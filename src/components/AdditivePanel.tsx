import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Zap, 
  Layers, 
  Flame, 
  AlertOctagon, 
  Skull, 
  FileWarning, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AdditiveItem, IngredientItem, NutritionData } from '../types';
import { evaluateFunctionalItems, EvaluatedFunctionalItem, HealthGrade } from '../config/additiveHealth';

interface AdditivePanelProps {
  additives: AdditiveItem[];
  ingredients?: IngredientItem[];
  nutrition?: NutritionData;
}

export const AdditivePanel: React.FC<AdditivePanelProps> = ({
  additives,
  ingredients = [],
  nutrition
}) => {
  const rawItems = evaluateFunctionalItems(additives, ingredients, nutrition);
  // Sort so harmful and dangerous additives are highlighted and shown on top
  const items = [...rawItems].sort((a, b) => {
    const score = (grade: HealthGrade, hazardType?: string) => {
      if (hazardType === 'carcinogen') return 4;
      if (grade === 'danger_hazard') return 3;
      if (grade === 'caution') return 2;
      if (grade === 'safe_neutral') return 1;
      return 0; // 'good'
    };
    return score(b.healthGrade, b.hazardProfile?.hazardType) - score(a.healthGrade, a.hazardProfile?.hazardType);
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | HealthGrade>('all');
  const [activeItemId, setActiveItemId] = useState<string>(items[0]?.id || '');
  const [showHazardModal, setShowHazardModal] = useState(false);

  // Groupings
  const cancerHazards = items.filter(i => i.hazardProfile?.hazardType === 'carcinogen');
  const seriousHazards = items.filter(i => i.hazardProfile?.hazardType === 'serious_hazard');
  const allDangerHazards = items.filter(i => i.healthGrade === 'danger_hazard');
  const cautionCount = items.filter(i => i.healthGrade === 'caution').length;
  const neutralCount = items.filter(i => i.healthGrade === 'safe_neutral').length;
  const goodCount = items.filter(i => i.healthGrade === 'good').length;

  // Filtered list
  const filteredItems = items.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.healthGrade === selectedFilter;
  });

  const activeItem = items.find(i => i.id === activeItemId) || items[0];

  // Percentage calculations for psychological spectrum
  const total = items.length || 1;
  const dangerPercent = Math.round((allDangerHazards.length / total) * 100);
  const cautionPercent = Math.round((cautionCount / total) * 100);
  const neutralPercent = Math.round((neutralCount / total) * 100);
  const goodPercent = Math.max(0, 100 - (dangerPercent + cautionPercent + neutralPercent));

  // Circular Multicolour Donut Dimensions
  const size = 250;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gapAngle = items.length > 1 ? 4 : 0;
  const gapLength = (gapAngle / 360) * circumference;
  const segmentLength = (circumference / total) - gapLength;

  return (
    <div id="additive-functional-health-spectrum" className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Biochemical & Clinical Safety Screening
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            Additive & Functional Ingredient Health Spectrum
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Multi-colour physiological analysis evaluating whole-food nutrients, technological stabilizers, and highlighting additives flagged for carcinogenic risks or severe medical hazards.
          </p>
        </div>

        {/* Dynamic Filter Badges */}
        <div className="flex items-center gap-1.5 bg-stone-100/80 p-1 rounded-2xl shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({items.length})
          </button>

          {allDangerHazards.length > 0 && (
            <button
              onClick={() => setSelectedFilter('danger_hazard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedFilter === 'danger_hazard'
                  ? 'bg-red-600 text-white shadow-xs animate-pulse'
                  : 'text-red-700 hover:bg-red-100/70 bg-red-50/80 border border-red-200'
              }`}
            >
              <Skull className="w-3.5 h-3.5" />
              Severe Hazards ({allDangerHazards.length})
            </button>
          )}

          <button
            onClick={() => setSelectedFilter('good')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedFilter === 'good'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-100/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Good ({goodCount})
          </button>

          <button
            onClick={() => setSelectedFilter('safe_neutral')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedFilter === 'safe_neutral'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 hover:bg-blue-100/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Safe ({neutralCount})
          </button>

          {cautionCount > 0 && (
            <button
              onClick={() => setSelectedFilter('caution')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedFilter === 'caution'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 hover:bg-amber-100/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Caution ({cautionCount})
            </button>
          )}
        </div>
      </div>

      {/* CRITICAL HEALTH ALERT: Cancer & Serious Health Issue Highlight Banner */}
      {allDangerHazards.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md border-2 border-red-700 animate-in fade-in space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs text-white shrink-0 mt-0.5 animate-bounce">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-[10px] font-mono font-black uppercase tracking-widest text-red-200 border border-red-400/40">
                    Toxicological Alert
                  </span>
                  <span className="text-xs font-bold bg-white text-red-700 px-2 py-0.5 rounded-full shadow-2xs">
                    {cancerHazards.length > 0 ? 'Carcinogen & High-Risk Additives' : 'Serious Medical Risk Flagged'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black font-display tracking-tight text-white mt-1">
                  High-Hazard Additive Notice: {allDangerHazards.map(i => i.name).join(', ')}
                </h3>
                <p className="text-xs sm:text-sm text-red-100 mt-1 leading-relaxed max-w-3xl">
                  {cancerHazards.length > 0
                    ? 'Clinical toxicology registries (including IARC/WHO, European EFSA, and US NTP) have linked one or more detected compounds in this formulation to carcinogenic risk, DNA damage, or severe tissue lesions.'
                    : 'One or more detected compounds in this formulation have been flagged by food safety authorities for endocrine disruption, systemic organ strain, or cardiovascular toxicity.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedFilter('danger_hazard')}
              className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-extrabold text-xs shrink-0 shadow-sm hover:bg-red-50 transition-colors flex items-center gap-1"
            >
              Inspect Hazards
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Hazard Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/20">
            {allDangerHazards.map(hazard => (
              <div
                key={hazard.id}
                onClick={() => setActiveItemId(hazard.id)}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/30 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Skull className="w-3.5 h-3.5 text-red-300 shrink-0" />
                <span className="font-extrabold text-white">{hazard.name}</span>
                <span className="text-[10px] text-red-200 font-medium">
                  {hazard.hazardProfile?.hazardBadge || 'Toxic Hazard'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multicolour Psychological Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-gradient-to-br from-stone-50/90 via-white to-stone-50/50 border border-stone-200/80">
        
        {/* Left: The Multicolour Circular Donut Chart */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-[250px] h-[250px] flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
            >
              {/* Neutral track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />

              {/* Multicolour segments */}
              {items.map((item, idx) => {
                const strokeDasharray = `${segmentLength} ${gapLength + (circumference - segmentLength)}`;
                const strokeDashoffset = -((segmentLength + gapLength) * idx);
                const isSelected = item.id === activeItem?.id;
                const isDanger = item.healthGrade === 'danger_hazard';

                return (
                  <circle
                    key={item.id}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={item.psychologicalColor.stroke}
                    strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      filter: isSelected 
                        ? `drop-shadow(0 0 12px ${item.psychologicalColor.glow})` 
                        : isDanger 
                        ? 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.4))' 
                        : 'none',
                      opacity: isSelected ? 1 : 0.85
                    }}
                    onClick={() => setActiveItemId(item.id)}
                  />
                );
              })}
            </svg>

            {/* Central Callout showing Active Item verdict */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
              {activeItem && (
                <div className="space-y-1 animate-in fade-in duration-200 max-w-[140px]">
                  <span
                    className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${activeItem.psychologicalColor.badge}`}
                  >
                    {activeItem.healthGrade === 'danger_hazard'
                      ? '🚨 SEVERE HAZARD'
                      : activeItem.healthGrade === 'good'
                      ? '★ Good for Health'
                      : activeItem.healthGrade === 'safe_neutral'
                      ? '✓ Recognized Safe'
                      : '⚠ Caution / Limit'}
                  </span>
                  <p className="text-xs font-black text-stone-900 line-clamp-1">
                    {activeItem.name}
                  </p>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className={`text-2xl font-black font-display ${activeItem.healthGrade === 'danger_hazard' ? 'text-red-600' : 'text-stone-900'}`}>
                      {activeItem.healthScore}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold">/100</span>
                  </div>
                  <p className="text-[10px] text-stone-500 line-clamp-1 font-medium">
                    {activeItem.category}
                  </p>
                </div>
              )}
            </div>
          </div>
          <span className="text-[11px] text-stone-400 mt-2 font-medium">
            Interactive Biochemical Spectrum Ring
          </span>
        </div>

        {/* Right: Psychological Distribution Spectrum & Active Highlight */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Horizontal Psychological Multi-Colour Gradient Bar */}
          <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Beneficial / Whole Food: {goodPercent}%
              </span>
              <span className="flex items-center gap-1.5 text-blue-800">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Safe Technological: {neutralPercent}%
              </span>
              {cautionCount > 0 && (
                <span className="flex items-center gap-1.5 text-amber-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Caution / Limit: {cautionPercent}%
                </span>
              )}
              {allDangerHazards.length > 0 && (
                <span className="flex items-center gap-1.5 text-red-700 font-extrabold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  Severe Risk / Carcinogen: {dangerPercent}%
                </span>
              )}
            </div>

            {/* Visual Multi-Colour Bar */}
            <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${goodPercent}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                title={`${goodCount} Good for health items`}
              />
              <div
                style={{ width: `${neutralPercent}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                title={`${neutralCount} Safe & technological items`}
              />
              <div
                style={{ width: `${cautionPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                title={`${cautionCount} Caution items`}
              />
              {allDangerHazards.length > 0 && (
                <div
                  style={{ width: `${dangerPercent}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-rose-600 transition-all duration-500"
                  title={`${allDangerHazards.length} High-hazard items`}
                />
              )}
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
              Food safety authorities categorize components along a psychological and medical spectrum: 
              <span className="text-emerald-700 font-semibold"> Green</span> for nourishing bioactives; 
              <span className="text-blue-700 font-semibold"> Blue</span> for inert culinary functional aids; 
              <span className="text-amber-700 font-semibold"> Amber</span> for non-toxic items requiring moderation; 
              <span className="text-red-700 font-bold"> Red</span> for additives linked to cancer risk or severe organ complications.
            </p>
          </div>

          {/* Active Inspected Component Spotlight */}
          {activeItem && (
            <div className={`p-4 rounded-2xl border-2 ${activeItem.psychologicalColor.border} ${activeItem.psychologicalColor.bgLight} transition-all space-y-2`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base sm:text-lg font-extrabold text-stone-900 font-display">
                      {activeItem.name}
                    </h4>
                    {activeItem.commonCode && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 font-bold">
                        {activeItem.commonCode}
                      </span>
                    )}
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${activeItem.psychologicalColor.badge}`}>
                      {activeItem.verdictTitle}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-stone-700 mt-1">
                    Functional Role: <span className="text-stone-900">{activeItem.category}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-stone-500 block">Health Index</span>
                  <span className={`text-xl sm:text-2xl font-black font-display ${activeItem.healthGrade === 'danger_hazard' ? 'text-red-600' : 'text-stone-900'}`}>
                    {activeItem.healthScore}/100
                  </span>
                </div>
              </div>

              {/* Purpose Highlight (Explicit requirement: "also add it purpose") */}
              <div className="p-3 rounded-xl bg-white border border-stone-200/80 text-xs text-stone-800 space-y-1 shadow-2xs">
                <p>
                  <strong className="text-stone-900 font-extrabold">Primary Food Purpose: </strong>
                  <span className="text-stone-700">{activeItem.purpose}</span>
                </p>
                <p className="text-stone-600 leading-relaxed">
                  <strong className="text-stone-900 font-extrabold">Health & Safety Finding: </strong>
                  {activeItem.explanation}
                </p>
              </div>

              {/* Special Clinical Callout if Carcinogen / Serious Hazard */}
              {activeItem.hazardProfile && (
                <div className="p-3 rounded-xl bg-red-100/90 border border-red-300 text-xs text-red-950 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-black text-red-900">
                    <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                    <span>Clinical Hazard Profile: {activeItem.hazardProfile.hazardBadge}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="font-bold text-red-900 block">Authority Citation:</span>
                      <span className="text-red-800">{activeItem.hazardProfile.authority}</span>
                    </div>
                    <div>
                      <span className="font-bold text-red-900 block">Regulatory Standing:</span>
                      <span className="text-red-800">{activeItem.hazardProfile.regulatoryStatus}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-bold text-red-900 block">Biological Mechanism:</span>
                      <span className="text-red-800">{activeItem.hazardProfile.biologicalMechanism}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Detailed Component Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          Detected Additives & Functional Components ({filteredItems.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isDanger = item.healthGrade === 'danger_hazard';
            const isGood = item.healthGrade === 'good';
            const isCaution = item.healthGrade === 'caution';
            const isSelected = item.id === activeItem?.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveItemId(item.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative group ${
                  isSelected
                    ? `${item.psychologicalColor.bgLight} ${item.psychologicalColor.border} shadow-md ring-2 ${item.psychologicalColor.ring}`
                    : isDanger
                    ? 'bg-red-50/70 border-red-500/80 hover:bg-red-50'
                    : 'bg-stone-50/70 border-stone-200/80 hover:bg-white hover:border-stone-300'
                }`}
              >
                {/* Header with Name & Health Verdict Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-extrabold text-stone-900 group-hover:text-stone-950 transition-colors">
                        {item.name}
                      </h4>
                      {item.commonCode && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 font-bold">
                          {item.commonCode}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-stone-500">
                      {item.category}
                    </span>
                  </div>

                  {/* Verdict Badge */}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border shrink-0 shadow-2xs flex items-center gap-1 ${item.psychologicalColor.badge}`}
                  >
                    {isDanger ? (
                      <>
                        <Skull className="w-3.5 h-3.5 text-white" />
                        Severe Hazard
                      </>
                    ) : isGood ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Good for Health
                      </>
                    ) : isCaution ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Limit / Caution
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Safe & Neutral
                      </>
                    )}
                  </span>
                </div>

                {/* Purpose Highlight (User specific requirement: "also add it purpose") */}
                <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-stone-900">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Purpose in Food:</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {item.purpose}
                  </p>
                </div>

                {/* Severe Medical Warning if Applicable */}
                {item.hazardProfile && (
                  <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-xs text-red-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-red-900">
                      <Flame className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{item.hazardProfile.hazardBadge}</span>
                    </div>
                    <p className="text-[11px] text-red-800 leading-snug">
                      {item.hazardProfile.riskDescription}
                    </p>
                  </div>
                )}

                {/* Health & Bodily Impact explanation */}
                <div className="text-xs text-stone-600 leading-relaxed">
                  <span className="font-bold text-stone-800">Health Impact: </span>
                  {item.explanation}
                </div>

                {/* Health Score Meter Bar */}
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-stone-500">
                    Health Affinity Score
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.healthScore}%`,
                          backgroundColor: item.psychologicalColor.stroke
                        }}
                      />
                    </div>
                    <span className="font-mono font-bold text-stone-800 text-xs">
                      {item.healthScore}%
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Reassurance & Toxicology Reference */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Food Decode additive toxicity screenings reference the World Health Organization International Agency for Research on Cancer (IARC), the European Food Safety Authority (EFSA), California Proposition 65, and the Center for Science in the Public Interest (CSPI) Chemical Cuisine evaluations.
        </p>
      </div>

    </div>
  );
};
