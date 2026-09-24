import React, { useState, useEffect } from 'react';
import { HarmfulAdditiveAlert } from './HarmfulAdditiveAlert';
import { ProductHeader } from './ProductHeader';
import { BestAlternatives } from './BestAlternatives';
import { NutritionSummary } from './NutritionSummary';
import { HealthImpactChart } from './HealthImpactChart';
import { NutritionTable } from './NutritionTable';
import { SmartFoodSummary } from './SmartFoodSummary';
import { IngredientList } from './IngredientList';
import { AdditivePanel } from './AdditivePanel';
import { AllergenPanel } from './AllergenPanel';
import { DietaryCompatibility } from './DietaryCompatibility';
import { LabelProfile } from './LabelProfile';
import { AIQuestionBox } from './AIQuestionBox';
import { LabelAnalysisResult } from '../types';
import { getBestAlternativesForProduct, convertAlternativeToLabelProduct, AlternativeProduct } from '../data/bestAlternatives';
import { Sparkles, ChevronDown, CheckCircle2, Globe, ExternalLink } from 'lucide-react';

interface ResultsPageProps {
  product: LabelAnalysisResult;
  isSaved: boolean;
  onToggleSave: () => void;
  onCompare: () => void;
  onNewScan: () => void;
  onSelectAlternative?: (altProduct: LabelAnalysisResult) => void;
  onCompareWithAlternative?: (altProduct: LabelAnalysisResult) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  product,
  isSaved,
  onToggleSave,
  onCompare,
  onNewScan,
  onSelectAlternative,
  onCompareWithAlternative,
}) => {
  // Only show the list of best alternatives when the user clicks the option on top
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Reset alternatives view if product changes
  useEffect(() => {
    setShowAlternatives(false);
  }, [product.id]);

  const alternatives = getBestAlternativesForProduct(product);

  const handleCompareAlternative = (alt: AlternativeProduct) => {
    const labelProduct = convertAlternativeToLabelProduct(alt);
    if (onCompareWithAlternative) {
      onCompareWithAlternative(labelProduct);
    } else {
      onCompare();
    }
  };

  const handleSelectAlternative = (alt: AlternativeProduct) => {
    const labelProduct = convertAlternativeToLabelProduct(alt);
    if (onSelectAlternative) {
      onSelectAlternative(labelProduct);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-16">
      {/* Heavy Demand Notification Banner if applicable */}
      {product.isHighDemandFallback && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-1.5 px-2.5 rounded-xl bg-amber-200/80 text-amber-900 text-xs font-bold shrink-0">Traffic Notice</span>
            <p className="text-xs text-amber-900 leading-relaxed">
              Cloud AI OCR experienced peak worldwide demand during this scan. Standardized baseline values have been populated for your photo so you can test all features. You can re-scan anytime.
            </p>
          </div>
          <button
            onClick={onNewScan}
            className="text-xs font-semibold text-white bg-amber-800 hover:bg-amber-700 px-3.5 py-1.5 rounded-xl transition-colors shrink-0 self-end sm:self-auto"
          >
            Re-scan Label
          </button>
        </div>
      )}

      {/* TOP PRIORITY: Harmful Additive Alert Banner strictly highlighting any dangerous chemicals on top */}
      <HarmfulAdditiveAlert
        product={product}
        onViewAlternatives={() => {
          setShowAlternatives(true);
          const elem = document.getElementById('top-best-alternative-option-card');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 1. Header with Name, Brand, Serving, Image, Badges, and Action Bar (with Best Alternatives trigger) */}
      <ProductHeader
        product={product}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onCompare={onCompare}
        onNewScan={onNewScan}
        showAlternatives={showAlternatives}
        onToggleAlternatives={() => setShowAlternatives(prev => !prev)}
        alternativesCount={alternatives.length}
      />

      {/* Google Search Grounding Sources Card */}
      {product.groundingMetadata?.sources && product.groundingMetadata.sources.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-2.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-600 text-white">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-900">
                Grounded with Real-time Google Search Data
              </span>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
              {product.groundingMetadata.sources.length} Web Grounding Sources
            </span>
          </div>
          <p className="text-xs text-blue-900/90 leading-relaxed">
            This food profile was verified using live web grounding via Google Search to retrieve current manufacturer nutrition panels, ingredients, and allergen statements.
          </p>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {product.groundingMetadata.sources.map((src, idx) => (
              <a
                key={idx}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-blue-800 hover:bg-blue-100 hover:text-blue-950 transition-colors shadow-2xs group"
                title={src.uri}
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                <span className="max-w-[240px] truncate">{src.title || src.uri}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* TOP OPTION: Best Alternative Banner on Top */}
      <div
        id="top-best-alternative-option-card"
        onClick={() => setShowAlternatives(prev => !prev)}
        className={`p-4 sm:p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none ${
          showAlternatives
            ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
            : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-600 hover:brightness-105 hover:shadow-md'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`p-3 rounded-2xl shrink-0 mt-0.5 sm:mt-0 ${
            showAlternatives ? 'bg-emerald-100 text-emerald-800' : 'bg-white/20 text-white backdrop-blur-xs'
          }`}>
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                showAlternatives ? 'bg-emerald-200 text-emerald-900' : 'bg-white/25 text-white'
              }`}>
                Clean Swaps Available
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                showAlternatives ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-900 font-extrabold'
              }`}>
                {alternatives.length} Healthier Alternatives Found
              </span>
            </div>
            <h3 className={`text-base sm:text-lg font-black font-display mt-1 ${
              showAlternatives ? 'text-stone-900' : 'text-white'
            }`}>
              {showAlternatives ? 'Viewing Curated Best Alternatives' : 'Best Alternative Option Available'}
            </h3>
            <p className={`text-xs mt-0.5 leading-relaxed ${
              showAlternatives ? 'text-stone-600' : 'text-emerald-100'
            }`}>
              {showAlternatives
                ? 'Showing clean-label, lower-sugar, and additive-free whole-food swaps matched to this category.'
                : 'Click this option to reveal the list of healthier, lower-sugar, and additive-free swaps for this food.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAlternatives(prev => !prev);
            }}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs ${
              showAlternatives
                ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <span>{showAlternatives ? 'Hide Alternatives' : 'View Best Alternatives'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAlternatives ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progressive Disclosure: List of Best Alternatives is rendered THEN AND ONLY THEN when user clicks the option */}
      {showAlternatives && (
        <BestAlternatives
          product={product}
          onClose={() => setShowAlternatives(false)}
          onCompareWithAlternative={handleCompareAlternative}
          onSelectAlternativeAsProduct={handleSelectAlternative}
        />
      )}

      {/* 2. Bodily Impact Wheel (Placed right before summary as requested) */}
      <HealthImpactChart product={product} />

      {/* 3. Additive & Functional Ingredient Health Spectrum (Multicolour psychological chart with cancer/hazard highlights) */}
      <AdditivePanel
        additives={product.additives}
        ingredients={product.ingredients}
        nutrition={product.nutrition}
      />

      {/* 4. Transparent Label Architecture Profile (Best design right after additives) */}
      <LabelProfile product={product} />

      {/* 5. Allergen Detection & Critical Safety Notices (Right after Label Profile) */}
      <AllergenPanel
        allergens={product.allergens}
        allergenStatement={product.allergenStatement}
      />

      {/* 6. Key Nutrition Summary */}
      <NutritionSummary nutrition={product.nutrition} />

      {/* 7. Smart Food Summary: "In simple terms" & "Things to notice" */}
      <SmartFoodSummary product={product} />

      {/* 8. Standardized Nutrition Facts Table (with per-serving & per-100g switch) */}
      <NutritionTable
        nutrition={product.nutrition}
        nutritionPer100g={product.nutritionPer100g}
        servingSize={product.servingSize}
        servingsPerPackage={product.servingsPerPackage}
        regionalStandard={product.regionalStandard}
      />

      {/* 9. Ingredient Hierarchy Breakdown with interactive science modal */}
      <IngredientList
        ingredients={product.ingredients}
        allergens={product.allergens}
      />

      {/* 10. Dietary Compatibility Tags (Derived from ingredients) */}
      <DietaryCompatibility dietaryTags={product.dietaryTags} />

      {/* 11. AI Question Box ("Ask About This Label") */}
      <AIQuestionBox product={product} />
    </div>
  );
};
