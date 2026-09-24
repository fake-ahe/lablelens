import React, { useState } from 'react';
import { Layers, Search, Filter, HelpCircle, ChevronRight, AlertTriangle, AlertCircle } from 'lucide-react';
import { IngredientItem, IngredientCategory, AllergenDetection } from '../types';
import { IngredientModal } from './IngredientModal';

interface IngredientListProps {
  ingredients: IngredientItem[];
  allergens?: AllergenDetection[];
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients, allergens = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeIngredient, setActiveIngredient] = useState<IngredientItem | null>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(ingredients.map(i => i.category)))];

  // Helper to check if ingredient is an allergen
  const isAllergicIngredient = (item: IngredientItem) => {
    if (item.isAllergen) return true;
    const lowerName = (item?.name || '').toLowerCase();
    return (allergens || []).some(a => {
      const lowerAllergen = (a?.name || '').toLowerCase();
      if (!lowerAllergen) return false;
      return lowerName.includes(lowerAllergen) ||
             (lowerAllergen === 'milk' && (lowerName.includes('dairy') || lowerName.includes('whey') || lowerName.includes('casein') || lowerName.includes('butter') || lowerName.includes('cream'))) ||
             (lowerAllergen === 'wheat' && (lowerName.includes('flour') || lowerName.includes('gluten'))) ||
             (lowerAllergen === 'soy' && lowerName.includes('soybean'));
    });
  };

  const q = (searchQuery || '').toLowerCase();
  const filteredIngredients = ingredients.filter(item => {
    if (!item) return false;
    const matchesSearch = (item.name || '').toLowerCase().includes(q) ||
                          (item.purpose || '').toLowerCase().includes(q) ||
                          (item.category || '').toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeColor = (cat: IngredientCategory) => {
    switch (cat) {
      case 'Grain': return 'bg-amber-100/70 text-amber-800 border-amber-200';
      case 'Sweetener': return 'bg-orange-100/70 text-orange-800 border-orange-200';
      case 'Oil/Fat': return 'bg-yellow-100/70 text-yellow-800 border-yellow-200';
      case 'Protein': return 'bg-emerald-100/70 text-emerald-800 border-emerald-200';
      case 'Emulsifier': return 'bg-teal-100/70 text-teal-800 border-teal-200';
      case 'Preservative': return 'bg-purple-100/70 text-purple-800 border-purple-200';
      case 'Flavoring': return 'bg-rose-100/70 text-rose-800 border-rose-200';
      case 'Acid': return 'bg-lime-100/70 text-lime-800 border-lime-200';
      case 'Mineral':
      case 'Vitamin': return 'bg-blue-100/70 text-blue-800 border-blue-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Ingredient Breakdown
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              {ingredients.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Listed in descending order by weight. Components containing allergens are highlighted in <span className="text-red-600 font-bold">RED</span>.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-stone-400 mr-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Numbered Ingredient Grid */}
      {filteredIngredients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredIngredients.map((ing) => {
            const hasAllergy = isAllergicIngredient(ing);

            return (
              <div
                key={ing.id || ing.order}
                onClick={() => setActiveIngredient(ing)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                  hasAllergy
                    ? 'bg-red-50/90 border-2 border-red-500 hover:border-red-600 shadow-xs ring-2 ring-red-500/10'
                    : 'bg-stone-50/70 border-stone-200/80 hover:bg-white hover:border-emerald-400 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      hasAllergy
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {ing.order}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm font-bold truncate transition-colors ${
                          hasAllergy
                            ? 'text-red-950 font-black'
                            : 'text-stone-900 group-hover:text-emerald-800'
                        }`}
                      >
                        {ing.name}
                      </h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${getCategoryBadgeColor(ing.category)}`}>
                        {ing.category}
                      </span>
                      
                      {/* Bold Red Allergen Flag */}
                      {hasAllergy && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-600 text-white border border-red-700 shadow-2xs flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-3 h-3 text-white" />
                          ALLERGEN
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 line-clamp-1 ${hasAllergy ? 'text-red-900 font-medium' : 'text-stone-500'}`}>
                      {ing.purpose}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 mt-1.5 transition-transform group-hover:translate-x-0.5 ${
                    hasAllergy ? 'text-red-500' : 'text-stone-400 group-hover:text-emerald-600'
                  }`}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-stone-400 text-xs bg-stone-50 rounded-2xl border border-stone-200">
          No ingredients matched your filter.
        </div>
      )}

      {/* Ingredient Detail Modal */}
      <IngredientModal
        ingredient={activeIngredient}
        onClose={() => setActiveIngredient(null)}
      />

    </div>
  );
};
