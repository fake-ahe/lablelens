import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AllergenDetection } from '../types';

interface AllergenPanelProps {
  allergens: AllergenDetection[];
  allergenStatement?: string;
}

export const AllergenPanel: React.FC<AllergenPanelProps> = ({ allergens, allergenStatement }) => {
  const hasAllergens = allergens && allergens.length > 0;

  return (
    <div
      className={`rounded-3xl border shadow-sm p-6 sm:p-8 space-y-5 transition-all ${
        hasAllergens
          ? 'bg-red-50/60 border-2 border-red-500 ring-4 ring-red-500/10'
          : 'bg-white border-stone-200/90'
      }`}
    >
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${hasAllergens ? 'border-red-200' : 'border-stone-100'}`}>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-2 text-stone-900">
              <AlertCircle className={`w-6 h-6 ${hasAllergens ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`} />
              Allergen Detection
            </h2>
            {hasAllergens && (
              <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-xs tracking-wide">
                ⚠ {allergens.length} ALLERGEN{allergens.length > 1 ? 'S' : ''} DETECTED
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Screened for the 9 major regulated food allergens (Milk, Eggs, Peanuts, Tree nuts, Soy, Wheat, Sesame, Fish, Shellfish).
          </p>
        </div>
      </div>

      {/* Allergen List or Safe Empty State */}
      {hasAllergens ? (
        <div className="space-y-4">
          {/* Vivid RED Highlighted Allergen Pills */}
          <div className="flex flex-wrap gap-3">
            {allergens.map((allergen, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-red-600 text-white font-extrabold text-sm shadow-md border-2 border-red-700 ring-2 ring-red-300"
              >
                <AlertTriangle className="w-5 h-5 text-amber-200 shrink-0" />
                <span className="tracking-wide">{allergen.name}</span>
                <span className="text-[11px] font-semibold text-red-900 bg-white/90 px-2 py-0.5 rounded-lg shadow-2xs">
                  {allergen.source === 'ingredient' ? 'Ingredient' : allergen.source === 'statement' ? 'Facility Trace' : 'Direct & Trace'}
                </span>
              </div>
            ))}
          </div>

          {/* Evidence Breakdown Highlighted in Red Tone */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-red-300 space-y-2.5 shadow-2xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-red-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Detected Label Evidence:
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-stone-800">
              {allergens.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-red-50/70 border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <div className="leading-relaxed">
                    <span className="font-extrabold text-red-950 underline decoration-red-400 mr-1.5">
                      {a.name}:
                    </span>
                    <span className="text-stone-700">{a.evidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explicit Package Statement if present - bold in red */}
          {allergenStatement && (
            <div className="p-4 rounded-2xl bg-red-100/80 border-2 border-red-300 text-xs sm:text-sm text-red-950 font-medium">
              <span className="font-black text-red-900 block sm:inline mr-1">
                Packaging Allergen Statement:
              </span>
              "{allergenStatement}"
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-emerald-950">
            No common allergens detected from the available label information.
          </h4>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            None of the 9 major regulated allergens were identified in the scanned ingredient list or allergen advisory box.
          </p>
        </div>
      )}

      {/* Mandatory Safety Notice */}
      <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 ${
        hasAllergens
          ? 'bg-red-100/60 border border-red-300 text-red-950'
          : 'bg-amber-50/70 border border-amber-200/80 text-amber-900'
      }`}>
        <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${hasAllergens ? 'text-red-600' : 'text-amber-600'}`} />
        <div className="space-y-0.5">
          <p className="font-bold">Important Allergen Safety Notice</p>
          <p className="leading-relaxed">
            Allergen detection is based on the text visible on the photographed label. Always verify physical packaging directly, particularly for severe allergies, facility cross-contact, or formulation updates.
          </p>
        </div>
      </div>

    </div>
  );
};
