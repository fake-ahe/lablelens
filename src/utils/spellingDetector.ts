import { SEARCHABLE_PRODUCTS } from '../data/searchableProducts';
import { LabelAnalysisResult } from '../types';

export interface SpellingCorrection {
  original: string;
  suggested: string;
  confidence: 'high' | 'medium';
  matchType: 'typo' | 'fuzzy' | 'completion';
  explanation?: string;
  matchedProduct?: LabelAnalysisResult;
}

// Known common packaged food product spelling errors to their canonical names
const COMMON_FOOD_TYPOS: Record<string, string> = {
  // Cookies & Sweets
  'orio': 'Oreo Cookies',
  'oreos': 'Oreo Cookies',
  'oreoo': 'Oreo Cookies',
  'oroe': 'Oreo Cookies',
  'oreo': 'Oreo Double Stuf',
  'choclate': 'Chocolate',
  'chololate': 'Chocolate',
  'choclate bar': 'Chocolate Bar',
  'nutela': 'Nutella Hazelnut Spread',
  'nutella': 'Nutella Hazelnut Spread',
  'nutellaa': 'Nutella Hazelnut Spread',
  'chips ahoy': 'Chips Ahoy! Chocolate Chip',
  'chip ahoy': 'Chips Ahoy! Chocolate Chip',
  'chipsahoy': 'Chips Ahoy! Chocolate Chip',
  'sniker': 'Snickers Bar',
  'snikers': 'Snickers Bar',
  'snicker': 'Snickers Bar',
  'snikrs': 'Snickers Bar',
  'kitkat': 'Kit Kat Wafer',
  'kit kat': 'Kit Kat Wafer',
  'kitkat bar': 'Kit Kat Wafer',
  'reese': "Reese's Peanut Butter Cups",
  'reeses': "Reese's Peanut Butter Cups",
  'reeses cup': "Reese's Peanut Butter Cups",
  'm&m': "M&M's Milk Chocolate",
  'mnm': "M&M's Milk Chocolate",
  'mnms': "M&M's Milk Chocolate",
  'skittles': 'Skittles Original Candy',
  'skittle': 'Skittles Original Candy',
  'skittls': 'Skittles Original Candy',
  'poptart': 'Pop-Tarts Frosted Strawberry',
  'poptarts': 'Pop-Tarts Frosted Strawberry',
  'pop tart': 'Pop-Tarts Frosted Strawberry',

  // Chips & Savory Snacks
  'doreto': 'Doritos Nacho Cheese',
  'doretos': 'Doritos Nacho Cheese',
  'dorito': 'Doritos Nacho Cheese',
  'doritos': 'Doritos Nacho Cheese',
  'doritoes': 'Doritos Nacho Cheese',
  'cheeto': "Cheetos Flamin' Hot",
  'cheetos': "Cheetos Flamin' Hot",
  'cheto': "Cheetos Flamin' Hot",
  'chetos': "Cheetos Flamin' Hot",
  'cheetoos': "Cheetos Flamin' Hot",
  'flamin hot': "Flamin' Hot Fiery Corn Curls",
  'flaming hot': "Flamin' Hot Fiery Corn Curls",
  'flammin hot': "Flamin' Hot Fiery Corn Curls",
  'pringel': 'Pringles Original',
  'pringels': 'Pringles Original',
  'pringle': 'Pringles Original',
  'pringles': 'Pringles Original',
  'pringls': 'Pringles Original',
  'layz': "Lay's Classic Potato Chips",
  'lays': "Lay's Classic Potato Chips",
  'layes': "Lay's Classic Potato Chips",
  'taki': 'Takis Fuego Rolled Tortilla',
  'takis': 'Takis Fuego Rolled Tortilla',
  'takkis': 'Takis Fuego Rolled Tortilla',
  'cheezit': 'Cheez-It Baked Snack Crackers',
  'cheez it': 'Cheez-It Baked Snack Crackers',
  'cheezits': 'Cheez-It Baked Snack Crackers',
  'goldfish': 'Goldfish Cheddar Crackers',
  'gold fish': 'Goldfish Cheddar Crackers',
  'ruffles': 'Ruffles Cheddar & Sour Cream',
  'rufffles': 'Ruffles Cheddar & Sour Cream',

  // Beverages
  'monstur': 'Monster Energy Drink',
  'monster': 'Monster Energy Drink',
  'monster energy': 'Monster Energy Drink',
  'redbul': 'Red Bull Energy Drink',
  'red bull': 'Red Bull Energy Drink',
  'redbull': 'Red Bull Energy Drink',
  'coke': 'Coca-Cola Original',
  'coka cola': 'Coca-Cola Original',
  'coca cola': 'Coca-Cola Original',
  'cocacola': 'Coca-Cola Original',
  'pepsi': 'Pepsi Cola',
  'pepci': 'Pepsi Cola',
  'gaterade': 'Gatorade Thirst Quencher',
  'gatorade': 'Gatorade Thirst Quencher',
  'gateraid': 'Gatorade Thirst Quencher',
  'hyper charge': 'Hyper Charge Energy Soda',
  'energy soda': 'Hyper Charge Energy Soda',

  // Dairy & Cereals & Condiments
  'chobani': 'Chobani Greek Yogurt',
  'chobanni': 'Chobani Greek Yogurt',
  'chobanie': 'Chobani Greek Yogurt',
  'greek yogurt': 'Chobani Greek Yogurt',
  'heinz': 'Heinz Tomato Ketchup',
  'hienz': 'Heinz Tomato Ketchup',
  'kethcup': 'Heinz Tomato Ketchup',
  'ketchup': 'Heinz Tomato Ketchup',
  'heinz ketchup': 'Heinz Tomato Ketchup',
  'cheerios': 'Cheerios Honey Nut',
  'cherios': 'Cheerios Honey Nut',
  'froot loops': 'Froot Loops Cereal',
  'fruit loops': 'Froot Loops Cereal',
  'frosted flakes': "Frosted Flakes Cereal",
  'cocoa oats': 'Crunchy Cocoa Oat Bites',
  'oat bites': 'Crunchy Cocoa Oat Bites',
  'maggi': 'Maggi 2-Minute Noodles',
  'magi': 'Maggi 2-Minute Noodles',
  'maggie': 'Maggi 2-Minute Noodles',
  'cup noodles': 'Nissin Cup Noodles',
  'cup noodle': 'Nissin Cup Noodles',
  'ramen': 'Maruchan Instant Ramen',
  'protein bar': 'Green Goddess Plant Protein Bar',
  'lentil crisps': 'Zesty Masala Lentil Crisps'
};

// Canonical list of standard brand and product terms for fuzzy distance checking
const FOOD_PRODUCT_NAMES = [
  'Oreo Cookies',
  'Oreo Double Stuf',
  'Doritos Nacho Cheese',
  "Cheetos Flamin' Hot",
  'Pringles Original',
  "Lay's Classic Potato Chips",
  'Monster Energy Drink',
  'Red Bull Energy Drink',
  'Chobani Greek Yogurt',
  'Nutella Hazelnut Spread',
  'Coca-Cola Original',
  'Pepsi Cola',
  'Snickers Bar',
  'Kit Kat Wafer',
  "Reese's Peanut Butter Cups",
  "M&M's Milk Chocolate",
  'Pop-Tarts Frosted Strawberry',
  'Takis Fuego',
  'Cheez-It Crackers',
  'Heinz Tomato Ketchup',
  'Cheerios Honey Nut',
  'Maggi 2-Minute Noodles',
  'Crunchy Cocoa Oat Bites',
  'Green Goddess Plant Protein Bar',
  'Zesty Masala Lentil Crisps',
  'Hyper Charge Energy Soda'
];

/**
 * Standard Levenshtein Distance for typo detection
 */
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Clean input string for normalized phonetic & typo comparison
 */
function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Real-time product spelling pre-detector while user is typing
 */
export function detectProductSpelling(rawQuery: string): SpellingCorrection | null {
  if (!rawQuery) return null;
  const clean = normalizeQuery(rawQuery);
  if (clean.length < 2) return null;

  // 1. Direct typo dictionary check (Instant high confidence)
  if (COMMON_FOOD_TYPOS[clean]) {
    const suggested = COMMON_FOOD_TYPOS[clean];
    const isDifferent = normalizeQuery(suggested) !== clean;
    if (isDifferent) {
      const matched = SEARCHABLE_PRODUCTS.find(p => 
        (p?.name || '').toLowerCase().includes(suggested.toLowerCase()) ||
        (suggested || '').toLowerCase().includes((p?.name || '').toLowerCase())
      );
      return {
        original: rawQuery,
        suggested,
        confidence: 'high',
        matchType: 'typo',
        explanation: `Spelling corrected from "${rawQuery}" to "${suggested}"`,
        matchedProduct: matched?.productData
      };
    }
  }

  // Check if any individual word in a multi-word input matches a common typo
  const words = clean.split(' ');
  if (words.length > 1) {
    let hasCorrection = false;
    const correctedWords = words.map(word => {
      if (COMMON_FOOD_TYPOS[word]) {
        hasCorrection = true;
        return COMMON_FOOD_TYPOS[word];
      }
      return word;
    });

    if (hasCorrection) {
      const suggested = correctedWords.join(' ');
      return {
        original: rawQuery,
        suggested,
        confidence: 'high',
        matchType: 'typo',
        explanation: `Detected typo in search term`,
      };
    }
  }

  // 2. Fuzzy Levenshtein match across known products
  let bestCandidate: string | null = null;
  let minDistance = 999;
  let matchedProductObj: LabelAnalysisResult | undefined;

  for (const name of FOOD_PRODUCT_NAMES) {
    const normName = normalizeQuery(name);
    // Exact or already clean match
    if (normName === clean) {
      return null;
    }

    // Compare whole phrase
    const dist = levenshteinDistance(clean, normName);
    
    // Check if input is a sub-word typo (e.g., 'doretos' vs first word 'doritos')
    const firstWordOfName = normName.split(' ')[0];
    const wordDist = levenshteinDistance(clean, firstWordOfName);

    const effectiveDist = Math.min(dist, wordDist);

    // Max allowable distance depends on query length:
    // 2-3 chars: dist <= 1
    // 4-6 chars: dist <= 2
    // 7+ chars: dist <= 3
    const maxAllowedDist = clean.length <= 3 ? 1 : clean.length <= 6 ? 2 : 3;

    if (effectiveDist <= maxAllowedDist && effectiveDist < minDistance) {
      minDistance = effectiveDist;
      bestCandidate = name;
      const found = SEARCHABLE_PRODUCTS.find(p => 
        (p?.name || '').toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes((p?.name || '').toLowerCase())
      );
      matchedProductObj = found?.productData;
    }
  }

  if (bestCandidate && minDistance > 0 && normalizeQuery(bestCandidate) !== clean) {
    return {
      original: rawQuery,
      suggested: bestCandidate,
      confidence: minDistance <= 2 ? 'high' : 'medium',
      matchType: 'fuzzy',
      explanation: `Did you mean "${bestCandidate}"?`,
      matchedProduct: matchedProductObj
    };
  }

  // 3. Prefix autocompletion detection (if user typed 3+ chars that start a product name)
  if (clean.length >= 3) {
    const prefixMatch = FOOD_PRODUCT_NAMES.find(name => {
      const norm = normalizeQuery(name);
      return norm.startsWith(clean) && norm !== clean;
    });

    if (prefixMatch) {
      const found = SEARCHABLE_PRODUCTS.find(p => 
        (p?.name || '').toLowerCase().includes(prefixMatch.toLowerCase())
      );
      return {
        original: rawQuery,
        suggested: prefixMatch,
        confidence: 'medium',
        matchType: 'completion',
        explanation: `Suggested product: "${prefixMatch}"`,
        matchedProduct: found?.productData
      };
    }
  }

  return null;
}
