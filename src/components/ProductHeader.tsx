import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Bookmark, BookmarkCheck, Scale, RefreshCw, Share2, Globe, Tag, Maximize2, X, Star, AlertCircle, Sparkles, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { LabelAnalysisResult } from '../types';
import { calculateProductRating } from '../config/rating';

interface ProductHeaderProps {
  product: LabelAnalysisResult;
  isSaved: boolean;
  onToggleSave: () => void;
  onCompare: () => void;
  onNewScan: () => void;
  showAlternatives?: boolean;
  onToggleAlternatives?: () => void;
  alternativesCount?: number;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  isSaved,
  onToggleSave,
  onCompare,
  onNewScan,
  showAlternatives = false,
  onToggleAlternatives,
  alternativesCount = 3
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(product.imageUrl || '');
  const [hasImgError, setHasImgError] = useState(false);

  // Sync image source & fetch real Google image if missing
  useEffect(() => {
    const initialUrl = product.imageUrl || '';
    setImgSrc(initialUrl);
    setHasImgError(false);

    if (!initialUrl && product.productName) {
      fetch(`/api/product-image?q=${encodeURIComponent(product.productName)}&brand=${encodeURIComponent(product.brand || '')}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.imageUrl) {
            setImgSrc(data.imageUrl);
          }
        })
        .catch(() => {});
    }
  }, [product.imageUrl, product.productName, product.brand]);

  const handleImageError = () => {
    if (!hasImgError && imgSrc && !imgSrc.startsWith('/api/image-proxy')) {
      setHasImgError(true);
      setImgSrc(`/api/image-proxy?url=${encodeURIComponent(imgSrc)}`);
    }
  };

  const googleImageSearchUrl = product.imageGoogleUrl || 
    `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
      (product.brand && product.brand !== 'Not detected' ? product.brand + ' ' : '') + 
      product.productName + ' packaging'
    )}`;

  const rating = calculateProductRating(product);
  const isLowConfidence = product.confidence.overall < 80 || product.confidence.lowConfidenceFields.length > 0;
  const hasAllergens = product.allergens && product.allergens.length > 0;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${product.productName} - Nutrition Summary`,
          text: `Check out the nutrition breakdown for ${product.productName} by ${product.brand} on LabelLens.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignored
    }
  };

  const getRegionLabel = (code: string) => {
    switch (code) {
      case 'US': return 'US FDA Format';
      case 'EU': return 'EU Regulation (1169/2011)';
      case 'IN': return 'Indian FSSAI Format';
      default: return 'Standardized Format';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-4">
      
      {/* High-priority RED Allergen Warning Banner if allergens are present */}
      {hasAllergens && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-red-600 text-white shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/25 px-2 py-0.5 rounded-md mr-2">
                Allergen Alert
              </span>
              <span className="font-extrabold text-sm sm:text-base">
                Contains: {product.allergens.map(a => a.name).join(', ')}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold bg-white text-red-700 px-3 py-1 rounded-xl shrink-0 hidden sm:inline-block shadow-2xs">
            Verify Packaging
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        
        {/* Left: Thumbnail & Core Info */}
        <div className="flex items-start gap-4 sm:gap-6 w-full md:w-auto">
          {imgSrc && (
            <div className="relative group shrink-0 mb-2 sm:mb-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-stone-200 shadow-xs bg-stone-100 flex items-center justify-center">
                <img
                  src={imgSrc}
                  alt={product.productName}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
                  onClick={() => setShowImageModal(true)}
                />
              </div>
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"
                title="View product image in full resolution"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-stone-700 shadow-xs border border-stone-200">
                  <span className="text-[#4285F4] font-black">G</span>oogle Image
                </span>
              </div>
            </div>
          )}

          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Meta Tags: Rating Badge + Regional + Confidence */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Prominent Rating Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-2xs ${rating.badgeClass}`}>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{rating.stars.toFixed(1)} / 5.0</span>
                <span className="opacity-40">|</span>
                <span className="font-semibold">{rating.label}</span>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-medium">
                <Globe className="w-3 h-3 text-stone-500" />
                {getRegionLabel(product.regionalStandard)}
              </span>

              {/* Confidence Badge */}
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isLowConfidence
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {isLowConfidence ? (
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                ) : (
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                )}
                <span>
                  {product.confidence.overall}% Confidence
                </span>
              </div>

              {/* Google Search Grounded Badge */}
              {product.groundingMetadata?.isSearchGrounded && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold">
                  <Globe className="w-3 h-3 text-blue-600" />
                  <span>Google Search Grounded</span>
                </div>
              )}
            </div>

            {/* Product Name & Brand */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display break-words">
              {product.productName}
            </h1>
            <p className="text-sm sm:text-base font-medium text-stone-500">
              {product.brand !== 'Not detected' ? product.brand : 'Brand Not Detected'} • Serving Size: <span className="text-stone-700 font-semibold">{product.servingSize}</span>
              {product.servingsPerPackage && (
                <span className="text-stone-500"> ({product.servingsPerPackage} servings/container)</span>
              )}
            </p>

            {/* Packaging Claims Badges */}
            {product.claims && product.claims.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                {product.claims.map((claim, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-700 text-[11px] font-medium border border-stone-200"
                  >
                    <Tag className="w-3 h-3 text-stone-400" />
                    {claim}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
          
          {/* Best Alternatives Trigger on Top */}
          {onToggleAlternatives && (
            <button
              onClick={onToggleAlternatives}
              id="top-best-alternatives-action-btn"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                showAlternatives
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100/90 shadow-2xs'
              }`}
              title="View best healthier alternatives for this product"
            >
              <Sparkles className={`w-4 h-4 ${showAlternatives ? 'text-white' : 'text-emerald-600 animate-pulse'}`} />
              <span>{showAlternatives ? 'Hide Alternatives' : 'Best Alternatives'}</span>
              {alternativesCount !== undefined && alternativesCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  showAlternatives ? 'bg-white text-emerald-900' : 'bg-emerald-600 text-white'
                }`}>
                  {alternativesCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onToggleSave}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-stone-500" />
                <span>Save Scan</span>
              </>
            )}
          </button>

          <button
            onClick={onCompare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 transition-all"
            title="Compare with another food label"
          >
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Compare</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 transition-all"
            title="Share this breakdown"
          >
            <Share2 className="w-4 h-4 text-stone-500" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={onNewScan}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </button>
        </div>

      </div>

      {/* Uncertainty Notice if Low Confidence */}
      {isLowConfidence && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Low confidence — please verify against physical package</p>
            <p className="text-amber-800 mt-0.5">
              Some nutrition or ingredient text was slightly blurry or obstructed ({product.confidence.lowConfidenceFields.join(', ') || 'text clarity'}). Extracted facts should be visually confirmed.
            </p>
          </div>
        </div>
      )}

      {/* Full Photo Modal */}
      {showImageModal && imgSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative max-w-3xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 text-white bg-stone-950/60">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white">
                    <span className="text-[#4285F4] font-black">G</span>oogle Image
                  </span>
                  <span className="text-xs text-stone-400 font-medium">Real Packaging Photo</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold truncate text-white">
                  {product.productName}
                </h3>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 rounded-xl bg-white/10 text-stone-300 hover:text-white hover:bg-white/20 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 sm:p-6 overflow-auto flex items-center justify-center bg-stone-950/40 min-h-[300px]">
              <img
                src={imgSrc}
                alt={product.productName}
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-2xl shadow-lg border border-white/5"
              />
            </div>

            {/* Modal Footer with Google Search Link */}
            <div className="p-3.5 sm:p-4 border-t border-white/10 bg-stone-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-stone-400">
                Sourced from Google Search image index for authentic retail packaging
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={googleImageSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                >
                  <span>Search on Google Images</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
