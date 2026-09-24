import { LabelAnalysisResult } from '../types';

export const DEMO_PRODUCTS: LabelAnalysisResult[] = [
  {
    id: 'demo-crunchy-cocoa-oats',
    productName: 'Crunchy Cocoa Oat Bites',
    brand: 'OatFields Co.',
    imageUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=600&q=80',
    scannedAt: '2026-09-16T10:30:00.000Z',
    regionalStandard: 'US',
    servingSize: '1 cup (55g)',
    servingSizeGrams: 55,
    servingsPerPackage: 8,
    nutrition: {
      calories: { value: 240, unit: 'kcal', dailyValuePercent: 12, confidence: 99 },
      totalFat: { value: 4.5, unit: 'g', dailyValuePercent: 6, confidence: 98 },
      saturatedFat: { value: 1.0, unit: 'g', dailyValuePercent: 5, confidence: 97 },
      transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99 },
      cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99 },
      sodium: { value: 380, unit: 'mg', dailyValuePercent: 17, confidence: 98 },
      carbohydrates: { value: 42, unit: 'g', dailyValuePercent: 15, confidence: 98 },
      fiber: { value: 4.0, unit: 'g', dailyValuePercent: 14, confidence: 96 },
      totalSugar: { value: 9.0, unit: 'g', dailyValuePercent: null, confidence: 98 },
      addedSugar: { value: 6.0, unit: 'g', dailyValuePercent: 12, confidence: 97 },
      protein: { value: 12.0, unit: 'g', dailyValuePercent: 24, confidence: 98 },
      vitaminsMinerals: [
        { name: 'Iron', amount: '3.6mg', dailyValuePercent: 20 },
        { name: 'Calcium', amount: '130mg', dailyValuePercent: 10 },
        { name: 'Potassium', amount: '220mg', dailyValuePercent: 4 },
        { name: 'Vitamin D', amount: '2mcg', dailyValuePercent: 10 }
      ]
    },
    nutritionPer100g: {
      calories: { value: 436, unit: 'kcal', dailyValuePercent: 22 },
      protein: { value: 21.8, unit: 'g', dailyValuePercent: 44 },
      totalFat: { value: 8.2, unit: 'g', dailyValuePercent: 11 },
      saturatedFat: { value: 1.8, unit: 'g', dailyValuePercent: 9 },
      carbohydrates: { value: 76.4, unit: 'g', dailyValuePercent: 28 },
      fiber: { value: 7.3, unit: 'g', dailyValuePercent: 26 },
      totalSugar: { value: 16.4, unit: 'g', dailyValuePercent: null },
      addedSugar: { value: 10.9, unit: 'g', dailyValuePercent: 22 },
      sodium: { value: 691, unit: 'mg', dailyValuePercent: 30 }
    },
    ingredients: [
      {
        id: 'ing-1',
        order: 1,
        name: 'Whole grain rolled oats',
        category: 'Grain',
        purpose: 'Primary complex carbohydrate & fiber source',
        explanation: 'Minimally processed whole oat flakes rich in beta-glucan soluble fiber, which supports healthy cholesterol levels.',
        dietaryRelevance: 'Contains natural gluten compounds unless certified gluten-free.'
      },
      {
        id: 'ing-2',
        order: 2,
        name: 'Soy protein isolate',
        category: 'Protein',
        purpose: 'Fortification of plant-based protein',
        explanation: 'De-fatted, concentrated protein powder derived from soybeans providing essential amino acids.',
        dietaryRelevance: 'Derived from soy (common allergen). Plant-based.',
        isAllergen: true
      },
      {
        id: 'ing-3',
        order: 3,
        name: 'Cane sugar',
        category: 'Sweetener',
        purpose: 'Sweetening and texture enhancement',
        explanation: 'Simple sucrose extracted from sugarcane used to balance bitter cocoa notes.',
        dietaryRelevance: 'Contributes to added sugars.'
      },
      {
        id: 'ing-4',
        order: 4,
        name: 'Cocoa powder (processed with alkali)',
        category: 'Flavoring',
        purpose: 'Chocolate flavor and natural deep color',
        explanation: 'Dutch-processed unsweetened cocoa, treated to reduce acidity and enhance richness.',
        dietaryRelevance: 'Contains natural polyphenols and trace minerals.'
      },
      {
        id: 'ing-5',
        order: 5,
        name: 'Expeller-pressed sunflower oil',
        category: 'Oil/Fat',
        purpose: 'Crispness, mouthfeel, and binding',
        explanation: 'Non-hydrogenated vegetable oil rich in monounsaturated and polyunsaturated fats.',
        dietaryRelevance: 'Free from trans fats.'
      },
      {
        id: 'ing-6',
        order: 6,
        name: 'Sea salt',
        category: 'Mineral',
        purpose: 'Flavor balance and seasoning',
        explanation: 'Unrefined sodium chloride with natural trace oceanic minerals.',
        dietaryRelevance: 'Primary source of sodium.'
      },
      {
        id: 'ing-7',
        order: 7,
        name: 'Soy lecithin',
        category: 'Emulsifier',
        purpose: 'Helps ingredients such as oil and water mix smoothly',
        explanation: 'Naturally occurring phospholipid mixture that prevents separation of fats and maintains crisp bite.',
        dietaryRelevance: 'Derived from soy.',
        isAdditive: true,
        isAllergen: true
      },
      {
        id: 'ing-8',
        order: 8,
        name: 'Natural vanilla flavor',
        category: 'Flavoring',
        purpose: 'Aroma and taste enhancement',
        explanation: 'Essence derived from real vanilla bean extracts to harmonize cocoa aroma.',
        dietaryRelevance: 'Natural botanical origin.'
      },
      {
        id: 'ing-9',
        order: 9,
        name: 'Mixed tocopherols',
        category: 'Preservative',
        purpose: 'Antioxidant to protect oil freshness',
        explanation: 'Natural Vitamin E family compounds that delay fat oxidation without artificial BHT.',
        dietaryRelevance: 'Vitamin E derived.',
        isAdditive: true
      }
    ],
    allergens: [
      {
        name: 'Soy',
        source: 'ingredient',
        evidence: 'Detected in ingredients: Soy protein isolate, Soy lecithin'
      },
      {
        name: 'Wheat',
        source: 'statement',
        evidence: 'Package statement: "May contain trace amounts of wheat from shared harvesting equipment."'
      }
    ],
    allergenStatement: 'Contains: Soy. Manufactured in a facility that also processes wheat, peanuts, and milk.',
    additives: [
      {
        id: 'add-1',
        name: 'Soy Lecithin',
        category: 'Emulsifier',
        purpose: 'Helps ingredients such as oil and cocoa fats mix together evenly and resist humidity.',
        explanation: 'A widely used natural substance found in egg yolks and soybeans that acts as a bridge between water and fat molecules.',
        commonCode: 'E322'
      },
      {
        id: 'add-2',
        name: 'Mixed Tocopherols',
        category: 'Antioxidant / Preservative',
        purpose: 'Protects natural vegetable oils from becoming stale or rancid over time.',
        explanation: 'A group of natural vitamin E isomers that protect fat freshness without synthetic chemical preservatives like BHT.',
        commonCode: 'E306'
      }
    ],
    claims: ['High Protein (12g)', 'Good Source of Fiber (4g)', 'Made with Whole Grain Oats', 'Non-GMO'],
    dietaryTags: [
      'Vegetarian',
      'Vegan',
      'Contains soy',
      'Gluten-containing ingredients detected',
      'No obvious animal-derived ingredients detected'
    ],
    confidence: {
      overall: 98,
      nutritionTable: 99,
      ingredientsList: 97,
      lowConfidenceFields: []
    },
    simpleSummary: 'This product provides 12 g of protein per serving and 4 g of fiber. It contains 6 g of added sugar and 380 mg of sodium per serving. Soy ingredients were detected and traces of wheat may be present.',
    thingsToNotice: [
      'Protein: 12 g (Supports muscle satiety and active energy)',
      'Fiber: 4 g (Wholesome oat beta-glucan fiber)',
      'Added sugar: 6 g (Moderate cane sugar addition)',
      'Sodium: 380 mg (Noticeable savory balance for a cereal)',
      'Allergens: Soy (Soy protein isolate, Soy lecithin)',
      'Notable additives: Lecithin (emulsifier), Tocopherols (natural freshness antioxidant)'
    ],
    healthImpacts: [
      {
        system: 'Muscle & Energy',
        rating: 'positive',
        score: 88,
        keyNutrient: '12g Protein',
        observation: 'High plant protein density',
        explanation: 'Provides 24% of daily value from soy isolate and oats, aiding sustained morning satiety and lean muscle maintenance.'
      },
      {
        system: 'Digestion & Gut',
        rating: 'positive',
        score: 82,
        keyNutrient: '4g Fiber',
        observation: 'Good soluble oat fiber source',
        explanation: 'Beta-glucan fibers slow carbohydrate breakdown and support beneficial gut microbiome diversity.'
      },
      {
        system: 'Blood Sugar Balance',
        rating: 'neutral',
        score: 68,
        keyNutrient: '6g Added Sugar / 42g Carbs',
        observation: 'Moderate glycemic load',
        explanation: 'The added cane sugar is buffered by protein and whole grain fiber, preventing rapid insulin spikes.'
      },
      {
        system: 'Heart & Blood Pressure',
        rating: 'neutral',
        score: 65,
        keyNutrient: '380mg Sodium / 1.0g Sat Fat',
        observation: 'Moderate sodium content',
        explanation: 'Low saturated fat (5% DV) is heart-friendly, though sodium sits at 17% DV for a single cup portion.'
      },
      {
        system: 'Metabolism & Satiety',
        rating: 'positive',
        score: 85,
        keyNutrient: '240 kcal / Balanced Macros',
        observation: 'Fulfilling macronutrient balance',
        explanation: 'Substantial calorie density coupled with plant protein delivers steady 3-4 hour satiety.'
      }
    ],
    labelProfile: {
      protein: 4,
      fiber: 3,
      addedSugar: 3,
      sodium: 3,
      complexity: 4
    }
  },
  {
    id: 'demo-green-goddess-bar',
    productName: 'Green Goddess Plant Protein Bar',
    brand: 'Verdant Botanicals',
    imageUrl: 'https://images.unsplash.com/photo-1622484216805-4c07c72f77e2?auto=format&fit=crop&w=600&q=80',
    scannedAt: '2026-09-16T09:15:00.000Z',
    regionalStandard: 'US',
    servingSize: '1 bar (60g)',
    servingSizeGrams: 60,
    servingsPerPackage: 1,
    nutrition: {
      calories: { value: 210, unit: 'kcal', dailyValuePercent: 11, confidence: 98 },
      totalFat: { value: 7.0, unit: 'g', dailyValuePercent: 9, confidence: 98 },
      saturatedFat: { value: 1.5, unit: 'g', dailyValuePercent: 8, confidence: 97 },
      transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 99 },
      cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99 },
      sodium: { value: 140, unit: 'mg', dailyValuePercent: 6, confidence: 99 },
      carbohydrates: { value: 22, unit: 'g', dailyValuePercent: 8, confidence: 98 },
      fiber: { value: 9.0, unit: 'g', dailyValuePercent: 32, confidence: 97 },
      totalSugar: { value: 2.0, unit: 'g', dailyValuePercent: null, confidence: 98 },
      addedSugar: { value: 1.0, unit: 'g', dailyValuePercent: 2, confidence: 98 },
      protein: { value: 20.0, unit: 'g', dailyValuePercent: 40, confidence: 99 },
      vitaminsMinerals: [
        { name: 'Iron', amount: '4.2mg', dailyValuePercent: 25 },
        { name: 'Potassium', amount: '280mg', dailyValuePercent: 6 },
        { name: 'Magnesium', amount: '60mg', dailyValuePercent: 15 }
      ]
    },
    ingredients: [
      {
        id: 'ing-bar-1',
        order: 1,
        name: 'Pea protein isolate',
        category: 'Protein',
        purpose: 'Primary vegan protein source',
        explanation: 'Purified protein extract from yellow peas offering branched-chain amino acids.',
        dietaryRelevance: 'Hypoallergenic plant protein.'
      },
      {
        id: 'ing-bar-2',
        order: 2,
        name: 'Soluble tapioca prebiotic fiber',
        category: 'Grain',
        purpose: 'Binding and dietary fiber',
        explanation: 'Resistant starch derived from cassava root that feeds beneficial gut microbiota.',
        dietaryRelevance: 'Prebiotic dietary fiber.'
      },
      {
        id: 'ing-bar-3',
        order: 3,
        name: 'Almond butter',
        category: 'Oil/Fat',
        purpose: 'Healthy fats, creaminess, and binding',
        explanation: 'Ground roasted whole almonds rich in monounsaturated fats and vitamin E.',
        dietaryRelevance: 'Contains tree nuts.',
        isAllergen: true
      },
      {
        id: 'ing-bar-4',
        order: 4,
        name: 'Pumpkin seeds',
        category: 'Protein',
        purpose: 'Crunch and mineral density',
        explanation: 'Raw pepitas naturally rich in zinc and magnesium.',
        dietaryRelevance: 'Seed-based nutrient booster.'
      },
      {
        id: 'ing-bar-5',
        order: 5,
        name: 'Monk fruit extract',
        category: 'Sweetener',
        purpose: 'Zero-calorie natural sweetener',
        explanation: 'Sweet mogroside extract from Luo Han Guo fruit that does not affect blood glucose levels.',
        dietaryRelevance: 'Non-nutritive botanical sweetener.',
        isAdditive: true
      },
      {
        id: 'ing-bar-6',
        order: 6,
        name: 'Sea salt',
        category: 'Mineral',
        purpose: 'Electrolyte balance',
        explanation: 'Pure sea salt for flavor enhancer and sodium balance.',
        dietaryRelevance: 'Mineral sodium.'
      }
    ],
    allergens: [
      {
        name: 'Tree nuts',
        source: 'ingredient',
        evidence: 'Detected in ingredients: Almond butter'
      }
    ],
    allergenStatement: 'Contains: Almonds (Tree nuts). May contain peanuts, sesame, and coconut.',
    additives: [
      {
        id: 'add-bar-1',
        name: 'Monk Fruit Extract',
        category: 'Sweetener',
        purpose: 'Provides natural sweetness without adding caloric sugar or spiking blood glucose.',
        explanation: 'A natural sweetener derived from Siraitia grosvenorii with high sweetness potency.'
      }
    ],
    claims: ['20g Plant Protein', '1g Sugar', '9g Prebiotic Fiber', 'Gluten Free', 'Keto Friendly'],
    dietaryTags: [
      'Vegan',
      'Vegetarian',
      'Contains nuts',
      'No obvious animal-derived ingredients detected',
      'Gluten-free friendly'
    ],
    confidence: {
      overall: 99,
      nutritionTable: 99,
      ingredientsList: 98,
      lowConfidenceFields: []
    },
    simpleSummary: 'This bar provides an impressive 20 g of protein and 9 g of prebiotic fiber per bar with only 1 g of added sugar and 140 mg of sodium. Almond ingredients were detected.',
    thingsToNotice: [
      'Protein: 20 g (Very high protein density for an active lifestyle)',
      'Fiber: 9 g (32% DV prebiotic fiber)',
      'Added sugar: 1 g (Extremely low)',
      'Sodium: 140 mg (Low sodium profile)',
      'Allergens: Almonds (Tree nuts)',
      'Notable additives: Monk fruit extract (botanical sweetener)'
    ],
    healthImpacts: [
      {
        system: 'Muscle & Energy',
        rating: 'positive',
        score: 95,
        keyNutrient: '20g Pea Protein',
        observation: 'Exceptional recovery density',
        explanation: 'Delivers 40% daily value of protein to stimulate muscle protein synthesis after physical activity.'
      },
      {
        system: 'Blood Sugar Balance',
        rating: 'positive',
        score: 94,
        keyNutrient: '1g Sugar / 9g Fiber',
        observation: 'Extremely stable glycemic profile',
        explanation: 'Virtually sugar-free with heavy soluble prebiotic fiber, causing negligible blood glucose response.'
      },
      {
        system: 'Digestion & Gut',
        rating: 'positive',
        score: 92,
        keyNutrient: '9g Prebiotic Tapioca Fiber',
        observation: 'Supports microbial fermentation',
        explanation: 'Feeds bifidobacteria in the lower digestive tract, contributing to gut barrier health.'
      },
      {
        system: 'Heart & Blood Pressure',
        rating: 'positive',
        score: 88,
        keyNutrient: '140mg Sodium / Monounsaturated Almond Fats',
        observation: 'Low sodium & heart-friendly fats',
        explanation: 'Well within FDA low-sodium bounds with cardiovascular-protective plant fats from whole almonds.'
      },
      {
        system: 'Metabolism & Satiety',
        rating: 'positive',
        score: 90,
        keyNutrient: 'Protein-to-Carb Ratio',
        observation: 'High satiety index',
        explanation: 'High peptide and fiber content activates satiety hormones GLP-1 and PYY.'
      }
    ],
    labelProfile: {
      protein: 5,
      fiber: 5,
      addedSugar: 5,
      sodium: 5,
      complexity: 5
    }
  },
  {
    id: 'demo-masala-lentil-crisps',
    productName: 'Zesty Masala Lentil Crisps',
    brand: 'Desi Crunch',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    scannedAt: '2026-09-16T08:20:00.000Z',
    regionalStandard: 'IN',
    servingSize: '30 g',
    servingSizeGrams: 30,
    servingsPerPackage: 5,
    nutrition: {
      calories: { value: 145, unit: 'kcal', dailyValuePercent: 7, confidence: 97, originalText: '607 kJ' },
      totalFat: { value: 6.8, unit: 'g', dailyValuePercent: 9, confidence: 96 },
      saturatedFat: { value: 2.2, unit: 'g', dailyValuePercent: 11, confidence: 95 },
      transFat: { value: 0, unit: 'g', dailyValuePercent: null, confidence: 98 },
      cholesterol: { value: 0, unit: 'mg', dailyValuePercent: 0, confidence: 99 },
      sodium: { value: 290, unit: 'mg', dailyValuePercent: 13, confidence: 96, originalText: '0.73g Salt' },
      carbohydrates: { value: 17.5, unit: 'g', dailyValuePercent: 6, confidence: 97 },
      fiber: { value: 2.4, unit: 'g', dailyValuePercent: 9, confidence: 94 },
      totalSugar: { value: 1.2, unit: 'g', dailyValuePercent: null, confidence: 97 },
      addedSugar: { value: 0.8, unit: 'g', dailyValuePercent: 2, confidence: 95 },
      protein: { value: 4.1, unit: 'g', dailyValuePercent: 8, confidence: 97 }
    },
    nutritionPer100g: {
      calories: { value: 483, unit: 'kcal', dailyValuePercent: 24 },
      protein: { value: 13.6, unit: 'g', dailyValuePercent: 27 },
      totalFat: { value: 22.6, unit: 'g', dailyValuePercent: 29 },
      saturatedFat: { value: 7.3, unit: 'g', dailyValuePercent: 37 },
      carbohydrates: { value: 58.3, unit: 'g', dailyValuePercent: 21 },
      fiber: { value: 8.0, unit: 'g', dailyValuePercent: 29 },
      totalSugar: { value: 4.0, unit: 'g', dailyValuePercent: null },
      addedSugar: { value: 2.6, unit: 'g', dailyValuePercent: 5 },
      sodium: { value: 966, unit: 'mg', dailyValuePercent: 42 }
    },
    ingredients: [
      {
        id: 'ing-lentil-1',
        order: 1,
        name: 'Lentil flour (Urad dal & Moong dal)',
        category: 'Grain',
        purpose: 'Legume base delivering crisp texture',
        explanation: 'Finely milled split de-husked lentils rich in plant proteins and resistant starch.',
        dietaryRelevance: 'Legume-based, naturally wheat-free.'
      },
      {
        id: 'ing-lentil-2',
        order: 2,
        name: 'Rice flour',
        category: 'Grain',
        purpose: 'Crispness and structural lightness',
        explanation: 'Milled non-glutinous rice grains.',
        dietaryRelevance: 'Gluten-free grain.'
      },
      {
        id: 'ing-lentil-3',
        order: 3,
        name: 'Refined palm olein & cottonseed oil',
        category: 'Oil/Fat',
        purpose: 'Frying medium for snap and shelf life',
        explanation: 'Fractionated vegetable oils with high smoke points.',
        dietaryRelevance: 'Higher in saturated fatty acids.'
      },
      {
        id: 'ing-lentil-4',
        order: 4,
        name: 'Masala spice seasoning (Cumin, Coriander, Black Pepper, Asafoetida)',
        category: 'Flavoring',
        purpose: 'Traditional savory and pungent aroma',
        explanation: 'A blend of dry roasted aromatic culinary spices.',
        dietaryRelevance: 'Asafoetida may be compounded with wheat starch.'
      },
      {
        id: 'ing-lentil-5',
        order: 5,
        name: 'Iodized salt & Black salt (Kala Namak)',
        category: 'Mineral',
        purpose: 'Saline seasoning and sulfurous tang',
        explanation: 'Volcanic rock salt with natural sulfur compounds and fortified table salt.',
        dietaryRelevance: 'Sodium contributor.'
      },
      {
        id: 'ing-lentil-6',
        order: 6,
        name: 'Citric acid',
        category: 'Acid',
        purpose: 'Acidity regulator for sour tangy kick',
        explanation: 'Organic acid naturally found in citrus, used for tartness and microbial stabilization.',
        dietaryRelevance: 'Acidity regulator.',
        isAdditive: true
      }
    ],
    allergens: [
      {
        name: 'Wheat',
        source: 'statement',
        evidence: 'Compounded asafoetida traditionally contains wheat starch. Package warns "May contain traces of wheat".'
      }
    ],
    allergenStatement: 'Manufactured in a plant that handles peanuts, tree nuts, wheat, soy, and milk.',
    additives: [
      {
        id: 'add-citric',
        name: 'Citric Acid',
        category: 'Acidity Regulator',
        purpose: 'Imparts a pleasant tart flavor and naturally balances pH for freshness.',
        explanation: 'A common organic food acid present in lemons, limes, and oranges.',
        commonCode: 'INS 330'
      }
    ],
    claims: ['Roasted & Baked Blend', 'Zero Trans Fat', 'Rich in Legume Protein', 'Authentic Indian Recipe'],
    dietaryTags: [
      'Vegetarian',
      'Vegan',
      'Contains gluten-compounded spice (possible wheat)',
      'No obvious animal-derived ingredients detected'
    ],
    confidence: {
      overall: 96,
      nutritionTable: 97,
      ingredientsList: 95,
      lowConfidenceFields: []
    },
    simpleSummary: 'This snack provides 4.1 g of protein and 2.4 g of fiber per 30 g portion. It has 0.8 g of added sugar and 290 mg of sodium. Energy is declared as 607 kJ (145 kcal) in Indian FSSAI format.',
    thingsToNotice: [
      'Protein: 4.1 g (Decent protein for a savory chip)',
      'Fiber: 2.4 g (Derived from lentils and spices)',
      'Added sugar: 0.8 g (Low)',
      'Sodium: 290 mg per 30g (Approaches 966mg per 100g, moderate to high on larger portion)',
      'Allergens: Possible trace wheat from compounded asafoetida',
      'Notable additives: Citric acid (INS 330)'
    ],
    healthImpacts: [
      {
        system: 'Blood Sugar Balance',
        rating: 'positive',
        score: 75,
        keyNutrient: 'Lentil Legume Base',
        observation: 'Slower starch absorption',
        explanation: 'Lentil flour has a lower glycemic index than plain potato or refined wheat chips.'
      },
      {
        system: 'Heart & Blood Pressure',
        rating: 'attention',
        score: 58,
        keyNutrient: '290mg Sodium (30g) / Palm Olein',
        observation: 'Elevated sodium & saturated fat per 100g',
        explanation: 'While one 30g handful is moderate, a 100g serving contains nearly 1,000mg sodium and 7.3g saturated fat.'
      },
      {
        system: 'Digestion & Gut',
        rating: 'neutral',
        score: 70,
        keyNutrient: 'Cumin & Black Pepper',
        observation: 'Carminative traditional spices',
        explanation: 'Spices like cumin and black pepper support gastric enzyme production.'
      },
      {
        system: 'Muscle & Energy',
        rating: 'neutral',
        score: 65,
        keyNutrient: '4.1g Protein per 30g',
        observation: 'Modest pulse protein',
        explanation: 'Supplies 8% daily value of protein per small serving.'
      },
      {
        system: 'Metabolism & Satiety',
        rating: 'neutral',
        score: 62,
        keyNutrient: 'Savory Snack Palatability',
        observation: 'High palatability may encourage larger portions',
        explanation: 'Salt and crisp texture trigger reward pathways; measuring portions helps maintain moderation.'
      }
    ],
    labelProfile: {
      protein: 2,
      fiber: 2,
      addedSugar: 5,
      sodium: 3,
      complexity: 4
    }
  }
];
