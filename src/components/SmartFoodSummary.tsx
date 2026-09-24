import React from 'react';
import { Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { LabelAnalysisResult } from '../types';

interface SmartFoodSummaryProps {
  product: LabelAnalysisResult;
}

export const SmartFoodSummary: React.FC<SmartFoodSummaryProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Smart Food Summary
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Key nutritional highlights distilled into plain language.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* In Simple Terms */}
        <div className="md:col-span-6 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            In Simple Terms
          </span>
          <p className="text-stone-800 text-sm leading-relaxed font-medium">
            {product.simpleSummary}
          </p>
        </div>

        {/* Things to Notice */}
        <div className="md:col-span-6 p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-stone-600" />
            Things to Notice
          </span>

          <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700">
            {/* If allergens exist, display a prominent red notice first */}
            {product.allergens && product.allergens.length > 0 && (
              <li className="flex items-start gap-2 p-2 rounded-xl bg-red-50 border border-red-200 text-red-950 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-600 mt-1 shrink-0" />
                <span>Allergen Warning: Contains {product.allergens.map(a => a.name).join(', ')}</span>
              </li>
            )}

            {product.thingsToNotice && product.thingsToNotice.length > 0 ? (
              product.thingsToNotice.map((notice, idx) => {
                const noticeStr = typeof notice === 'string' ? notice : String(notice || '');
                const isAllergenNotice = noticeStr.toLowerCase().includes('allergen') || noticeStr.toLowerCase().includes('contains');
                return (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 ${
                      isAllergenNotice
                        ? 'p-2 rounded-xl bg-red-50 border border-red-200 text-red-950 font-bold'
                        : ''
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isAllergenNotice ? 'bg-red-600' : 'bg-emerald-600'}`} />
                    <span>{notice}</span>
                  </li>
                );
              })
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>Protein: {product.nutrition.protein.value ?? 'N/A'} g</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>Fiber: {product.nutrition.fiber.value ?? 'N/A'} g</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>Added Sugar: {product.nutrition.addedSugar.value ?? 'N/A'} g</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>Sodium: {product.nutrition.sodium.value ?? 'N/A'} mg</span>
                </li>
              </>
            )}
          </ul>
        </div>

      </div>

    </div>
  );
};
