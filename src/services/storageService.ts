import { LabelAnalysisResult } from '../types';
import { DEMO_PRODUCTS } from '../data/demoProducts';

const HISTORY_STORAGE_KEY = 'fooddecode_scan_history_v1';
const FAVORITES_STORAGE_KEY = 'fooddecode_favorites_v1';
const INIT_FLAG_KEY = 'fooddecode_initialized_v2';

export const storageService = {
  getHistory(): LabelAnalysisResult[] {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY) || localStorage.getItem('labellens_scan_history_v1');
      const isInitialized = localStorage.getItem(INIT_FLAG_KEY) || localStorage.getItem('labellens_initialized_v2');
      
      if (!isInitialized && !data) {
        // Pre-seed only on very first app launch
        const initial = [DEMO_PRODUCTS[0]];
        localStorage.setItem(INIT_FLAG_KEY, 'true');
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read scan history:', e);
      return [];
    }
  },

  saveScan(scan: LabelAnalysisResult): LabelAnalysisResult[] {
    try {
      const existing = this.getHistory();
      // Avoid duplicate by id
      const filtered = existing.filter(item => item.id !== scan.id);
      const updated = [scan, ...filtered].slice(0, 30); // Keep last 30 scans
      localStorage.setItem(INIT_FLAG_KEY, 'true');
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save scan:', e);
      return [];
    }
  },

  deleteScan(id: string): LabelAnalysisResult[] {
    try {
      const existing = this.getHistory();
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to delete scan:', e);
      return [];
    }
  },

  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(id: string): string[] {
    try {
      const favs = this.getFavorites();
      const isFav = favs.includes(id);
      const updated = isFav ? favs.filter(f => f !== id) : [...favs, id];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  clearAllHistory(): void {
    try {
      localStorage.setItem(INIT_FLAG_KEY, 'true');
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  },

  // Aliases for convenient UI invocation
  getScans(): LabelAnalysisResult[] {
    const history = this.getHistory();
    const favs = this.getFavorites();
    return history.map(item => ({
      ...item,
      isSaved: favs.includes(item.id)
    }));
  },

  toggleSave(id: string): string[] {
    return this.toggleFavorite(id);
  },

  clearHistory(): void {
    this.clearAllHistory();
  }
};
