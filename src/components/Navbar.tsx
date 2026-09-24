import React from 'react';
import { Sparkles, Scan, History, Scale, BookOpen } from 'lucide-react';
import { LabelAnalysisResult } from '../types';

interface NavbarProps {
  onScanClick: () => void;
  onDemoClick: () => void;
  onHistoryClick: () => void;
  onCompareClick: () => void;
  onHomeClick: () => void;
  historyCount: number;
  currentProduct: LabelAnalysisResult | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScanClick,
  onDemoClick,
  onHistoryClick,
  onCompareClick,
  onHomeClick,
  historyCount,
  currentProduct
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          id="nav-brand-logo"
          onClick={onHomeClick}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/40 group-hover:scale-105 transition-transform">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
              LabelLens
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AI OCR
              </span>
            </span>
            <p className="text-xs text-stone-400 -mt-0.5 hidden sm:block">Food Label Nutrition Decoded</p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-try-demo-btn"
            onClick={onDemoClick}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Try Demo
          </button>

          <button
            id="nav-compare-btn"
            onClick={onCompareClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-stone-300 bg-stone-800/80 border border-stone-700/80 hover:bg-stone-700/80 transition-colors"
            title="Compare two food labels"
          >
            <Scale className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          <button
            id="nav-history-btn"
            onClick={onHistoryClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-stone-300 bg-stone-800/80 border border-stone-700/80 hover:bg-stone-700/80 transition-colors relative"
            title="View scanned label history"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="nav-scan-cta-btn"
            onClick={onScanClick}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm hover:shadow-emerald-400/20 active:scale-95"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Label</span>
          </button>
        </div>

      </div>
    </header>
  );
};
