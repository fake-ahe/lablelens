import React, { useState } from 'react';
import { Heart, Activity, Apple, Zap, Scale, Star, Sparkles, ChevronRight, Info } from 'lucide-react';
import { HealthImpactItem, LabelAnalysisResult } from '../types';
import { calculateProductRating } from '../config/rating';

interface HealthImpactChartProps {
  product: LabelAnalysisResult;
}

export const HealthImpactChart: React.FC<HealthImpactChartProps> = ({ product }) => {
  const impacts = product.healthImpacts || [];
  const [activeSystemIndex, setActiveSystemIndex] = useState<number>(0);

  const rating = calculateProductRating(product);

  // SVG Donut calculation parameters
  const size = 280;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const totalSegments = impacts.length || 5;
  const gapAngle = 5; // degrees gap between segments
  const gapLength = (gapAngle / 360) * circumference;
  const segmentLength = (circumference / totalSegments) - gapLength;

  const activeItem = impacts[activeSystemIndex] || impacts[0];

  // Distinct vibrant color palette for each bodily system
  const getSystemTheme = (systemName: string, index: number) => {
    switch (systemName) {
      case 'Heart & Blood Pressure':
        return {
          stroke: '#e11d48', // rose-600
          bgLight: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          badge: 'bg-rose-100 text-rose-800',
          icon: Heart,
        };
      case 'Blood Sugar Balance':
        return {
          stroke: '#f59e0b', // amber-500
          bgLight: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-800',
          icon: Activity,
        };
      case 'Digestion & Gut':
        return {
          stroke: '#10b981', // emerald-500
          bgLight: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800',
          icon: Apple,
        };
      case 'Muscle & Energy':
        return {
          stroke: '#4f46e5', // indigo-600
          bgLight: 'bg-indigo-50',
          border: 'border-indigo-200',
          text: 'text-indigo-700',
          badge: 'bg-indigo-100 text-indigo-800',
          icon: Zap,
        };
      case 'Metabolism & Satiety':
      default:
        return {
          stroke: '#0d9488', // teal-600
          bgLight: 'bg-teal-50',
          border: 'border-teal-200',
          text: 'text-teal-700',
          badge: 'bg-teal-100 text-teal-800',
          icon: Scale,
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Title with Overall Rating Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Nutritional Physiological Mapping
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            Bodily Impact Wheel
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            How this food's nutrient density influences 5 vital bodily systems.
          </p>
        </div>

        {/* Highlighted Overall Health Rating */}
        <div className="flex items-center gap-3 bg-stone-50 border border-stone-200/90 rounded-2xl px-4 py-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Food Rating
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-stone-900 font-display">
                {rating.stars.toFixed(1)}
              </span>
              <span className="text-xs text-stone-400 font-medium">/ 5.0</span>
              <span className="text-xs font-semibold text-emerald-700 ml-1">
                ({rating.score}/100)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Prominent Circular Chart on Left, Clean Simple List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: The Large High-Visibility Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-[280px] h-[280px] flex items-center justify-center drop-shadow-xs">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 transition-transform duration-500"
            >
              {/* Neutral background track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />

              {/* High-visibility distinct segments */}
              {impacts.map((item, idx) => {
                const theme = getSystemTheme(item.system, idx);
                const strokeDasharray = `${segmentLength} ${gapLength + (circumference - segmentLength)}`;
                const strokeDashoffset = -((segmentLength + gapLength) * idx);
                const isSelected = idx === activeSystemIndex;

                return (
                  <circle
                    key={item.system}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={theme.stroke}
                    strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-300 hover:opacity-85"
                    style={{
                      filter: isSelected ? 'drop-shadow(0px 3px 10px rgba(0,0,0,0.22))' : 'none',
                      opacity: isSelected ? 1 : 0.82
                    }}
                    onClick={() => setActiveSystemIndex(idx)}
                  />
                );
              })}
            </svg>

            {/* Central Score / Focus Callout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
              {activeItem ? (() => {
                const theme = getSystemTheme(activeItem.system, activeSystemIndex);
                const Icon = theme.icon;
                return (
                  <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                    <div className={`w-11 h-11 mx-auto rounded-2xl flex items-center justify-center ${theme.bgLight} ${theme.text} border ${theme.border} shadow-2xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-stone-900 leading-tight max-w-[130px] line-clamp-1">
                      {activeItem.system}
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-black text-stone-900 font-display tracking-tight">
                        {activeItem.score}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-400">/100</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${theme.badge}`}>
                      {activeItem.observation}
                    </span>
                  </div>
                );
              })() : null}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
            <span>Tap any colored arc to inspect its nutrient driver</span>
          </div>
        </div>

        {/* Right: Simplified, Highly Readable 5-System Cards */}
        <div className="lg:col-span-7 space-y-2.5">
          {impacts.map((item, idx) => {
            const isSelected = idx === activeSystemIndex;
            const theme = getSystemTheme(item.system, idx);
            const Icon = theme.icon;

            return (
              <div
                key={item.system}
                onClick={() => setActiveSystemIndex(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? `${theme.bgLight} ${theme.border} shadow-xs ring-2 ring-stone-900/10`
                    : 'bg-stone-50/70 border-stone-200/80 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: isSelected ? theme.stroke : '#f1f5f9', color: isSelected ? '#ffffff' : theme.stroke }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-stone-900 font-display">
                          {item.system}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>
                          {item.observation}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 font-medium">
                        Key Nutrient: <span className="text-stone-900 font-semibold">{item.keyNutrient}</span>
                      </p>
                      {isSelected && (
                        <p className="text-xs text-stone-600 mt-2 leading-relaxed pt-2 border-t border-stone-200/60">
                          {item.explanation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score Indicator & Progress Bar */}
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-lg font-black text-stone-900 font-display">
                        {item.score}
                      </span>
                      <span className="text-[10px] text-stone-400">/100</span>
                    </div>
                    <div className="w-16 sm:w-20 h-2 bg-stone-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.score}%`, backgroundColor: theme.stroke }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
