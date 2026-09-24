import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Scan, Sparkles } from 'lucide-react';

interface ProcessingStateProps {
  previewImage?: string | null;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ previewImage }) => {
  const steps = [
    'Scanning packaging typography and orientation...',
    'Extracting Nutrition Facts table & Daily Values...',
    'Parsing and categorizing ingredient list...',
    'Screening for 9 common allergens & hidden traces...',
    'Identifying additives, sweeteners, and emulsifiers...',
    'Normalizing regional units (kcal, kJ, g, mg)...',
    'Synthesizing health impact wheel and simple terms...'
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 max-w-xl mx-auto text-center space-y-6">
      {/* Scanner Visual Frame */}
      <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-stone-950 border-2 border-emerald-500/80 shadow-lg flex items-center justify-center">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Scanning target"
            className="w-full h-full object-cover opacity-60 filter contrast-125"
          />
        ) : (
          <div className="text-stone-600 flex flex-col items-center">
            <Scan className="w-12 h-12 text-emerald-500/50 mb-2" />
            <span className="text-xs font-mono">OPTICAL RECOGNITION</span>
          </div>
        )}

        {/* Animated Green Laser Scan Line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-bounce" style={{ animationDuration: '2s' }} />

        {/* Framing Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

        <div className="absolute bottom-3 inset-x-4 bg-stone-900/80 backdrop-blur-xs py-1 px-2 rounded text-[10px] font-mono text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 animate-spin text-emerald-400" />
          OCR & VISION ENGINE ACTIVE
        </div>
      </div>

      {/* Status Copy */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-stone-900 font-display flex items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          Analyzing your label...
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          Extracting exact figures without guessing. Unclear fields will be marked with low confidence.
        </p>
      </div>

      {/* Progress Steps List */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 text-left space-y-2 max-w-md mx-auto">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                isDone
                  ? 'text-emerald-800 font-medium'
                  : isCurrent
                  ? 'text-stone-900 font-semibold'
                  : 'text-stone-400 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
