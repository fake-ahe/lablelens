import React from 'react';
import { X, ShieldCheck, HeartPulse, Sparkles, BookOpen, AlertTriangle, Lock, FileText, CheckCircle2, Scan } from 'lucide-react';

export type FooterModalType = 'about' | 'privacy' | 'terms' | null;

interface FooterModalsProps {
  activeModal: FooterModalType;
  onClose: () => void;
  onSwitchModal: (type: FooterModalType) => void;
  onScanClick?: () => void;
}

export const FooterModals: React.FC<FooterModalsProps> = ({
  activeModal,
  onClose,
  onSwitchModal,
  onScanClick
}) => {
  if (!activeModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm font-black text-xs">
              FD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-stone-900 tracking-tight text-base font-display">Food Decode</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Consumer Transparency
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 px-6 gap-2 text-xs font-semibold">
          <button
            onClick={() => onSwitchModal('about')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeModal === 'about'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white/70 rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            About Food Decode
          </button>
          <button
            onClick={() => onSwitchModal('privacy')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeModal === 'privacy'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white/70 rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => onSwitchModal('terms')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeModal === 'terms'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white/70 rounded-t-lg'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-stone-600">
          {activeModal === 'about' && (
            <>
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display">Demystifying Food Labels with Science & Objectivity</h3>
                <p className="mt-2 text-stone-600">
                  <strong className="text-stone-900">Food Decode</strong> is an independent nutritional intelligence platform built to make food labels readable, clear, and actionable. Food packaging is loaded with deceptive front-of-pack claims (&quot;all-natural&quot;, &quot;made with real fruit&quot;, &quot;gluten-free&quot;) that frequently disguise ultra-processed formulations, high added sugars, and synthetic emulsifiers.
                </p>
              </div>

              {/* Special Emphasis: Prefer Scan Over Search Term */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/40 border border-emerald-200/80 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Scan className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span className="text-base">Why You Should Prefer Scan Over Search Term</span>
                </div>
                <p className="text-emerald-950 text-xs sm:text-sm leading-relaxed">
                  While Food Decode offers search term lookups via Google Search, <strong>we strongly advise users to prefer scan over search term</strong>. Direct camera scanning captures the <em>exact batch</em>, actual physical nutrition facts panel, regional allergen warning label, and authentic ingredient sequence printed on the box in your hands. Food brands constantly change supplier recipes, oil types, and sweetening agents across countries and dates without changing the product name. Optical scanning guarantees 100% ground-truth accuracy.
                </p>
                {onScanClick && (
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onScanClick();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-xs"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      Try Scanning a Label Now
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-emerald-600" />
                  Our Core Commitments
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900">Zero Fear-Mongering</span>
                    <p className="text-stone-500">We explain every additive, preservative, and chemical name based on peer-reviewed science, without sensationalist alarmism.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900">FDA & EU Benchmark Rules</span>
                    <p className="text-stone-500">Calibrated against FDA 21 CFR 101.9, EU 1169/2011, WHO/IARC toxicity databases, and EFSA opinions.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900">100% Ad-Free & Objective</span>
                    <p className="text-stone-500">We take zero sponsorship from food manufacturers. Healthy alternative suggestions are algorithmic and unbiased.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900">Privacy by Design</span>
                    <p className="text-stone-500">No account required. Scanned images are processed ephemerally and never sold to third-party brokers.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeModal === 'privacy' && (
            <>
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display">Privacy Policy</h3>
                <p className="text-xs text-stone-400 mt-0.5">Last updated: September 2026</p>
                <p className="mt-2 text-stone-600">
                  Your privacy and trust are paramount at Food Decode. We believe transparency should apply to software just as it does to food ingredients.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    1. Camera & Image Processing
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    When you use the Food Decode camera scanner or upload an image file, the photo is transmitted via encrypted HTTPS strictly to extract textual nutritional tables and ingredients. The image data is processed in ephemeral server memory and is not stored long-term, indexed for facial recognition, or shared with external data brokers.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    2. Local Storage & Client Control
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Your scan history, bookmarks, and search cache are stored locally in your browser&apos;s <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 text-xs">localStorage</code>. You can inspect, download as JSON, or erase this data at any moment with a single click from the History tab.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    3. No Third-Party Data Sales
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Food Decode does not sell, license, or monetize your dietary preferences, scan habits, health inquiries, or personal device telemetry to insurance companies, marketers, or advertisers.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    4. Security Hardening
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Our platform implements strict content-security protections, SSRF mitigation, IP rate limiting, input sanitization, and automated payload size caps to prevent unauthorized access or system abuse.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display">Terms of Service</h3>
                <p className="text-xs text-stone-400 mt-0.5">Effective Date: September 2026</p>
                <p className="mt-2 text-stone-600">
                  By accessing or using Food Decode, you acknowledge and agree to these terms of service and educational use guidelines.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Crucial Non-Medical & Educational Disclaimer</span>
                </div>
                <p className="leading-relaxed">
                  Food Decode is an informational optical character recognition and consumer educational tool. It does not provide medical, clinical, pharmaceutical, or diagnostic advice. Allergen notifications are extracted from visible label text. For severe, life-threatening food allergies (e.g. anaphylaxis), always read the actual physical box carefully and consult with your physician or allergist.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900">1. Acceptable Use: Edible Food Packages Only</h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Food Decode is engineered exclusively for edible grocery items, packaged foods, snacks, and beverages. Scanning or querying non-edible items (electronics, hardware, toys, cleaning chemicals) is rejected by automated system safeguards.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900">2. Scan Preference Over Search Terms</h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Users acknowledge that searching by general text term may yield generalized or manufacturer-updated formulations. For verifiable certainty regarding exact ingredients, users should prefer scan over search term.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900">3. Intellectual Property & Fair Use</h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Product brand names, trademarks, and packaging graphics referenced within the application belong exclusively to their respective copyright and trademark owners. They are displayed for descriptive consumer identification under statutory fair use doctrines.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900">4. Limitation of Liability</h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Food Decode and its contributors provide this service on an &quot;as-is&quot; basis without warranties of any kind. Under no circumstances shall Food Decode be liable for dietary discrepancies or manufacturing label inaccuracies.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between text-xs text-stone-500">
          <span>Prefer scan over search term • Food Decode</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
