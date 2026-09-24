export type RegionalStandard = 'US' | 'EU' | 'IN' | 'OTHER';

export type NutrientLevel = 'low' | 'moderate' | 'high' | 'not-available';

export type IngredientCategory =
  | 'Grain'
  | 'Sweetener'
  | 'Oil/Fat'
  | 'Preservative'
  | 'Emulsifier'
  | 'Flavoring'
  | 'Coloring'
  | 'Thickener'
  | 'Stabilizer'
  | 'Acid'
  | 'Mineral'
  | 'Vitamin'
  | 'Dairy'
  | 'Protein'
  | 'Other'
  | (string & {});

export interface NutrientValue {
  value: number | null;
  unit: string;
  dailyValuePercent: number | null;
  originalText?: string;
  confidence?: number; // 0 - 100
}

export interface VitaminMineral {
  name: string;
  amount: string;
  dailyValuePercent: number | null;
}

export interface NutritionData {
  calories: NutrientValue;
  totalFat: NutrientValue;
  saturatedFat: NutrientValue;
  transFat: NutrientValue;
  cholesterol: NutrientValue;
  sodium: NutrientValue;
  carbohydrates: NutrientValue;
  fiber: NutrientValue;
  totalSugar: NutrientValue;
  addedSugar: NutrientValue;
  protein: NutrientValue;
  vitaminsMinerals?: VitaminMineral[];
}

export interface IngredientItem {
  id: string;
  order: number;
  name: string;
  category: IngredientCategory;
  purpose: string;
  explanation: string;
  dietaryRelevance?: string;
  isAdditive?: boolean;
  isAllergen?: boolean;
}

export interface AdditiveItem {
  id: string;
  name: string;
  category: string;
  purpose: string;
  explanation: string;
  commonCode?: string; // e.g. E322, INS 322
}

export interface AllergenDetection {
  name: string; // e.g., 'Milk', 'Soy', 'Peanuts'
  source: 'ingredient' | 'statement' | 'both';
  evidence: string;
}

export interface HealthImpactItem {
  system:
    | 'Heart & Blood Pressure'
    | 'Blood Sugar Balance'
    | 'Digestion & Gut'
    | 'Muscle & Energy'
    | 'Metabolism & Satiety'
    | 'Cellular & Toxicity Defense'
    | 'Hormonal & Endocrine System'
    | (string & {});
  rating: 'positive' | 'neutral' | 'attention' | 'negative';
  score: number; // 0 - 100
  keyNutrient: string;
  observation: string;
  explanation: string;
}

export interface LabelAnalysisResult {
  id: string;
  productName: string;
  brand: string;
  imageUrl?: string;
  imageSource?: string;
  imageGoogleUrl?: string;
  scannedAt: string;
  regionalStandard: RegionalStandard;
  servingSize: string;
  servingSizeGrams: number | null;
  servingsPerPackage: number | null;
  nutrition: NutritionData;
  nutritionPer100g?: Partial<Record<keyof NutritionData, NutrientValue>>;
  ingredients: IngredientItem[];
  allergens: AllergenDetection[];
  allergenStatement?: string;
  additives: AdditiveItem[];
  claims: string[];
  dietaryTags: string[];
  confidence: {
    overall: number; // 0 - 100
    nutritionTable: number;
    ingredientsList: number;
    lowConfidenceFields: string[];
  };
  simpleSummary: string;
  thingsToNotice: string[];
  healthImpacts: HealthImpactItem[];
  labelProfile: {
    protein: number; // 1 - 5
    fiber: number; // 1 - 5
    addedSugar: number; // 1 - 5 (5 is best/lowest or standardized)
    sodium: number; // 1 - 5
    complexity: number; // 1 - 5 (fewer additives = 5)
  };
  sourceConfidenceNote?: string;
  isSaved?: boolean;
  isHighDemandFallback?: boolean;
  groundingMetadata?: GroundingMetadata;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundingMetadata {
  isSearchGrounded?: boolean;
  sources?: GroundingSource[];
  searchQueries?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface ProductComparison {
  productA: LabelAnalysisResult;
  productB: LabelAnalysisResult;
  keyDifferences: string[];
}
