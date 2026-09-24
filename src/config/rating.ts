import { LabelAnalysisResult } from '../types';

export interface ProductRating {
  stars: number; // e.g. 4.2 out of 5.0
  score: number; // e.g. 84 out of 100
  label: string;
  badgeClass: string;
  starDisplay: string;
  summary: string;
}

export function calculateProductRating(product: LabelAnalysisResult): ProductRating {
  // If healthImpacts scores exist, calculate baseline from average
  let baseScore = 75;
  if (product.healthImpacts && product.healthImpacts.length > 0) {
    const sum = product.healthImpacts.reduce((acc, item) => acc + (item.score || 70), 0);
    baseScore = Math.round(sum / product.healthImpacts.length);
  }

  // Adjustments based on nutrition facts
  let modifier = 0;
  const n = product.nutrition;
  if (n) {
    // Protein bonus
    if (n.protein?.value !== null && n.protein?.value >= 10) modifier += 4;
    else if (n.protein?.value !== null && n.protein?.value >= 5) modifier += 2;

    // Fiber bonus
    if (n.fiber?.value !== null && n.fiber?.value >= 5) modifier += 5;
    else if (n.fiber?.value !== null && n.fiber?.value >= 2.8) modifier += 3;

    // Added sugar penalty or reward
    if (n.addedSugar?.value !== null) {
      if (n.addedSugar.value <= 2) modifier += 4;
      else if (n.addedSugar.value <= 6) modifier += 1;
      else if (n.addedSugar.value > 12) modifier -= 6;
      else if (n.addedSugar.value > 8) modifier -= 3;
    }

    // Sodium penalty or reward
    if (n.sodium?.value !== null) {
      if (n.sodium.value <= 140) modifier += 3;
      else if (n.sodium.value >= 460) modifier -= 5;
      else if (n.sodium.value >= 300) modifier -= 2;
    }

    // Saturated fat
    if (n.saturatedFat?.value !== null) {
      if (n.saturatedFat.value <= 1) modifier += 2;
      else if (n.saturatedFat.value >= 4) modifier -= 4;
    }
  }

  // Additives penalty
  const additiveCount = product.additives?.length || 0;
  if (additiveCount === 0) modifier += 3;
  else if (additiveCount >= 4) modifier -= 4;

  const finalScore = Math.min(98, Math.max(45, baseScore + modifier));
  const stars = Math.round((finalScore / 20) * 10) / 10; // e.g. 4.2

  let label = 'Wholesome Choice';
  let badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let summary = 'Nutritionally balanced with favorable nutrient density.';

  if (finalScore >= 85) {
    label = 'Excellent Profile';
    badgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-400';
    summary = 'High nutritional density with quality ingredients and minimal excess.';
  } else if (finalScore >= 75) {
    label = 'Nutritionally Balanced';
    badgeClass = 'bg-teal-50 text-teal-800 border-teal-300';
    summary = 'Well-proportioned macronutrients suitable for everyday meals.';
  } else if (finalScore >= 60) {
    label = 'Moderate Profile';
    badgeClass = 'bg-amber-50 text-amber-800 border-amber-300';
    summary = 'Balanced overall, but notice sugar, sodium, or saturated fat levels.';
  } else {
    label = 'Mindful Consumption';
    badgeClass = 'bg-orange-50 text-orange-900 border-orange-300';
    summary = 'Higher in added sugar, saturated fat, or sodium; best enjoyed in moderation.';
  }

  // Visual star representation
  const fullStars = Math.floor(stars);
  const hasHalf = stars - fullStars >= 0.5;
  let starDisplay = '★'.repeat(fullStars);
  if (hasHalf && fullStars < 5) starDisplay += '½';
  while (starDisplay.length < 5) starDisplay += '☆';

  return {
    stars,
    score: finalScore,
    label,
    badgeClass,
    starDisplay,
    summary
  };
}
