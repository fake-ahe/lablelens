import React from 'react';
import { 
  Skull, 
  AlertOctagon, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  Sparkles, 
  Ban, 
  Flame, 
  ArrowDown
} from 'lucide-react';
import { LabelAnalysisResult } from '../types';
import { evaluateFunctionalItems, EvaluatedFunctionalItem } from '../config/additiveHealth';

interface HarmfulAdditiveAlertProps {
  product: LabelAnalysisResult;
  onViewAlternatives?: () => void;
}

export const HarmfulAdditiveAlert: React.FC<HarmfulAdditiveAlertProps> = ({
  product,
  onViewAlternatives
}) => {
  if (!product) return null;

  // Extract and evaluate all additives and functional ingredients
  const evaluatedItems = evaluateFunctionalItems(
    product.additives || [],
    product.ingredients || [],
    product.nutrition
  );

  // Filter items that carry cancer hazard, serious health hazard, or danger grade
  const dangerousHazards = evaluatedItems.filter(
    item => item.healthGrade === 'danger_hazard' || 
            item.hazardProfile?.hazardType === 'carcinogen' || 
            item.hazardProfile?.hazardType === 'serious_hazard'
  );

  // Also check for caution items that are synthetic petroleum dyes or intense additives
  const cautionHazards = evaluatedItems.filter(
    item => item.healthGrade === 'caution' && 
            item.hazardProfile?.hazardType === 'caution' &&
            !dangerousHazards.some(d => d.id === item.id)
  );

  const hasCriticalDanger = dangerousHazards.length > 0;
  const hasCautionDyes = cautionHazards.length > 0;

  // If no harmful additives or cautions found, do not render this alert
  if (!hasCriticalDanger && !hasCautionDyes) {
    return null;
  }

  const totalFlagged = dangerousHazards.length + cautionHazards.length;

  return (
    <div 
      id="top-harmful-additive-critical-alert"
      className="rounded-3xl border-2 border-red-600 bg-gradient-to-b from-red-50 via-rose-50/70 to-red-50 p-6 sm:p-8 shadow-xl shadow-red-950/10 ring-4 ring-red-500/20 space-y-6 relative overflow-hidden"
    >
      {/* Background Warning Watermark Pattern */}
      <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none select-none text-red-950">
        <Skull className="w-80 h-80" />
      </div>

      {/* Top Banner: Strict Do Not Consume Directive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-red-200 pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30 shrink-0 mt-0.5 sm:mt-0 animate-pulse">
            <Skull className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-black tracking-wider uppercase flex items-center gap-1 shadow-xs">
                <AlertOctagon className="w-3.5 h-3.5" />
                Toxicological Health Alert
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-300 text-xs font-bold">
                {totalFlagged} Harmful {totalFlagged === 1 ? 'Additive' : 'Additives'} Detected
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-red-950 font-display tracking-tight flex items-center gap-2">
              Harmful Chemical Additives Detected on Label
            </h2>
          </div>
        </div>

        {/* Action Button: Jump to Clean Alternatives */}
        {onViewAlternatives && (
          <button
            onClick={onViewAlternatives}
            className="shrink-0 self-start sm:self-auto px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Switch to Clean Alternative</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* UNEQUIVOCAL "DO NOT CONSUME" ADVISORY BANNER */}
      <div className="bg-red-700 text-white rounded-2xl p-4 sm:p-5 shadow-inner border border-red-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-red-900/60 text-red-100 shrink-0 mt-0.5">
            <Ban className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="space-y-1">
            <div className="text-base sm:text-lg font-black tracking-wide uppercase font-display text-amber-200">
              STRICT HEALTH ADVISORY: DO NOT CONSUME THIS PRODUCT NO MATTER WHAT
            </div>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed max-w-3xl">
              This product contains industrial food additives and chemical agents classified by recognized public health, oncology, and toxicological authorities (such as IARC, EFSA, and WHO) as hazardous to human health. Due to documented risks of cellular toxicity, hormonal breakdown, or carcinogenicity, this item is <strong className="text-white underline">not considered safe or suitable for consumption</strong>.
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-red-900/80 px-4 py-2 rounded-xl border border-red-500/40 text-center">
          <span className="block text-[10px] uppercase font-bold text-red-200">Consumption Safety</span>
          <span className="text-sm font-black text-white">UNSAFE (0 / 100)</span>
        </div>
      </div>

      {/* HIGHLIGHTED LIST OF HARMFUL ADDITIVES WITH PRECISE REASONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            Specific Toxic & Harmful Additives Identified ({dangerousHazards.length + cautionHazards.length})
          </h3>
          <span className="text-xs text-stone-500 font-medium">Review toxicological reasons below</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Critical Danger Hazards */}
          {dangerousHazards.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl border-2 border-red-300 shadow-sm p-5 space-y-4 hover:border-red-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black text-sm shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-black text-stone-900 font-display">
                        {item.name}
                      </h4>
                      {item.commonCode && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                          {item.commonCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Category: {item.category} • Declared Purpose: {item.purpose}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-black uppercase tracking-wide flex items-center gap-1 shadow-2xs">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {item.hazardProfile?.hazardBadge || 'Severe Health Hazard'}
                  </span>
                </div>
              </div>

              {/* Explicit Reasons Why NOT to Consume */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-red-50/50 p-4 rounded-xl border border-red-200/80">
                {/* Reason 1: Toxic Biological Mechanism */}
                <div className="space-y-1">
                  <span className="font-extrabold text-red-900 uppercase tracking-wider block text-[10px]">
                    1. Biological Harm Mechanism:
                  </span>
                  <p className="text-stone-700 leading-relaxed">
                    {item.hazardProfile?.biologicalMechanism || 
                     'Induces cellular oxidative stress, membrane irritation, and toxic biochemical disruption in tissues.'}
                  </p>
                </div>

                {/* Reason 2: Clinical Risk & Disease Association */}
                <div className="space-y-1">
                  <span className="font-extrabold text-red-900 uppercase tracking-wider block text-[10px]">
                    2. Clinical Risk & Organ Strain:
                  </span>
                  <p className="text-stone-700 leading-relaxed">
                    {item.hazardProfile?.riskDescription || 
                     'Documented in toxicology bioassays to induce tissue damage, organ strain, and elevated cellular pathology.'}
                  </p>
                </div>

                {/* Reason 3: Regulatory & Ban Status */}
                <div className="space-y-1">
                  <span className="font-extrabold text-red-900 uppercase tracking-wider block text-[10px]">
                    3. Regulatory Ban & Oversight:
                  </span>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {item.hazardProfile?.regulatoryStatus || 
                     'Classified by public health bodies as high-risk; restricted or banned in multiple international jurisdictions.'}
                  </p>
                </div>
              </div>

              {/* Authority citation note */}
              {item.hazardProfile?.authority && (
                <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                  <span className="font-bold text-stone-700">Flagged Authority:</span>
                  <span className="text-red-700 font-semibold">{item.hazardProfile.authority}</span>
                </div>
              )}
            </div>
          ))}

          {/* Caution Hazards (e.g. Synthetic Petroleum Dyes) */}
          {cautionHazards.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl border border-amber-300 shadow-sm p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-stone-900">{item.name}</span>
                      {item.commonCode && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          {item.commonCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">{item.purpose}</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold self-start sm:self-auto">
                  {item.hazardProfile?.hazardBadge || 'Synthetic Additive Caution'}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                <strong>Why to avoid: </strong>
                {item.hazardProfile?.riskDescription || item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
