import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  ArrowRightLeft, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Flame, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  Leaf, 
  Award,
  ExternalLink,
  Layers,
  Zap
} from 'lucide-react';
import { LabelAnalysisResult } from '../types';
import { AlternativeProduct, getBestAlternativesForProduct } from '../data/bestAlternatives';

interface BestAlternativesProps {
  product: LabelAnalysisResult;
  onClose: () => void;
  onCompareWithAlternative?: (alt: AlternativeProduct) => void;
  onSelectAlternativeAsProduct?: (alt: AlternativeProduct) => void;
}

export const BestAlternatives: React.FC<BestAlternativesProps> = ({
  product,
  onClose,
  onCompareWithAlternative,
  onSelectAlternativeAsProduct
}) => {
  const alternatives = getBestAlternativesForProduct(product);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sugar' | 'protein' | 'clean'>('all');
  const [selectedAltId, setSelectedAltId] = useState<string>(alternatives[0]?.id || '');

  // Filter alternatives if requested
  const filteredAlternatives = alternatives.filter(alt => {
    if (selectedFilter === 'sugar') return alt.nutrition.addedSugar <= 1.0;
    if (selectedFilter === 'protein') return alt.nutrition.protein >= 10.0;
    if (selectedFilter === 'clean') return alt.cleanScore >= 96;
    return true;
  });

  const activeAlt = alternatives.find(a => a.id === selectedAltId) || alternatives[0];

  return (
    <section 
      id="best-alternatives-list-section" 
      className="bg-white rounded-3xl border-2 border-emerald-500/80 shadow-lg p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300 relative"
    >
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Nutritionally Superior & Clean-Label Swaps
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            Best Healthier Alternatives for {product.productName}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Curated swaps featuring significantly lower added sugars, clean whole-food ingredients, cardiovascular-friendly sodium levels, and zero high-hazard technological additives.
          </p>
        </div>

        {/* Action Controls: Filter tabs & Close button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({alternatives.length})
            </button>
            <button
              onClick={() => setSelectedFilter('sugar')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'sugar'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Low Sugar
            </button>
            <button
              onClick={() => setSelectedFilter('protein')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'protein'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              High Protein
            </button>
            <button
              onClick={() => setSelectedFilter('clean')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'clean'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              100% Clean
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Hide Alternatives List"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid of Best Alternative Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filteredAlternatives.map((alt) => {
          const isSelected = alt.id === activeAlt?.id;

          // Nutrient comparison values
          const currentSugar = product.nutrition.addedSugar?.value ?? product.nutrition.totalSugar?.value ?? 0;
          const currentSodium = product.nutrition.sodium?.value ?? 0;
          const currentProtein = product.nutrition.protein?.value ?? 0;
          const currentFiber = product.nutrition.fiber?.value ?? 0;

          return (
            <div
              key={alt.id}
              onClick={() => setSelectedAltId(alt.id)}
              className={`rounded-2xl border-2 transition-all p-5 flex flex-col justify-between space-y-4 cursor-pointer relative group ${
                isSelected
                  ? 'bg-emerald-50/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-stone-50/50 border-stone-200/80 hover:bg-white hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              {/* Card Top: Image + Title + Rating */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={alt.imageUrl}
                    alt={alt.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300/60">
                        Grade {alt.cleanGrade}
                      </span>
                      <div className="inline-flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{alt.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900 font-display mt-1 leading-snug line-clamp-2">
                      {alt.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {alt.brand} • {alt.servingSize}
                    </p>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {alt.tagline}
                </p>

                {/* Key Advantage Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {alt.keyBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 shadow-2xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Direct Side-by-Side Advantage Box */}
                <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    Key Improvements vs Current Product:
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100/80">
                      <span className="text-[10px] text-stone-500 font-bold block">Added Sugar:</span>
                      <div className="flex items-baseline gap-1 font-bold text-emerald-800 font-mono">
                        <span>{alt.nutrition.addedSugar}g</span>
                        <span className="text-[10px] text-stone-400 font-normal">vs {currentSugar}g</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100/80">
                      <span className="text-[10px] text-stone-500 font-bold block">Dietary Fiber:</span>
                      <div className="flex items-baseline gap-1 font-bold text-teal-800 font-mono">
                        <span>{alt.nutrition.fiber}g</span>
                        <span className="text-[10px] text-stone-400 font-normal">vs {currentFiber}g</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100/80">
                      <span className="text-[10px] text-stone-500 font-bold block">Sodium:</span>
                      <div className="flex items-baseline gap-1 font-bold text-blue-800 font-mono">
                        <span>{alt.nutrition.sodium}mg</span>
                        <span className="text-[10px] text-stone-400 font-normal">vs {currentSodium}mg</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100/80">
                      <span className="text-[10px] text-stone-500 font-bold block">Protein:</span>
                      <div className="flex items-baseline gap-1 font-bold text-indigo-800 font-mono">
                        <span>{alt.nutrition.protein}g</span>
                        <span className="text-[10px] text-stone-400 font-normal">vs {currentProtein}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why It's Better / Clinical Explanation */}
                <div className="p-3 rounded-xl bg-stone-100/70 text-stone-700 text-xs leading-relaxed space-y-1">
                  <span className="font-extrabold text-stone-900 block">Why this is a better swap:</span>
                  <p>{alt.whyBetter}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2">
                {onCompareWithAlternative && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompareWithAlternative(alt);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Compare</span>
                  </button>
                )}

                {onSelectAlternativeAsProduct && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAlternativeAsProduct(alt);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Label</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clean Food Certification Badge Footer */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-medium">
            <strong>Clean Formulation Standard:</strong> All recommended alternatives exclude artificial food colorings, high-fructose corn syrup, partially hydrogenated trans-fats, and carcinogenic preservatives.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0"
        >
          Hide Alternatives List
        </button>
      </div>

    </section>
  );
};
