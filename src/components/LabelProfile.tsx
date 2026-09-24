import React, { useState } from 'react';
import { 
  Sliders, 
  HelpCircle, 
  X, 
  Info, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Award,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { LabelAnalysisResult } from '../types';
import { calculateProductRating } from '../config/rating';

interface LabelProfileProps {
  product: LabelAnalysisResult;
}

export const LabelProfile: React.FC<LabelProfileProps> = ({ product }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeMetricIndex, setActiveMetricIndex] = useState<number>(0);
  const profile = product.labelProfile;
  const rating = calculateProductRating(product);

  // Overall Transparency Index (0 - 100)
  const sumScores = profile.protein + profile.fiber + profile.addedSugar + profile.sodium + profile.complexity;
  const overallTransparencyPercent = Math.round((sumScores / 25) * 100);

  let transparencyGrade = 'A';
  let transparencyBadgeClass = 'bg-emerald-600 text-white';
  let transparencyVerdict = 'High Nutritional Integrity';

  if (overallTransparencyPercent >= 85) {
    transparencyGrade = 'A+';
    transparencyBadgeClass = 'bg-emerald-600 text-white';
    transparencyVerdict = 'Exemplary Nutritional Architecture';
  } else if (overallTransparencyPercent >= 70) {
    transparencyGrade = 'A';
    transparencyBadgeClass = 'bg-emerald-600 text-white';
    transparencyVerdict = 'Strong Clean-Label Transparency';
  } else if (overallTransparencyPercent >= 55) {
    transparencyGrade = 'B';
    transparencyBadgeClass = 'bg-blue-600 text-white';
    transparencyVerdict = 'Balanced Nutrient Profile';
  } else if (overallTransparencyPercent >= 40) {
    transparencyGrade = 'C';
    transparencyBadgeClass = 'bg-amber-500 text-white';
    transparencyVerdict = 'Moderate Processing / Refined Elements';
  } else {
    transparencyGrade = 'D';
    transparencyBadgeClass = 'bg-red-600 text-white';
    transparencyVerdict = 'Elevated Sugar, Sodium, or Ultra-Processing';
  }

  const indicators = [
    {
      id: 'protein',
      name: 'Protein Density',
      score: profile.protein,
      target: '≥ 10g per serving',
      currentVal: product.nutrition.protein !== null ? `${product.nutrition.protein}g` : 'Detected',
      color: '#10b981',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      tagline: 'Satiety & Muscle Maintenance',
      desc: 'Based on grams of bio-available protein per serving. Higher density supports steady metabolic rate and sustained satiety.'
    },
    {
      id: 'fiber',
      name: 'Dietary Fiber',
      score: profile.fiber,
      target: '≥ 5g per serving',
      currentVal: product.nutrition.fiber !== null ? `${product.nutrition.fiber}g` : 'Detected',
      color: '#14b8a6',
      bgLight: 'bg-teal-50',
      border: 'border-teal-200',
      badge: 'bg-teal-100 text-teal-800',
      tagline: 'Prebiotic Gut Microbiome Fuel',
      desc: 'Evaluates soluble & insoluble plant fiber relative to the 28g Daily Value benchmark. Drives gut microbiome health and glucose smoothing.'
    },
    {
      id: 'sugar',
      name: 'Added Sugar Restraint',
      score: profile.addedSugar,
      target: '≤ 2g per serving',
      currentVal: product.nutrition.addedSugars !== null ? `${product.nutrition.addedSugars}g` : (product.nutrition.sugars !== null ? `${product.nutrition.sugars}g` : 'Minimal'),
      color: profile.addedSugar >= 4 ? '#10b981' : profile.addedSugar >= 3 ? '#f59e0b' : '#ef4444',
      bgLight: profile.addedSugar >= 4 ? 'bg-emerald-50' : 'bg-amber-50',
      border: profile.addedSugar >= 4 ? 'border-emerald-200' : 'border-amber-200',
      badge: profile.addedSugar >= 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
      tagline: 'Insulin & Glycemic Stability',
      desc: 'Inverse clinical scale where minimal or zero added sugars yields the highest rating (≤2g = 5/5, ≥15g = 1/5). Protects arterial endothelium.'
    },
    {
      id: 'sodium',
      name: 'Sodium Moderation',
      score: profile.sodium,
      target: '≤ 140mg per serving',
      currentVal: product.nutrition.sodium !== null ? `${product.nutrition.sodium}mg` : 'Standard',
      color: profile.sodium >= 4 ? '#3b82f6' : profile.sodium >= 3 ? '#f59e0b' : '#ef4444',
      bgLight: profile.sodium >= 4 ? 'bg-blue-50' : 'bg-amber-50',
      border: profile.sodium >= 4 ? 'border-blue-200' : 'border-amber-200',
      badge: profile.sodium >= 4 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800',
      tagline: 'Cardiovascular Fluid Equilibrium',
      desc: 'Inverse threshold based on low-sodium FDA guidelines (≤140mg = 5/5, ≥800mg = 1/5). Safeguards blood pressure and renal filtration.'
    },
    {
      id: 'simplicity',
      name: 'Ingredient Simplicity',
      score: profile.complexity,
      target: 'Whole food purity',
      currentVal: `${product.ingredients.length} items`,
      color: '#6366f1',
      bgLight: 'bg-indigo-50',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-800',
      tagline: 'Minimal Industrial Processing',
      desc: 'Assesses whole food ingredient integrity vs. multi-stage industrial formulations, artificial gums, bleaching agents, and synthetic colors.'
    }
  ];

  const activeMetric = indicators[activeMetricIndex] || indicators[0];

  return (
    <div id="transparent-label-profile" className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200 mb-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            100% Documented Clinical Reference Model
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            Transparent Label Architecture Profile
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Standardized 5-pillar mathematical index derived from public dietary reference intakes, evaluating macro-density, nutrient moderation, and whole-food simplicity.
          </p>
        </div>

        {/* Right Badges: Grade & Rating */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-2xl border border-stone-200">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg font-display ${transparencyBadgeClass} shadow-xs`}>
              {transparencyGrade}
            </div>
            <div className="pr-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Clean Index</span>
              <span className="text-xs font-extrabold text-stone-800">{overallTransparencyPercent}% Integrity</span>
            </div>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-extrabold ${rating.badgeClass} shadow-2xs`}>
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{rating.stars.toFixed(1)} / 5.0</span>
          </div>

          <button
            onClick={() => setShowExplanation(true)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            title="Inspect Mathematical Formula & Science Rules"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Transparency Dashboard: 5-Pillar Visual Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-gradient-to-br from-stone-50/90 via-white to-stone-50/50 border border-stone-200/80">
        
        {/* Left: Interactive 5-Pillar Segmented Bar Graphic */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              Nutritional Quality Vectors
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Total Score: {sumScores} / 25
            </span>
          </div>

          <div className="space-y-3">
            {indicators.map((metric, idx) => {
              const isSelected = activeMetricIndex === idx;
              const percent = (metric.score / 5) * 100;

              return (
                <div
                  key={metric.id}
                  onClick={() => setActiveMetricIndex(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-stone-300 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-stone-50/60 border-stone-200/60 hover:bg-white hover:border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{metric.name}</span>
                      <span className="text-[10px] text-stone-400 font-medium">({metric.target})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-stone-500">Value: {metric.currentVal}</span>
                      <span className="text-xs font-black font-mono text-stone-900 px-1.5 py-0.5 rounded bg-stone-100">
                        {metric.score}/5
                      </span>
                    </div>
                  </div>

                  {/* 5-Segment Visual Progress Bar */}
                  <div className="grid grid-cols-5 gap-1.5 h-2.5">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div
                        key={seg}
                        className={`rounded-full transition-all duration-300 ${
                          seg <= metric.score
                            ? 'bg-emerald-600 shadow-2xs'
                            : 'bg-stone-200'
                        }`}
                        style={{
                          backgroundColor: seg <= metric.score ? metric.color : undefined
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Focused Metric Deep-Dive Spotlight Card */}
        <div className="lg:col-span-5">
          <div className={`p-5 rounded-2xl border-2 ${activeMetric.border} ${activeMetric.bgLight} space-y-3 shadow-xs transition-all`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${activeMetric.badge} mb-1`}>
                  {activeMetric.tagline}
                </span>
                <h4 className="text-base font-extrabold text-stone-900 font-display">
                  {activeMetric.name}
                </h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black font-display text-stone-900">
                  {activeMetric.score}<span className="text-stone-400 text-sm font-bold">/5</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {activeMetric.desc}
            </p>

            <div className="p-3 rounded-xl bg-white/90 border border-stone-200/80 space-y-1 text-xs">
              <div className="flex justify-between items-center text-stone-600">
                <span className="font-bold">Detected Value:</span>
                <span className="font-mono font-bold text-stone-900">{activeMetric.currentVal}</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span className="font-bold">Clinical Target:</span>
                <span className="font-mono text-emerald-700 font-bold">{activeMetric.target}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500">
              <span>Scientific Thresholds Documented</span>
              <button
                onClick={() => setShowExplanation(true)}
                className="font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                View Rules <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 5-Column Quick Indicator Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {indicators.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveMetricIndex(idx)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeMetricIndex === idx
                ? 'bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                : 'bg-stone-50/70 border-stone-200/80 hover:bg-white'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-stone-900 block truncate">
                {item.name}
              </span>
              <span className="text-[10px] text-stone-500 block truncate mt-0.5">
                {item.target}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(d => (
                  <span
                    key={d}
                    className={`w-2 h-2 rounded-full ${d <= item.score ? 'bg-emerald-600' : 'bg-stone-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-stone-800">
                {item.score}/5
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Architectural Guarantee Notice */}
      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Open Architecture Commitment:</strong> Unlike proprietary "black-box" scores, every point in this profile is derived directly from published FDA Reference Amounts Customarily Consumed (RACC) and WHO dietary recommendations.
        </p>
      </div>

      {/* Scientific Rationale Modal */}
      {showExplanation && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowExplanation(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900 font-display">
                  Transparent Evaluation Rules
                </h3>
                <span className="text-xs text-stone-400">Standardized Thresholds</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-600 pt-3">
              <p className="leading-relaxed">
                Food Decode scores are completely open, auditable, and derived mathematically from verified nutritional benchmarks:
              </p>

              <div className="space-y-2 pt-1">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block">1. Protein Density (0 - 5)</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">5 = ≥15g, 4 = ≥10g, 3 = ≥6g, 2 = ≥3g, 1 = &lt;3g per serving.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block">2. Dietary Fiber (0 - 5)</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">5 = ≥8g (High Prebiotic), 4 = ≥5g, 3 = ≥3g, 2 = ≥1g, 1 = &lt;1g.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block">3. Added Sugar Restraint (0 - 5)</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">Inverse scoring: 5 = ≤2g, 4 = ≤5g, 3 = ≤10g, 2 = ≤15g, 1 = &gt;15g per serving.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block">4. Sodium Moderation (0 - 5)</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">FDA low-sodium basis: 5 = ≤140mg, 4 = ≤300mg, 3 = ≤500mg, 2 = ≤800mg, 1 = &gt;800mg.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block">5. Ingredient Simplicity (0 - 5)</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">Penalizes multi-stage synthetic additives, ultra-processed fillers, and artificial coloring agents.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowExplanation(false)}
              className="mt-6 w-full py-3 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-sm"
            >
              Close Methodology
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
