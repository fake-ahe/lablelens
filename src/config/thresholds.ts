import { NutrientLevel } from '../types';

/**
 * Standard Nutritional Thresholds (Reference: US FDA, WHO, and Codex Alimentarius guidelines)
 * All thresholds represent per-serving guidelines unless noted per-100g.
 */
export const NUTRITION_THRESHOLDS = {
  protein: {
    low: 3, // <= 3g per serving
    high: 10, // >= 10g per serving
    unit: 'g',
    rationale: 'Products offering ≥10g per serving are considered a significant source of protein, supporting satiety and muscle synthesis.',
    dailyValueRef: 50, // FDA 50g reference DV
  },
  fiber: {
    low: 2, // < 2g per serving
    high: 5, // >= 5g (20% of 28g DV)
    unit: 'g',
    rationale: 'Products with ≥5g dietary fiber per serving qualify as high-fiber under FDA guidelines, supporting digestion and heart health.',
    dailyValueRef: 28, // FDA 28g reference DV
  },
  addedSugar: {
    low: 2.5, // <= 5% DV (2.5g)
    high: 10, // >= 20% DV (10g)
    unit: 'g',
    rationale: 'FDA defines high added sugar as ≥10g (20% Daily Value) per serving. WHO recommends limiting free sugars to <25g/day.',
    dailyValueRef: 50, // FDA 50g reference DV
  },
  sodium: {
    low: 115, // <= 5% DV (115mg)
    high: 460, // >= 20% DV (460mg)
    unit: 'mg',
    rationale: 'FDA low sodium is ≤140mg/serving. High sodium is ≥460mg (20% Daily Value). The standard adult limit is 2,300mg/day.',
    dailyValueRef: 2300, // FDA 2,300mg reference DV
  },
  saturatedFat: {
    low: 1, // <= 5% DV (1g)
    high: 4, // >= 20% DV (4g)
    unit: 'g',
    rationale: 'FDA considers ≥4g (20% Daily Value) high in saturated fat. AHA recommends limiting saturated fat to under 13g daily.',
    dailyValueRef: 20, // FDA 20g reference DV
  },
  totalSugar: {
    low: 4,
    high: 15,
    unit: 'g',
    rationale: 'Total sugar accounts for both naturally occurring sugars (such as in dairy or fruit) and refined sweeteners.',
    dailyValueRef: 50,
  },
  calories: {
    low: 100,
    moderate: 250,
    high: 400,
    unit: 'kcal',
    rationale: 'General reference benchmark based on standard 2,000 calorie daily diet (~400 kcal per meal or 150-200 kcal per snack).',
    dailyValueRef: 2000,
  }
};

/**
 * Evaluates the nutrient level based on thresholds
 */
export function evaluateNutrientLevel(
  nutrientKey: 'protein' | 'fiber' | 'addedSugar' | 'sodium' | 'saturatedFat' | 'totalSugar',
  value: number | null
): { level: NutrientLevel; text: string; rationale: string } {
  if (value === null || value === undefined) {
    return {
      level: 'not-available',
      text: 'Not available',
      rationale: 'This nutrient was not detected or specified on the visible label.',
    };
  }

  const threshold = NUTRITION_THRESHOLDS[nutrientKey];
  if (!threshold) {
    return {
      level: 'moderate',
      text: 'Moderate',
      rationale: 'Standard baseline values.',
    };
  }

  let level: NutrientLevel = 'moderate';
  if (value <= threshold.low) {
    level = 'low';
  } else if (value >= threshold.high) {
    level = 'high';
  }

  let text = 'Moderate';
  if (level === 'low') {
    text = nutrientKey === 'protein' || nutrientKey === 'fiber' ? 'Relatively Low' : 'Low';
  } else if (level === 'high') {
    text = nutrientKey === 'protein' || nutrientKey === 'fiber' ? 'Relatively High' : 'High';
  }

  return {
    level,
    text,
    rationale: threshold.rationale,
  };
}

/**
 * Calculates a transparent 1-5 Label Profile based on documented rules
 */
export function calculateLabelProfile(nutrition: {
  protein?: number | null;
  fiber?: number | null;
  addedSugar?: number | null;
  sodium?: number | null;
  ingredientCount?: number;
  additiveCount?: number;
}) {
  // Protein (more is higher rating: 0-3g = 1, 3-6g = 2, 6-10g = 3, 10-15g = 4, 15g+ = 5)
  const p = nutrition.protein ?? 0;
  const proteinScore = p >= 15 ? 5 : p >= 10 ? 4 : p >= 6 ? 3 : p >= 3 ? 2 : 1;

  // Fiber (more is higher rating: 0-1g = 1, 1-3g = 2, 3-5g = 3, 5-8g = 4, 8g+ = 5)
  const f = nutrition.fiber ?? 0;
  const fiberScore = f >= 8 ? 5 : f >= 5 ? 4 : f >= 3 ? 3 : f >= 1 ? 2 : 1;

  // Added Sugar (less is cleaner profile: <=2g = 5, 2-5g = 4, 5-10g = 3, 10-15g = 2, 15g+ = 1)
  const s = nutrition.addedSugar ?? 0;
  const addedSugarScore = s <= 2 ? 5 : s <= 5 ? 4 : s <= 10 ? 3 : s <= 15 ? 2 : 1;

  // Sodium (less is cleaner profile: <=140mg = 5, 140-300mg = 4, 300-500mg = 3, 500-800mg = 2, 800mg+ = 1)
  const na = nutrition.sodium ?? 0;
  const sodiumScore = na <= 140 ? 5 : na <= 300 ? 4 : na <= 500 ? 3 : na <= 800 ? 2 : 1;

  // Complexity (based on ingredient count & additives count: fewer processed ingredients = 5)
  const totalItems = (nutrition.ingredientCount ?? 5) + (nutrition.additiveCount ?? 0) * 1.5;
  const complexityScore = totalItems <= 5 ? 5 : totalItems <= 8 ? 4 : totalItems <= 14 ? 3 : totalItems <= 20 ? 2 : 1;

  return {
    protein: proteinScore,
    fiber: fiberScore,
    addedSugar: addedSugarScore,
    sodium: sodiumScore,
    complexity: complexityScore,
  };
}
