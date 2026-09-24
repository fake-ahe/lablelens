import { AdditiveItem, IngredientItem, NutritionData } from '../types';

export type HealthGrade = 'good' | 'safe_neutral' | 'caution' | 'danger_hazard';
export type HazardType = 'carcinogen' | 'serious_hazard' | 'caution' | 'none';

export interface HazardProfile {
  hazardType: HazardType;
  hazardBadge: string;
  authority: string;
  riskDescription: string;
  biologicalMechanism: string;
  regulatoryStatus: string;
}

export interface EvaluatedFunctionalItem {
  id: string;
  name: string;
  category: string;
  purpose: string;
  explanation: string;
  commonCode?: string;
  healthGrade: HealthGrade;
  healthScore: number; // 0 - 100
  verdictTitle: string;
  hazardProfile?: HazardProfile;
  psychologicalColor: {
    stroke: string;
    bgLight: string;
    border: string;
    text: string;
    badge: string;
    ring: string;
    glow: string;
  };
  isFunctionalWholeFood?: boolean;
}

// Database of additives linked to cancer risk or serious medical complications
interface KnownHazardDefinition {
  matches: string[];
  hazardType: HazardType;
  hazardBadge: string;
  authority: string;
  riskDescription: string;
  biologicalMechanism: string;
  regulatoryStatus: string;
  explanation: string;
  score: number;
}

const KNOWN_HAZARDS: KnownHazardDefinition[] = [
  {
    matches: ['potassium bromate', 'e924', 'bromate'],
    hazardType: 'carcinogen',
    hazardBadge: 'Group 2B Carcinogen Hazard',
    authority: 'IARC / WHO & EFSA (Banned in EU & UK)',
    riskDescription: 'Recognized kidney and thyroid tumor inducer; damages DNA via oxidative stress.',
    biologicalMechanism: 'Oxidative radical generation inducing chromosomal aberrations and renal cell damage.',
    regulatoryStatus: 'Banned in the European Union, UK, Canada, Brazil; restricted under CA AB 418.',
    explanation: 'Potassium bromate is an oxidizing dough conditioner classified as possibly carcinogenic to humans (IARC Group 2B). High risk of cellular toxicity.',
    score: 15
  },
  {
    matches: ['titanium dioxide', 'e171', 'tio2'],
    hazardType: 'carcinogen',
    hazardBadge: 'Genotoxic & DNA Breakage Hazard',
    authority: 'EFSA (Banned in European Food)',
    riskDescription: 'Nanoparticles accumulate in organs, inducing chronic cellular inflammation and DNA damage.',
    biologicalMechanism: 'Nanoscale particle accumulation causing reactive oxygen species (ROS) and cellular DNA strand breaks.',
    regulatoryStatus: 'Formally banned as a food additive across all 27 European Union member states since 2022.',
    explanation: 'Used as an artificial white pigment. European Food Safety Authority (EFSA) concluded it can no longer be considered safe due to genotoxicity.',
    score: 20
  },
  {
    matches: ['bha', 'butylated hydroxyanisole', 'e320'],
    hazardType: 'carcinogen',
    hazardBadge: 'Anticipated Human Carcinogen',
    authority: 'US National Toxicology Program (NTP) & IARC',
    riskDescription: 'Classified by the US National Toxicology Program as "reasonably anticipated to be a human carcinogen".',
    biologicalMechanism: 'Promotes stomach & liver neoplasms in biological assays and disrupts thyroid/estrogen hormones.',
    regulatoryStatus: 'Restricted in the EU; listed on California Proposition 65 as a known carcinogen.',
    explanation: 'Synthetic preservative used in fats and snack foods. Shown to cause forestomach papillomas and interfere with endocrine signaling.',
    score: 22
  },
  {
    matches: ['bht', 'butylated hydroxytoluene', 'e321'],
    hazardType: 'serious_hazard',
    hazardBadge: 'Endocrine & Organ Toxicity Hazard',
    authority: 'National Institutes of Health & EFSA',
    riskDescription: 'Linked to liver and kidney hypertrophy, pulmonary toxicity, and thyroid hormonal disruption.',
    biologicalMechanism: 'Metabolized into reactive quinone methide intermediates that alter cellular lipid enzymes.',
    regulatoryStatus: 'Severely restricted in European food formulations; consumer watchdog high-concern.',
    explanation: 'Synthetic petrochemical antioxidant that stabilizes vegetable oils. Associated with systemic organ strain and endocrine disruption.',
    score: 30
  },
  {
    matches: ['sodium nitrite', 'sodium nitrate', 'e250', 'e251', 'potassium nitrite', 'e249'],
    hazardType: 'carcinogen',
    hazardBadge: 'Probable Carcinogen (Nitrosamines)',
    authority: 'IARC / WHO (Group 2A Probable Carcinogen)',
    riskDescription: 'Converts in the acidic gut into carcinogenic N-nitrosamines, directly linked to colorectal cancer.',
    biologicalMechanism: 'Reacts with secondary dietary amines to form highly mutagenic alkylating nitrosamine compounds.',
    regulatoryStatus: 'Targeted for mandatory reduction by global oncology and gastrointestinal associations.',
    explanation: 'Curing agent used in processed meats. High thermal cooking converts nitrites into nitrosamines, recognized drivers of gastrointestinal and colon cancers.',
    score: 25
  },
  {
    matches: ['aspartame', 'e951', 'nutrasweet', 'equal'],
    hazardType: 'carcinogen',
    hazardBadge: 'IARC Group 2B Possible Carcinogen',
    authority: 'WHO / IARC & JECFA (2023 Evaluation)',
    riskDescription: 'Classified by the WHO International Agency for Research on Cancer as "possibly carcinogenic to humans".',
    biologicalMechanism: 'Metabolizes into aspartic acid, phenylalanine, and trace formaldehyde; linked to liver tumor models.',
    regulatoryStatus: 'Subject to strict daily consumption limits; flagged for ongoing pediatric cancer research.',
    explanation: 'Artificial high-intensity sweetener. Recent WHO evaluations highlight potential associations with hepatocellular carcinoma and microbiome alteration.',
    score: 35
  },
  {
    matches: ['red 3', 'erythrosine', 'e127', 'fd&c red no. 3', 'red no. 3'],
    hazardType: 'carcinogen',
    hazardBadge: 'Thyroid Carcinogen Hazard',
    authority: 'FDA (Cosmetics Ban) & CA Food Safety Act',
    riskDescription: 'Causes thyroid follicular cell tumors in animal studies; banned in cosmetics by the FDA.',
    biologicalMechanism: 'Interferes with thyroid hormone conversion and stimulates thyroid stimulating hormone (TSH) proliferation.',
    regulatoryStatus: 'Banned in food by California AB 418; restricted in EU confectionery and baked goods.',
    explanation: 'Synthetic petroleum-based dye. Conclusively demonstrated to induce thyroid cancer in laboratory rodents; outlawed in cosmetics since 1990.',
    score: 20
  },
  {
    matches: ['caramel color iv', 'caramel color iii', 'e150d', 'e150c', '4-mei', '4-methylimidazole', 'ammonia caramel'],
    hazardType: 'carcinogen',
    hazardBadge: 'Carcinogen Hazard (4-MeI Contaminant)',
    authority: 'California Prop 65 & IARC Group 2B',
    riskDescription: 'Industrial production with ammonia yields 4-methylimidazole (4-MeI), an established carcinogen.',
    biologicalMechanism: '4-MeI induces lung tumors (alveolar/bronchiolar neoplasms) and leukemia in chronic animal bioassays.',
    regulatoryStatus: 'Must carry cancer warning labels in California if exceeding 29 micrograms per day.',
    explanation: 'Ammonia-sulfite caramel coloring used in sodas and dark sauces. Contains 4-MeI byproduct, recognized on California Proposition 65.',
    score: 28
  },
  {
    matches: ['brominated vegetable oil', 'bvo'],
    hazardType: 'serious_hazard',
    hazardBadge: 'Severe Organ & Neural Toxicity',
    authority: 'US FDA (Formally Revoked)',
    riskDescription: 'Bioaccumulates in heart, liver, and brain tissue; induces myocardial and thyroid damage.',
    biologicalMechanism: 'Bromine displaces iodine in thyroid receptors and integrates into cardiac lipid membranes.',
    regulatoryStatus: 'Banned across Europe, India, and Japan; FDA issued final rule revoking all food authorization in 2024.',
    explanation: 'Citrus flavor emulsifier. Clinical studies proved tissue accumulation leading to cardiac lipidosis and severe thyroid dysfunction.',
    score: 10
  },
  {
    matches: ['azodicarbonamide', 'ada', 'e927a'],
    hazardType: 'serious_hazard',
    hazardBadge: 'Carcinogenic Breakdown (Semicarbazide)',
    authority: 'EFSA & UK Food Standards Agency',
    riskDescription: 'Thermal baking breaks down ADA into semicarbazide, a mutagenic carcinogen in animal models.',
    biologicalMechanism: 'Generates semicarbazide and ethyl carbamate during thermal baking, damaging cellular chromosomes.',
    regulatoryStatus: 'Banned as a food additive in the European Union, Australia, and Singapore.',
    explanation: 'Chemical dough conditioner and plastic foaming agent ("yoga mat chemical"). Banned in numerous countries due to semicarbazide risk.',
    score: 24
  },
  {
    matches: ['partially hydrogenated', 'trans fat', 'hydrogenated soybean oil'],
    hazardType: 'serious_hazard',
    hazardBadge: 'Severe Cardiovascular Hazard',
    authority: 'WHO & US FDA (Banned GRAS Status)',
    riskDescription: 'Directly accelerates coronary artery calcification, raises LDL, lowers protective HDL, and increases stroke risk.',
    biologicalMechanism: 'Promotes arterial endothelial dysfunction, systemic inflammation, and rapid atherosclerotic plaque accumulation.',
    regulatoryStatus: 'Banned from GRAS (Generally Recognized as Safe) food inventory globally by the WHO REPLACE initiative.',
    explanation: 'Industrial trans fatty acid. Responsible for hundreds of thousands of premature cardiovascular deaths worldwide.',
    score: 18
  },
  {
    matches: ['propyl gallate', 'e310'],
    hazardType: 'serious_hazard',
    hazardBadge: 'Endocrine & Estrogenic Disruptor',
    authority: 'EFSA & Endocrine Society',
    riskDescription: 'Exhibits estrogenic receptor binding and potential reproductive organ toxicities.',
    biologicalMechanism: 'Competes with endogenous hormones at cellular receptor sites, disturbing endocrine homeostasis.',
    regulatoryStatus: 'Restricted to low parts-per-million thresholds; consumer health advisory.',
    explanation: 'Synthetic antioxidant used to prevent rancidity in meats and oils. Flagged for endocrine disruption and allergic sensitization.',
    score: 38
  },
  {
    matches: ['tbhq', 'tertiary butylhydroquinone', 'e319'],
    hazardType: 'serious_hazard',
    hazardBadge: 'Immune & Cellular Toxicant Hazard',
    authority: 'National Toxicology Program & EFSA',
    riskDescription: 'Shown in immunology models to alter immune T-cell response, promote food allergies, and induce liver stress.',
    biologicalMechanism: 'Induces oxidative stress in lymphocyte membranes and inhibits T-helper cytokine expression.',
    regulatoryStatus: 'Strictly capped at 0.02% of total fat content; flagged by pediatric immune specialists.',
    explanation: 'Petroleum-derived preservative in oils and chips. Linked in peer-reviewed immunology studies to impaired immune defenses.',
    score: 36
  },
  {
    matches: ['red 40', 'allura red', 'e129', 'yellow 5', 'tartrazine', 'e102', 'yellow 6', 'sunset yellow', 'e110', 'blue 1', 'brilliant blue', 'e133'],
    hazardType: 'caution',
    hazardBadge: 'Synthetic Dye & Neuro-Allergy Risk',
    authority: 'European Parliament (Requires Warning Label)',
    riskDescription: 'Linked to neurobehavioral hyperactivity in children; potential aromatic amine contaminants.',
    biologicalMechanism: 'Interferes with zinc metabolism and histamine release, triggering hypersensitivity and attention deficits.',
    regulatoryStatus: 'Requires mandatory warning label in the EU: "May have an adverse effect on activity and attention in children."',
    explanation: 'Artificial coal-tar derived food dyes. Flagged internationally for behavioral impacts on children and genotoxic trace risks.',
    score: 48
  }
];

export function evaluateFunctionalItems(
  additives: AdditiveItem[] = [],
  ingredients: IngredientItem[] = [],
  nutrition?: NutritionData
): EvaluatedFunctionalItem[] {
  const evaluated: EvaluatedFunctionalItem[] = [];
  const processedNames = new Set<string>();

  // 1. Process explicit additives
  for (const add of additives) {
    if (!add || !add.name) continue;
    const lowerName = (add.name || '').toLowerCase();
    const lowerPurpose = (add.purpose || '').toLowerCase();
    const lowerCat = (add.category || '').toLowerCase();
    const lowerCode = (add.commonCode || '').toLowerCase();
    processedNames.add(lowerName);

    // Check for serious hazard or carcinogen match
    const hazardDef = KNOWN_HAZARDS.find(h =>
      h.matches.some(m => lowerName.includes(m) || lowerCode.includes(m) || lowerPurpose.includes(m))
    );

    let healthGrade: HealthGrade = 'safe_neutral';
    let healthScore = 75;
    let verdictTitle = 'Recognized Safe (Functional)';
    let hazardProfile: HazardProfile | undefined = undefined;

    if (hazardDef) {
      if (hazardDef.hazardType === 'carcinogen') {
        healthGrade = 'danger_hazard';
        healthScore = hazardDef.score;
        verdictTitle = 'Carcinogen Risk Hazard';
      } else if (hazardDef.hazardType === 'serious_hazard') {
        healthGrade = 'danger_hazard';
        healthScore = hazardDef.score;
        verdictTitle = 'Serious Health Hazard';
      } else {
        healthGrade = 'caution';
        healthScore = hazardDef.score;
        verdictTitle = 'Caution (Limit / Mindful Intake)';
      }

      hazardProfile = {
        hazardType: hazardDef.hazardType,
        hazardBadge: hazardDef.hazardBadge,
        authority: hazardDef.authority,
        riskDescription: hazardDef.riskDescription,
        biologicalMechanism: hazardDef.biologicalMechanism,
        regulatoryStatus: hazardDef.regulatoryStatus
      };
    }
    // Good for health (natural antioxidants, vitamins, bio-active nutrients, soluble fiber gums)
    else if (
      lowerName.includes('tocopherol') ||
      lowerName.includes('vitamin') ||
      lowerName.includes('ascorbic') ||
      lowerName.includes('beta-carotene') ||
      lowerName.includes('pectin') ||
      lowerName.includes('folic') ||
      lowerName.includes('niacin') ||
      lowerName.includes('riboflavin') ||
      lowerName.includes('thiamine') ||
      lowerName.includes('calcium carbonate') ||
      lowerName.includes('zinc') ||
      lowerName.includes('iron') ||
      lowerName.includes('inulin')
    ) {
      healthGrade = 'good';
      healthScore = 92;
      verdictTitle = 'Good for Health (Nutrient & Antioxidant)';
    }
    // General caution / limit (Artificial sweeteners, mild chemical preservatives)
    else if (
      lowerName.includes('sucralose') ||
      lowerName.includes('acesulfame') ||
      lowerName.includes('saccharin') ||
      lowerName.includes('sodium benzoate')
    ) {
      healthGrade = 'caution';
      healthScore = 48;
      verdictTitle = 'Caution (Limit / Mindful Intake)';
      hazardProfile = {
        hazardType: 'caution',
        hazardBadge: 'Synthetic Additive (Limit Intake)',
        authority: 'CSPI & Consumer Toxicology',
        riskDescription: 'Chemical additive associated with gut microbiome shift or hyperactivity in sensitive individuals.',
        biologicalMechanism: 'Alters intestinal microbial diversity and can interact with citric acid to form trace benzene.',
        regulatoryStatus: 'Permitted within strict daily intake limits.'
      };
    }
    // Safe & Functional (Standard culinary & technological components)
    else {
      healthGrade = 'safe_neutral';
      healthScore = 78;
      verdictTitle = 'Safe & Technological (Non-toxic)';
    }

    evaluated.push({
      id: add.id || add.name,
      name: add.name,
      category: add.category,
      purpose: add.purpose || 'Technological stabilizer & freshness protection',
      explanation: hazardDef ? hazardDef.explanation : add.explanation,
      commonCode: add.commonCode,
      healthGrade,
      healthScore,
      verdictTitle,
      hazardProfile,
      psychologicalColor: getPsychologicalTheme(healthGrade, evaluated.length)
    });
  }

  // 2. Scan ingredients for functional components or stealth hazards
  for (const ing of ingredients) {
    if (!ing || !ing.name) continue;
    const lowerName = (ing.name || '').toLowerCase();
    if (processedNames.has(lowerName)) continue;

    // Check if ingredient itself matches any cancer/serious hazard
    const hazardDef = KNOWN_HAZARDS.find(h =>
      h.matches.some(m => lowerName.includes(m))
    );

    if (hazardDef) {
      processedNames.add(lowerName);
      const isCarcinogen = hazardDef.hazardType === 'carcinogen';
      evaluated.push({
        id: ing.id || ing.name,
        name: ing.name,
        category: ing.category || 'Preservative/Additive',
        purpose: ing.purpose || 'Industrial preservative or stabilizer',
        explanation: hazardDef.explanation,
        healthGrade: hazardDef.hazardType === 'caution' ? 'caution' : 'danger_hazard',
        healthScore: hazardDef.score,
        verdictTitle: isCarcinogen ? 'Carcinogen Risk Hazard' : 'Serious Health Hazard',
        hazardProfile: {
          hazardType: hazardDef.hazardType,
          hazardBadge: hazardDef.hazardBadge,
          authority: hazardDef.authority,
          riskDescription: hazardDef.riskDescription,
          biologicalMechanism: hazardDef.biologicalMechanism,
          regulatoryStatus: hazardDef.regulatoryStatus
        },
        psychologicalColor: getPsychologicalTheme(
          hazardDef.hazardType === 'caution' ? 'caution' : 'danger_hazard',
          evaluated.length
        )
      });
      continue;
    }

    // Check if ingredient is a beneficial whole-food functional component
    const isFunctional =
      ing.category === 'Vitamin' ||
      ing.category === 'Mineral' ||
      ing.category === 'Emulsifier' ||
      ing.category === 'Preservative' ||
      lowerName.includes('fiber') ||
      lowerName.includes('lecithin') ||
      lowerName.includes('cocoa') ||
      lowerName.includes('cacao') ||
      lowerName.includes('chia') ||
      lowerName.includes('flax') ||
      lowerName.includes('probiotic') ||
      lowerName.includes('culture') ||
      lowerName.includes('oat beta-glucan') ||
      lowerName.includes('curcumin') ||
      lowerName.includes('cinnamon') ||
      lowerName.includes('ginger') ||
      lowerName.includes('citric acid') ||
      lowerName.includes('baking soda') ||
      lowerName.includes('sea salt');

    if (isFunctional) {
      processedNames.add(lowerName);
      let healthGrade: HealthGrade = 'good';
      let healthScore = 88;
      let verdictTitle = 'Good for Health (Bioactive Food Component)';

      if (lowerName.includes('sea salt') || lowerName.includes('sodium bicarbonate')) {
        healthGrade = 'safe_neutral';
        healthScore = 75;
        verdictTitle = 'Safe & Natural Mineral (Consume in Balance)';
      }

      evaluated.push({
        id: ing.id || ing.name,
        name: ing.name,
        category: ing.category,
        purpose: ing.purpose || 'Natural nutrient provider & flavor foundation',
        explanation: ing.explanation || 'Whole food or mineral component that contributes essential functional nourishment.',
        healthGrade,
        healthScore,
        verdictTitle,
        psychologicalColor: getPsychologicalTheme(healthGrade, evaluated.length),
        isFunctionalWholeFood: true
      });
    }
  }

  // 3. Fallback: If product has literally no additives or identified functional ingredients,
  // evaluate primary macronutrient functional drivers from the label
  if (evaluated.length === 0 && ingredients.length > 0) {
    const primary = ingredients.slice(0, 3);
    for (const p of primary) {
      evaluated.push({
        id: p.id || p.name,
        name: p.name,
        category: p.category,
        purpose: p.purpose || 'Primary nutrient foundation',
        explanation: p.explanation || 'Primary functional food ingredient providing clean caloric energy without synthetic additives.',
        healthGrade: 'good',
        healthScore: 94,
        verdictTitle: 'Good for Health (Whole Food Ingredient)',
        psychologicalColor: getPsychologicalTheme('good', evaluated.length),
        isFunctionalWholeFood: true
      });
    }
  }

  return evaluated;
}

function getPsychologicalTheme(grade: HealthGrade, index: number) {
  if (grade === 'danger_hazard') {
    // Intense Crimson / High-Risk Danger Red
    return {
      stroke: '#dc2626', // red-600
      bgLight: 'bg-red-50',
      border: 'border-red-600',
      text: 'text-red-900',
      badge: 'bg-red-600 text-white border-red-700 font-black tracking-wide',
      ring: 'ring-red-600/30',
      glow: 'rgba(220, 38, 38, 0.45)'
    };
  } else if (grade === 'good') {
    // Variations of healthy greens and teals
    const greenVariants = [
      {
        stroke: '#10b981', // emerald-500
        bgLight: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-emerald-800',
        badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        ring: 'ring-emerald-400/20',
        glow: 'rgba(16, 185, 129, 0.25)'
      },
      {
        stroke: '#059669', // emerald-600
        bgLight: 'bg-teal-50',
        border: 'border-teal-300',
        text: 'text-teal-800',
        badge: 'bg-teal-100 text-teal-900 border-teal-300',
        ring: 'ring-teal-400/20',
        glow: 'rgba(20, 184, 166, 0.25)'
      },
      {
        stroke: '#14b8a6', // teal-500
        bgLight: 'bg-cyan-50',
        border: 'border-cyan-300',
        text: 'text-cyan-800',
        badge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
        ring: 'ring-cyan-400/20',
        glow: 'rgba(6, 182, 212, 0.25)'
      }
    ];
    return greenVariants[index % greenVariants.length];
  } else if (grade === 'caution') {
    // Amber / Coral / Orange caution tones
    return {
      stroke: '#f97316', // orange-500
      bgLight: 'bg-amber-50',
      border: 'border-amber-400',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-950 border-amber-400 font-bold',
      ring: 'ring-amber-400/30',
      glow: 'rgba(249, 115, 22, 0.3)'
    };
  } else {
    // Safe & Functional neutral variants (Indigo, Sky Blue, Violet)
    const neutralVariants = [
      {
        stroke: '#3b82f6', // blue-500
        bgLight: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-800',
        badge: 'bg-blue-100 text-blue-900 border-blue-300',
        ring: 'ring-blue-400/20',
        glow: 'rgba(59, 130, 246, 0.25)'
      },
      {
        stroke: '#6366f1', // indigo-500
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-300',
        text: 'text-indigo-800',
        badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        ring: 'ring-indigo-400/20',
        glow: 'rgba(99, 102, 241, 0.25)'
      },
      {
        stroke: '#8b5cf6', // violet-500
        bgLight: 'bg-purple-50',
        border: 'border-purple-300',
        text: 'text-purple-800',
        badge: 'bg-purple-100 text-purple-900 border-purple-300',
        ring: 'ring-purple-400/20',
        glow: 'rgba(139, 92, 246, 0.25)'
      }
    ];
    return neutralVariants[index % neutralVariants.length];
  }
}
