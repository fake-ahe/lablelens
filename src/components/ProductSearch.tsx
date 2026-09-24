import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  X, 
  Loader2, 
  Globe, 
  ArrowRight, 
  ShieldAlert, 
  AlertTriangle,
  CheckCircle2, 
  CheckCheck, 
  FileCode2,
  History,
  TrendingUp,
  Trash2,
  CornerDownLeft,
  Scan
} from 'lucide-react';
import { SEARCHABLE_PRODUCTS } from '../data/searchableProducts';
import { LabelAnalysisResult } from '../types';
import { updatePageSEO } from '../utils/seo';
import { checkIsNonEdible } from '../utils/foodValidator';
import {
  AutocompleteItem,
  buildInstantAutocomplete,
  fetchGoogleSearchSuggestions,
  getRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearRecentSearches
} from '../utils/autocompleteEngine';

interface ProductSearchProps {
  onSelectProduct: (product: LabelAnalysisResult) => void;
  onCustomSearchSubmit?: (query: string) => void;
  compact?: boolean;
  initialQuery?: string;
}

const POPULAR_SEARCHES = [
  'Oreo Cookies',
  "Cheetos Flamin' Hot",
  'Doritos Nacho',
  'Monster Energy',
  'Chobani Greek Yogurt',
  'Nutella Hazelnut',
  'Snickers Bar',
  'Pringles Original'
];

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSelectProduct,
  onCustomSearchSubmit,
  compact = false,
  initialQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autoCorrectNotice, setAutoCorrectNotice] = useState<string | null>(null);
  const [googleSuggestions, setGoogleSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [nonEdibleNotice, setNonEdibleNotice] = useState<{ query: string; reason: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Sync initial query if updated externally
  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Debounced Google Suggestion fetch
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setGoogleSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const suggestions = await fetchGoogleSearchSuggestions(trimmed);
      setGoogleSuggestions(suggestions);
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute live autocomplete results
  const autocomplete = useMemo(() => {
    return buildInstantAutocomplete(searchQuery, googleSuggestions, recentSearches);
  }, [searchQuery, googleSuggestions, recentSearches]);

  // Reset selected keyboard index when items change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [autocomplete.items]);

  // Click outside listener to close autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCustomAISearch = async (queryToSearch: string) => {
    const trimmed = queryToSearch.trim();
    if (!trimmed) return;
    setShowAutocomplete(false);
    setNonEdibleNotice(null);

    // Immediate client-side edibility check for instant feedback
    const nonEdibleCheck = checkIsNonEdible(trimmed);
    if (nonEdibleCheck.isNonEdible) {
      setNonEdibleNotice({
        query: trimmed,
        reason: nonEdibleCheck.reason || `"${trimmed}" is classified as a non-edible item. Food Decode is strictly engineered to search and analyze edible foods, snacks, and beverages.`
      });
      return;
    }

    // Save to recent search history
    saveRecentSearch(trimmed);
    setRecentSearches(getRecentSearches());

    // If there's an active high-confidence spelling pre-detection, automatically use the corrected spelling
    let finalQuery = trimmed;
    if (autocomplete.matchedSpelling && autocomplete.matchedSpelling.confidence === 'high' && autocomplete.matchedSpelling.suggested.toLowerCase() !== trimmed.toLowerCase()) {
      finalQuery = autocomplete.matchedSpelling.suggested;
      setAutoCorrectNotice(`Auto-corrected spelling from "${trimmed}" to "${finalQuery}"`);
      setSearchQuery(finalQuery);
      saveRecentSearch(finalQuery);
      setRecentSearches(getRecentSearches());
      setTimeout(() => setAutoCorrectNotice(null), 4000);
    }

    // Update SEO dynamically for this search term
    updatePageSEO({
      title: `Search: ${finalQuery} Nutrition & Ingredients`,
      description: `Explore nutrition facts, harmful additives, allergen alerts, and health impact for ${finalQuery} on Food Decode. Prefer scan over search term for full packaging analysis.`,
      searchQuery: finalQuery,
      keywords: [finalQuery, `${finalQuery} ingredients`, `${finalQuery} nutrition facts`, `${finalQuery} calories`, `${finalQuery} additives`]
    });

    // Sync URL parameter so the search is shareable and indexed by web crawlers
    if (typeof window !== 'undefined') {
      const searchUrl = `${window.location.pathname}?q=${encodeURIComponent(finalQuery)}`;
      window.history.replaceState({ path: searchUrl }, '', searchUrl);
    }

    // Check if it matches an existing product in the library first
    const qLower = (finalQuery || '').toLowerCase();
    const existing = SEARCHABLE_PRODUCTS.find(p => 
      (p?.name || '').toLowerCase().includes(qLower) ||
      (p?.brand || '').toLowerCase().includes(qLower) ||
      qLower.includes((p?.name || '').toLowerCase())
    );

    if (existing) {
      onSelectProduct(existing.productData);
      return;
    }

    // Call server AI endpoint or trigger custom submit
    setIsSearchingAI(true);
    try {
      const response = await fetch('/api/search-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery })
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.status === 422 || responseData?.isNonEdible) {
        setNonEdibleNotice({
          query: finalQuery,
          reason: responseData.error || responseData.reason || `"${finalQuery}" is a non-edible item (like electronics, plastic, hardware, or household product). Food Decode only searches edible food products.`
        });
        return;
      }

      if (response.ok) {
        onSelectProduct(responseData);
      } else {
        // Double check query is not non-edible before any fallback
        const nonEdible = checkIsNonEdible(finalQuery);
        if (nonEdible.isNonEdible) {
          setNonEdibleNotice({
            query: finalQuery,
            reason: nonEdible.reason || `"${finalQuery}" is a non-edible item. Food Decode only searches edible food and beverage products.`
          });
          return;
        }

        const fallback = SEARCHABLE_PRODUCTS.find(p => p.name.toLowerCase().includes(finalQuery.toLowerCase())) || SEARCHABLE_PRODUCTS[0];
        onSelectProduct({
          ...fallback.productData,
          productName: finalQuery,
          brand: 'Packaged Food Search'
        });
      }
    } catch (err) {
      console.warn('AI search notice:', err);
      const nonEdible = checkIsNonEdible(finalQuery);
      if (nonEdible.isNonEdible) {
        setNonEdibleNotice({
          query: finalQuery,
          reason: nonEdible.reason || `"${finalQuery}" is classified as a non-edible item.`
        });
        return;
      }
      if (onCustomSearchSubmit) {
        onCustomSearchSubmit(finalQuery);
      }
    } finally {
      setIsSearchingAI(false);
    }
  };

  const selectAutocompleteItem = (item: AutocompleteItem) => {
    const nonEdible = checkIsNonEdible(item.query || item.displayText);
    if (nonEdible.isNonEdible) {
      setShowAutocomplete(false);
      setNonEdibleNotice({
        query: item.query || item.displayText,
        reason: nonEdible.reason || `"${item.displayText}" is classified as a non-edible item. Food Decode only analyzes edible food and beverage products.`
      });
      return;
    }

    if (item.matchedProduct) {
      setShowAutocomplete(false);
      saveRecentSearch(item.displayText);
      setRecentSearches(getRecentSearches());
      onSelectProduct(item.matchedProduct.productData);
    } else {
      setSearchQuery(item.query);
      handleCustomAISearch(item.query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setShowAutocomplete(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < autocomplete.items.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : autocomplete.items.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < autocomplete.items.length) {
        selectAutocompleteItem(autocomplete.items[selectedIndex]);
      } else if (searchQuery.trim()) {
        handleCustomAISearch(searchQuery);
      }
    } else if ((e.key === 'Tab' || e.key === 'ArrowRight') && autocomplete.ghostSuffix) {
      // Check if cursor is at the end of input
      const input = inputRef.current;
      if (input && input.selectionStart === searchQuery.length) {
        e.preventDefault();
        const completed = searchQuery + autocomplete.ghostSuffix;
        setSearchQuery(completed);
      }
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = removeRecentSearch(item);
    setRecentSearches(updated);
  };

  return (
    <section 
      id="product-search-container"
      ref={containerRef}
      aria-labelledby="product-search-heading"
      className={`bg-white rounded-3xl border border-stone-200/90 shadow-md ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
      } space-y-4 transition-all relative`}
    >
      {/* Header with SEO & Schema.org Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Live Google Search Grounded
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 text-xs font-bold border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Smart Autocomplete Active
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200" title="Schema.org SearchAction and Product metadata enabled">
              <FileCode2 className="w-3 h-3 text-emerald-600" />
              SEO Indexed
            </div>
          </div>
          <h2 id="product-search-heading" className="text-xl sm:text-2xl font-black text-stone-900 font-display">
            Search Packaged Food with Google Search
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
            Instant Google autocomplete as you type, with inline tab completion, spelling pre-detection, and live nutritional indexing for any food item.
          </p>
        </div>
      </div>

      {/* Pro Advisory: Prefer Scan Over Search Term */}
      <div className="p-3 sm:px-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200/90 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Scan className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-emerald-900">Prefer Scan Over Search Term: </span>
            <span className="text-emerald-800">
              For complete certainty, camera scanning reads the physical batch label, exact ingredient order, and local allergen warnings on your package.
            </span>
          </div>
        </div>
      </div>

      {/* Auto-correction confirmation toast/banner if applied */}
      {autoCorrectNotice && (
        <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{autoCorrectNotice}</span>
        </div>
      )}

      {/* Non-edible rejection banner */}
      {nonEdibleNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs space-y-1.5 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Edible Food & Beverage Search Only</span>
            </div>
            <button
              type="button"
              onClick={() => setNonEdibleNotice(null)}
              className="text-amber-700 hover:text-amber-900 p-0.5 rounded-lg hover:bg-amber-100/60 transition-colors"
              title="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-amber-800 leading-relaxed">
            {nonEdibleNotice.reason}
          </p>
          <div className="pt-1 text-[11px] text-amber-700 font-medium">
            💡 Food Decode is designed exclusively for packaged foods, groceries, and drinks. Prefer scan over search term when you have the item on hand. Try searching for items like <span className="font-semibold underline cursor-pointer" onClick={() => { setSearchQuery('Oreo Cookies'); handleCustomAISearch('Oreo Cookies'); }}>Oreo</span>, <span className="font-semibold underline cursor-pointer" onClick={() => { setSearchQuery('Doritos Nacho Cheese'); handleCustomAISearch('Doritos Nacho Cheese'); }}>Doritos</span>, or <span className="font-semibold underline cursor-pointer" onClick={() => { setSearchQuery('Greek Yogurt'); handleCustomAISearch('Greek Yogurt'); }}>Greek Yogurt</span>.
          </div>
        </div>
      )}

      {/* Semantic Search Form with Autocomplete */}
      <form 
        role="search"
        aria-label="Google Food Search Engine"
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) {
            handleCustomAISearch(searchQuery);
          }
        }}
        className="space-y-3 relative"
      >
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            {/* Magnifying Glass Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 z-10">
              <Search className="w-5 h-5 text-blue-600" />
            </div>

            {/* Input with inline Ghost completion overlay */}
            <div className="relative w-full">
              <input
                ref={inputRef}
                id="product-search-input"
                type="text"
                name="q"
                value={searchQuery}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                aria-label="Search packaged food by brand or product name"
                aria-autocomplete="list"
                aria-controls="google-search-autocomplete-list"
                onFocus={() => setShowAutocomplete(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search any packaged food (e.g. 'oreo', 'doritos', 'cheetos', 'monster energy')..."
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-stone-50 border-2 border-stone-200 text-stone-900 placeholder-stone-400 text-sm sm:text-base font-medium focus:bg-white focus:border-blue-600 focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner relative z-10"
              />

              {/* Ghost Completion Preview Behind User Text */}
              {autocomplete.ghostSuffix && searchQuery && (
                <div 
                  aria-hidden="true" 
                  className="absolute inset-0 pl-12 pr-28 py-3.5 text-sm sm:text-base font-medium pointer-events-none flex items-center overflow-hidden z-5"
                >
                  <span className="opacity-0 whitespace-pre">{searchQuery}</span>
                  <span className="text-stone-400/80 whitespace-pre select-none font-normal">
                    {autocomplete.ghostSuffix}
                  </span>
                </div>
              )}
            </div>

            {/* Right-side Input Controls: Tab hint and Clear Button */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5 z-20">
              {autocomplete.ghostSuffix && searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery(searchQuery + autocomplete.ghostSuffix)}
                  className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-200/70 hover:bg-blue-100 hover:text-blue-800 text-stone-600 text-[10px] font-bold transition-colors cursor-pointer"
                  title="Press Tab to complete suggestion"
                >
                  <span>Tab ⇥</span>
                </button>
              )}

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowAutocomplete(false);
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <button
            id="product-search-google-btn"
            type="submit"
            disabled={isSearchingAI}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 active:scale-98 transition-all shrink-0 disabled:opacity-50 cursor-pointer"
            title="Search packaging and nutritional data via Google Search"
          >
            {isSearchingAI ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching Google...</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 text-blue-200" />
                <span>Search Google</span>
              </>
            )}
          </button>
        </div>

        {/* Live Auto Pre-Detected Spelling Pill */}
        {autocomplete.matchedSpelling && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs sm:text-sm animate-fadeIn shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-amber-200/80 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              </div>
              <div className="truncate">
                <span className="text-amber-800 text-xs font-semibold mr-1">Spelling pre-detection:</span>
                <span className="text-stone-700">Did you mean </span>
                <strong className="text-amber-950 font-black underline decoration-amber-400 decoration-2">
                  &quot;{autocomplete.matchedSpelling.suggested}&quot;
                </strong>
                <span className="text-stone-500 text-[11px] ml-1 hidden sm:inline">(Press Tab to auto-fill)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(autocomplete.matchedSpelling!.suggested);
                  setShowAutocomplete(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors"
                title="Replace input with corrected product spelling"
              >
                Auto-Correct
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(autocomplete.matchedSpelling!.suggested);
                  handleCustomAISearch(autocomplete.matchedSpelling!.suggested);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors"
                title="Search using corrected spelling immediately"
              >
                <span>Correct & Search</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Google Autocomplete System Dropdown */}
        {showAutocomplete && autocomplete.items.length > 0 && (
          <div 
            id="google-search-autocomplete-list"
            role="listbox"
            className="absolute top-full left-0 right-0 sm:right-44 mt-1.5 z-40 bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden divide-y divide-stone-100 animate-fadeIn"
          >
            {/* Empty input state: Recent searches header */}
            {!searchQuery.trim() && recentSearches.length > 0 && (
              <div className="px-4 py-2 bg-stone-50 flex items-center justify-between text-xs font-bold text-stone-500">
                <div className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-stone-400" />
                  <span>Recent Searches</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-[11px] text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            )}

            {/* Suggestions List Items */}
            <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
              {autocomplete.items.map((item, idx) => {
                const isSelected = selectedIndex === idx;

                if (item.type === 'product_match' && item.matchedProduct) {
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectAutocompleteItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`px-4 py-3 flex items-center justify-between transition-colors cursor-pointer group ${
                        isSelected ? 'bg-blue-50/80' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {item.brand?.slice(0, 2).toUpperCase() || 'FD'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-blue-700 truncate">
                              {item.displayText}
                            </span>
                            <span className="text-[10px] text-stone-400 truncate">({item.brand})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.hasHarmfulAdditives ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                                <ShieldAlert className="w-3 h-3" />
                                Harmful Additives Flagged
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                                <CheckCircle2 className="w-3 h-3" />
                                Clean Formulation
                              </span>
                            )}
                            <span className="text-[10px] text-stone-400">• {item.calories} kcal</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors">
                          Instant View
                        </span>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  );
                }

                // Query suggestions (Google Query, Recent Search, or Trending)
                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectAutocompleteItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-4 py-2.5 flex items-center justify-between transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/80' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      {item.type === 'recent_search' ? (
                        <History className="w-4 h-4 text-stone-400 shrink-0" />
                      ) : item.type === 'trending' ? (
                        <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />
                      ) : (
                        <Search className="w-4 h-4 text-blue-600 shrink-0" />
                      )}

                      <div className="truncate text-xs sm:text-sm text-stone-800 group-hover:text-blue-700">
                        <span className="font-semibold">{item.displayText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.type === 'recent_search' ? (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveHistoryItem(e, item.query)}
                          className="p-1 text-stone-300 hover:text-stone-600 transition-colors"
                          title="Remove from history"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-stone-400 hidden sm:inline">
                            {item.subText || 'Google Search'}
                          </span>
                          <CornerDownLeft className="w-3.5 h-3.5 text-stone-300 group-hover:text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Keyboard shortcut guide footer */}
            <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <div className="flex items-center gap-3">
                <span>Use <strong className="text-stone-600 font-semibold">↑↓</strong> to navigate</span>
                <span><strong className="text-stone-600 font-semibold">↵</strong> to select</span>
                {autocomplete.ghostSuffix && (
                  <span><strong className="text-stone-600 font-semibold">Tab</strong> to complete</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAutocomplete(false)}
                className="hover:text-stone-600 transition-colors cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        )}

        {/* Popular searches with crawlable anchor links for Search Engine SEO Indexing */}
        <nav aria-label="Popular Product Searches" className="flex items-center gap-1.5 text-xs text-stone-500 flex-wrap pt-1">
          <span className="font-bold text-stone-400 text-xs">Popular searches:</span>
          {POPULAR_SEARCHES.map((item) => (
            <a
              key={item}
              href={`/?q=${encodeURIComponent(item)}`}
              onClick={(e) => {
                e.preventDefault();
                setSearchQuery(item);
                handleCustomAISearch(item);
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-blue-50 hover:text-blue-800 text-stone-600 text-xs font-semibold border border-stone-200/70 transition-colors cursor-pointer"
            >
              {item}
            </a>
          ))}
        </nav>
      </form>

      {/* Live AI Search Notice Banner */}
      {isSearchingAI && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-blue-900 animate-pulse">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
          <div className="text-xs">
            <span className="font-black block text-blue-950">Grounding with Real-time Google Search Data</span>
            <span className="text-blue-800">
              Retrieving live manufacturer nutrition panels, ingredients, allergens, and harmful additives for &quot;{searchQuery}&quot;...
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

