import React from 'react';
import { X, BookOpen, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';
import { IngredientItem } from '../types';

interface IngredientModalProps {
  ingredient: IngredientItem | null;
  onClose: () => void;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({ ingredient, onClose }) => {
  if (!ingredient) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Order Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            #{ingredient.order} by volume
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {ingredient.category}
          </span>
          {ingredient.isAllergen && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Allergen
            </span>
          )}
          {ingredient.isAdditive && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Approved Additive
            </span>
          )}
        </div>

        {/* Ingredient Title */}
        <h3 className="text-2xl font-bold text-stone-900 font-display">
          {ingredient.name}
        </h3>

        {/* Content sections */}
        <div className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Purpose */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Primary Purpose in Product
            </span>
            <p className="text-stone-800 font-medium leading-relaxed">
              {ingredient.purpose}
            </p>
          </div>

          {/* Explanation */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              What it is & Why it is used
            </span>
            <p className="text-stone-700 leading-relaxed">
              {ingredient.explanation}
            </p>
          </div>

          {/* Dietary relevance */}
          {ingredient.dietaryRelevance && (
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Dietary & Allergen Notes
              </span>
              <p className="text-stone-700 leading-relaxed">
                {ingredient.dietaryRelevance}
              </p>
            </div>
          )}

          {/* Neutral Tone Guarantee */}
          <p className="text-[11px] text-stone-400 italic">
            LabelLens explanations are derived from objective food-science literature and regulatory classifications (FDA, EFSA, Codex Alimentarius), completely free of fear-based marketing.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
        >
          Close Detail
        </button>

      </div>
    </div>
  );
};
