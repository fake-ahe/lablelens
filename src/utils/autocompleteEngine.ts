import { SEARCHABLE_PRODUCTS, SearchableProductItem } from '../data/searchableProducts';
import { detectProductSpelling, SpellingCorrection } from './spellingDetector';
import { checkIsNonEdible } from './foodValidator';

export interface AutocompleteItem {
  id: string;
  type: 'google_query' | 'product_match' | 'recent_search' | 'trending';
  displayText: string;
  query: string;
  subText?: string;
  category?: string;
  matchedProduct?: SearchableProductItem;
  hasHarmfulAdditives?: boolean;
  harmfulAdditivesCount?: number;
  highlightWarning?: string;
  calories?: number;
  brand?: string;
}

export interface AutocompleteResult {
  query: string;
  ghostSuffix: string; // The remaining text for inline tab completion
  matchedSpelling: SpellingCorrection | null;
  items: AutocompleteItem[];
}

// In-memory cache for Google Suggestion API responses
const googleSuggestCache = new Map<string, string[]>();

const RECENT_SEARCHES_KEY = 'labellens_recent_searches_v1';

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = (query || '').trim();
  if (!trimmed || trimmed.length < 2) return;

  try {
    const current = getRecentSearches();
    const updated = [trimmed, ...current.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage issues
  }
}

export function removeRecentSearch(queryToRemove: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getRecentSearches();
    const updated = current.filter(item => item.toLowerCase() !== queryToRemove.toLowerCase());
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore
  }
}

// Curated list of popular foods for zero-latency local autocomplete
const FOOD_QUERY_PRESETS: string[] = [
  'Oreo Cookies nutrition facts',
  'Oreo ingredients and additives',
  'Doritos Nacho Cheese ingredients',
  'Doritos calories per serving',
  'Cheetos Flamin Hot harmful additives',
  'Cheetos Red 40 & Yellow 6 dyes',
  'Monster Energy caffeine and sugar',
  'Red Bull Energy Drink ingredients',
  'Chobani Greek Yogurt protein content',
  'Nutella sugar and palm oil',
  'Snickers Bar ingredients and allergens',
  'Pringles Potato Crisps additives',
  'Coca-Cola high fructose corn syrup',
  'Pepsi Cola nutrition facts',
  'Pop-Tarts Titanium Dioxide warning',
  'Goldfish Cheddar Crackers nutrition',
  'Lay\'s Classic Potato Chips',
  'Kit Kat Wafer chocolate',
  'Reese\'s Peanut Butter Cups allergens',
  'Gatorade artificial dyes and electrolytes'
];

/**
 * Fetch real-time suggestions from the Google Search Autocomplete backend endpoint
 */
export async function fetchGoogleSearchSuggestions(query: string): Promise<string[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return [];

  if (googleSuggestCache.has(trimmed)) {
    return googleSuggestCache.get(trimmed)!;
  }

  try {
    const res = await fetch(`/api/search-autocomplete?q=${encodeURIComponent(trimmed)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        googleSuggestCache.set(trimmed, data.suggestions);
        return data.suggestions;
      }
    }
  } catch {
    // Fallback silently to local food presets
  }

  // Fallback to locally matching preset queries
  const localMatches = FOOD_QUERY_PRESETS.filter(q => q.toLowerCase().includes(trimmed)).slice(0, 5);
  return localMatches;
}

/**
 * Computes instant autocompletions including:
 * - In-line ghost completion text
 * - High-confidence spelling auto-corrections
 * - Verified product cards
 * - Google Search autocomplete queries
 */
export function buildInstantAutocomplete(
  query: string,
  googleQueries: string[] = [],
  recentSearches: string[] = []
): AutocompleteResult {
  const trimmed = query.trim();
  const qLower = trimmed.toLowerCase();

  // If query is empty, show recent searches and popular trending foods
  if (!trimmed) {
    const recentItems: AutocompleteItem[] = recentSearches.map(item => ({
      id: `recent-${item}`,
      type: 'recent_search',
      displayText: item,
      query: item,
      subText: 'Recent Search'
    }));

    const trendingItems: AutocompleteItem[] = [
      { id: 'trend-1', type: 'trending', displayText: 'Oreo Cookies', query: 'Oreo Cookies', subText: 'Popular Snack' },
      { id: 'trend-2', type: 'trending', displayText: 'Doritos Nacho Cheese', query: 'Doritos Nacho Cheese', subText: 'Popular Chips' },
      { id: 'trend-3', type: 'trending', displayText: 'Monster Energy Drink', query: 'Monster Energy Drink', subText: 'Beverages' },
      { id: 'trend-4', type: 'trending', displayText: 'Chobani Greek Yogurt', query: 'Chobani Greek Yogurt', subText: 'Clean Dairy' }
    ];

    return {
      query: '',
      ghostSuffix: '',
      matchedSpelling: null,
      items: [...recentItems, ...trendingItems].slice(0, 7)
    };
  }

  // If query is non-edible (e.g. phone, shoes, laptop, plastic), do not offer food suggestions
  if (checkIsNonEdible(trimmed).isNonEdible) {
    return {
      query: trimmed,
      ghostSuffix: '',
      matchedSpelling: null,
      items: []
    };
  }

  // 1. Detect spelling errors while typing
  const matchedSpelling = detectProductSpelling(trimmed);

  // 2. Direct catalog product matches
  const productMatches = SEARCHABLE_PRODUCTS.filter(p => {
    const name = (p.name || '').toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    const tags = (p.tags || []).map(t => t.toLowerCase());
    return name.includes(qLower) || brand.includes(qLower) || tags.some(t => t.includes(qLower));
  });

  // Calculate inline ghost completion suffix
  let ghostSuffix = '';
  // Check if any product starts with the query
  const startsWithProduct = SEARCHABLE_PRODUCTS.find(p => p.name.toLowerCase().startsWith(qLower));
  if (startsWithProduct) {
    ghostSuffix = startsWithProduct.name.slice(trimmed.length);
  } else if (matchedSpelling && matchedSpelling.suggested.toLowerCase().startsWith(qLower)) {
    ghostSuffix = matchedSpelling.suggested.slice(trimmed.length);
  } else {
    // Check google suggestions
    const startsWithGoogle = googleQueries.find(g => g.toLowerCase().startsWith(qLower));
    if (startsWithGoogle) {
      ghostSuffix = startsWithGoogle.slice(trimmed.length);
    }
  }

  const items: AutocompleteItem[] = [];

  // Add matching products (top 3)
  for (const product of productMatches.slice(0, 3)) {
    items.push({
      id: `prod-${product.id}`,
      type: 'product_match',
      displayText: product.name,
      query: product.name,
      subText: product.brand,
      category: product.category,
      matchedProduct: product,
      hasHarmfulAdditives: product.hasHarmfulAdditives,
      harmfulAdditivesCount: product.harmfulAdditivesCount,
      highlightWarning: product.highlightWarning,
      calories: product.calories,
      brand: product.brand
    });
  }

  // Add Google autocomplete suggestions (filter out duplicates)
  const seenQueries = new Set(items.map(i => i.query.toLowerCase()));

  for (const gQuery of googleQueries) {
    const gLower = gQuery.toLowerCase();
    if (!seenQueries.has(gLower) && !checkIsNonEdible(gQuery).isNonEdible) {
      seenQueries.add(gLower);
      items.push({
        id: `google-${gQuery}`,
        type: 'google_query',
        displayText: gQuery,
        query: gQuery,
        subText: 'Google Search Completion'
      });
    }
  }

  // If we still need more suggestions, generate smart food query intents (only if query is not non-edible)
  if (items.length < 5 && !checkIsNonEdible(trimmed).isNonEdible) {
    const smartIntents = [
      `${trimmed} nutrition facts`,
      `${trimmed} ingredients label`,
      `${trimmed} harmful additives`,
      `${trimmed} calories and sugar`
    ];

    for (const intent of smartIntents) {
      if (!seenQueries.has(intent.toLowerCase()) && items.length < 7) {
        seenQueries.add(intent.toLowerCase());
        items.push({
          id: `intent-${intent}`,
          type: 'google_query',
          displayText: intent,
          query: intent,
          subText: 'Google Nutrition Search'
        });
      }
    }
  }

  return {
    query: trimmed,
    ghostSuffix,
    matchedSpelling,
    items: items.slice(0, 7)
  };
}
