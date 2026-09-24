import React, { useState } from 'react';
import { Scale, ArrowLeftRight, Check, AlertCircle, X, ChevronRight, Sparkles, Star, AlertTriangle } from 'lucide-react';
import { LabelAnalysisResult } from '../types';
import { calculateProductRating } from '../config/rating';

interface ProductComparisonProps {
  currentProduct: LabelAnalysisResult;
  allScans: LabelAnalysisResult[];
  onClose: () => void;
  onSelectProductA?: (p: LabelAnalysisResult) => void;
  onSelectProductB?: (p: LabelAnalysisResult) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  currentProduct,
  allScans,
  onClose
}) => {
  // Product A defaults to currentProduct, Product B to another scan or demo
  const [productA, setProductA] = useState<LabelAnalysisResult>(currentProduct);
  const otherOptions = allScans.filter(s => s.id !== productA.id);
  const [productB, setProductB] = useState<LabelAnalysisResult>(
    otherOptions[0] || currentProduct
  );

  const ratingA = calculateProductRating(productA);
  const ratingB = calculateProductRating(productB);

  const formatVal = (val: number | null | undefined, unit: string) => {
    if (val === null || val === undefined) return 'Not detected';
    return `${val} ${unit}`;
  };

  // Compare key metrics
  const comparisonRows = [
    {
      label: 'Food Rating',
      valA: `★ ${ratingA.stars.toFixed(1)} / 5.0 (${ratingA.label})`,
      valB: `★ ${ratingB.stars.toFixed(1)} / 5.0 (${ratingB.label})`,
      isRating: true
    },
    { label: 'Serving Size', valA: productA.servingSize, valB: productB.servingSize },
    {
      label: 'Calories',
      valA: formatVal(productA.nutrition.calories.value, 'kcal'),
      valB: formatVal(productB.nutrition.calories.value, 'kcal'),
    },
    {
      label: 'Protein',
      valA: formatVal(productA.nutrition.protein.value, 'g'),
      valB: formatVal(productB.nutrition.protein.value, 'g'),
    },
    {
      label: 'Dietary Fiber',
      valA: formatVal(productA.nutrition.fiber.value, 'g'),
      valB: formatVal(productB.nutrition.fiber.value, 'g'),
    },
    {
      label: 'Total Sugar',
      valA: formatVal(productA.nutrition.totalSugar.value, 'g'),
      valB: formatVal(productB.nutrition.totalSugar.value, 'g'),
    },
    {
      label: 'Added Sugar',
      valA: formatVal(productA.nutrition.addedSugar.value, 'g'),
      valB: formatVal(productB.nutrition.addedSugar.value, 'g'),
    },
    {
      label: 'Sodium',
      valA: formatVal(productA.nutrition.sodium.value, 'mg'),
      valB: formatVal(productB.nutrition.sodium.value, 'mg'),
    },
    {
      label: 'Saturated Fat',
      valA: formatVal(productA.nutrition.saturatedFat.value, 'g'),
      valB: formatVal(productB.nutrition.saturatedFat.value, 'g'),
    },
    {
      label: 'Total Ingredients',
      valA: `${productA.ingredients.length} items`,
      valB: `${productB.ingredients.length} items`,
    },
    {
      label: 'Certified Additives',
      valA: `${productA.additives.length} detected`,
      valB: `${productB.additives.length} detected`,
    },
    {
      label: 'Allergens Flagged',
      valA: productA.allergens.map(a => a.name).join(', ') || 'None detected',
      valB: productB.allergens.map(a => a.name).join(', ') || 'None detected',
      isAllergen: true,
      hasAllergenA: productA.allergens.length > 0,
      hasAllergenB: productB.allergens.length > 0
    }
  ];

  // Derive factual key differences (no "winner", strictly factual)
  const getKeyDifferences = () => {
    const diffs: string[] = [];
    const pA = productA.nutrition;
    const pB = productB.nutrition;

    // Protein diff
    if (pA.protein.value !== null && pB.protein.value !== null) {
      const diff = Math.round((pA.protein.value - pB.protein.value) * 10) / 10;
      if (Math.abs(diff) >= 2) {
        diffs.push(
          diff > 0
            ? `${productA.productName} has ${diff}g more protein per serving than ${productB.productName}.`
            : `${productB.productName} provides ${Math.abs(diff)}g more protein per serving than ${productA.productName}.`
        );
      }
    }

    // Fiber diff
    if (pA.fiber.value !== null && pB.fiber.value !== null) {
      const diff = Math.round((pA.fiber.value - pB.fiber.value) * 10) / 10;
      if (Math.abs(diff) >= 2) {
        diffs.push(
          diff > 0
            ? `${productA.productName} contains ${diff}g more dietary fiber.`
            : `${productB.productName} contains ${Math.abs(diff)}g more dietary fiber.`
        );
      }
    }

    // Sugar diff
    if (pA.addedSugar.value !== null && pB.addedSugar.value !== null) {
      const diff = Math.round((pA.addedSugar.value - pB.addedSugar.value) * 10) / 10;
      if (Math.abs(diff) >= 2) {
        diffs.push(
          diff > 0
            ? `${productA.productName} contains ${diff}g more added sugar per serving.`
            : `${productB.productName} contains ${Math.abs(diff)}g more added sugar per serving.`
        );
      }
    }

    // Sodium diff
    if (pA.sodium.value !== null && pB.sodium.value !== null) {
      const diff = Math.round(pA.sodium.value - pB.sodium.value);
      if (Math.abs(diff) >= 100) {
        diffs.push(
          diff > 0
            ? `${productA.productName} has ${diff}mg higher sodium content.`
            : `${productB.productName} has ${Math.abs(diff)}mg higher sodium content.`
        );
      }
    }

    // Allergens diff
    const aAllergens = productA.allergens.map(a => a.name);
    const bAllergens = productB.allergens.map(a => a.name);
    if (aAllergens.join(',') !== bAllergens.join(',')) {
      diffs.push(
        `Allergen contrast: ${productA.productName} flags (${aAllergens.join(', ') || 'none'}), whereas ${productB.productName} flags (${bAllergens.join(', ') || 'none'}).`
      );
    }

    if (diffs.length === 0) {
      diffs.push('Both products have very comparable nutritional density and macro profiles.');
    }

    return diffs;
  };

  const keyDifferences = getKeyDifferences();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
              <Scale className="w-6 h-6 text-indigo-600" />
              Product Comparison
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Side-by-side factual matrix. We do not pick a winner; choose based on your personal dietary priorities.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5">
          {/* Product A Selector */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Product A
            </span>
            <select
              value={productA.id}
              onChange={(e) => {
                const found = allScans.find(s => s.id === e.target.value);
                if (found) setProductA(found);
              }}
              className="w-full text-sm font-bold text-stone-900 bg-white border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {allScans.map(s => (
                <option key={s.id} value={s.id}>
                  {s.productName} ({s.brand})
                </option>
              ))}
            </select>
          </div>

          {/* Product B Selector */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Product B
            </span>
            <select
              value={productB.id}
              onChange={(e) => {
                const found = allScans.find(s => s.id === e.target.value);
                if (found) setProductB(found);
              }}
              className="w-full text-sm font-bold text-stone-900 bg-white border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {allScans.map(s => (
                <option key={s.id} value={s.id}>
                  {s.productName} ({s.brand})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Differences Box (Section 11 requirement) */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs sm:text-sm text-indigo-950 space-y-2 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Key Differences
          </h3>
          <ul className="space-y-1">
            {keyDifferences.map((diff, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{diff}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto border border-stone-200 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 text-xs font-bold text-stone-900 uppercase">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4 w-5/12 text-emerald-800">{productA.productName}</th>
                <th className="py-3 px-4 w-5/12 text-indigo-800">{productB.productName}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className={`hover:bg-stone-50/70 transition-colors ${row.isRating ? 'bg-amber-50/40 font-bold' : ''}`}>
                  <td className="py-2.5 px-4 font-medium text-stone-600 flex items-center gap-1.5">
                    {row.isRating && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />}
                    {row.isAllergen && (row.hasAllergenA || row.hasAllergenB) && (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    )}
                    {row.label}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-stone-900">
                    {row.isAllergen && row.hasAllergenA ? (
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-red-100 text-red-900 border border-red-300 text-xs font-black">
                        ⚠ {row.valA}
                      </span>
                    ) : (
                      row.valA
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-stone-900">
                    {row.isAllergen && row.hasAllergenB ? (
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-red-100 text-red-900 border border-red-300 text-xs font-black">
                        ⚠ {row.valB}
                      </span>
                    ) : (
                      row.valB
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
