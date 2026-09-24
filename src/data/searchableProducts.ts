import { LabelAnalysisResult } from '../types';
import { DEMO_PRODUCTS } from './demoProducts';
import { POPULAR_FOOD_CATALOG } from './popularFoodCatalog';
import { checkIsNonEdible } from '../utils/foodValidator';

export interface SearchableProductItem {
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

// Ultra-processed product loaded with hazardous chemicals for safety testing
const FLAMIN_HOT_FIERY_CURLS: LabelAnalysisResult = {
  id: 'hazard-flamin-hot-curls',
  productName: "Flamin' Hot Fiery Corn Curls",
  brand: "Scorchin' Snacks",
  imageUrl: 'https://i5.walmartimages.com/seo/Cheetos-Crunchy-Flamin-Hot-Cheese-Flavored-Snacks-8-5-oz-Bag_4c643aa7-0c7f-4424-ab18-8ce945f3c983.47e95f6cf9c00ba6ca52a0a2df99ba13.jpeg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Cheetos+Crunchy+Flamin+Hot+Cheese+Flavored+Snacks+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '1 oz (28g / about 21 pieces)',
  servingSizeGrams: 28,
  servingsPerPackage: 9,
  nutrition: {
    calories: { value: 170, unit: 'kcal', dailyValuePercent: 9, confidence: 98 },
    totalFat: { value: 11.0, unit: 'g', dailyValuePercent: 14, confidence: 97 },
    saturatedFat: { value: 1.5, unit: 'g', dailyValuePercent: 8, confidence: 96 },
    transFat: { value: 0.5, unit: 'g', dailyValuePercent: null, confidence: 95 },
    cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99 },
    sodium: { value: 250, unit: 'mg', dailyValuePercent: 11, confidence: 98 },
    carbohydrates: { value: 15.0, unit: 'g', dailyValuePercent: 5, confidence: 98 },
    fiber: { value: 0.5, unit: 'g', dailyValuePercent: 2, confidence: 92 },
    totalSugar: { value: 1.0, unit: 'g', dailyValuePercent: null, confidence: 96 },
    addedSugar: { value: 0.5, unit: 'g', dailyValuePercent: 1, confidence: 95 },
    protein: { value: 1.0, unit: 'g', dailyValuePercent: 2, confidence: 97 },
    vitaminsMinerals: []
  },
  nutritionPer100g: {
    calories: { value: 607, unit: 'kcal', dailyValuePercent: 30 },
    protein: { value: 3.6, unit: 'g', dailyValuePercent: 7 },
    totalFat: { value: 39.3, unit: 'g', dailyValuePercent: 50 },
    saturatedFat: { value: 5.4, unit: 'g', dailyValuePercent: 27 },
    carbohydrates: { value: 53.6, unit: 'g', dailyValuePercent: 19 },
    fiber: { value: 1.8, unit: 'g', dailyValuePercent: 6 },
    totalSugar: { value: 3.6, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 1.8, unit: 'g', dailyValuePercent: 4 },
    sodium: { value: 893, unit: 'mg', dailyValuePercent: 39 }
  },
  ingredients: [
    {
      id: 'ing-f-1',
      order: 1,
      name: 'Enriched corn meal (corn meal, ferrous sulfate, niacin, thiamin mononitrate, riboflavin, folic acid)',
      category: 'Grain',
      purpose: 'Refined puffed corn base',
      explanation: 'Highly milled degermed corn flour stripped of natural germ and dietary bran.'
    },
    {
      id: 'ing-f-2',
      order: 2,
      name: 'Vegetable oil (corn, canola, and/or sunflower oil)',
      category: 'Oil/Fat',
      purpose: 'High temperature frying fat',
      explanation: 'Refined vegetable oils subjected to high heat processing.'
    },
    {
      id: 'ing-f-3',
      order: 3,
      name: 'Flamin hot seasoning (maltodextrin, salt, sugar, monosodium glutamate)',
      category: 'Flavoring',
      purpose: 'Intense hyper-palatable savory seasoning',
      explanation: 'Concentrated sodium and MSG blend designed to stimulate dopamine reward pathways.'
    },
    {
      id: 'ing-f-4',
      order: 4,
      name: 'Red 40 Lake, Yellow 6 Lake, Yellow 5 Lake',
      category: 'Artificial Color',
      purpose: 'Vibrant neon red and orange synthetic pigmentation',
      explanation: 'Petrochemical synthetic coal-tar derived food dyes linked to neurobehavioral hyperactivity in children.',
      isAdditive: true
    },
    {
      id: 'ing-f-5',
      order: 5,
      name: 'TBHQ (tertiary butylhydroquinone)',
      category: 'Synthetic Preservative',
      purpose: 'Prevents oxidation and rancidity of commercial frying oil',
      explanation: 'Petroleum-derived synthetic preservative shown in immunology models to alter T-cell immune responses.',
      isAdditive: true
    },
    {
      id: 'ing-f-6',
      order: 6,
      name: 'BHA (butylated hydroxyanisole)',
      category: 'Chemical Preservative',
      purpose: 'Stabilizes shelf life of refined snack fats',
      explanation: 'Synthetic petrochemical antioxidant classified by the US National Toxicology Program as reasonably anticipated to be a human carcinogen.',
      isAdditive: true
    }
  ],
  allergens: [
    {
      name: 'Milk',
      source: 'statement',
      evidence: 'Contains whey, cheddar cheese cultures, and buttermilk powder in cheese seasoning.'
    }
  ],
  allergenStatement: 'Contains Milk ingredients.',
  additives: [
    {
      id: 'add-bha',
      name: 'BHA (Butylated Hydroxyanisole)',
      category: 'Chemical Preservative / Antioxidant',
      purpose: 'Synthetic chemical added to prevent oil rancidity.',
      explanation: 'Classified by the US National Toxicology Program as reasonably anticipated to be a human carcinogen; promotes cell tumor growth in toxicology models.',
      commonCode: 'E320'
    },
    {
      id: 'add-tbhq',
      name: 'TBHQ (Tertiary Butylhydroquinone)',
      category: 'Petrochemical Preservative',
      purpose: 'Industrial antioxidant to extend commercial shelf stability.',
      explanation: 'Petroleum-derived compound proven in peer-reviewed immunological studies to impair T-cell immune response and induce hepatic oxidative stress.',
      commonCode: 'E319'
    },
    {
      id: 'add-red40',
      name: 'Red 40 (Allura Red AC)',
      category: 'Synthetic Food Dye',
      purpose: 'Imparts intense fiery red coloration.',
      explanation: 'Synthetic petroleum-derived dye requiring mandatory neurological warning labels across the European Union.',
      commonCode: 'E129'
    },
    {
      id: 'add-yellow6',
      name: 'Yellow 6 (Sunset Yellow)',
      category: 'Synthetic Food Dye',
      purpose: 'Yellow-orange artificial coloring.',
      explanation: 'Coal-tar derived artificial dye linked to adrenal gland tumors in animal bioassays and hypersensitivity reactions.',
      commonCode: 'E110'
    }
  ],
  claims: ['Fiery Hot Flavor', 'Extreme Crunch', 'Bursting with Heat'],
  dietaryTags: ['Ultra-Processed Food (NOVA 4)', 'Contains Artificial Dyes', 'Contains Synthetic Preservatives', 'Contains Milk'],
  confidence: {
    overall: 99,
    nutritionTable: 99,
    ingredientsList: 98,
    lowConfidenceFields: []
  },
  simpleSummary: 'WARNING: This product contains synthetic chemicals including BHA (a recognized anticipated human carcinogen) and TBHQ (an immune toxicant), alongside artificial petroleum dyes Red 40 and Yellow 6. It is an ultra-processed snack with low nutritional value and serious health risks.',
  thingsToNotice: [
    'CRITICAL: Contains BHA (E320), classified as reasonably anticipated to be a human carcinogen',
    'CRITICAL: Contains TBHQ (E319), linked to immune cell suppression and liver toxicity',
    'Petrochemical Dyes: Red 40 Lake and Yellow 6 Lake require European warning labels',
    'High Fat Density: 11g of refined vegetable fat in a tiny 28g portion',
    'Zero Nutritional Merit: Less than 1g fiber and 1g protein with hyper-palatable artificial seasonings'
  ],
  healthImpacts: [
    {
      system: 'Cellular & Toxicity Defense',
      rating: 'negative',
      score: 18,
      keyNutrient: 'BHA (E320) & TBHQ (E319)',
      observation: 'Severe cellular toxicant load',
      explanation: 'Synthetic petrochemical preservatives generate reactive oxidative stress and promote carcinogenic cellular signaling.'
    },
    {
      system: 'Heart & Blood Pressure',
      rating: 'attention',
      score: 42,
      keyNutrient: 'Industrial Refined Oils & Sodium',
      observation: 'Atherogenic fat profile',
      explanation: 'Thermally oxidized commercial oils promote systemic arterial inflammation and raise cardiovascular strain.'
    },
    {
      system: 'Digestion & Gut',
      rating: 'negative',
      score: 28,
      keyNutrient: 'Synthetic Dyes & Emulsifiers',
      observation: 'Intestinal barrier irritation',
      explanation: 'Red 40 and Yellow 6 have been shown in biomedical assays to trigger colonic mucosal inflammation and dysbiosis.'
    },
    {
      system: 'Blood Sugar Balance',
      rating: 'attention',
      score: 45,
      keyNutrient: 'Maltodextrin & Refined Starch',
      observation: 'High glycemic absorption',
      explanation: 'Degermed corn meal and maltodextrin digest rapidly, provoking sharp insulin surges.'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'negative',
      score: 25,
      keyNutrient: 'Hyper-Palatable MSG & Fat Matrix',
      observation: 'Overrides natural satiety cues',
      explanation: 'Combination of salt, monosodium glutamate, and refined fat stimulates hedonic overeating.'
    }
  ],
  labelProfile: {
    protein: 1,
    fiber: 1,
    addedSugar: 3,
    sodium: 2,
    complexity: 1
  }
};

// Ultra-processed pastry with Titanium Dioxide (banned in EU) & TBHQ
const SUPER_GLAZED_BERRY_TARTS: LabelAnalysisResult = {
  id: 'hazard-glazed-berry-tarts',
  productName: 'Super Glazed Morning Berry Tarts',
  brand: 'SugarGlaze Pastries',
  imageUrl: 'https://i5.walmartimages.com/seo/Kelloggs-Pop-Tarts-Frosted-Strawberry-48-Ct_dd7b17ec-2d8c-4f7f-8567-93be9f3237eb.101db109d435e23637e69f8ae09618b0.jpeg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Kelloggs+Pop-Tarts+Frosted+Strawberry+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '2 pastries (96g)',
  servingSizeGrams: 96,
  servingsPerPackage: 6,
  nutrition: {
    calories: { value: 370, unit: 'kcal', dailyValuePercent: 19, confidence: 99 },
    totalFat: { value: 9.0, unit: 'g', dailyValuePercent: 12, confidence: 98 },
    saturatedFat: { value: 3.0, unit: 'g', dailyValuePercent: 15, confidence: 97 },
    transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99 },
    cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99 },
    sodium: { value: 340, unit: 'mg', dailyValuePercent: 15, confidence: 98 },
    carbohydrates: { value: 70.0, unit: 'g', dailyValuePercent: 25, confidence: 98 },
    fiber: { value: 1.0, unit: 'g', dailyValuePercent: 4, confidence: 95 },
    totalSugar: { value: 30.0, unit: 'g', dailyValuePercent: null, confidence: 99 },
    addedSugar: { value: 29.0, unit: 'g', dailyValuePercent: 58, confidence: 99 },
    protein: { value: 4.0, unit: 'g', dailyValuePercent: 8, confidence: 98 },
    vitaminsMinerals: []
  },
  nutritionPer100g: {
    calories: { value: 385, unit: 'kcal', dailyValuePercent: 19 },
    protein: { value: 4.2, unit: 'g', dailyValuePercent: 8 },
    totalFat: { value: 9.4, unit: 'g', dailyValuePercent: 12 },
    saturatedFat: { value: 3.1, unit: 'g', dailyValuePercent: 16 },
    carbohydrates: { value: 72.9, unit: 'g', dailyValuePercent: 26 },
    fiber: { value: 1.0, unit: 'g', dailyValuePercent: 4 },
    totalSugar: { value: 31.2, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 30.2, unit: 'g', dailyValuePercent: 60 },
    sodium: { value: 354, unit: 'mg', dailyValuePercent: 15 }
  },
  ingredients: [
    {
      id: 'ing-t-1',
      order: 1,
      name: 'Enriched bleached flour (wheat flour, niacin, reduced iron, thiamin mononitrate, riboflavin, folic acid)',
      category: 'Grain',
      purpose: 'Refined dough base',
      explanation: 'Bleached wheat flour stripped of whole grain fiber.'
    },
    {
      id: 'ing-t-2',
      order: 2,
      name: 'High fructose corn syrup & corn syrup',
      category: 'Sweetener',
      purpose: 'Inexpensive industrial sweetening',
      explanation: 'Liquid concentrated fructose syrups that promote hepatic fat accumulation.'
    },
    {
      id: 'ing-t-3',
      order: 3,
      name: 'Titanium Dioxide (color)',
      category: 'Color / Whitening Agent',
      purpose: 'Imparts opaque artificial bright white sheen to frosting',
      explanation: 'Inorganic nanoparticle pigment banned across the European Union due to proven DNA breakage and genotoxicity.',
      isAdditive: true
    },
    {
      id: 'ing-t-4',
      order: 4,
      name: 'TBHQ (for freshness)',
      category: 'Synthetic Preservative',
      purpose: 'Chemical antioxidant to extend shelf life',
      explanation: 'Petrochemical additive linked in immunology studies to altered cellular defenses.',
      isAdditive: true
    },
    {
      id: 'ing-t-5',
      order: 5,
      name: 'Red 40, Blue 1',
      category: 'Artificial Color',
      purpose: 'Synthetic artificial berry glaze colors',
      explanation: 'Petrochemical dyes flagged internationally for childhood hyperactivity.',
      isAdditive: true
    }
  ],
  allergens: [
    {
      name: 'Wheat',
      source: 'ingredient',
      evidence: 'Enriched bleached wheat flour.'
    },
    {
      name: 'Soy',
      source: 'statement',
      evidence: 'Soy lecithin and soybean oil in dough conditioner.'
    }
  ],
  allergenStatement: 'Contains Wheat and Soy. May contain Milk and Peanuts.',
  additives: [
    {
      id: 'add-tio2',
      name: 'Titanium Dioxide',
      category: 'Artificial Pigment / Nanoparticle',
      purpose: 'Artificially whitens the opaque pastry frosting.',
      explanation: 'Officially BANNED in the European Union (EFSA). Nanoparticles bioaccumulate in organs, triggering cellular DNA strand breaks and genotoxic harm.',
      commonCode: 'E171'
    },
    {
      id: 'add-tbhq-2',
      name: 'TBHQ (Tertiary Butylhydroquinone)',
      category: 'Chemical Preservative',
      purpose: 'Prevents fat rancidity.',
      explanation: 'Petroleum derivative shown to suppress immune responses and promote oxidative stress.',
      commonCode: 'E319'
    },
    {
      id: 'add-red40-2',
      name: 'Red 40',
      category: 'Synthetic Food Dye',
      purpose: 'Imparts red berry tint.',
      explanation: 'Petrochemical food dye restricted with mandatory warnings in Europe.',
      commonCode: 'E129'
    }
  ],
  claims: ['Bursting with Berry Flavor', 'Frosted Goodness', 'Ready to Toast'],
  dietaryTags: ['Ultra-Processed Food', 'Contains Banned Additive (EU E171)', 'Extremely High Sugar (58% DV)', 'Contains Wheat', 'Contains Soy'],
  confidence: {
    overall: 98,
    nutritionTable: 99,
    ingredientsList: 97,
    lowConfidenceFields: []
  },
  simpleSummary: 'CRITICAL ALERT: This product contains Titanium Dioxide (E171), a chemical banned in food across the European Union due to DNA damage and genotoxicity concerns. It also packs 29g of added sugars (58% of your entire daily maximum) in just 2 pastries.',
  thingsToNotice: [
    'CRITICAL: Contains Titanium Dioxide (E171), banned in the EU for DNA breakage and genotoxicity',
    'Contains TBHQ (E319) petroleum preservative',
    'Extreme Sugar: 29g of added sugars in a single portion (58% Daily Value)',
    'Low Fiber: Only 1g fiber despite 70g of fast-absorbing refined carbohydrates'
  ],
  healthImpacts: [
    {
      system: 'Cellular & Toxicity Defense',
      rating: 'negative',
      score: 12,
      keyNutrient: 'Titanium Dioxide E171 & TBHQ',
      observation: 'Genotoxic particle accumulation',
      explanation: 'Nanoparticles of titanium dioxide cannot be eliminated safely by the body, accumulating in internal organs and inducing cellular DNA mutations.'
    },
    {
      system: 'Blood Sugar Balance',
      rating: 'negative',
      score: 20,
      keyNutrient: '29g Added Sugar (HFCS)',
      observation: 'Violent insulin spike',
      explanation: 'Delivers 58% of daily added sugar limit in minutes without dietary fiber buffering.'
    },
    {
      system: 'Heart & Blood Pressure',
      rating: 'attention',
      score: 48,
      keyNutrient: 'Industrial Palm Oil & High Sodium',
      observation: 'Arterial inflammation',
      explanation: 'Combination of high-fructose corn syrup and saturated palm fat accelerates hepatic lipogenesis.'
    },
    {
      system: 'Digestion & Gut',
      rating: 'negative',
      score: 26,
      keyNutrient: 'Artificial Dyes & High Fructose',
      observation: 'Microbiome disruption',
      explanation: 'Surplus refined fructose and synthetic dyes fuel inflammatory bacterial overgrowth in the digestive tract.'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'negative',
      score: 22,
      keyNutrient: '370 Empty Caloric Density',
      observation: 'Rebound hunger trigger',
      explanation: 'High glycemic index causes rapid sugar crash within 60-90 minutes, driving severe cravings.'
    }
  ],
  labelProfile: {
    protein: 1,
    fiber: 1,
    addedSugar: 1,
    sodium: 2,
    complexity: 1
  }
};

// Commercial bread with Potassium Bromate (IARC 2B Carcinogen, Banned in EU) & Azodicarbonamide
const COMMERCIAL_WHITE_BREAD: LabelAnalysisResult = {
  id: 'hazard-commercial-white-bread',
  productName: 'Commercial Classic Sandwich White Bread',
  brand: 'SunLoaf Mills',
  imageUrl: 'https://i5.walmartimages.com/asr/3f19179d-e490-482f-8703-a44b9347fc91.e0ce38290231cfb574226f959c8d575c.jpeg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Sandwich+White+Bread+loaf+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '2 slices (56g)',
  servingSizeGrams: 56,
  servingsPerPackage: 11,
  nutrition: {
    calories: { value: 140, unit: 'kcal', dailyValuePercent: 7, confidence: 99 },
    totalFat: { value: 1.5, unit: 'g', dailyValuePercent: 2, confidence: 98 },
    saturatedFat: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99 },
    transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99 },
    cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99 },
    sodium: { value: 260, unit: 'mg', dailyValuePercent: 11, confidence: 98 },
    carbohydrates: { value: 26.0, unit: 'g', dailyValuePercent: 9, confidence: 98 },
    fiber: { value: 1.0, unit: 'g', dailyValuePercent: 4, confidence: 95 },
    totalSugar: { value: 3.0, unit: 'g', dailyValuePercent: null, confidence: 98 },
    addedSugar: { value: 3.0, unit: 'g', dailyValuePercent: 6, confidence: 97 },
    protein: { value: 4.0, unit: 'g', dailyValuePercent: 8, confidence: 98 },
    vitaminsMinerals: []
  },
  nutritionPer100g: {
    calories: { value: 250, unit: 'kcal', dailyValuePercent: 12 },
    protein: { value: 7.1, unit: 'g', dailyValuePercent: 14 },
    totalFat: { value: 2.7, unit: 'g', dailyValuePercent: 3 },
    saturatedFat: { value: 0, unit: 'g', dailyValuePercent: 0 },
    carbohydrates: { value: 46.4, unit: 'g', dailyValuePercent: 17 },
    fiber: { value: 1.8, unit: 'g', dailyValuePercent: 6 },
    totalSugar: { value: 5.4, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 5.4, unit: 'g', dailyValuePercent: 11 },
    sodium: { value: 464, unit: 'mg', dailyValuePercent: 20 }
  },
  ingredients: [
    {
      id: 'ing-b-1',
      order: 1,
      name: 'Unbleached enriched wheat flour (flour, malted barley flour, niacin, reduced iron, thiamin mononitrate)',
      category: 'Grain',
      purpose: 'Refined bread flour',
      explanation: 'Highly processed white flour.'
    },
    {
      id: 'ing-b-2',
      order: 2,
      name: 'Water, High fructose corn syrup, Yeast',
      category: 'Fermentation / Sweetener',
      purpose: 'Leavening and fast rising',
      explanation: 'Standard industrial baker yeast and corn syrup.'
    },
    {
      id: 'ing-b-3',
      order: 3,
      name: 'Potassium Bromate',
      category: 'Oxidizing Dough Conditioner',
      purpose: 'Strengthens gluten matrix to produce unnaturally fluffy volume',
      explanation: 'Potassium bromate is classified by the WHO International Agency for Research on Cancer (IARC) as a Group 2B possible human carcinogen; banned in the EU, UK, Canada, and Brazil.',
      isAdditive: true
    },
    {
      id: 'ing-b-4',
      order: 4,
      name: 'Azodicarbonamide (ADA)',
      category: 'Chemical Dough Bleaching Agent',
      purpose: 'Fast chemical flour aging and dough whitening',
      explanation: 'Industrial chemical banned in the EU and Australia because baking breaks it down into semicarbazide, a proven mutagen and carcinogen.',
      isAdditive: true
    },
    {
      id: 'ing-b-5',
      order: 5,
      name: 'Propylparaben',
      category: 'Antimicrobial Preservative',
      purpose: 'Inhibits mold growth on room temperature store shelves',
      explanation: 'Synthetic paraben shown in endocrine toxicology to act as an estrogen disruptor and damage reproductive health.',
      isAdditive: true
    }
  ],
  allergens: [
    {
      name: 'Wheat',
      source: 'ingredient',
      evidence: 'Enriched wheat flour base.'
    }
  ],
  allergenStatement: 'Contains Wheat. May contain Soy.',
  additives: [
    {
      id: 'add-bromate',
      name: 'Potassium Bromate',
      category: 'Chemical Dough Conditioner',
      purpose: 'Chemically fluffs the industrial dough matrix.',
      explanation: 'CLASSIFIED AS A HUMAN CARCINOGEN (IARC Group 2B). Banned in the European Union, Canada, UK, and California AB 418. Induces thyroid, renal, and peritoneal tumors in laboratory toxicology.',
      commonCode: 'E924'
    },
    {
      id: 'add-ada',
      name: 'Azodicarbonamide (ADA)',
      category: 'Chemical Blowing Agent / Conditioner',
      purpose: 'Ages dough in minutes.',
      explanation: 'Banned in the European Union and Australia. Degrades under heat into semicarbazide, a mutagenic compound.',
      commonCode: 'E927a'
    },
    {
      id: 'add-paraben',
      name: 'Propylparaben',
      category: 'Synthetic Chemical Preservative',
      purpose: 'Prevents shelf mold.',
      explanation: 'Recognized endocrine disruptor that interferes with fertility and hormone receptor pathways.',
      commonCode: 'E216'
    }
  ],
  claims: ['Extra Soft & Fluffy', 'Classic White Bread', 'Family Value Size'],
  dietaryTags: ['Contains Carcinogen (Potassium Bromate)', 'Contains Banned Additives (EU)', 'Contains Wheat', 'Vegetarian'],
  confidence: {
    overall: 99,
    nutritionTable: 99,
    ingredientsList: 99,
    lowConfidenceFields: []
  },
  simpleSummary: 'STRICT TOXICOLOGICAL WARNING: This bread contains Potassium Bromate (E924), an internationally banned chemical classified as possibly carcinogenic to humans by the WHO. It also contains Azodicarbonamide (ADA) and Propylparaben, both banned or restricted in Europe due to toxic breakdown products and hormonal disruption.',
  thingsToNotice: [
    'CRITICAL HAZARD: Potassium Bromate (E924) — IARC Carcinogen, banned across the European Union',
    'CRITICAL HAZARD: Azodicarbonamide (ADA) — Breaks down into carcinogenic semicarbazide',
    'CRITICAL HAZARD: Propylparaben — Endocrine and reproductive hormone disruptor',
    'Stripped of whole grain fiber: Only 1g fiber per 2 slices'
  ],
  healthImpacts: [
    {
      system: 'Cellular & Toxicity Defense',
      rating: 'negative',
      score: 8,
      keyNutrient: 'Potassium Bromate (E924) & ADA',
      observation: 'Active carcinogenic compounds',
      explanation: 'Potassium bromate causes chromosomal aberrations and DNA strand breaks in renal and thyroid cells. Completely banned in international jurisdictions.'
    },
    {
      system: 'Hormonal & Endocrine System',
      rating: 'negative',
      score: 14,
      keyNutrient: 'Propylparaben (E216)',
      observation: 'Estrogen receptor disruption',
      explanation: 'Synthetic parabens mimic estrogen molecules, directly interfering with normal endocrine receptor signaling.'
    },
    {
      system: 'Blood Sugar Balance',
      rating: 'attention',
      score: 52,
      keyNutrient: 'High Glycemic Refined Wheat',
      observation: 'Fast carbohydrate conversion',
      explanation: 'Refined starch rapidly spikes blood glucose due to complete absence of whole-grain bran.'
    },
    {
      system: 'Heart & Blood Pressure',
      rating: 'neutral',
      score: 62,
      keyNutrient: '260mg Sodium',
      observation: 'Moderate bread sodium',
      explanation: 'Sodium content is standard for industrial white bread slices.'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'attention',
      score: 40,
      keyNutrient: 'Low Fiber Density',
      observation: 'Poor long-term satiety',
      explanation: 'Absence of dietary fiber results in fast gastric emptying.'
    }
  ],
  labelProfile: {
    protein: 2,
    fiber: 1,
    addedSugar: 3,
    sodium: 3,
    complexity: 1
  }
};

// Electric Citrus Energy Soda with BVO (FDA Banned) and Aspartame
const HYPER_CHARGE_ENERGY_SODA: LabelAnalysisResult = {
  id: 'hazard-hypercharge-energy',
  productName: 'Hyper-Charge Electric Citrus Energy Fizz',
  brand: 'VoltRush Beverages',
  imageUrl: 'https://i5.walmartimages.com/seo/Mountain-Dew-Citrus-Soda-12-oz-Cans-12-Pack_1e006611-3642-4f05-b778-f7d1933dc0fa.c33842c23ae3b64dc4ec9ea40adbe9bb.jpeg',
  imageSource: 'Google Search Images',
  imageGoogleUrl: 'https://www.google.com/search?tbm=isch&q=Mountain+Dew+Citrus+Soda+Can+packaging',
  scannedAt: new Date().toISOString(),
  regionalStandard: 'US',
  servingSize: '1 can (16 fl oz / 473 mL)',
  servingSizeGrams: 473,
  servingsPerPackage: 1,
  nutrition: {
    calories: { value: 10, unit: 'kcal', dailyValuePercent: 0, confidence: 99 },
    totalFat: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99 },
    saturatedFat: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99 },
    transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99 },
    cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99 },
    sodium: { value: 370, unit: 'mg', dailyValuePercent: 16, confidence: 98 },
    carbohydrates: { value: 2.0, unit: 'g', dailyValuePercent: 1, confidence: 98 },
    fiber: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99 },
    totalSugar: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99 },
    addedSugar: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99 },
    protein: { value: 0, unit: 'g', dailyValuePercent: 0, confidence: 99 },
    vitaminsMinerals: [
      { name: 'Niacin (B3)', amount: '32mg', dailyValuePercent: 200 },
      { name: 'Vitamin B6', amount: '3.4mg', dailyValuePercent: 200 },
      { name: 'Vitamin B12', amount: '4.8mcg', dailyValuePercent: 200 }
    ]
  },
  nutritionPer100g: {
    calories: { value: 2, unit: 'kcal', dailyValuePercent: 0 },
    protein: { value: 0, unit: 'g', dailyValuePercent: 0 },
    totalFat: { value: 0, unit: 'g', dailyValuePercent: 0 },
    saturatedFat: { value: 0, unit: 'g', dailyValuePercent: 0 },
    carbohydrates: { value: 0.4, unit: 'g', dailyValuePercent: 0 },
    fiber: { value: 0, unit: 'g', dailyValuePercent: 0 },
    totalSugar: { value: 0, unit: 'g', dailyValuePercent: null },
    addedSugar: { value: 0, unit: 'g', dailyValuePercent: 0 },
    sodium: { value: 78, unit: 'mg', dailyValuePercent: 3 }
  },
  ingredients: [
    {
      id: 'ing-e-1',
      order: 1,
      name: 'Carbonated water, Citric acid, Natural citrus flavor, Taurine',
      category: 'Beverage Base',
      purpose: 'Carbonated matrix and flavoring',
      explanation: 'Carbonated water flavored with organic acid and amino acid taurine.'
    },
    {
      id: 'ing-e-2',
      order: 2,
      name: 'Brominated Vegetable Oil (BVO)',
      category: 'Flavor Emulsifier / Density Modifier',
      purpose: 'Prevents citrus flavor oils from separating and floating to the top',
      explanation: 'BVO is an industrial brominated chemical formally banned across Europe, India, Japan, and revoked by the US FDA in 2024 due to chronic tissue accumulation and thyroid/cardiac lipidosis.',
      isAdditive: true
    },
    {
      id: 'ing-e-3',
      order: 3,
      name: 'Aspartame & Acesulfame Potassium',
      category: 'High-Intensity Artificial Sweetener',
      purpose: 'Non-nutritive intense sweetness',
      explanation: 'Aspartame is designated as an IARC Group 2B possible human carcinogen, with concerns over liver cancer and microbiome degradation.',
      isAdditive: true
    },
    {
      id: 'ing-e-4',
      order: 4,
      name: 'Sodium Benzoate (preservative)',
      category: 'Chemical Preservative',
      purpose: 'Inhibits bacterial and fungal spoilage in acidic beverage',
      explanation: 'Can react with added ascorbic acid (vitamin C) under heat to form benzene, an established class 1 human carcinogen.',
      isAdditive: true
    },
    {
      id: 'ing-e-5',
      order: 5,
      name: 'Yellow 5 (Tartrazine)',
      category: 'Artificial Food Dye',
      purpose: 'Electric neon yellow coloration',
      explanation: 'Synthetic dye banned in Norway/Austria and carrying mandatory European warnings regarding hyperactivity and hypersensitivity.',
      isAdditive: true
    }
  ],
  allergens: [],
  allergenStatement: 'Does not contain any of the 9 major allergens.',
  additives: [
    {
      id: 'add-bvo',
      name: 'Brominated Vegetable Oil (BVO)',
      category: 'Industrial Chemical Emulsifier',
      purpose: 'Emulsifies citrus flavor oils.',
      explanation: 'FORMALLY BANNED BY FDA IN 2024. Bioaccumulates in human myocardial (heart), liver, and brain tissue, inducing severe thyroid disruption and cellular lipidosis.',
      commonCode: 'BVO'
    },
    {
      id: 'add-aspartame',
      name: 'Aspartame',
      category: 'Artificial Sweetener',
      purpose: 'Zero-calorie sweetening.',
      explanation: 'IARC Group 2B possible human carcinogen; flagged by international oncology associations.',
      commonCode: 'E951'
    },
    {
      id: 'add-sodium-benzoate',
      name: 'Sodium Benzoate',
      category: 'Chemical Preservative',
      purpose: 'Prevents microbial growth in liquid.',
      explanation: 'Forms trace benzene (known human carcinogen) when combined with dietary vitamin C.',
      commonCode: 'E211'
    },
    {
      id: 'add-yellow5',
      name: 'Yellow 5 (Tartrazine)',
      category: 'Synthetic Dye',
      purpose: 'Neon yellow color.',
      explanation: 'Synthetic petroleum dye linked to behavioral hyperactivity in children.',
      commonCode: 'E102'
    }
  ],
  claims: ['Zero Sugar', 'Ultra Energy 200mg Caffeine', 'Electric Citrus Kick', 'B-Vitamin Charged'],
  dietaryTags: ['Contains Banned Additive (BVO)', 'Contains Artificial Sweeteners (Aspartame)', 'Contains Synthetic Dyes (Yellow 5)', 'Gluten-Free', 'Vegan'],
  confidence: {
    overall: 99,
    nutritionTable: 99,
    ingredientsList: 99,
    lowConfidenceFields: []
  },
  simpleSummary: 'CRITICAL SAFETY ALERT: This drink contains Brominated Vegetable Oil (BVO), a dangerous additive formally banned by the FDA and prohibited in Europe, India, and Japan due to organ bioaccumulation and thyroid toxicity. It also contains Aspartame (IARC 2B carcinogen risk) and Yellow 5.',
  thingsToNotice: [
    'CRITICAL: Contains Brominated Vegetable Oil (BVO) — Banned by FDA due to organ accumulation',
    'Contains Aspartame — Evaluated as an IARC Group 2B possible carcinogen',
    'Sodium Benzoate + Acid matrix — Can yield trace carcinogenic benzene',
    'Yellow 5 (Tartrazine) — Requires mandatory child behavioral warning in the EU'
  ],
  healthImpacts: [
    {
      system: 'Cellular & Toxicity Defense',
      rating: 'negative',
      score: 10,
      keyNutrient: 'Brominated Vegetable Oil (BVO)',
      observation: 'Severe organ accumulation',
      explanation: 'Bromine atoms accumulate in fat deposits, brain, and cardiac tissues over time, permanently altering normal organ lipid metabolism.'
    },
    {
      system: 'Hormonal & Endocrine System',
      rating: 'negative',
      score: 15,
      keyNutrient: 'BVO & Aspartame',
      observation: 'Severe thyroid interference',
      explanation: 'Bromine competitively displaces iodine in thyroid hormone receptors, precipitating clinical thyroid dysregulation.'
    },
    {
      system: 'Digestion & Gut',
      rating: 'negative',
      score: 30,
      keyNutrient: 'Aspartame & Acesulfame K',
      observation: 'Microbiome disruption',
      explanation: 'Artificial sweeteners alter gut microbiota composition and reduce microbial diversity.'
    },
    {
      system: 'Heart & Blood Pressure',
      rating: 'attention',
      score: 45,
      keyNutrient: '200mg Caffeine & 370mg Sodium',
      observation: 'Vasoconstrictive stimulation',
      explanation: 'High caffeine load coupled with sodium temporarily spikes systolic blood pressure.'
    },
    {
      system: 'Metabolism & Satiety',
      rating: 'attention',
      score: 50,
      keyNutrient: 'Non-Nutritive Sweeteners',
      observation: 'Artificial sweet taste dissociation',
      explanation: 'Artificial sweeteners stimulate sweet taste buds without caloric satisfaction, confusing metabolic satiety cues.'
    }
  ],
  labelProfile: {
    protein: 1,
    fiber: 1,
    addedSugar: 5,
    sodium: 2,
    complexity: 1
  }
};

// Complete Searchable Catalog mapping both demo products and hazard testing products
export const SEARCHABLE_PRODUCTS: SearchableProductItem[] = [
  // 1. Hazard Product: Flamin Hot Corn Curls
  {
    id: FLAMIN_HOT_FIERY_CURLS.id,
    name: FLAMIN_HOT_FIERY_CURLS.productName,
    brand: FLAMIN_HOT_FIERY_CURLS.brand,
    category: 'Snacks & Chips',
    servingSize: FLAMIN_HOT_FIERY_CURLS.servingSize,
    calories: FLAMIN_HOT_FIERY_CURLS.nutrition.calories.value || 170,
    tags: ['Snack', 'Chips', 'Spicy', 'Corn', 'Ultra-Processed', 'Hazard Test'],
    hasHarmfulAdditives: true,
    harmfulAdditivesCount: 4,
    highlightWarning: 'Contains BHA (Carcinogen) & TBHQ (Immune Toxicant)',
    imageUrl: FLAMIN_HOT_FIERY_CURLS.imageUrl,
    productData: FLAMIN_HOT_FIERY_CURLS
  },
  // 2. Hazard Product: Super Glazed Berry Tarts
  {
    id: SUPER_GLAZED_BERRY_TARTS.id,
    name: SUPER_GLAZED_BERRY_TARTS.productName,
    brand: SUPER_GLAZED_BERRY_TARTS.brand,
    category: 'Breakfast Pastries',
    servingSize: SUPER_GLAZED_BERRY_TARTS.servingSize,
    calories: SUPER_GLAZED_BERRY_TARTS.nutrition.calories.value || 370,
    tags: ['Pastry', 'Breakfast', 'Sweet', 'Berry', 'Ultra-Processed', 'Hazard Test'],
    hasHarmfulAdditives: true,
    harmfulAdditivesCount: 3,
    highlightWarning: 'Contains Titanium Dioxide (Banned in EU, Genotoxic)',
    imageUrl: SUPER_GLAZED_BERRY_TARTS.imageUrl,
    productData: SUPER_GLAZED_BERRY_TARTS
  },
  // 3. Hazard Product: Commercial White Bread
  {
    id: COMMERCIAL_WHITE_BREAD.id,
    name: COMMERCIAL_WHITE_BREAD.productName,
    brand: COMMERCIAL_WHITE_BREAD.brand,
    category: 'Bread & Bakery',
    servingSize: COMMERCIAL_WHITE_BREAD.servingSize,
    calories: COMMERCIAL_WHITE_BREAD.nutrition.calories.value || 140,
    tags: ['Bread', 'Bakery', 'Sandwich', 'White Bread', 'Hazard Test'],
    hasHarmfulAdditives: true,
    harmfulAdditivesCount: 3,
    highlightWarning: 'Contains Potassium Bromate (IARC Group 2B Carcinogen)',
    imageUrl: COMMERCIAL_WHITE_BREAD.imageUrl,
    productData: COMMERCIAL_WHITE_BREAD
  },
  // 4. Hazard Product: Hyper-Charge Energy Soda
  {
    id: HYPER_CHARGE_ENERGY_SODA.id,
    name: HYPER_CHARGE_ENERGY_SODA.productName,
    brand: HYPER_CHARGE_ENERGY_SODA.brand,
    category: 'Beverages & Energy Drinks',
    servingSize: HYPER_CHARGE_ENERGY_SODA.servingSize,
    calories: HYPER_CHARGE_ENERGY_SODA.nutrition.calories.value || 10,
    tags: ['Drink', 'Soda', 'Energy', 'Citrus', 'Caffeine', 'Hazard Test'],
    hasHarmfulAdditives: true,
    harmfulAdditivesCount: 4,
    highlightWarning: 'Contains BVO (Banned by FDA) & Aspartame',
    imageUrl: HYPER_CHARGE_ENERGY_SODA.imageUrl,
    productData: HYPER_CHARGE_ENERGY_SODA
  },
  // 5. Clean Demo: Crunchy Cocoa Oat Bites
  {
    id: DEMO_PRODUCTS[0].id,
    name: DEMO_PRODUCTS[0].productName,
    brand: DEMO_PRODUCTS[0].brand,
    category: 'Breakfast Cereals',
    servingSize: DEMO_PRODUCTS[0].servingSize,
    calories: DEMO_PRODUCTS[0].nutrition.calories.value || 240,
    tags: ['Cereal', 'Oats', 'Chocolate', 'Breakfast', 'High Protein'],
    hasHarmfulAdditives: false,
    harmfulAdditivesCount: 0,
    imageUrl: DEMO_PRODUCTS[0].imageUrl,
    productData: DEMO_PRODUCTS[0]
  },
  // 6. Clean Demo: Green Goddess Plant Protein Bar
  {
    id: DEMO_PRODUCTS[1].id,
    name: DEMO_PRODUCTS[1].productName,
    brand: DEMO_PRODUCTS[1].brand,
    category: 'Protein & Snack Bars',
    servingSize: DEMO_PRODUCTS[1].servingSize,
    calories: DEMO_PRODUCTS[1].nutrition.calories.value || 210,
    tags: ['Protein Bar', 'Clean', 'Vegan', 'Superfood', 'Zero Toxic Additives'],
    hasHarmfulAdditives: false,
    harmfulAdditivesCount: 0,
    imageUrl: DEMO_PRODUCTS[1].imageUrl,
    productData: DEMO_PRODUCTS[1]
  },
  // 7. Clean Demo: Zesty Masala Lentil Crisps
  {
    id: DEMO_PRODUCTS[2].id,
    name: DEMO_PRODUCTS[2].productName,
    brand: DEMO_PRODUCTS[2].brand,
    category: 'Snacks & Chips',
    servingSize: DEMO_PRODUCTS[2].servingSize,
    calories: DEMO_PRODUCTS[2].nutrition.calories.value || 145,
    tags: ['Chips', 'Lentils', 'Indian', 'Spices', 'Plant Protein'],
    hasHarmfulAdditives: false,
    harmfulAdditivesCount: 0,
    imageUrl: DEMO_PRODUCTS[2].imageUrl,
    productData: DEMO_PRODUCTS[2]
  },
  // Real commercially verified popular food items
  ...POPULAR_FOOD_CATALOG
];

export function searchProducts(query: string = '', categoryFilter?: string): SearchableProductItem[] {
  const cleanQ = (query || '').trim().toLowerCase();

  // If query is an identified non-edible term, return empty results immediately
  if (cleanQ) {
    const nonEdible = checkIsNonEdible(cleanQ);
    if (nonEdible.isNonEdible) {
      return [];
    }
  }

  return SEARCHABLE_PRODUCTS.filter(item => {
    if (!item) return false;
    // Category check
    if (categoryFilter && categoryFilter !== 'all') {
      if (categoryFilter === 'hazard' && !item.hasHarmfulAdditives) return false;
      if (categoryFilter === 'clean' && item.hasHarmfulAdditives) return false;
      if (categoryFilter !== 'hazard' && categoryFilter !== 'clean' && item.category !== categoryFilter) {
        return false;
      }
    }

    if (!cleanQ) return true;

    return (
      (item.name || '').toLowerCase().includes(cleanQ) ||
      (item.brand || '').toLowerCase().includes(cleanQ) ||
      (item.category || '').toLowerCase().includes(cleanQ) ||
      (item.tags || []).some(t => (t || '').toLowerCase().includes(cleanQ)) ||
      Boolean(item.highlightWarning && item.highlightWarning.toLowerCase().includes(cleanQ))
    );
  });
}
