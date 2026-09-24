import React from 'react';
import { Scan, Upload, Sparkles, ShieldCheck, HeartPulse, Layers, AlertCircle, Scale, Brain } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { LabelAnalysisResult } from '../types';
import { ProductSearch } from './ProductSearch';

interface HeroProps {
  onScanClick: () => void;
  onUploadClick: () => void;
  onSelectDemo: (demo: LabelAnalysisResult) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScanClick,
  onUploadClick,
  onSelectDemo
}) => {
  const primaryDemo = DEMO_PRODUCTS[0]; // Crunchy Cocoa Oat Bites

  const features = [
    {
      title: 'Nutrition Summary',
      description: 'Standardized tables with % Daily Values, per serving & per 100g metrics.',
      icon: HeartPulse,
      badge: 'FDA & EU Norms',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Ingredient Breakdown',
      description: 'Every ingredient categorized by function without fear-based exaggeration.',
      icon: Layers,
      badge: 'Categorized',
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    },
    {
      title: 'Allergen Detection',
      description: 'Rapid scans for milk, soy, nuts, gluten, sesame, and hidden traces.',
      icon: AlertCircle,
      badge: '9 Major Allergens',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      title: 'Additive Detection',
      description: 'Identifies emulsifiers, preservatives, and sweetening agents factually.',
      icon: ShieldCheck,
      badge: 'E-Codes & INS',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      title: 'Product Comparison',
      description: 'Compare two packaged foods side-by-side to highlight key nutritional differences.',
      icon: Scale,
      badge: 'Side-by-Side',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Personalized Insights',
      description: 'Interactive physiological impact wheel and instant AI conversational answers.',
      icon: Brain,
      badge: 'Ask Food Decode',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Subtle background ambient tint */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-50/70 via-stone-50/50 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-800 text-xs font-semibold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Designed for Conscious Consumers, Not Food Chemists
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 font-display">
            Understand what’s <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 bg-clip-text text-transparent">
              really in your food.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Scan your physical package label to get an instant breakdown of nutrition, ingredients, allergens, and harmful additives.
          </p>

          {/* User Guidance Banner: Prefer Scan Over Search Term */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-emerald-500/10 border border-emerald-500/30 text-emerald-950 text-xs font-medium shadow-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 uppercase tracking-wider text-[11px] bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              <Scan className="w-3.5 h-3.5 text-emerald-700" />
              Pro Tip
            </span>
            <span>
              <strong>Prefer scan over search term:</strong> Direct camera OCR reads exact regional formulas, batch dates, and allergy warnings that text search might miss.
            </span>
          </div>
        </div>

        {/* Primary: Physical Label Scan & Upload Options */}
        <div className="mt-8 max-w-3xl mx-auto text-center space-y-4">
          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="hero-scan-label-btn"
              onClick={onScanClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-base shadow-lg shadow-emerald-700/25 hover:bg-emerald-500 hover:shadow-emerald-600/35 active:scale-98 transition-all"
            >
              <Scan className="w-5 h-5" />
              <span>Scan Food Label Camera (Preferred)</span>
            </button>

            <button
              id="hero-upload-image-btn"
              onClick={onUploadClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-base hover:bg-stone-200/70 active:scale-98 transition-all"
            >
              <Upload className="w-5 h-5 text-stone-600" />
              <span>Upload Label Photo</span>
            </button>
          </div>

          {/* Quick Demo CTA */}
          <div className="pt-2">
            <p className="text-xs text-stone-500 mb-2">No photo on hand? Try our pre-scanned test labels:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {DEMO_PRODUCTS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => onSelectDemo(demo)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-700 shadow-2xs hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{demo.productName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GOOGLE SEARCH: Placed below the scan section */}
        <div className="mt-12 max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-4 justify-center">
            <div className="h-px bg-stone-200 flex-1 max-w-xs" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Prefer Scan Above • Or Search By Product Name</span>
            <div className="h-px bg-stone-200 flex-1 max-w-xs" />
          </div>

          <ProductSearch onSelectProduct={onSelectDemo} />
        </div>

        {/* Featured Sample Card Preview */}
        <div className="mt-12 bg-white rounded-2xl border border-stone-200/80 shadow-md p-6 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Demo Label Ready
                </span>
                <span className="text-xs text-stone-400">US FDA Format • 98% Confidence</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mt-1 font-display">
                {primaryDemo.productName}
              </h3>
              <p className="text-sm text-stone-500">{primaryDemo.brand} • {primaryDemo.servingSize}</p>
            </div>

            <button
              onClick={() => onSelectDemo(primaryDemo)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shrink-0"
            >
              <span>Explore This Scan</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          {/* Quick Stats Grid Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
              <span className="text-xs font-medium text-stone-500">Calories</span>
              <p className="text-2xl font-bold text-stone-900 mt-0.5 font-display">{primaryDemo.nutrition.calories.value} <span className="text-xs font-normal text-stone-500">kcal</span></p>
              <span className="text-[11px] text-stone-500">12% Daily Value</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
              <span className="text-xs font-medium text-stone-500">Protein</span>
              <p className="text-2xl font-bold text-emerald-700 mt-0.5 font-display">{primaryDemo.nutrition.protein.value} <span className="text-xs font-normal text-stone-500">g</span></p>
              <span className="text-[11px] text-emerald-700 font-medium">Relatively High</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
              <span className="text-xs font-medium text-stone-500">Added Sugar</span>
              <p className="text-2xl font-bold text-amber-600 mt-0.5 font-display">{primaryDemo.nutrition.addedSugar.value} <span className="text-xs font-normal text-stone-500">g</span></p>
              <span className="text-[11px] text-amber-700 font-medium">Moderate</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
              <span className="text-xs font-medium text-stone-500">Dietary Fiber</span>
              <p className="text-2xl font-bold text-teal-700 mt-0.5 font-display">{primaryDemo.nutrition.fiber.value} <span className="text-xs font-normal text-stone-500">g</span></p>
              <span className="text-[11px] text-teal-700 font-medium">Good Source</span>
            </div>
          </div>
        </div>

        {/* 6 Feature Cards */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Everything you need to decipher grocery packaging
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-xl mx-auto">
              We turn tiny, confusing nutrition panels and long chemical-sounding ingredient lists into clear, neutral knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feature.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 font-display">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
