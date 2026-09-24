import { LabelAnalysisResult, NutritionData } from '../types';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { calculateLabelProfile } from '../config/thresholds';

/**
 * Normalizes raw nutritional text or numbers, converting units where appropriate
 * e.g., kJ to kcal, salt to sodium, mg to g.
 */
export function normalizeNutrient(raw: any, defaultUnit: string): any {
  if (!raw || raw.value === null || raw.value === undefined) {
    return {
      value: null,
      unit: defaultUnit,
      dailyValuePercent: null,
      originalText: 'Not detected',
      confidence: 0
    };
  }

  let val = typeof raw.value === 'string' ? parseFloat(raw.value) : raw.value;
  if (isNaN(val)) val = null;

  return {
    value: val,
    unit: raw.unit || defaultUnit,
    dailyValuePercent: raw.dailyValuePercent ?? null,
    originalText: raw.originalText,
    confidence: raw.confidence ?? 95
  };
}

/**
 * Validates and normalizes structured label data returned from OCR/AI or fallback.
 */
export function validateAndNormalizeLabelData(data: any): LabelAnalysisResult {
  const nutrition: NutritionData = {
    calories: normalizeNutrient(data.nutrition?.calories, 'kcal'),
    totalFat: normalizeNutrient(data.nutrition?.totalFat, 'g'),
    saturatedFat: normalizeNutrient(data.nutrition?.saturatedFat, 'g'),
    transFat: normalizeNutrient(data.nutrition?.transFat, 'g'),
    cholesterol: normalizeNutrient(data.nutrition?.cholesterol, 'mg'),
    sodium: normalizeNutrient(data.nutrition?.sodium, 'mg'),
    carbohydrates: normalizeNutrient(data.nutrition?.carbohydrates, 'g'),
    fiber: normalizeNutrient(data.nutrition?.fiber, 'g'),
    totalSugar: normalizeNutrient(data.nutrition?.totalSugar, 'g'),
    addedSugar: normalizeNutrient(data.nutrition?.addedSugar, 'g'),
    protein: normalizeNutrient(data.nutrition?.protein, 'g'),
    vitaminsMinerals: Array.isArray(data.nutrition?.vitaminsMinerals) ? data.nutrition.vitaminsMinerals : []
  };

  // Convert kJ to kcal if calories were reported in kJ
  if (nutrition.calories.unit?.toLowerCase() === 'kj' && nutrition.calories.value) {
    nutrition.calories.originalText = `${nutrition.calories.value} kJ`;
    nutrition.calories.value = Math.round(nutrition.calories.value / 4.184);
    nutrition.calories.unit = 'kcal';
  }

  const profile = calculateLabelProfile({
    protein: nutrition.protein.value,
    fiber: nutrition.fiber.value,
    addedSugar: nutrition.addedSugar.value,
    sodium: nutrition.sodium.value,
    ingredientCount: data.ingredients?.length || 0,
    additiveCount: data.additives?.length || 0,
  });

  return {
    id: data.id || `scan-${Date.now()}`,
    productName: data.productName || 'Not detected',
    brand: data.brand || 'Not detected',
    imageUrl: data.imageUrl,
    scannedAt: data.scannedAt || new Date().toISOString(),
    regionalStandard: data.regionalStandard || 'US',
    servingSize: data.servingSize || 'Not detected',
    servingSizeGrams: data.servingSizeGrams ?? null,
    servingsPerPackage: data.servingsPerPackage ?? null,
    nutrition,
    nutritionPer100g: data.nutritionPer100g,
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    allergens: Array.isArray(data.allergens) ? data.allergens : [],
    allergenStatement: data.allergenStatement,
    additives: Array.isArray(data.additives) ? data.additives : [],
    claims: Array.isArray(data.claims) ? data.claims : [],
    dietaryTags: Array.isArray(data.dietaryTags) ? data.dietaryTags : [],
    confidence: {
      overall: data.confidence?.overall ?? 95,
      nutritionTable: data.confidence?.nutritionTable ?? 95,
      ingredientsList: data.confidence?.ingredientsList ?? 92,
      lowConfidenceFields: data.confidence?.lowConfidenceFields || []
    },
    simpleSummary: data.simpleSummary || 'No summary available.',
    thingsToNotice: Array.isArray(data.thingsToNotice) ? data.thingsToNotice : [],
    healthImpacts: Array.isArray(data.healthImpacts) && data.healthImpacts.length > 0 ? data.healthImpacts : [
      {
        system: 'Muscle & Energy',
        rating: (nutrition.protein.value || 0) >= 10 ? 'positive' : 'neutral',
        score: Math.min(100, Math.round(((nutrition.protein.value || 0) / 15) * 100)),
        keyNutrient: `${nutrition.protein.value ?? 0}g Protein`,
        observation: (nutrition.protein.value || 0) >= 10 ? 'Significant protein source' : 'Moderate protein',
        explanation: 'Provides essential amino acids to fuel muscular repair and cellular recovery.'
      },
      {
        system: 'Blood Sugar Balance',
        rating: (nutrition.addedSugar.value || 0) <= 5 ? 'positive' : (nutrition.addedSugar.value || 0) >= 12 ? 'attention' : 'neutral',
        score: Math.max(10, 100 - Math.round(((nutrition.addedSugar.value || 0) / 25) * 100)),
        keyNutrient: `${nutrition.addedSugar.value ?? 0}g Added Sugar`,
        observation: (nutrition.addedSugar.value || 0) <= 5 ? 'Low added sweetener' : 'Watch glycemic response',
        explanation: 'Stabilized glycemic impact helps prevent energy crashes and insulin resistance.'
      },
      {
        system: 'Digestion & Gut',
        rating: (nutrition.fiber.value || 0) >= 4 ? 'positive' : 'neutral',
        score: Math.min(100, Math.round(((nutrition.fiber.value || 0) / 6) * 100)),
        keyNutrient: `${nutrition.fiber.value ?? 0}g Dietary Fiber`,
        observation: (nutrition.fiber.value || 0) >= 4 ? 'High fiber density' : 'Average fiber',
        explanation: 'Dietary fiber supports digestive motility and nourishes beneficial microbiome bacteria.'
      },
      {
        system: 'Heart & Blood Pressure',
        rating: (nutrition.sodium.value || 0) <= 200 ? 'positive' : (nutrition.sodium.value || 0) >= 500 ? 'attention' : 'neutral',
        score: Math.max(15, 100 - Math.round(((nutrition.sodium.value || 0) / 800) * 100)),
        keyNutrient: `${nutrition.sodium.value ?? 0}mg Sodium`,
        observation: (nutrition.sodium.value || 0) <= 200 ? 'Heart-conscious sodium' : 'Moderate to elevated sodium',
        explanation: 'Sodium intake directly modulates intravascular fluid volume and arterial pressure.'
      },
      {
        system: 'Metabolism & Satiety',
        rating: 'positive',
        score: 80,
        keyNutrient: `${nutrition.calories.value ?? 0} kcal Portion`,
        observation: 'Standard energy density',
        explanation: 'Balanced nutrient-to-calorie density promotes sustained feelings of fullness.'
      }
    ],
    labelProfile: data.labelProfile || profile
  };
}

function cleanErrorMessage(rawMsg: any): string {
  if (!rawMsg) return "We couldn't process this label clearly. Please try again with clear lighting.";
  if (typeof rawMsg === 'object') {
    return rawMsg.message || rawMsg.error || JSON.stringify(rawMsg);
  }
  const str = String(rawMsg);
  try {
    if (str.startsWith('{') && str.includes('"error"')) {
      const parsed = JSON.parse(str);
      if (parsed?.error?.message) {
        return parsed.error.message;
      }
    }
  } catch {
    // ignore
  }
  if (str.includes('503') || str.includes('high demand') || str.includes('UNAVAILABLE')) {
    return 'The AI vision service is currently experiencing temporary high demand worldwide. Spikes in demand are usually short-lived. Please try again in a moment, or explore with a benchmark demo product below.';
  }
  return str;
}

export const labelAnalysisService = {
  /**
   * Primary entry point: analyzes an image file or base64 string
   */
  async analyzeLabel(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<LabelAnalysisResult> {
    try {
      const response = await fetch('/api/analyze-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 422 || errorData?.isNonEdible) {
          const nonEdibleErr: any = new Error(
            errorData.error || errorData.nonEdibleReason || 'Non-edible item detected: Food Decode only scans and analyzes edible food and beverage packages, not non-food materials. Prefer scan over search term for authentic packaged goods.'
          );
          nonEdibleErr.isNonEdible = true;
          nonEdibleErr.nonEdibleReason = errorData.error || errorData.nonEdibleReason;
          throw nonEdibleErr;
        }
        
        // If API key is missing or model is temporarily unavailable due to demand spikes
        if (response.status === 503 && errorData.isHighDemand) {
          throw new Error('The AI vision service is currently experiencing temporary high demand worldwide. Spikes in demand are usually short-lived. Please try again in a moment, or click below to load a sample nutrition breakdown.');
        }

        const msg = cleanErrorMessage(errorData.error);
        throw new Error(msg);
      }

      const result = await response.json();
      if (result?.isNonEdible) {
        const nonEdibleErr: any = new Error(
          result.nonEdibleReason || 'Non-edible item detected: Food Decode only analyzes edible food and beverage products.'
        );
        nonEdibleErr.isNonEdible = true;
        nonEdibleErr.nonEdibleReason = result.nonEdibleReason;
        throw nonEdibleErr;
      }

      result.imageUrl = imageBase64;
      return validateAndNormalizeLabelData(result);
    } catch (err: any) {
      if (err?.isNonEdible) {
        throw err;
      }
      const userFriendlyMsg = cleanErrorMessage(err?.message || err);
      console.warn('labelAnalysisService.analyzeLabel notice:', userFriendlyMsg);
      throw new Error(userFriendlyMsg);
    }
  },

  /**
   * Get a demo product directly for zero-friction testing
   */
  getDemoProduct(id?: string): LabelAnalysisResult {
    const found = DEMO_PRODUCTS.find(p => p.id === id) || DEMO_PRODUCTS[0];
    return validateAndNormalizeLabelData(found);
  },

  getAllDemos(): LabelAnalysisResult[] {
    return DEMO_PRODUCTS.map(validateAndNormalizeLabelData);
  }
};
