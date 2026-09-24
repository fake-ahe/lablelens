import React from 'react';
import { Leaf, Check, AlertCircle, ShieldCheck } from 'lucide-react';

interface DietaryCompatibilityProps {
  dietaryTags: string[];
}

export const DietaryCompatibility: React.FC<DietaryCompatibilityProps> = ({ dietaryTags }) => {
  if (!dietaryTags || dietaryTags.length === 0) return null;

  const getTagStyle = (tag: string) => {
    const t = (tag || '').toLowerCase();
    if (t.includes('vegan') || t.includes('vegetarian')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
    if (t.includes('gluten') || t.includes('wheat') || t.includes('dairy') || t.includes('egg') || t.includes('soy') || t.includes('nuts')) {
      return 'bg-amber-50 text-amber-900 border-amber-300';
    }
    return 'bg-stone-100 text-stone-800 border-stone-300';
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            Dietary Compatibility
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Objective classifications based strictly on detected ingredient formulas.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {dietaryTags.map((tag, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${getTagStyle(tag)}`}
          >
            <Check className="w-3.5 h-3.5" />
            {tag}
          </span>
        ))}
      </div>

      <p className="text-[11px] text-stone-400 italic pt-1">
        Disclaimer: Dietary tags indicate ingredient absence/presence derived from OCR analysis. Certifications (such as Certified Gluten-Free or Kosher/Halal) require direct third-party packaging stamps.
      </p>
    </div>
  );
};
