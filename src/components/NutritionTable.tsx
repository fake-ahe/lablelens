import React, { useState } from 'react';
import { Table, ArrowUpDown, Info, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { NutritionData, NutrientValue, RegionalStandard } from '../types';

interface NutritionTableProps {
  nutrition: NutritionData;
  nutritionPer100g?: Partial<Record<keyof NutritionData, NutrientValue>>;
  servingSize: string;
  servingsPerPackage: number | null;
  regionalStandard: RegionalStandard;
}

export const NutritionTable: React.FC<NutritionTableProps> = ({
  nutrition,
  nutritionPer100g,
  servingSize,
  servingsPerPackage,
  regionalStandard
}) => {
  const [viewMode, setViewMode] = useState<'serving' | '100g'>('serving');
  const [showUnitHelper, setShowUnitHelper] = useState(false);

  const rows: {
    key: keyof NutritionData;
    label: string;
    isIndent?: boolean;
    isBold?: boolean;
    defaultUnit: string;
  }[] = [
    { key: 'calories', label: 'Calories', isBold: true, defaultUnit: 'kcal' },
    { key: 'totalFat', label: 'Total Fat', isBold: true, defaultUnit: 'g' },
    { key: 'saturatedFat', label: 'Saturated Fat', isIndent: true, defaultUnit: 'g' },
    { key: 'transFat', label: 'Trans Fat', isIndent: true, defaultUnit: 'g' },
    { key: 'cholesterol', label: 'Cholesterol', isBold: true, defaultUnit: 'mg' },
    { key: 'sodium', label: 'Sodium', isBold: true, defaultUnit: 'mg' },
    { key: 'carbohydrates', label: 'Total Carbohydrates', isBold: true, defaultUnit: 'g' },
    { key: 'fiber', label: 'Dietary Fiber', isIndent: true, defaultUnit: 'g' },
    { key: 'totalSugar', label: 'Total Sugars', isIndent: true, defaultUnit: 'g' },
    { key: 'addedSugar', label: 'Includes Added Sugars', isIndent: true, defaultUnit: 'g' },
    { key: 'protein', label: 'Protein', isBold: true, defaultUnit: 'g' },
  ];

  const has100gData = Boolean(nutritionPer100g && Object.keys(nutritionPer100g).length > 0);

  const renderValue = (item: NutrientValue | undefined, defaultUnit: string) => {
    if (!item || item.value === null || item.value === undefined) {
      return (
        <span className="text-stone-400 italic text-xs">
          Not detected
        </span>
      );
    }
    return (
      <span className="font-semibold text-stone-900">
        {item.value} {item.unit || defaultUnit}
      </span>
    );
  };

  const renderDV = (item: NutrientValue | undefined) => {
    if (!item || item.dailyValuePercent === null || item.dailyValuePercent === undefined) {
      return <span className="text-stone-300">—</span>;
    }
    return (
      <span className="font-bold text-stone-900 font-mono">
        {item.dailyValuePercent}%
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-5">
      
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-600" />
            Standardized Nutrition Facts
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Normalized into consistent units across regional label systems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between Per Serving and Per 100g */}
          <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('serving')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'serving'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Per Serving
            </button>
            <button
              onClick={() => setViewMode('100g')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === '100g'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Per 100 g / ml
            </button>
          </div>

          <button
            onClick={() => setShowUnitHelper(!showUnitHelper)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200/70 text-stone-600 border border-stone-200"
            title="Unit normalization formulas"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Serving Size Bar */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div>
          <span className="text-stone-500 font-medium">Serving Size: </span>
          <span className="font-bold text-stone-900">{servingSize}</span>
        </div>
        <div>
          <span className="text-stone-500 font-medium">Servings Per Package: </span>
          <span className="font-bold text-stone-900">
            {servingsPerPackage !== null ? servingsPerPackage : 'Not specified'}
          </span>
        </div>
        <div className="text-stone-400 text-xs">
          Viewing: <span className="font-semibold text-emerald-700">{viewMode === 'serving' ? 'Per Serving' : 'Per 100g / 100ml'}</span>
        </div>
      </div>

      {/* Unit Helper Banner */}
      {showUnitHelper && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-700" />
            Automatic Unit Normalization Rules:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-emerald-900">
            <li><strong>Salt to Sodium:</strong> Sodium (mg) = Salt (g) × 400 (for EU and Indian labels declaring Salt).</li>
            <li><strong>Energy:</strong> 1 kcal ≈ 4.184 kJ (Kilojoules converted to standard Kilocalories).</li>
            <li><strong>Weight:</strong> 1,000 mg = 1 g; 1,000 mcg = 1 mg.</li>
            <li><strong>Daily Values (% DV):</strong> Based on standard US FDA 2,000 kcal daily adult intake.</li>
          </ul>
        </div>
      )}

      {/* Standardized Nutrition Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-stone-900 text-xs font-bold text-stone-900 uppercase tracking-wider">
              <th className="py-2.5 px-3">Nutrient</th>
              <th className="py-2.5 px-3 text-right">
                {viewMode === 'serving' ? 'Amount Per Serving' : 'Amount Per 100g'}
              </th>
              <th className="py-2.5 px-3 text-right">% Daily Value*</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
            {rows.map((row) => {
              const servingNutrient = nutrition[row.key] as NutrientValue;
              const per100gNutrient = nutritionPer100g ? (nutritionPer100g[row.key] as NutrientValue) : undefined;
              const activeNutrient = viewMode === 'serving' ? servingNutrient : (per100gNutrient || servingNutrient);

              return (
                <tr
                  key={row.key}
                  className={`hover:bg-stone-50/80 transition-colors ${
                    row.isBold ? 'font-semibold text-stone-900' : 'text-stone-700'
                  }`}
                >
                  <td className={`py-2 px-3 ${row.isIndent ? 'pl-7 text-stone-600' : ''}`}>
                    {row.label}
                    {activeNutrient?.originalText && activeNutrient.originalText !== 'Not detected' && (
                      <span className="text-[10px] text-stone-400 block font-normal">
                        Original on label: {activeNutrient.originalText}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {renderValue(activeNutrient, row.defaultUnit)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {renderDV(activeNutrient)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vitamins & Minerals Section */}
      {nutrition.vitaminsMinerals && nutrition.vitaminsMinerals.length > 0 && (
        <div className="pt-3 border-t border-stone-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Vitamins & Minerals Detected
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {nutrition.vitaminsMinerals.map((vm, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                <span className="font-medium text-stone-700">{vm.name}</span>
                <span className="font-bold text-stone-900 font-mono">
                  {vm.amount} {vm.dailyValuePercent !== null ? `(${vm.dailyValuePercent}% DV)` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FDA Footnote */}
      <p className="text-[11px] text-stone-400 italic pt-1">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice. Missing fields are displayed as "Not detected" rather than estimated.
      </p>

    </div>
  );
};
