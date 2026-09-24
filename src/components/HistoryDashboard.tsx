import React, { useState } from 'react';
import { Bookmark, Clock, Search, Trash2, ChevronRight, Download, Filter, Sparkles, Scale, Star, AlertTriangle } from 'lucide-react';
import { LabelAnalysisResult } from '../types';
import { calculateProductRating } from '../config/rating';

interface HistoryDashboardProps {
  scans: LabelAnalysisResult[];
  onSelectScan: (scan: LabelAnalysisResult) => void;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  onCompareWith?: (scan: LabelAnalysisResult) => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  scans,
  onSelectScan,
  onDeleteScan,
  onClearHistory,
  onCompareWith
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredScans = scans.filter((item) => {
    const matchesTab = activeTab === 'all' || item.isSaved;
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (item.productName || '').toLowerCase().includes(q) ||
      (item.brand || '').toLowerCase().includes(q) ||
      (item.allergens || []).some(a => (a?.name || '').toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const exportAllAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scans, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `labellens_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            Scan History & Saved Labels
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Access previous food label breakdowns or export your records.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {scans.length > 0 && (
            <button
              onClick={exportAllAsJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
              title="Export all scans to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Records</span>
            </button>
          )}

          {scans.length > 0 && (
            showConfirmClear ? (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2.5 py-1.5 rounded-xl text-xs text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="font-semibold hidden sm:inline">Clear all?</span>
                <button
                  onClick={() => {
                    setShowConfirmClear(false);
                    onClearHistory();
                  }}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors shadow-2xs text-[11px]"
                >
                  Confirm Clear
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold rounded-lg transition-colors text-[11px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                title="Clear all stored scans"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Scans ({scans.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'saved'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saved Favorites ({scans.filter(s => s.isSaved).length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product, brand, or allergen..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Scans List */}
      {filteredScans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200 hover:bg-white hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {scan.imageUrl ? (
                    <img
                      src={scan.imageUrl}
                      alt={scan.productName}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0">
                      SCAN
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors truncate">
                        {scan.productName}
                      </h4>
                      {scan.isSaved && (
                        <Bookmark className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
                      )}

                      {/* Food Rating Pill */}
                      {(() => {
                        const r = calculateProductRating(scan);
                        return (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${r.badgeClass}`}>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            {r.stars.toFixed(1)}
                          </span>
                        );
                      })()}

                      {/* Red Allergen Alert Pill if detected */}
                      {scan.allergens && scan.allergens.length > 0 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-1 shadow-2xs">
                          <AlertTriangle className="w-2.5 h-2.5 text-white" />
                          {scan.allergens.map(a => a.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 truncate">
                      {scan.brand !== 'Not detected' ? scan.brand : 'Brand Not Detected'} • {scan.servingSize}
                    </p>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      {scan.timestamp ? new Date(scan.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteScan(scan.id);
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete scan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Metrics Bar */}
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-3">
                  <span><strong>{scan.nutrition.calories.value ?? '—'}</strong> kcal</span>
                  <span><strong>{scan.nutrition.protein.value ?? '—'}g</strong> protein</span>
                  <span><strong>{scan.nutrition.addedSugar.value ?? '—'}g</strong> sugar</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <Clock className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="text-base font-bold text-stone-700">No label scans found</h4>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            {activeTab === 'saved'
              ? 'You have not marked any scans as favorites yet.'
              : 'Scan food labels or test with demo packaging to build your history.'}
          </p>
        </div>
      )}

    </div>
  );
};
