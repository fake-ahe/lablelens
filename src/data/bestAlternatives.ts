import { LabelAnalysisResult } from '../types';

export interface AlternativeProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  rating: number; // e.g. 4.9
  cleanScore: number; // 0 - 100
  cleanGrade: 'A+' | 'A' | 'A-';
  tagline: string;
  whyBetter: string;
  keyBadges: string[];
  servingSize: string;
  nutrition: {
    calories: number;
    protein: number;
    fiber: number;
    addedSugar: number;
    totalSugar: number;
    sodium: number;
    saturatedFat: number;
  };
  highlightComparison: {
    label: string;
    value: string;
    advantage: 'better' | 'neutral';
  }[];
  cleanIngredients: string[];
  certifications: string[];
  fullProductData?: LabelAnalysisResult;
}

export const CURATED_ALTERNATIVES: AlternativeProduct[] = [
  // 1. For Cereals, Granolas, Breakfast
  {
    id: 'alt-sprouted-ancient-cereal',
    name: 'Sprouted Ancient Grain & Raw Cocoa Flakes',
    brand: 'Natures Origin Co.',
    category: 'Breakfast Cereal & Granola',
    imageUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    cleanScore: 97,
    cleanGrade: 'A+',
    tagline: 'Bio-sprouted grains with zero refined sugars or artificial emulsifiers',
    whyBetter: 'Sprouting neutralizes phytic acid for 3x higher mineral bio-availability. Sweetened strictly with organic Ceylon cinnamon and unsweetened Ecuadorian raw cacao nibs instead of cane syrups.',
    keyBadges: ['Zero Added Sugar', '100% Sprouted Whole Grains', 'No Soy Lecithin', 'Cardio-Protective Beta Glucan'],
    servingSize: '1 cup (55g)',
    nutrition: {
      calories: 190,
      protein: 11.0,
      fiber: 8.5,
      addedSugar: 0.0,
      totalSugar: 1.5,
      sodium: 75,
      saturatedFat: 0.5
    },
    highlightComparison: [
      { label: 'Added Sugar', value: '0g (vs current added sugar)', advantage: 'better' },
      { label: 'Dietary Fiber', value: '8.5g (2.1x higher prebiotic fiber)', advantage: 'better' },
      { label: 'Sodium', value: '75mg (80% lower sodium)', advantage: 'better' },
      { label: 'Industrial Additives', value: '0 additives (100% whole foods)', advantage: 'better' }
    ],
    cleanIngredients: [
      'Organic sprouted whole rolled oats',
      'Organic sprouted quinoa flakes',
      'Raw single-origin fair-trade cacao nibs',
      'Organic golden flaxseed',
      'Ceylon cinnamon',
      'Himalayan pink salt'
    ],
    certifications: ['USDA Organic', 'Non-GMO Verified', 'Certified Gluten-Free', 'Glycemic Index Tested']
  },

  // 2. For Breakfast / Muesli
  {
    id: 'alt-wild-berry-protein-crunch',
    name: 'Wild Berry & Sprouted Seed Keto Crunch',
    brand: 'Verdant Harvest',
    category: 'Breakfast Cereal & Granola',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    cleanScore: 95,
    cleanGrade: 'A+',
    tagline: 'Grain-free, high-protein morning crunch powered by seeds & freeze-dried berries',
    whyBetter: 'Eliminates fast-digesting starches completely, delivering 15g of sustained plant protein and only 1g net carb with zero spike in morning insulin.',
    keyBadges: ['15g Plant Protein', '1g Total Sugar', 'Grain-Free', 'Omega-3 Rich'],
    servingSize: '50g',
    nutrition: {
      calories: 210,
      protein: 15.0,
      fiber: 7.0,
      addedSugar: 0.0,
      totalSugar: 1.0,
      sodium: 90,
      saturatedFat: 1.0
    },
    highlightComparison: [
      { label: 'Protein Density', value: '15g per serving', advantage: 'better' },
      { label: 'Added Sugar', value: '0g zero cane sugar', advantage: 'better' },
      { label: 'Digestive Comfort', value: 'Grain-free prebiotic seeds', advantage: 'better' },
      { label: 'Additives', value: 'Zero artificial preservatives', advantage: 'better' }
    ],
    cleanIngredients: [
      'Raw sprouted pumpkin seeds',
      'Organic chia seeds',
      'Raw hemp hearts',
      'Freeze-dried wild blueberries',
      'Toasted coconut chips',
      'Pure Madagascar vanilla bean'
    ],
    certifications: ['Certified Organic', 'Keto Certified', 'Paleo Friendly', 'Vegan']
  },

  // 3. For Protein Bars & Snack Bars
  {
    id: 'alt-raw-almond-date-fuel',
    name: 'Raw Sprouted Almond & Vanilla Fuel Bar',
    brand: 'EarthCore Nutrition',
    category: 'Protein & Energy Bars',
    imageUrl: 'https://images.unsplash.com/photo-1622484216805-4c07c72f77e2?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    cleanScore: 98,
    cleanGrade: 'A+',
    tagline: 'Cold-pressed whole foods bar with 18g clean bio-protein and 0 synthetic gums',
    whyBetter: 'Replaces processed soy isolates and artificial polyols with stone-ground sprouted almond butter and organic yellow pea protein. 100% free of palm oils, sucralose, or soluble corn fibers.',
    keyBadges: ['18g Clean Protein', 'Zero Sugar Alcohols', 'No Palm Oil', 'Cold-Pressed Whole Foods'],
    servingSize: '1 bar (60g)',
    nutrition: {
      calories: 215,
      protein: 18.0,
      fiber: 9.0,
      addedSugar: 0.0,
      totalSugar: 2.5,
      sodium: 110,
      saturatedFat: 1.2
    },
    highlightComparison: [
      { label: 'Sugar Alcohols', value: '0g (no erythritol/maltitol gut bloat)', advantage: 'better' },
      { label: 'Gut Health', value: '9g organic prebiotic tapioca', advantage: 'better' },
      { label: 'Clean Ingredients', value: '6 whole ingredients vs 15+ industrial', advantage: 'better' },
      { label: 'Sodium', value: '110mg clean cardiovascular profile', advantage: 'better' }
    ],
    cleanIngredients: [
      'Organic sprouted yellow pea protein isolate',
      'Stone-ground California almond butter',
      'Prebiotic tapioca fiber',
      'Organic Medjool date paste',
      'Sprouted pumpkin seeds',
      'Pure vanilla extract',
      'Sea salt'
    ],
    certifications: ['Non-GMO Project', 'Certified Plant-Based', 'Gluten-Free']
  },

  // 4. For Savory Crisps, Chips & Indian Snacks
  {
    id: 'alt-air-popped-lentil-crisps',
    name: 'Air-Popped Sprouted Moong & Black Salt Crisps',
    brand: 'PurePulse Botanicals',
    category: 'Savory Chips & Crisps',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    cleanScore: 94,
    cleanGrade: 'A+',
    tagline: 'Slow-baked non-fried legume crisps roasted in cold-pressed avocado oil',
    whyBetter: 'Completely replaces refined high-temperature palm olein with cold-pressed avocado oil (high smoke point, zero trans fats, and rich in monounsaturated oleic acid). Reduces sodium by 60% compared to typical commercial namkeen.',
    keyBadges: ['Non-Fried Air Baked', 'Zero Palm Olein', '60% Less Sodium', 'Avocado Oil Roasted'],
    servingSize: '30g',
    nutrition: {
      calories: 115,
      protein: 6.5,
      fiber: 4.5,
      addedSugar: 0.0,
      totalSugar: 0.5,
      sodium: 120,
      saturatedFat: 0.4
    },
    highlightComparison: [
      { label: 'Cooking Medium', value: 'Cold-Pressed Avocado Oil (vs Refined Palm Olein)', advantage: 'better' },
      { label: 'Sodium Control', value: '120mg (vs 290mg - 60% reduction)', advantage: 'better' },
      { label: 'Protein per 30g', value: '6.5g pulse protein (+58%)', advantage: 'better' },
      { label: 'Saturated Fat', value: '0.4g (vs 2.2g - 80% reduction)', advantage: 'better' }
    ],
    cleanIngredients: [
      'Sprouted Moong dal flour',
      'Whole Urad dal flour',
      'Cold-pressed avocado oil',
      'Toasted stone-ground cumin & coriander seeds',
      'Black salt (Kala Namak)',
      'Dry green mango powder (Amchur)'
    ],
    certifications: ['Zero Trans Fat', 'Vegan Certified', '100% Natural Spices', 'No Added MSG']
  },

  // 5. For Beverages, Sodas, and Sweet Teas
  {
    id: 'alt-botanical-sparkling-elixir',
    name: 'Organic Sparkling Hibiscus & Ginger Prebiotic Tonic',
    brand: 'Botanica Flora',
    category: 'Beverages & Refreshments',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    cleanScore: 99,
    cleanGrade: 'A+',
    tagline: 'Brewed medicinal flowers with zero artificial sweeteners, caramel color, or phosphoric acid',
    whyBetter: 'Provides a vibrant, tart sparkling fizz with 100% real brewed herbs and 5g prebiotic plant fiber to soothe digestion, avoiding hazardous caramel color IV (4-MeI) and artificial sweeteners.',
    keyBadges: ['Zero Added Sugar', 'Zero Aspartame / Sucralose', 'No Caramel Color IV', '5g Prebiotic Fiber'],
    servingSize: '1 can (355ml)',
    nutrition: {
      calories: 15,
      protein: 0.5,
      fiber: 5.0,
      addedSugar: 0.0,
      totalSugar: 1.0,
      sodium: 15,
      saturatedFat: 0.0
    },
    highlightComparison: [
      { label: 'Sugar Impact', value: '0g added sugar (vs 35-40g in standard sodas)', advantage: 'better' },
      { label: 'Chemical Additives', value: 'No phosphoric acid or caramel IV', advantage: 'better' },
      { label: 'Gut Support', value: '5g agave prebiotic inulin', advantage: 'better' },
      { label: 'Color Source', value: 'Natural brewed organic hibiscus petals', advantage: 'better' }
    ],
    cleanIngredients: [
      'Sparkling mountain spring water',
      'Organic cold-brewed hibiscus flowers',
      'Fresh pressed organic ginger juice',
      'Organic blue agave inulin',
      'Cold-pressed lemon juice'
    ],
    certifications: ['USDA Organic', 'Non-GMO Verified', 'Gut Health Certified', 'Kosher']
  },

  // 6. For Sweet Treats, Cookies & Chocolates
  {
    id: 'alt-wild-cacao-coconut-thins',
    name: '85% Single-Origin Stone Ground Raw Cacao Thins',
    brand: 'Aura Artisan Chocolates',
    category: 'Chocolates & Sweet Treats',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    cleanScore: 96,
    cleanGrade: 'A+',
    tagline: 'Pure antioxidant-dense raw chocolate sweetened with minimal organic date nectar',
    whyBetter: 'Contains over 850mg of natural cardiovascular flavanols. Contains NO soy lecithin, NO alkali processing (Dutch cocoa), NO hydrogenated fats, and only 3g of natural unrefined sugars.',
    keyBadges: ['85% Raw Flavanol Cacao', 'No Soy/Sunflower Lecithin', 'Zero Trans Fats', '3g Natural Sugar'],
    servingSize: '30g',
    nutrition: {
      calories: 160,
      protein: 3.5,
      fiber: 5.0,
      addedSugar: 2.0,
      totalSugar: 3.0,
      sodium: 10,
      saturatedFat: 6.0
    },
    highlightComparison: [
      { label: 'Cacao Purity', value: '85% raw unalkalized cacao', advantage: 'better' },
      { label: 'Added Sugar', value: '2g (vs 15-20g in mass-market chocolate)', advantage: 'better' },
      { label: 'Emulsifiers', value: '100% lecithin-free', advantage: 'better' },
      { label: 'Antioxidants', value: 'High flavanol polyphenols', advantage: 'better' }
    ],
    cleanIngredients: [
      'Organic raw Criollo cacao beans',
      'Organic cold-pressed cacao butter',
      'Organic Medjool date nectar',
      'Vanilla bean powder'
    ],
    certifications: ['Direct Fair Trade', 'USDA Organic', 'Bean-to-Bar Craft']
  }
];

/**
 * Intelligent alternative matcher that selects the best 2-3 healthier swaps
 * tailored to the detected product's name, brand, category, and nutritional profile.
 */
export function getBestAlternativesForProduct(product: LabelAnalysisResult): AlternativeProduct[] {
  if (!product) return [CURATED_ALTERNATIVES[0], CURATED_ALTERNATIVES[1], CURATED_ALTERNATIVES[2]];

  const ingredientsStr = (product.ingredients || []).map(i => i?.name || '').join(' ');
  const tagsStr = (product.dietaryTags || []).join(' ');
  const text = `${product.productName || ''} ${product.brand || ''} ${ingredientsStr} ${tagsStr}`.toLowerCase();

  // Match based on category keywords
  const isCereal = text.includes('cereal') || text.includes('oat') || text.includes('granola') || text.includes('flake') || text.includes('breakfast');
  const isBar = text.includes('bar') || text.includes('protein') || text.includes('snack bar') || text.includes('energy');
  const isSavoryCrisp = text.includes('crisp') || text.includes('chip') || text.includes('lentil') || text.includes('namkeen') || text.includes('cracker') || text.includes('snack');
  const isBeverage = text.includes('soda') || text.includes('drink') || text.includes('cola') || text.includes('juice') || text.includes('tea') || text.includes('beverage');
  const isSweetSnack = text.includes('choco') || text.includes('cookie') || text.includes('candy') || text.includes('sweet') || text.includes('biscuit');

  let matched: AlternativeProduct[] = [];

  if (isCereal) {
    matched.push(CURATED_ALTERNATIVES[0], CURATED_ALTERNATIVES[1], CURATED_ALTERNATIVES[2]);
  } else if (isBar) {
    matched.push(CURATED_ALTERNATIVES[2], CURATED_ALTERNATIVES[1], CURATED_ALTERNATIVES[0]);
  } else if (isSavoryCrisp) {
    matched.push(CURATED_ALTERNATIVES[3], CURATED_ALTERNATIVES[2], CURATED_ALTERNATIVES[0]);
  } else if (isBeverage) {
    matched.push(CURATED_ALTERNATIVES[4], CURATED_ALTERNATIVES[2], CURATED_ALTERNATIVES[0]);
  } else if (isSweetSnack) {
    matched.push(CURATED_ALTERNATIVES[5], CURATED_ALTERNATIVES[0], CURATED_ALTERNATIVES[2]);
  } else {
    // Default tailored selection based on nutritional flags
    const addedSugar = product.nutrition?.addedSugar?.value ?? 0;
    const sodium = product.nutrition?.sodium?.value ?? 0;
    const hasDangerAdditives = (product.additives || []).some(a => {
      const aName = (a?.name || '').toLowerCase();
      return aName.includes('potassium bromate') || 
             aName.includes('titanium') ||
             aName.includes('nitrite') ||
             aName.includes('bha') ||
             aName.includes('tbhq');
    });

    if (addedSugar > 5) {
      matched.push(CURATED_ALTERNATIVES[0], CURATED_ALTERNATIVES[2], CURATED_ALTERNATIVES[5]);
    } else if (sodium > 300) {
      matched.push(CURATED_ALTERNATIVES[3], CURATED_ALTERNATIVES[0], CURATED_ALTERNATIVES[2]);
    } else if (hasDangerAdditives) {
      matched.push(CURATED_ALTERNATIVES[0], CURATED_ALTERNATIVES[2], CURATED_ALTERNATIVES[3]);
    } else {
      matched = [CURATED_ALTERNATIVES[0], CURATED_ALTERNATIVES[2], CURATED_ALTERNATIVES[3]];
    }
  }

  // Calculate dynamic comparison metrics vs current product for each alternative
  return matched.map(alt => {
    const currentSugar = product.nutrition.addedSugar?.value ?? product.nutrition.totalSugar?.value ?? null;
    const currentSodium = product.nutrition.sodium?.value ?? null;
    const currentProtein = product.nutrition.protein?.value ?? null;
    const currentFiber = product.nutrition.fiber?.value ?? null;
    const currentAdditivesCount = product.additives.length;

    const dynamicComparisons = [...alt.highlightComparison];

    if (currentSugar !== null && currentSugar > 0 && alt.nutrition.addedSugar < currentSugar) {
      const reduction = Math.round(((currentSugar - alt.nutrition.addedSugar) / currentSugar) * 100);
      dynamicComparisons[0] = {
        label: 'Sugar Savings',
        value: `${reduction}% less added sugar (${alt.nutrition.addedSugar}g vs ${currentSugar}g)`,
        advantage: 'better'
      };
    }

    if (currentSodium !== null && currentSodium > alt.nutrition.sodium) {
      const reduction = Math.round(((currentSodium - alt.nutrition.sodium) / currentSodium) * 100);
      dynamicComparisons[2] = {
        label: 'Sodium Reduction',
        value: `${reduction}% lower sodium (${alt.nutrition.sodium}mg vs ${currentSodium}mg)`,
        advantage: 'better'
      };
    }

    return {
      ...alt,
      highlightComparison: dynamicComparisons
    };
  });
}

/**
 * Converts an alternative product into a standard LabelAnalysisResult
 * so that the user can compare side-by-side or inspect its full label in LabelLens.
 */
export function convertAlternativeToLabelProduct(alt: AlternativeProduct): LabelAnalysisResult {
  return {
    id: alt.id,
    productName: alt.name,
    brand: alt.brand,
    imageUrl: alt.imageUrl,
    scannedAt: new Date().toISOString(),
    regionalStandard: 'US',
    servingSize: alt.servingSize,
    servingSizeGrams: 55,
    servingsPerPackage: 1,
    nutrition: {
      calories: { value: alt.nutrition.calories, unit: 'kcal', dailyValuePercent: Math.round((alt.nutrition.calories / 2000) * 100), confidence: 99 },
      totalFat: { value: alt.nutrition.saturatedFat * 3, unit: 'g', dailyValuePercent: 7, confidence: 98 },
      saturatedFat: { value: alt.nutrition.saturatedFat, unit: 'g', dailyValuePercent: Math.round((alt.nutrition.saturatedFat / 20) * 100), confidence: 98 },
      transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99 },
      cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99 },
      sodium: { value: alt.nutrition.sodium, unit: 'mg', dailyValuePercent: Math.round((alt.nutrition.sodium / 2300) * 100), confidence: 99 },
      carbohydrates: { value: 30, unit: 'g', dailyValuePercent: 11, confidence: 98 },
      fiber: { value: alt.nutrition.fiber, unit: 'g', dailyValuePercent: Math.round((alt.nutrition.fiber / 28) * 100), confidence: 98 },
      totalSugar: { value: alt.nutrition.totalSugar, unit: 'g', dailyValuePercent: null, confidence: 99 },
      addedSugar: { value: alt.nutrition.addedSugar, unit: 'g', dailyValuePercent: Math.round((alt.nutrition.addedSugar / 50) * 100), confidence: 99 },
      protein: { value: alt.nutrition.protein, unit: 'g', dailyValuePercent: Math.round((alt.nutrition.protein / 50) * 100), confidence: 99 },
    },
    ingredients: alt.cleanIngredients.map((ing, idx) => ({
      id: `alt-ing-${idx}`,
      order: idx + 1,
      name: ing,
      category: idx === 0 ? 'Grain' : 'Other',
      purpose: 'Wholesome organic nutrient base',
      explanation: 'Unrefined, non-GMO natural food ingredient with no chemical bleaching or synthetic enrichment.'
    })),
    allergens: [],
    allergenStatement: 'Formulated in a dedicated clean-label certified facility.',
    additives: [],
    claims: alt.keyBadges,
    dietaryTags: ['Clean Label', 'Low Sugar', 'Whole Food'],
    confidence: {
      overall: 99,
      nutritionTable: 99,
      ingredientsList: 99,
      lowConfidenceFields: []
    },
    simpleSummary: `This alternative provides ${alt.nutrition.protein}g of protein and ${alt.nutrition.fiber}g of prebiotic fiber with ${alt.nutrition.addedSugar}g added sugar and only ${alt.nutrition.sodium}mg sodium.`,
    thingsToNotice: [
      `Added sugar: ${alt.nutrition.addedSugar}g (Significantly reduced)`,
      `Sodium: ${alt.nutrition.sodium}mg (Cardiovascular healthy)`,
      `Dietary fiber: ${alt.nutrition.fiber}g (Prebiotic gut nourishment)`,
      `Formulation: 100% free from high-hazard technological additives`
    ],
    healthImpacts: [
      {
        system: 'Heart & Blood Pressure',
        rating: 'positive',
        score: 95,
        keyNutrient: `${alt.nutrition.sodium}mg Sodium`,
        observation: 'Low sodium cardioprotective balance',
        explanation: 'Safeguards vascular endothelium with minimal sodium and healthy whole plant fats.'
      },
      {
        system: 'Blood Sugar Balance',
        rating: 'positive',
        score: 96,
        keyNutrient: `${alt.nutrition.addedSugar}g Added Sugar`,
        observation: 'Gentle glycemic curve',
        explanation: 'Avoids sudden insulin surges; supports long-term metabolic health.'
      },
      {
        system: 'Digestion & Gut',
        rating: 'positive',
        score: 94,
        keyNutrient: `${alt.nutrition.fiber}g Prebiotic Fiber`,
        observation: 'Prebiotic richness',
        explanation: 'Plant-derived soluble fiber enhances short-chain fatty acid microbial synthesis.'
      },
      {
        system: 'Muscle & Energy',
        rating: 'positive',
        score: alt.nutrition.protein >= 10 ? 92 : 80,
        keyNutrient: `${alt.nutrition.protein}g Bio-Protein`,
        observation: 'Clean amino acid delivery',
        explanation: 'Supports muscle maintenance with wholesome bio-available proteins.'
      },
      {
        system: 'Metabolism & Satiety',
        rating: 'positive',
        score: 90,
        keyNutrient: 'Nutrient Density Ratio',
        observation: 'Sustained cellular fuel',
        explanation: 'High nutrient-to-calorie ratio satisfies appetite naturally.'
      }
    ],
    labelProfile: {
      protein: alt.nutrition.protein >= 15 ? 5 : alt.nutrition.protein >= 10 ? 4 : 3,
      fiber: alt.nutrition.fiber >= 7 ? 5 : alt.nutrition.fiber >= 4 ? 4 : 3,
      addedSugar: alt.nutrition.addedSugar <= 1 ? 5 : alt.nutrition.addedSugar <= 3 ? 4 : 3,
      sodium: alt.nutrition.sodium <= 100 ? 5 : alt.nutrition.sodium <= 140 ? 4 : 3,
      complexity: 5
    }
  };
}

