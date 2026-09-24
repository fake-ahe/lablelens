import { LabelAnalysisResult } from '../types';

export interface PopularCatalogItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  servingSize: string;
  calories: number;
  tags: string[];
  hasHarmfulAdditives: boolean;
  harmfulAdditivesCount: number;
  highlightWarning?: string;
  imageUrl: string;
  productData: LabelAnalysisResult;
}

// 1. OREO DOUBLE STUF COOKIES
const OREO_PRODUCT: LabelAnalysisResult = {
  id: 'catalog-oreo-double-stuf',
  productName: 'Oreo Double Stuf Chocolate Sandwich Cookies',
  brand: 'Nabisco (Mondelēz)',
  imageUrl: 'https://i5.walmartimages.com/asr/f5ad0505-6627-4e84-b264-b682835cabe7_1.eda12da44753c142ec5d73d29cb59385.jpeg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Oreo+Double+Stuf+Chocolate+Sandwich+Cookies+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '2 cookies (29g)',
  servingSizeGrams: 29,
  servingsPerPackage: 15,
  nutrition: {
    calories: { value: 140, unit: 'kcal', dailyValuePercent: 7, confidence: 99, originalText: '140' },
    totalFat: { value: 7.0, unit: 'g', dailyValuePercent: 9, confidence: 98, originalText: '7g' },
    saturatedFat: { value: 2.0, unit: 'g', dailyValuePercent: 10, confidence: 98, originalText: '2g' },
    transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '0g' },
    cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99, originalText: '0mg' },
    sodium: { value: 90, unit: 'mg', dailyValuePercent: 4, confidence: 99, originalText: '90mg' },
    carbohydrates: { value: 21.0, unit: 'g', dailyValuePercent: 8, confidence: 99, originalText: '21g' },
    fiber: { value: 1.0, unit: 'g', dailyValuePercent: 4, confidence: 95, originalText: '1g' },
    totalSugar: { value: 13.0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '13g' },
    addedSugar: { value: 13.0, unit: 'g', dailyValuePercent: 26, confidence: 99, originalText: '13g' },
    protein: { value: 1.0, unit: 'g', dailyValuePercent: 2, confidence: 97, originalText: '1g' },
    vitaminsMinerals: [
      { name: 'Iron', amount: '1.2mg', dailyValuePercent: 6 }
    ]
  },
  nutritionPer100g: {
    calories: { value: 483, unit: 'kcal', dailyValuePercent: 24 },
    protein: { value: 3.4, unit: 'g', dailyValuePercent: 7 },
    totalFat: { value: 24.1, unit: 'g', dailyValuePercent: 31 },
    saturatedFat: { value: 6.9, unit: 'g', dailyValuePercent: 35 },
    carbohydrates: { value: 72.4, unit: 'g', dailyValuePercent: 26 },
    fiber: { value: 3.4, unit: 'g', dailyValuePercent: 12 },
    totalSugar: { value: 44.8, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 44.8, unit: 'g', dailyValuePercent: 90 },
    sodium: { value: 310, unit: 'mg', dailyValuePercent: 13 }
  },
  ingredients: [
    {
      id: 'ing-o-1',
      order: 1,
      name: 'Sugar',
      category: 'Sweetener',
      purpose: 'Primary sweetener for cookie and cream',
      explanation: 'Refined sucrose driving high glycemic index.',
      isAdditive: false
    },
    {
      id: 'ing-o-2',
      order: 2,
      name: 'Unbleached enriched flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)',
      category: 'Grain',
      purpose: 'Refined flour base',
      explanation: 'Endosperm-only wheat flour stripped of wheat bran and germ fibers.',
      isAllergen: true
    },
    {
      id: 'ing-o-3',
      order: 3,
      name: 'Palm and/or canola oil',
      category: 'Oil/Fat',
      purpose: 'Structured fat for cream stability',
      explanation: 'High saturated fatty acid tropical oil providing room-temperature firmness.',
      isAdditive: false
    },
    {
      id: 'ing-o-4',
      order: 4,
      name: 'Cocoa (processed with alkali / Dutch cocoa)',
      category: 'Flavoring',
      purpose: 'Deep chocolate flavor and dark hue',
      explanation: 'Cocoa powder treated with potassium carbonate to reduce bitterness and neutralize natural acidity.',
      isAdditive: false
    },
    {
      id: 'ing-o-5',
      order: 5,
      name: 'High fructose corn syrup',
      category: 'Sweetener',
      purpose: 'Softness and moisture retention',
      explanation: 'Industrial corn-derived monosaccharide liquid sweetener metabolized rapidly by the liver.',
      isAdditive: true
    },
    {
      id: 'ing-o-6',
      order: 6,
      name: 'Soy lecithin',
      category: 'Emulsifier',
      purpose: 'Fat-water binding',
      explanation: 'Phospholipid emulsifier extracted from soybeans.',
      isAdditive: true,
      isAllergen: true
    },
    {
      id: 'ing-o-7',
      order: 7,
      name: 'Vanillin (artificial flavor)',
      category: 'Flavoring',
      purpose: 'Synthetic vanilla aroma',
      explanation: 'Synthetic aroma chemical mimicking vanilla bean notes.',
      isAdditive: true
    }
  ],
  allergens: [
    { name: 'Wheat', source: 'ingredient', evidence: 'Unbleached enriched flour' },
    { name: 'Soy', source: 'ingredient', evidence: 'Soy lecithin' }
  ],
  allergenStatement: 'Contains: Wheat, Soy.',
  additives: [
    {
      id: 'add-o-1',
      name: 'High Fructose Corn Syrup',
      category: 'Liquid Sweetener',
      purpose: 'Enhances texture and sweetness',
      explanation: 'Associated with hepatic de novo lipogenesis when consumed in excess.'
    },
    {
      id: 'add-o-2',
      name: 'Soy Lecithin (E322)',
      category: 'Emulsifier',
      purpose: 'Prevents oil separation',
      explanation: 'Generally recognized as safe (GRAS) phospholipid.'
    },
    {
      id: 'add-o-3',
      name: 'Vanillin',
      category: 'Artificial Flavoring',
      purpose: 'Flavor standardization',
      explanation: 'Synthetic petrochemical or wood-pulp derived flavor compound.'
    }
  ],
  claims: ['Kosher (OU-D)'],
  dietaryTags: ['Vegetarian'],
  confidence: {
    overall: 99,
    nutritionTable: 99,
    ingredientsList: 99,
    lowConfidenceFields: []
  },
  simpleSummary: 'Oreo Double Stuf cookies are an ultra-processed confectionery treat consisting of nearly 45% sugar by weight, blended with refined palm oil and enriched bleached flour.',
  thingsToNotice: [
    'Sugar is the very first listed ingredient by weight.',
    'Contains 13g added sugar in just 2 cookies (26% of recommended daily value).',
    'Uses industrial high-fructose corn syrup in addition to refined cane sugar.',
    'Contains palm oil high in palmitic saturated fatty acids.'
  ],
  healthImpacts: [
    {
      system: 'Blood Sugar Balance',
      rating: 'attention',
      score: 38,
      keyNutrient: '13g Added Sugar / 2 cookies',
      observation: 'Sharp glycemic excursion',
      explanation: 'High concentration of simple sucrose and HFCS without dietary fiber causes rapid postprandial glucose spike.'
    },
    {
      system: 'Heart & Blood Pressure',
      rating: 'neutral',
      score: 62,
      keyNutrient: '2g Saturated Fat & 90mg Sodium',
      observation: 'Moderate saturated fat density',
      explanation: 'Contains palm oil palmitic acid; sodium load is relatively modest at 90mg.'
    },
    {
      system: 'Digestion & Gut',
      rating: 'attention',
      score: 48,
      keyNutrient: 'Low Fiber (<1g)',
      observation: 'Minimal prebiotic substrate',
      explanation: 'Ultra-refined flour and sugar provide virtually no dietary fiber to support gut microbiome diversity.'
    },
    {
      system: 'Muscle & Energy',
      rating: 'neutral',
      score: 55,
      keyNutrient: '140 kcal rapid energy',
      observation: 'Quick energy burst followed by slump',
      explanation: 'Provides fast-acting carbohydrate energy but lacks amino acids (1g protein) for sustained satiety.'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'attention',
      score: 35,
      keyNutrient: 'Hyper-palatable sugar/fat ratio',
      observation: 'Weak satiety feedback signals',
      explanation: 'The classic 2:1 carbohydrate-to-fat combination activates hedonic reward centers, encouraging overconsumption.'
    }
  ],
  labelProfile: {
    protein: 1,
    fiber: 1,
    addedSugar: 5,
    sodium: 2,
    complexity: 4
  },
  groundingMetadata: {
    isSearchGrounded: true,
    sources: [
      { title: 'USDA FoodData Central - Oreo Double Stuf Cookies', uri: 'https://fdc.nal.usda.gov' },
      { title: 'OpenFoodFacts - Oreo Double Stuf Nutrition Facts', uri: 'https://world.openfoodfacts.org' }
    ],
    searchQueries: ['oreo double stuf nutrition facts', 'oreo ingredients label']
  }
};

// 2. DORITOS NACHO CHEESE
const DORITOS_PRODUCT: LabelAnalysisResult = {
  id: 'catalog-doritos-nacho',
  productName: 'Doritos Nacho Cheese Flavored Tortilla Chips',
  brand: 'Frito-Lay (PepsiCo)',
  imageUrl: 'https://i5.walmartimages.com/asr/aa096172-f2d0-4d95-b2d9-50bf5f198bed.a6c937a25600f2dbeb6b8a5074293e46.jpeg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Doritos+Nacho+Cheese+Flavored+Tortilla+Chips+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '1 oz (28g / about 12 chips)',
  servingSizeGrams: 28,
  servingsPerPackage: 9,
  nutrition: {
    calories: { value: 150, unit: 'kcal', dailyValuePercent: 8, confidence: 99, originalText: '150' },
    totalFat: { value: 8.0, unit: 'g', dailyValuePercent: 10, confidence: 99, originalText: '8g' },
    saturatedFat: { value: 1.0, unit: 'g', dailyValuePercent: 5, confidence: 98, originalText: '1g' },
    transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '0g' },
    cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99, originalText: '0mg' },
    sodium: { value: 210, unit: 'mg', dailyValuePercent: 9, confidence: 99, originalText: '210mg' },
    carbohydrates: { value: 18.0, unit: 'g', dailyValuePercent: 7, confidence: 99, originalText: '18g' },
    fiber: { value: 1.0, unit: 'g', dailyValuePercent: 4, confidence: 96, originalText: '1g' },
    totalSugar: { value: 1.0, unit: 'g', dailyValuePercent: null, confidence: 98, originalText: '1g' },
    addedSugar: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 98, originalText: '0g' },
    protein: { value: 2.0, unit: 'g', dailyValuePercent: 4, confidence: 98, originalText: '2g' },
    vitaminsMinerals: [
      { name: 'Calcium', amount: '50mg', dailyValuePercent: 4 },
      { name: 'Potassium', amount: '50mg', dailyValuePercent: 0 }
    ]
  },
  nutritionPer100g: {
    calories: { value: 536, unit: 'kcal', dailyValuePercent: 27 },
    protein: { value: 7.1, unit: 'g', dailyValuePercent: 14 },
    totalFat: { value: 28.6, unit: 'g', dailyValuePercent: 37 },
    saturatedFat: { value: 3.6, unit: 'g', dailyValuePercent: 18 },
    carbohydrates: { value: 64.3, unit: 'g', dailyValuePercent: 23 },
    fiber: { value: 3.6, unit: 'g', dailyValuePercent: 13 },
    totalSugar: { value: 3.6, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 0, unit: 'g', dailyValuePercent: 0 },
    sodium: { value: 750, unit: 'mg', dailyValuePercent: 33 }
  },
  ingredients: [
    { id: 'ing-d-1', order: 1, name: 'Corn', category: 'Grain', purpose: 'Milled whole grain corn base', explanation: 'Whole corn grains cooked and ground into masa.' },
    { id: 'ing-d-2', order: 2, name: 'Vegetable oil (corn, canola, and/or sunflower oil)', category: 'Oil/Fat', purpose: 'Cooking medium', explanation: 'High heat frying oil providing crunchy texture.' },
    { id: 'ing-d-3', order: 3, name: 'Maltodextrin', category: 'Carbohydrate', purpose: 'Flavor carrier with high glycemic index', explanation: 'Fast-digesting corn starch derivative carrying seasoning.' },
    { id: 'ing-d-4', order: 4, name: 'Salt', category: 'Mineral', purpose: 'Seasoning', explanation: 'Refined table salt enhancing flavor perception.' },
    { id: 'ing-d-5', order: 5, name: 'Cheddar cheese (milk, cheese cultures, salt, enzymes)', category: 'Dairy', purpose: 'Cheese flavor', explanation: 'Dehydrated real cheddar cheese solids.', isAllergen: true },
    { id: 'ing-d-6', order: 6, name: 'Monosodium glutamate (MSG)', category: 'Flavor Enhancer', purpose: 'Umami neurotransmitter stimulation', explanation: 'Glutamate salt activating savory taste receptors.', isAdditive: true },
    { id: 'ing-d-7', order: 7, name: 'Yellow 6, Yellow 5, Red 40', category: 'Artificial Color', purpose: 'Vibrant orange synthetic appearance', explanation: 'Petroleum-derived synthetic food colorants.', isAdditive: true },
    { id: 'ing-d-8', order: 8, name: 'Disodium inosinate and disodium guanylate', category: 'Flavor Enhancer', purpose: 'Synergistic umami amplifier', explanation: 'Nucleotide salts that multiply the umami effect of MSG.', isAdditive: true }
  ],
  allergens: [
    { name: 'Milk', source: 'ingredient', evidence: 'Cheddar cheese, whey, buttermilk, Romano cheese' }
  ],
  allergenStatement: 'Contains Milk ingredients.',
  additives: [
    {
      id: 'add-d-1',
      name: 'Monosodium Glutamate (MSG / E621)',
      category: 'Flavor Enhancer',
      purpose: 'Umami receptor excitation',
      explanation: 'Free glutamate that stimulates gustatory taste receptors.'
    },
    {
      id: 'add-d-2',
      name: 'Yellow 6 Lake & Yellow 5 Lake (E110, E102)',
      category: 'Artificial Food Dye',
      purpose: 'Synthetic food coloring',
      explanation: 'Azo dyes requiring warning labels in the European Union regarding attention in children.'
    },
    {
      id: 'add-d-3',
      name: 'Red 40 Lake (E129)',
      category: 'Artificial Food Dye',
      purpose: 'Synthetic colorant',
      explanation: 'Allura Red AC petroleum-derived dye.'
    },
    {
      id: 'add-d-4',
      name: 'Disodium Inosinate & Disodium Guanylate (E631, E627)',
      category: 'Flavor Enhancer',
      purpose: 'Nucleotide umami enhancer',
      explanation: 'Works synergistically with MSG to multiply flavor perception.'
    }
  ],
  claims: ['Gluten Free'],
  dietaryTags: ['Contains Dairy'],
  confidence: { overall: 99, nutritionTable: 99, ingredientsList: 99, lowConfidenceFields: [] },
  simpleSummary: 'Doritos Nacho Cheese is an ultra-processed snack engineered with deep umami enhancers (MSG, Disodium Inosinate, Disodium Guanylate) and petroleum-derived artificial dyes (Yellow 6, Yellow 5, Red 40).',
  thingsToNotice: [
    'Contains 3 synthetic azo food dyes (Yellow 6, Yellow 5, Red 40).',
    'Features triple-action umami enhancers (MSG + Disodium Inosinate + Disodium Guanylate).',
    'Provides 210mg sodium in a small 12-chip serving.',
    'Highly engineered flavor dynamics trigger sensory-specific satiety bypass.'
  ],
  healthImpacts: [
    {
      system: 'Heart & Blood Pressure',
      rating: 'attention',
      score: 52,
      keyNutrient: '210mg Sodium & 8g Fat',
      observation: 'Concentrated sodium density',
      explanation: 'One standard grab bag (2.75 oz) contains over 550mg sodium.'
    },
    {
      system: 'Blood Sugar Balance',
      rating: 'neutral',
      score: 65,
      keyNutrient: '18g Carbohydrates / 0g Added Sugar',
      observation: 'Low sugar but high maltodextrin',
      explanation: 'Contains maltodextrin which carries a higher glycemic index (105-110) than pure table sugar.'
    },
    {
      system: 'Digestion & Gut',
      rating: 'attention',
      score: 50,
      keyNutrient: 'Synthetic Food Dyes & Refined Oils',
      observation: 'Intestinal permeability considerations',
      explanation: 'Synthetic azo dyes have been evaluated in research for mild gut mucosal interactions in sensitive individuals.'
    },
    {
      system: 'Muscle & Energy',
      rating: 'neutral',
      score: 60,
      keyNutrient: '150 kcal Energy',
      observation: 'Quick carbohydrate calories',
      explanation: 'Provides fast savory calories but modest amino acid density (2g protein).'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'attention',
      score: 30,
      keyNutrient: 'MSG + Nucleotide Flavor Synergy',
      observation: 'Vanishing caloric density mechanics',
      explanation: 'The melt-in-mouth crisp texture and potent glutamate synergy suppress satiety cues, encouraging compulsive snacking.'
    }
  ],
  labelProfile: {
    protein: 2,
    fiber: 1,
    addedSugar: 1,
    sodium: 4,
    complexity: 5
  },
  groundingMetadata: {
    isSearchGrounded: true,
    sources: [
      { title: 'Frito-Lay Official Doritos Nacho Cheese Nutrition Facts', uri: 'https://www.fritolay.com' },
      { title: 'USDA FoodData Central - Doritos Nacho Cheese', uri: 'https://fdc.nal.usda.gov' }
    ],
    searchQueries: ['doritos nacho cheese ingredients', 'doritos artificial colors additives']
  }
};

// 3. MONSTER ENERGY ORIGINAL
const MONSTER_PRODUCT: LabelAnalysisResult = {
  id: 'catalog-monster-energy-original',
  productName: 'Monster Energy Drink Original',
  brand: 'Monster Beverage Corporation',
  imageUrl: 'https://i5.walmartimages.com/seo/Monster-Energy-Original-12pk-16-fl-oz-Cans_68166a74-c68f-42e3-985f-97cfcaf550ab.28b4d2df7e3c1de79cff5942ae6d0f9a.jpeg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Monster+Energy+Drink+Original+16+fl+oz+can+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '1 can (16 fl oz / 473ml)',
  servingSizeGrams: 473,
  servingsPerPackage: 1,
  nutrition: {
    calories: { value: 210, unit: 'kcal', dailyValuePercent: 11, confidence: 99, originalText: '210' },
    totalFat: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99, originalText: '0g' },
    saturatedFat: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99, originalText: '0g' },
    transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '0g' },
    cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99, originalText: '0mg' },
    sodium: { value: 370, unit: 'mg', dailyValuePercent: 16, confidence: 99, originalText: '370mg' },
    carbohydrates: { value: 54.0, unit: 'g', dailyValuePercent: 20, confidence: 99, originalText: '54g' },
    fiber: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99, originalText: '0g' },
    totalSugar: { value: 54.0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '54g' },
    addedSugar: { value: 54.0, unit: 'g', dailyValuePercent: 108, confidence: 99, originalText: '54g' },
    protein: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99, originalText: '0g' },
    vitaminsMinerals: [
      { name: 'Niacin (Vit B3)', amount: '40mg', dailyValuePercent: 250 },
      { name: 'Vitamin B6', amount: '4.2mg', dailyValuePercent: 250 },
      { name: 'Vitamin B12', amount: '6mcg', dailyValuePercent: 250 },
      { name: 'Riboflavin (Vit B2)', amount: '3.4mg', dailyValuePercent: 260 }
    ]
  },
  nutritionPer100g: {
    calories: { value: 44, unit: 'kcal', dailyValuePercent: 2 },
    protein: { value: 0, unit: 'g', dailyValuePercent: 0 },
    totalFat: { value: 0, unit: 'g', dailyValuePercent: 0 },
    saturatedFat: { value: 0, unit: 'g', dailyValuePercent: 0 },
    carbohydrates: { value: 11.4, unit: 'g', dailyValuePercent: 4 },
    fiber: { value: 0, unit: 'g', dailyValuePercent: 0 },
    totalSugar: { value: 11.4, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 11.4, unit: 'g', dailyValuePercent: 23 },
    sodium: { value: 78, unit: 'mg', dailyValuePercent: 3 }
  },
  ingredients: [
    { id: 'ing-m-1', order: 1, name: 'Carbonated water', category: 'Liquid Base', purpose: 'Carbonated effervescent beverage base', explanation: 'Purified water infused with carbon dioxide.' },
    { id: 'ing-m-2', order: 2, name: 'Sugar / Glucose', category: 'Sweetener', purpose: 'High caloric simple sugar sweetener', explanation: 'Simple carbohydrate sugars yielding rapid blood glucose elevation.' },
    { id: 'ing-m-3', order: 3, name: 'Citric acid', category: 'Acidulant', purpose: 'Tartness and flavor balance', explanation: 'Organic acid balancing intense sweetness and maintaining acidic pH.', isAdditive: true },
    { id: 'ing-m-4', order: 4, name: 'Taurine (1000mg)', category: 'Amino Sulfonic Acid', purpose: 'Energy blend compound', explanation: 'Sulfur-containing amino acid naturally occurring in animal tissues.' },
    { id: 'ing-m-5', order: 5, name: 'Caffeine (160mg per can)', category: 'Stimulant', purpose: 'Central nervous system stimulant', explanation: 'Adenosine receptor antagonist promoting physiological wakefulness.' },
    { id: 'ing-m-6', order: 6, name: 'Sodium benzoate & sorbic acid', category: 'Preservative', purpose: 'Microbial stabilization', explanation: 'Food antimicrobial agent inhibiting yeast and mold reproduction.', isAdditive: true },
    { id: 'ing-m-7', order: 7, name: 'Sucralose', category: 'Artificial Sweetener', purpose: 'Intense high-potency non-caloric sweetener', explanation: 'Chlorinated sucrose derivative hundreds of times sweeter than table sugar.', isAdditive: true }
  ],
  allergens: [],
  allergenStatement: 'No major common food allergens detected.',
  additives: [
    {
      id: 'add-m-1',
      name: 'Sodium Benzoate (E211)',
      category: 'Preservative',
      purpose: 'Inhibits mold and bacterial growth',
      explanation: 'Can form trace benzene in the presence of ascorbic acid (vitamin C) and light.'
    },
    {
      id: 'add-m-2',
      name: 'Sucralose (E955)',
      category: 'Artificial Non-Caloric Sweetener',
      purpose: 'Sweetness amplification',
      explanation: 'Chlorinated sucrose derivative.'
    },
    {
      id: 'add-m-3',
      name: 'Sorbic Acid (E200)',
      category: 'Preservative',
      purpose: 'Antimicrobial agent',
      explanation: 'Preserves shelf-life of high-sugar acidic liquids.'
    }
  ],
  claims: ['High Caffeine (160mg)', 'Energy Blend: Taurine, Panax Ginseng, L-Carnitine, B-Vitamins'],
  dietaryTags: ['Vegetarian', 'Gluten Free'],
  confidence: { overall: 99, nutritionTable: 99, ingredientsList: 99, lowConfidenceFields: [] },
  simpleSummary: 'Monster Energy Original delivers 54g of added sugar (108% Daily Value) paired with 160mg of caffeine and 370mg of sodium, exceeding daily recommended sugar intake in a single can.',
  thingsToNotice: [
    'Contains 54g added sugar (108% Daily Value) — more than 13 teaspoons of pure sugar.',
    'Contains 160mg caffeine per 16 fl oz can (equivalent to nearly 2 cups of brewed coffee).',
    'Formulated with both sugar AND the artificial sweetener Sucralose.',
    'Contains 370mg sodium, which is surprisingly high for a sweet beverage.'
  ],
  healthImpacts: [
    {
      system: 'Blood Sugar Balance',
      rating: 'negative',
      score: 18,
      keyNutrient: '54g Added Sugar (108% DV)',
      observation: 'Extreme glycemic overload',
      explanation: 'Liquid sucrose and glucose enter the bloodstream virtually unobstructed, demanding a massive insulin surge from pancreatic beta cells.'
    },
    {
      system: 'Heart & Blood Pressure',
      rating: 'attention',
      score: 42,
      keyNutrient: '160mg Caffeine & 370mg Sodium',
      observation: 'Sympathetic nervous system surge',
      explanation: 'Caffeine stimulates adenosine receptor blockade, elevating cardiac output and vascular resistance.'
    },
    {
      system: 'Digestion & Gut',
      rating: 'attention',
      score: 55,
      keyNutrient: 'Citric Acid & Sucralose',
      observation: 'Acidic beverage pH (~3.3)',
      explanation: 'Low pH and concentrated liquid sugars can accelerate dental enamel erosion and irritate sensitive gastric linings.'
    },
    {
      system: 'Muscle & Energy',
      rating: 'attention',
      score: 45,
      keyNutrient: 'Stimulant + Sugar Crash Cycle',
      observation: 'Acute dopamine and alertness spike followed by fatigue',
      explanation: 'After caffeine clearance and rapid cellular glucose uptake, consumers often encounter rebound lethargy.'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'negative',
      score: 25,
      keyNutrient: '210 Liquid Calories',
      observation: 'Zero satiety value',
      explanation: 'Liquid calories do not trigger gastric stretch receptors or satiety peptide YY secretion.'
    }
  ],
  labelProfile: {
    protein: 1,
    fiber: 1,
    addedSugar: 5,
    sodium: 4,
    complexity: 4
  },
  groundingMetadata: {
    isSearchGrounded: true,
    sources: [
      { title: 'Monster Energy Official Nutrition Information', uri: 'https://www.monsterenergy.com' },
      { title: 'USDA FoodData Central - Monster Energy Original', uri: 'https://fdc.nal.usda.gov' }
    ],
    searchQueries: ['monster energy original nutrition facts label', 'monster energy caffeine sugar content']
  }
};

// 4. CHOBANI GREEK YOGURT PLAIN (CLEAN BENCHMARK)
const CHOBANI_PRODUCT: LabelAnalysisResult = {
  id: 'catalog-chobani-plain-greek',
  productName: 'Chobani Whole Milk Plain Greek Yogurt',
  brand: 'Chobani',
  imageUrl: 'https://images.openfoodfacts.net/images/products/089/470/001/0054/front_en.114.400.jpg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Chobani+Plain+Whole+Milk+Greek+Yogurt+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '3/4 cup (170g)',
  servingSizeGrams: 170,
  servingsPerPackage: 5,
  nutrition: {
    calories: { value: 170, unit: 'kcal', dailyValuePercent: 9, confidence: 99, originalText: '170' },
    totalFat: { value: 9.0, unit: 'g', dailyValuePercent: 12, confidence: 99, originalText: '9g' },
    saturatedFat: { value: 5.0, unit: 'g', dailyValuePercent: 25, confidence: 99, originalText: '5g' },
    transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '0g' },
    cholesterol: { value: 30, unit: 'mg', dailyValuePercent: 10, confidence: 99, originalText: '30mg' },
    sodium: { value: 65, unit: 'mg', dailyValuePercent: 3, confidence: 99, originalText: '65mg' },
    carbohydrates: { value: 7.0, unit: 'g', dailyValuePercent: 3, confidence: 99, originalText: '7g' },
    fiber: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99, originalText: '0g' },
    totalSugar: { value: 7.0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '7g' },
    addedSugar: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99, originalText: '0g' },
    protein: { value: 16.0, unit: 'g', dailyValuePercent: 32, confidence: 99, originalText: '16g' },
    vitaminsMinerals: [
      { name: 'Calcium', amount: '190mg', dailyValuePercent: 15 },
      { name: 'Potassium', amount: '240mg', dailyValuePercent: 6 }
    ]
  },
  nutritionPer100g: {
    calories: { value: 100, unit: 'kcal', dailyValuePercent: 5 },
    protein: { value: 9.4, unit: 'g', dailyValuePercent: 19 },
    totalFat: { value: 5.3, unit: 'g', dailyValuePercent: 7 },
    saturatedFat: { value: 2.9, unit: 'g', dailyValuePercent: 15 },
    carbohydrates: { value: 4.1, unit: 'g', dailyValuePercent: 1 },
    fiber: { value: 0, unit: 'g', dailyValuePercent: 0 },
    totalSugar: { value: 4.1, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 0, unit: 'g', dailyValuePercent: 0 },
    sodium: { value: 38, unit: 'mg', dailyValuePercent: 2 }
  },
  ingredients: [
    { id: 'ing-c-1', order: 1, name: 'Cultured pasteurized nonfat milk and cream', category: 'Dairy', purpose: 'Wholesome dairy base', explanation: 'Grade A milk filtered and concentrated through traditional straining.', isAllergen: true },
    { id: 'ing-c-2', order: 2, name: 'Live and active cultures (S. thermophilus, L. bulgaricus, L. acidophilus, Bifidus, L. casei, and L. rhamnosus)', category: 'Probiotic Cultures', purpose: 'Natural fermentation and gut microbiome support', explanation: 'Beneficial lactic acid bacterial strains providing probiotic digestion benefits.' }
  ],
  allergens: [
    { name: 'Milk', source: 'ingredient', evidence: 'Cultured pasteurized milk and cream' }
  ],
  allergenStatement: 'Contains Milk.',
  additives: [],
  claims: ['Zero Added Sugar', '16g Protein per serving', 'Non-GMO Project Verified', 'Kosher Certified', '6 Live Active Probiotic Cultures'],
  dietaryTags: ['Vegetarian', 'Gluten Free', 'Clean Label', 'High Protein'],
  confidence: { overall: 99, nutritionTable: 99, ingredientsList: 99, lowConfidenceFields: [] },
  simpleSummary: 'Chobani Plain Greek Yogurt is a minimally processed, nutrient-dense whole food offering 16g of complete dairy protein, zero added sugars, and 6 active probiotic strains.',
  thingsToNotice: [
    'Zero added sugars — all 7g carbohydrates are naturally occurring dairy lactose.',
    'Provides 16g complete protein with high branched-chain amino acid (BCAA) content.',
    'Formulated with only 2 real ingredients: milk/cream and live probiotic cultures.',
    'Completely free of artificial thickeners, gums, starches, or artificial sweeteners.'
  ],
  healthImpacts: [
    {
      system: 'Digestion & Gut',
      rating: 'positive',
      score: 95,
      keyNutrient: '6 Live Active Probiotics',
      observation: 'Rich microbiome biodiversity support',
      explanation: 'Contains Lactobacillus and Bifidobacterium strains that ferment milk lactose into gut-supportive lactic acid and short-chain fatty acids.'
    },
    {
      system: 'Muscle & Energy',
      rating: 'positive',
      score: 92,
      keyNutrient: '16g Complete Protein (Leucine rich)',
      observation: 'Optimal muscle protein synthesis trigger',
      explanation: 'Slow-digesting micellar casein combined with whey promotes prolonged amino acid delivery to skeletal muscles.'
    },
    {
      system: 'Blood Sugar Balance',
      rating: 'positive',
      score: 90,
      keyNutrient: '0g Added Sugar & High Protein Buffer',
      observation: 'Very low glycemic impact',
      explanation: 'The combination of protein and natural dairy fat blunts gastric emptying, maintaining stable blood sugar.'
    },
    {
      system: 'Heart & Blood Pressure',
      rating: 'positive',
      score: 82,
      keyNutrient: 'Low Sodium (65mg) & Potassium (240mg)',
      observation: 'Favorable potassium-to-sodium ratio',
      explanation: 'Supplies essential dietary minerals to support blood pressure regulation.'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'positive',
      score: 92,
      keyNutrient: 'High Satiety Index Score',
      observation: 'Long-lasting fullness cues',
      explanation: 'High protein and dietary fat stimulate satiety hormones (cholecystokinin and GLP-1).'
    }
  ],
  labelProfile: {
    protein: 5,
    fiber: 1,
    addedSugar: 1,
    sodium: 1,
    complexity: 1
  },
  groundingMetadata: {
    isSearchGrounded: true,
    sources: [
      { title: 'Chobani Official Product Nutrition Facts', uri: 'https://www.chobani.com' },
      { title: 'USDA FoodData Central - Greek Yogurt Whole Milk', uri: 'https://fdc.nal.usda.gov' }
    ],
    searchQueries: ['chobani whole milk plain greek yogurt nutrition', 'chobani ingredients live cultures']
  }
};

// 5. NUTELLA HAZELNUT SPREAD
const NUTELLA_PRODUCT: LabelAnalysisResult = {
  id: 'catalog-nutella-hazelnut',
  productName: 'Nutella Hazelnut Spread with Cocoa',
  brand: 'Ferrero',
  imageUrl: 'https://i5.walmartimages.com/seo/Nutella-Hazelnut-Spread-with-Cocoa-for-Breakfast-13-oz-Jar_0feee4a1-e85e-4c06-b352-49ad7f923667.f1566bc742c5eb20a79738e3ad74c1f5.jpeg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Nutella+Hazelnut+Spread+with+Cocoa+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '2 tbsp (37g)',
  servingSizeGrams: 37,
  servingsPerPackage: 20,
  nutrition: {
    calories: { value: 200, unit: 'kcal', dailyValuePercent: 10, confidence: 99, originalText: '200' },
    totalFat: { value: 12.0, unit: 'g', dailyValuePercent: 15, confidence: 99, originalText: '12g' },
    saturatedFat: { value: 4.0, unit: 'g', dailyValuePercent: 20, confidence: 99, originalText: '4g' },
    transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '0g' },
    cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99, originalText: '0mg' },
    sodium: { value: 15, unit: 'mg', dailyValuePercent: 1, confidence: 99, originalText: '15mg' },
    carbohydrates: { value: 21.0, unit: 'g', dailyValuePercent: 8, confidence: 99, originalText: '21g' },
    fiber: { value: 1.0, unit: 'g', dailyValuePercent: 4, confidence: 95, originalText: '1g' },
    totalSugar: { value: 21.0, unit: 'g', dailyValuePercent: null, confidence: 99, originalText: '21g' },
    addedSugar: { value: 19.0, unit: 'g', dailyValuePercent: 38, confidence: 99, originalText: '19g' },
    protein: { value: 2.0, unit: 'g', dailyValuePercent: 4, confidence: 98, originalText: '2g' },
    vitaminsMinerals: [
      { name: 'Calcium', amount: '40mg', dailyValuePercent: 4 },
      { name: 'Iron', amount: '0.8mg', dailyValuePercent: 4 }
    ]
  },
  nutritionPer100g: {
    calories: { value: 541, unit: 'kcal', dailyValuePercent: 27 },
    protein: { value: 5.4, unit: 'g', dailyValuePercent: 11 },
    totalFat: { value: 32.4, unit: 'g', dailyValuePercent: 42 },
    saturatedFat: { value: 10.8, unit: 'g', dailyValuePercent: 54 },
    carbohydrates: { value: 56.8, unit: 'g', dailyValuePercent: 20 },
    fiber: { value: 2.7, unit: 'g', dailyValuePercent: 10 },
    totalSugar: { value: 56.8, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 51.4, unit: 'g', dailyValuePercent: 103 },
    sodium: { value: 41, unit: 'mg', dailyValuePercent: 2 }
  },
  ingredients: [
    { id: 'ing-n-1', order: 1, name: 'Sugar', category: 'Sweetener', purpose: 'Primary ingredient by weight (>50%)', explanation: 'Refined granulated sucrose.' },
    { id: 'ing-n-2', order: 2, name: 'Palm oil', category: 'Oil/Fat', purpose: 'Smooth spreadable emulsion fat', explanation: 'Semi-solid tropical palm fruit oil providing texture.' },
    { id: 'ing-n-3', order: 3, name: 'Hazelnuts (13%)', category: 'Tree Nut', purpose: 'Signature hazelnut taste', explanation: 'Roasted European hazelnut paste.', isAllergen: true },
    { id: 'ing-n-4', order: 4, name: 'Skim milk (8.7%)', category: 'Dairy', purpose: 'Creaminess', explanation: 'Spray-dried nonfat cow milk powder.', isAllergen: true },
    { id: 'ing-n-5', order: 5, name: 'Cocoa (7.4%)', category: 'Flavoring', purpose: 'Chocolate flavor', explanation: 'De-fatted cocoa powder.' },
    { id: 'ing-n-6', order: 6, name: 'Soy lecithin as emulsifier', category: 'Emulsifier', purpose: 'Prevents oil separation', explanation: 'Phospholipid emulsifier keeping fat in suspension.', isAdditive: true, isAllergen: true },
    { id: 'ing-n-7', order: 7, name: 'Vanillin (an artificial flavor)', category: 'Flavoring', purpose: 'Aroma', explanation: 'Synthetic vanilla flavoring agent.', isAdditive: true }
  ],
  allergens: [
    { name: 'Tree Nuts (Hazelnuts)', source: 'ingredient', evidence: 'Hazelnuts (13%)' },
    { name: 'Milk', source: 'ingredient', evidence: 'Skim milk' },
    { name: 'Soy', source: 'ingredient', evidence: 'Soy lecithin' }
  ],
  allergenStatement: 'Contains Tree Nuts (Hazelnuts), Milk, Soy.',
  additives: [
    {
      id: 'add-n-1',
      name: 'Soy Lecithin (E322)',
      category: 'Emulsifier',
      purpose: 'Stabilizes hazelnut oil and cocoa suspension',
      explanation: 'Food-grade phospholipid aiding fat and liquid emulsion stability.'
    },
    {
      id: 'add-n-2',
      name: 'Vanillin',
      category: 'Artificial Flavor',
      purpose: 'Standardizes sweet vanilla top notes',
      explanation: 'Synthetic fragrance compound imitating natural vanilla.'
    }
  ],
  claims: ['No Artificial Colors', 'No Artificial Preservatives', 'Gluten Free'],
  dietaryTags: ['Vegetarian', 'Gluten Free'],
  confidence: { overall: 99, nutritionTable: 99, ingredientsList: 99, lowConfidenceFields: [] },
  simpleSummary: 'Over 55% of Nutella by weight is refined sugar, followed by modified palm oil, with hazelnuts comprising only approximately 13% of the recipe.',
  thingsToNotice: [
    'Sugar is the #1 ingredient, accounting for 21g of sugar in a 37g serving (57% sugar).',
    'Refined palm oil is the second largest ingredient, delivering 4g saturated fat.',
    'Hazelnuts constitute only about 13% of the total product weight.',
    'Contains 19g of added sugars in just 2 tablespoons (38% of daily value).'
  ],
  healthImpacts: [
    {
      system: 'Blood Sugar Balance',
      rating: 'attention',
      score: 30,
      keyNutrient: '19g Added Sugar / 2 tbsp',
      observation: 'Concentrated sugar density',
      explanation: 'High concentration of sucrose causes a swift insulin response.'
    },
    {
      system: 'Heart & Blood Pressure',
      rating: 'neutral',
      score: 60,
      keyNutrient: '4g Saturated Fat & 15mg Sodium',
      observation: 'Palm oil saturated fatty acid profile',
      explanation: 'Low in sodium (15mg), but saturated palmitic acid content is relatively high.'
    },
    {
      system: 'Digestion & Gut',
      rating: 'neutral',
      score: 55,
      keyNutrient: '1g Fiber from hazelnuts and cocoa',
      observation: 'Modest prebiotic polyphenol content',
      explanation: 'Natural cocoa and hazelnuts contribute trace dietary polyphenols.'
    },
    {
      system: 'Muscle & Energy',
      rating: 'neutral',
      score: 50,
      keyNutrient: '200 kcal Energy',
      observation: 'High caloric density',
      explanation: 'Delivers 200 calories in a modest two-tablespoon serving.'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'attention',
      score: 35,
      keyNutrient: 'Sugar and Fat Synergy',
      observation: 'Elevated hedonic drive',
      explanation: 'Warm spreadable texture with 55% sugar and 32% fat maximizes palate stimulation.'
    }
  ],
  labelProfile: {
    protein: 1,
    fiber: 1,
    addedSugar: 5,
    sodium: 1,
    complexity: 3
  },
  groundingMetadata: {
    isSearchGrounded: true,
    sources: [
      { title: 'Ferrero Official Nutella Label & Ingredients', uri: 'https://www.nutella.com' },
      { title: 'OpenFoodFacts - Nutella Nutrition Table', uri: 'https://world.openfoodfacts.org' }
    ],
    searchQueries: ['nutella hazelnut spread nutrition facts', 'nutella ingredients percentage sugar']
  }
};

export const POPULAR_FOOD_CATALOG: PopularCatalogItem[] = [
  {
    id: OREO_PRODUCT.id,
    name: OREO_PRODUCT.productName,
    brand: OREO_PRODUCT.brand,
    category: 'Cookies & Bakery',
    servingSize: OREO_PRODUCT.servingSize,
    calories: OREO_PRODUCT.nutrition.calories.value || 140,
    tags: ['Oreo', 'Cookies', 'Chocolate', 'Sweet', 'Snacks', 'Popular'],
    hasHarmfulAdditives: false,
    harmfulAdditivesCount: 0,
    imageUrl: OREO_PRODUCT.imageUrl,
    productData: OREO_PRODUCT
  },
  {
    id: DORITOS_PRODUCT.id,
    name: DORITOS_PRODUCT.productName,
    brand: DORITOS_PRODUCT.brand,
    category: 'Snacks & Chips',
    servingSize: DORITOS_PRODUCT.servingSize,
    calories: DORITOS_PRODUCT.nutrition.calories.value || 150,
    tags: ['Doritos', 'Chips', 'Nacho Cheese', 'Snacks', 'Tortilla Chips', 'Popular'],
    hasHarmfulAdditives: true,
    harmfulAdditivesCount: 3,
    highlightWarning: 'Contains Synthetic Dyes (Yellow 6, Red 40) & MSG',
    imageUrl: DORITOS_PRODUCT.imageUrl,
    productData: DORITOS_PRODUCT
  },
  {
    id: MONSTER_PRODUCT.id,
    name: MONSTER_PRODUCT.productName,
    brand: MONSTER_PRODUCT.brand,
    category: 'Beverages & Energy Drinks',
    servingSize: MONSTER_PRODUCT.servingSize,
    calories: MONSTER_PRODUCT.nutrition.calories.value || 210,
    tags: ['Monster', 'Energy Drink', 'Caffeine', 'Beverage', 'Soda', 'Popular'],
    hasHarmfulAdditives: true,
    harmfulAdditivesCount: 2,
    highlightWarning: 'Contains 54g Added Sugar (108% DV) & Sodium Benzoate',
    imageUrl: MONSTER_PRODUCT.imageUrl,
    productData: MONSTER_PRODUCT
  },
  {
    id: CHOBANI_PRODUCT.id,
    name: CHOBANI_PRODUCT.productName,
    brand: CHOBANI_PRODUCT.brand,
    category: 'Dairy & Yogurt',
    servingSize: CHOBANI_PRODUCT.servingSize,
    calories: CHOBANI_PRODUCT.nutrition.calories.value || 170,
    tags: ['Chobani', 'Greek Yogurt', 'Dairy', 'Clean', 'High Protein', 'Popular'],
    hasHarmfulAdditives: false,
    harmfulAdditivesCount: 0,
    imageUrl: CHOBANI_PRODUCT.imageUrl,
    productData: CHOBANI_PRODUCT
  },
  {
    id: NUTELLA_PRODUCT.id,
    name: NUTELLA_PRODUCT.productName,
    brand: NUTELLA_PRODUCT.brand,
    category: 'Spreads & Condiments',
    servingSize: NUTELLA_PRODUCT.servingSize,
    calories: NUTELLA_PRODUCT.nutrition.calories.value || 200,
    tags: ['Nutella', 'Hazelnut', 'Chocolate', 'Spread', 'Sweet', 'Popular'],
    hasHarmfulAdditives: false,
    harmfulAdditivesCount: 0,
    imageUrl: NUTELLA_PRODUCT.imageUrl,
    productData: NUTELLA_PRODUCT
  }
];
