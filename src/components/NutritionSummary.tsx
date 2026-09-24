import React, { useState } from 'react';
import { Info, HelpCircle, X, Check, AlertCircle } from 'lucide-react';
import { NutritionData, NutrientLevel } from '../types';
import { evaluateNutrientLevel, NUTRITION_THRESHOLDS } from '../config/thresholds';

interface NutritionSummaryProps {
  nutrition: NutritionData;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutrition }) => {
  const [selectedRationale, setSelectedRationale] = useState<{
    title: string;
    value: string;
    level: string;
    rationale: string;
    thresholds: string;
  } | null>(null);

  // Evaluate the core neutral observations
  const observations = [
    {
      key: 'protein',
      label: 'Protein',
      val: nutrition.protein.value,
      unit: 'g',
      eval: evaluateNutrientLevel('protein', nutrition.protein.value),
      dailyVal: nutrition.protein.dailyValuePercent,
      targetRef: 'FDA reference: 50g/day. High if ≥10g/serving.'
    },
    {
      key: 'fiber',
      label: 'Dietary Fiber',
      val: nutrition.fiber.value,
      unit: 'g',
      eval: evaluateNutrientLevel('fiber', nutrition.fiber.value),
      dailyVal: nutrition.fiber.dailyValuePercent,
      targetRef: 'FDA reference: 28g/day. Good source if ≥2.8g, high if ≥5g.'
    },
    {
      key: 'addedSugar',
      label: 'Added Sugar',
      val: nutrition.addedSugar.value,
      unit: 'g',
      eval: evaluateNutrientLevel('addedSugar', nutrition.addedSugar.value),
      dailyVal: nutrition.addedSugar.dailyValuePercent,
      targetRef: 'FDA limit: 50g/day. High if ≥10g (20% DV). WHO recommends <25g.'
    },
    {
      key: 'sodium',
      label: 'Sodium',
      val: nutrition.sodium.value,
      unit: 'mg',
      eval: evaluateNutrientLevel('sodium', nutrition.sodium.value),
      dailyVal: nutrition.sodium.dailyValuePercent,
      targetRef: 'FDA limit: 2,300mg/day. Low is ≤140mg; High is ≥460mg (20% DV).'
    },
    {
      key: 'saturatedFat',
      label: 'Saturated Fat',
      val: nutrition.saturatedFat.value,
      unit: 'g',
      eval: evaluateNutrientLevel('saturatedFat', nutrition.saturatedFat.value),
      dailyVal: nutrition.saturatedFat.dailyValuePercent,
      targetRef: 'FDA limit: 20g/day. Low is ≤1g; High is ≥4g.'
    }
  ];

  const getLevelBadgeClasses = (level: NutrientLevel, isPositiveNutrient: boolean) => {
    switch (level) {
      case 'low':
        return isPositiveNutrient
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'moderate':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      case 'high':
        return isPositiveNutrient
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-amber-50 text-amber-800 border-amber-200';
      case 'not-available':
      default:
        return 'bg-stone-100 text-stone-500 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header with quick tip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            Quick Summary
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            High-level numbers at a glance. Tap any metric to see the standard benchmark rationale.
          </p>
        </div>
        <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
          Ref: 2,000 kcal / day DV
        </span>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Calories */}
        <div
          onClick={() => setSelectedRationale({
            title: 'Calories',
            value: `${nutrition.calories.value ?? 'Not detected'} kcal`,
            level: 'Energy baseline',
            rationale: NUTRITION_THRESHOLDS.calories.rationale,
            thresholds: 'Standard 2,000 kcal daily diet reference. 1 kcal = 4.184 kJ.'
          })}
          className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/20 cursor-pointer transition-all text-center group relative"
        >
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Calories</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 font-display group-hover:text-emerald-700 transition-colors">
            {nutrition.calories.value ?? '—'}
          </p>
          <span className="text-xs text-stone-500">kcal / serving</span>
          <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-center gap-1 group-hover:text-emerald-600">
            <HelpCircle className="w-3 h-3" /> Tap rationale
          </div>
        </div>

        {/* Protein */}
        <div
          onClick={() => {
            const obs = observations.find(o => o.key === 'protein');
            setSelectedRationale({
              title: 'Protein',
              value: `${nutrition.protein.value ?? 'Not detected'} g`,
              level: obs?.eval.text || 'Standard',
              rationale: obs?.eval.rationale || '',
              thresholds: obs?.targetRef || ''
            });
          }}
          className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/20 cursor-pointer transition-all text-center group"
        >
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Protein</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 font-display">
            {nutrition.protein.value ?? '—'} <span className="text-sm font-medium">g</span>
          </p>
          <span className="text-xs text-emerald-800 font-medium">{evaluateNutrientLevel('protein', nutrition.protein.value).text}</span>
          <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-center gap-1 group-hover:text-emerald-600">
            <HelpCircle className="w-3 h-3" /> Tap rationale
          </div>
        </div>

        {/* Total Sugar */}
        <div
          onClick={() => {
            setSelectedRationale({
              title: 'Total Sugar',
              value: `${nutrition.totalSugar.value ?? 'Not detected'} g`,
              level: evaluateNutrientLevel('totalSugar', nutrition.totalSugar.value).text,
              rationale: NUTRITION_THRESHOLDS.totalSugar.rationale,
              thresholds: 'Includes both natural sugars (from fruit, dairy, grains) and added refined sugars.'
            });
          }}
          className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/20 cursor-pointer transition-all text-center group"
        >
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Total Sugar</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 font-display">
            {nutrition.totalSugar.value ?? '—'} <span className="text-sm font-medium">g</span>
          </p>
          <span className="text-xs text-stone-500">
            {nutrition.totalSugar.value !== null ? `${nutrition.totalSugar.value} g` : 'Not detected'}
          </span>
          <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-center gap-1 group-hover:text-emerald-600">
            <HelpCircle className="w-3 h-3" /> Tap rationale
          </div>
        </div>

        {/* Added Sugar */}
        <div
          onClick={() => {
            const obs = observations.find(o => o.key === 'addedSugar');
            setSelectedRationale({
              title: 'Added Sugar',
              value: `${nutrition.addedSugar.value ?? 'Not detected'} g`,
              level: obs?.eval.text || 'Standard',
              rationale: obs?.eval.rationale || '',
              thresholds: obs?.targetRef || ''
            });
          }}
          className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/20 cursor-pointer transition-all text-center group"
        >
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Added Sugar</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 font-display">
            {nutrition.addedSugar.value ?? '—'} <span className="text-sm font-medium">g</span>
          </p>
          <span className="text-xs text-amber-800 font-medium">{evaluateNutrientLevel('addedSugar', nutrition.addedSugar.value).text}</span>
          <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-center gap-1 group-hover:text-emerald-600">
            <HelpCircle className="w-3 h-3" /> Tap rationale
          </div>
        </div>

        {/* Fiber */}
        <div
          onClick={() => {
            const obs = observations.find(o => o.key === 'fiber');
            setSelectedRationale({
              title: 'Dietary Fiber',
              value: `${nutrition.fiber.value ?? 'Not detected'} g`,
              level: obs?.eval.text || 'Standard',
              rationale: obs?.eval.rationale || '',
              thresholds: obs?.targetRef || ''
            });
          }}
          className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/20 cursor-pointer transition-all text-center group"
        >
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Dietary Fiber</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 mt-1 font-display">
            {nutrition.fiber.value ?? '—'} <span className="text-sm font-medium">g</span>
          </p>
          <span className="text-xs text-teal-800 font-medium">{evaluateNutrientLevel('fiber', nutrition.fiber.value).text}</span>
          <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-center gap-1 group-hover:text-emerald-600">
            <HelpCircle className="w-3 h-3" /> Tap rationale
          </div>
        </div>

        {/* Sodium */}
        <div
          onClick={() => {
            const obs = observations.find(o => o.key === 'sodium');
            setSelectedRationale({
              title: 'Sodium',
              value: `${nutrition.sodium.value ?? 'Not detected'} mg`,
              level: obs?.eval.text || 'Standard',
              rationale: obs?.eval.rationale || '',
              thresholds: obs?.targetRef || ''
            });
          }}
          className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/20 cursor-pointer transition-all text-center group"
        >
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Sodium</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 font-display">
            {nutrition.sodium.value ?? '—'} <span className="text-sm font-medium">mg</span>
          </p>
          <span className="text-xs text-stone-600 font-medium">{evaluateNutrientLevel('sodium', nutrition.sodium.value).text}</span>
          <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-center gap-1 group-hover:text-emerald-600">
            <HelpCircle className="w-3 h-3" /> Tap rationale
          </div>
        </div>
      </div>

      {/* Neutral Observations Breakdown List */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Neutral Observations (Per Serving)
          </h3>
          <span className="text-xs text-stone-400 italic">Non-medical classification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {observations.map((item) => {
            const isPositive = item.key === 'protein' || item.key === 'fiber';
            const badgeClasses = getLevelBadgeClasses(item.eval.level, isPositive);

            return (
              <div
                key={item.key}
                onClick={() => setSelectedRationale({
                  title: item.label,
                  value: item.val !== null ? `${item.val} ${item.unit}` : 'Not detected',
                  level: item.eval.text,
                  rationale: item.eval.rationale,
                  thresholds: item.targetRef
                })}
                className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 hover:bg-white hover:border-stone-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-700">{item.label}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClasses}`}>
                    {item.eval.text}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-stone-900">
                    {item.val !== null ? `${item.val} ${item.unit}` : 'Not detected'}
                  </span>
                  {item.dailyVal !== null && (
                    <span className="text-[11px] text-stone-500 font-mono">
                      {item.dailyVal}% DV
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Threshold & Rationale Modal */}
      {selectedRationale && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedRationale(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                Nutrient Benchmark
              </span>
              <span className="text-xs font-bold text-emerald-700">
                {selectedRationale.level}
              </span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-display">
              {selectedRationale.title}: {selectedRationale.value}
            </h3>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-stone-600">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <p className="font-semibold text-stone-900 text-xs mb-1">Standard Rationale:</p>
                <p className="leading-relaxed">{selectedRationale.rationale}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
                <p className="font-semibold text-xs mb-1">Official Reference Standard:</p>
                <p className="leading-relaxed text-xs">{selectedRationale.thresholds}</p>
              </div>

              <p className="text-[11px] text-stone-400 italic pt-1">
                Notice: These classifications are educational benchmarks derived from FDA / WHO public population guidelines and do not constitute personal medical recommendations.
              </p>
            </div>

            <button
              onClick={() => setSelectedRationale(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
            >
              Close Rationale
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
