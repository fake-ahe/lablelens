import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LabelAnalysisResult } from '../types';
import { ScanRecord } from '../types/supabase';
import { calculateProductRating } from '../config/rating';

/**
 * Transforms a Supabase `scans` record into the frontend `LabelAnalysisResult`
 */
export function mapScanRecordToLabelResult(record: ScanRecord & { is_favorite?: boolean; raw_data?: any }): LabelAnalysisResult {
  // If complete raw_data is preserved, use it as baseline
  if (record.raw_data && typeof record.raw_data === 'object' && record.raw_data.productName) {
    return {
      ...record.raw_data,
      id: record.id,
      productName: record.product_name || record.raw_data.productName,
      imageUrl: record.image_url || record.raw_data.imageUrl,
      scannedAt: record.created_at || record.raw_data.scannedAt,
      isSaved: Boolean(record.is_favorite)
    };
  }

  // Otherwise construct from normalized columns
  return {
    id: record.id,
    productName: record.product_name,
    brand: 'Scanned Food Package',
    imageUrl: record.image_url || undefined,
    scannedAt: record.created_at,
    regionalStandard: 'US',
    servingSize: record.nutrition?.servingSize || '1 serving',
    servingSizeGrams: record.nutrition?.servingSizeGrams || 100,
    servingsPerPackage: record.nutrition?.servingsPerPackage || 1,
    nutrition: record.nutrition || {},
    ingredients: Array.isArray(record.ingredients) ? record.ingredients : [],
    additives: [],
    allergens: Array.isArray(record.warnings) ? record.warnings : [],
    claims: [],
    dietaryTags: [],
    confidence: {
      overall: 95,
      nutritionTable: 95,
      ingredientsList: 95,
      lowConfidenceFields: []
    },
    simpleSummary: `Saved breakdown for ${record.product_name}.`,
    thingsToNotice: [],
    healthImpacts: [],
    labelProfile: {
      protein: 3,
      fiber: 3,
      addedSugar: 3,
      sodium: 3,
      complexity: 3
    },
    isSaved: Boolean(record.is_favorite)
  };
}

export const supabaseService = {
  /**
   * Saves an analyzed label to the user's Supabase account.
   */
  async saveScan(userId: string, labelData: LabelAnalysisResult): Promise<{ scan: LabelAnalysisResult | null; error: string | null }> {
    if (!isSupabaseConfigured() || !userId) {
      return { scan: null, error: 'Database or user not available.' };
    }

    try {
      const rating = calculateProductRating(labelData);

      const payload = {
        user_id: userId,
        product_name: labelData.productName || 'Scanned Food Item',
        ingredients: labelData.ingredients || [],
        nutrition: labelData.nutrition || {},
        health_score: rating?.score != null ? rating.score : 75,
        warnings: labelData.allergens || [],
        image_url: labelData.imageUrl || null,
        raw_data: labelData,
        created_at: labelData.scannedAt || new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('scans')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.warn('Supabase saveScan notice:', error.message);
        return { scan: null, error: 'Could not sync scan to cloud account.' };
      }

      const result = mapScanRecordToLabelResult(data);
      return { scan: result, error: null };
    } catch (err: any) {
      console.warn('Supabase saveScan exception:', err?.message || err);
      return { scan: null, error: 'Could not sync scan to cloud account.' };
    }
  },

  /**
   * Fetches all scans for a user with favorite status attached.
   */
  async getUserScans(userId: string): Promise<{ scans: LabelAnalysisResult[]; error: string | null }> {
    if (!isSupabaseConfigured() || !userId) {
      return { scans: [], error: null };
    }

    try {
      // 1. Fetch user's scans
      const { data: scansData, error: scansError } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (scansError) {
        console.warn('Supabase getUserScans notice:', scansError.message);
        return { scans: [], error: 'Failed to retrieve cloud scans.' };
      }

      // 2. Fetch user's favorite scan IDs
      const { data: favsData } = await supabase
        .from('favorites')
        .select('scan_id')
        .eq('user_id', userId);

      const favScanIds = new Set((favsData || []).map(f => f.scan_id));

      const mapped: LabelAnalysisResult[] = (scansData || []).map(row => 
        mapScanRecordToLabelResult({
          ...row,
          is_favorite: favScanIds.has(row.id)
        })
      );

      return { scans: mapped, error: null };
    } catch (err: any) {
      console.warn('Supabase getUserScans error:', err?.message || err);
      return { scans: [], error: 'Failed to retrieve cloud scans.' };
    }
  },

  /**
   * Deletes a scan from Supabase.
   */
  async deleteScan(userId: string, scanId: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured() || !userId) {
      return { success: false, error: 'Unauthorized.' };
    }

    try {
      const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', scanId)
        .eq('user_id', userId);

      if (error) {
        console.warn('Supabase deleteScan error:', error.message);
        return { success: false, error: 'Could not delete scan from cloud.' };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Could not delete scan.' };
    }
  },

  /**
   * Toggles favorite status for a scan in Supabase.
   */
  async toggleFavorite(userId: string, scanId: string): Promise<{ isFavorite: boolean; error: string | null }> {
    if (!isSupabaseConfigured() || !userId) {
      return { isFavorite: false, error: 'Unauthorized.' };
    }

    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('scan_id', scanId)
        .maybeSingle();

      if (existing) {
        // Remove favorite
        const { error: delError } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);

        if (delError) throw delError;
        return { isFavorite: false, error: null };
      } else {
        // Add favorite
        const { error: insError } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            scan_id: scanId
          });

        if (insError) throw insError;
        return { isFavorite: true, error: null };
      }
    } catch (err: any) {
      console.warn('Supabase toggleFavorite error:', err?.message || err);
      return { isFavorite: false, error: 'Could not update favorites.' };
    }
  },

  /**
   * Syncs existing offline/guest scans into user's account upon signing in.
   */
  async syncLocalScans(userId: string, localScans: LabelAnalysisResult[]): Promise<number> {
    if (!isSupabaseConfigured() || !userId || !localScans || localScans.length === 0) {
      return 0;
    }

    try {
      // Fetch user's existing scans to avoid duplicate titles/dates
      const { data: existing } = await supabase
        .from('scans')
        .select('product_name, created_at')
        .eq('user_id', userId);

      const existingSignatures = new Set(
        (existing || []).map(e => `${e.product_name}_${e.created_at}`)
      );

      let syncedCount = 0;
      for (const scan of localScans) {
        const sig = `${scan.productName}_${scan.scannedAt}`;
        if (!existingSignatures.has(sig)) {
          await this.saveScan(userId, scan);
          syncedCount++;
        }
      }

      return syncedCount;
    } catch (err) {
      console.warn('Error during local scans sync:', err);
      return 0;
    }
  }
};
