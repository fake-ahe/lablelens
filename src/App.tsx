import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UploadScanner } from './components/UploadScanner';
import { ProcessingState } from './components/ProcessingState';
import { ResultsPage } from './components/ResultsPage';
import { HistoryDashboard } from './components/HistoryDashboard';
import { ProductComparison } from './components/ProductComparison';
import { labelAnalysisService } from './services/labelAnalysisService';
import { storageService } from './services/storageService';
import { supabaseService } from './services/supabaseService';
import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { ProfileModal } from './components/ProfileModal';
import { LabelAnalysisResult } from './types';
import { DEMO_PRODUCTS } from './data/demoProducts';
import { SEARCHABLE_PRODUCTS } from './data/searchableProducts';
import { updatePageSEO } from './utils/seo';
import { AlertTriangle, X, ShieldAlert, Sparkles, Scan } from 'lucide-react';
import { FooterModals, FooterModalType } from './components/FooterModals';

export default function App() {
  const { user, openAuthModal, openProfileModal, isConfigured, isPasswordRecoveryMode } = useAuth();
  const [activeView, setActiveView] = useState<'home' | 'scan' | 'results' | 'history' | 'favorites' | 'login' | 'signup' | 'forgot-password' | 'reset-password'>('home');
  const [currentProduct, setCurrentProduct] = useState<LabelAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedPreviewImage, setScannedPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nonEdibleNotice, setNonEdibleNotice] = useState<{ reason: string; image?: string } | null>(null);
  const [historyScans, setHistoryScans] = useState<LabelAnalysisResult[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparisonAlternative, setComparisonAlternative] = useState<LabelAnalysisResult | null>(null);
  const [activeFooterModal, setActiveFooterModal] = useState<FooterModalType>(null);

  // Automatically switch to reset password view when in recovery mode
  useEffect(() => {
    if (isPasswordRecoveryMode) {
      setActiveView('reset-password');
    }
  }, [isPasswordRecoveryMode]);

  // Sync scans with Supabase when user logs in, or fallback to local storage
  useEffect(() => {
    if (user) {
      supabaseService.getUserScans(user.id).then(({ scans, error }) => {
        if (!error && scans && scans.length > 0) {
          setHistoryScans(scans);
        } else {
          // If user has local scans but none in cloud yet, sync them up!
          const local = storageService.getScans();
          if (local.length > 0) {
            supabaseService.syncLocalScans(user.id, local).then(() => {
              supabaseService.getUserScans(user.id).then(({ scans: synced }) => {
                if (synced && synced.length > 0) setHistoryScans(synced);
              });
            });
          }
        }
      });
    } else {
      const saved = storageService.getScans();
      setHistoryScans(saved);
    }
  }, [user]);

  // Deep link URL param parsing on mount (e.g. ?q=oreo)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('q');
      if (queryParam) {
        const qLower = queryParam.toLowerCase();
        const found = SEARCHABLE_PRODUCTS.find(p => 
          (p?.name || '').toLowerCase().includes(qLower) ||
          (p?.brand || '').toLowerCase().includes(qLower) ||
          qLower.includes((p?.name || '').toLowerCase())
        );

        if (found) {
          setCurrentProduct(found.productData);
          setActiveView('results');
          updatePageSEO({
            title: `${found.productData.productName} (${found.productData.brand}) – Nutrition & Ingredients`,
            description: found.productData.simpleSummary,
            product: found.productData,
            searchQuery: queryParam
          });
        }
      }
    }
  }, []);

  // Synchronize SEO tags and Canonical URLs whenever active view or current product changes
  useEffect(() => {
    if (activeView === 'results' && currentProduct) {
      updatePageSEO({
        title: `${currentProduct.productName} (${currentProduct.brand}) – Nutrition & Ingredients`,
        description: currentProduct.simpleSummary || `Nutrition breakdown, ingredient safety analysis, and harmful additive checks for ${currentProduct.productName}.`,
        product: currentProduct,
        searchQuery: currentProduct.productName
      });
      if (typeof window !== 'undefined') {
        const productUrl = `${window.location.pathname}?q=${encodeURIComponent(currentProduct.productName)}`;
        window.history.replaceState(null, '', productUrl);
      }
    } else if (activeView === 'home') {
      updatePageSEO({});
      if (typeof window !== 'undefined' && window.location.search) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else if (activeView === 'history') {
      updatePageSEO({
        title: 'Scan History & Saved Food Labels',
        description: 'Review your previously analyzed food products, nutrition ratings, and saved healthy labels on Food Decode.'
      });
    } else if (activeView === 'scan') {
      updatePageSEO({
        title: 'Scan Food Nutrition Label',
        description: 'Snap or upload a photo of any packaged food nutrition facts panel or ingredients list for instant AI analysis.'
      });
    }
  }, [activeView, currentProduct]);

  const handleAnalyzeImage = async (base64Image: string, mimeType: string) => {
    setIsLoading(true);
    setScannedPreviewImage(base64Image);
    setErrorMessage(null);
    setNonEdibleNotice(null);

    try {
      const result = await labelAnalysisService.analyzeLabel(base64Image, mimeType);
      
      // 1. Requirement 9: Display result immediately
      setCurrentProduct(result);
      setActiveView('results');

      // 2. Save result into local history
      storageService.saveScan(result);
      const updatedHistory = storageService.getScans();
      setHistoryScans(updatedHistory);

      // 3. Requirement 9: Save result to Supabase and associate with logged-in user
      if (user) {
        supabaseService.saveScan(user.id, result).then(({ scan, error }) => {
          if (!error && scan) {
            setCurrentProduct(scan);
            setHistoryScans(prev => [scan, ...prev.filter(s => s.id !== result.id && s.id !== scan.id)]);
          }
        });
      }
    } catch (err: any) {
      console.info('Label analysis result:', err?.message || err);
      if (err?.isNonEdible || err?.message?.toLowerCase().includes('non-edible')) {
        setNonEdibleNotice({
          reason: err.nonEdibleReason || err.message || 'The scanned image appears to be a non-edible object rather than an edible food or drink package. Food Decode is strictly engineered to scan and analyze edible foods, groceries, snacks, and beverages. Always prefer scan over search term for authentic packaged goods.',
          image: base64Image
        });
        setActiveView('scan');
      } else {
        setErrorMessage(
          err.message || 'Failed to process label image. Please ensure the label is well-lit and legible, or try a demo product.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (demo: LabelAnalysisResult) => {
    if (!demo) return;
    const productCopy = { ...demo };
    // Immediately transition view and state first
    setCurrentProduct(productCopy);
    setActiveView('results');

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }

    // Safely sync to storage in background
    try {
      storageService.saveScan(productCopy);
      setHistoryScans(storageService.getScans());
    } catch (e) {
      console.warn('Storage sync skipped:', e);
    }

    // Also persist demo exploration to user's Supabase account if logged in
    if (user) {
      supabaseService.saveScan(user.id, productCopy).then(({ scan }) => {
        if (scan) {
          setHistoryScans(prev => [scan, ...prev.filter(s => s.id !== demo.id && s.id !== scan.id)]);
        }
      }).catch(() => {});
    }
  };

  const handleToggleSave = async (targetId?: string) => {
    const idToToggle = targetId || currentProduct?.id;
    if (!idToToggle) return;

    // 1. Toggle in local storage
    storageService.toggleSave(idToToggle);
    let updated = storageService.getScans();

    // 2. Toggle in Supabase if user is authenticated
    if (user) {
      const { isFavorite } = await supabaseService.toggleFavorite(user.id, idToToggle);
      updated = updated.map(item => item.id === idToToggle ? { ...item, isSaved: isFavorite } : item);
    }

    setHistoryScans(updated);

    if (currentProduct && currentProduct.id === idToToggle) {
      const found = updated.find(s => s.id === idToToggle);
      if (found) {
        setCurrentProduct(found);
      } else {
        setCurrentProduct({ ...currentProduct, isSaved: !currentProduct.isSaved });
      }
    }
  };

  const handleDeleteScan = async (id: string) => {
    storageService.deleteScan(id);
    if (user) {
      await supabaseService.deleteScan(user.id, id);
    }
    const updated = storageService.getScans();
    setHistoryScans(updated);
    if (currentProduct?.id === id) {
      setCurrentProduct(null);
      setActiveView('history');
    }
  };

  const handleClearHistory = () => {
    storageService.clearHistory();
    setHistoryScans([]);
    if (activeView === 'results') {
      setActiveView('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/70 text-stone-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar
        onScanClick={() => {
          setActiveView('scan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDemoClick={() => handleSelectDemo(DEMO_PRODUCTS[0])}
        onHistoryClick={() => {
          setActiveView('history');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onFavoritesClick={() => {
          setActiveView('favorites');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCompareClick={() => setShowCompareModal(true)}
        onHomeClick={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLoginClick={() => {
          setActiveView('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSignUpClick={() => {
          setActiveView('signup');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        historyCount={historyScans.length}
        favoritesCount={historyScans.filter(s => s.isSaved).length}
        currentProduct={currentProduct}
      />

      {/* Non-edible Scan Rejection Notice */}
      {nonEdibleNotice && (
        <div className="max-w-4xl mx-auto px-4 mt-6 w-full animate-fadeIn">
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm sm:text-base text-amber-900">
                  Non-Edible Item Detected — Cannot Scan Non-Food Objects
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  {nonEdibleNotice.reason}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setNonEdibleNotice(null);
                      setActiveView('scan');
                    }}
                    className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 rounded-xl transition-colors shadow-2xs"
                  >
                    Scan an Edible Food Item
                  </button>
                  <button
                    onClick={() => {
                      setNonEdibleNotice(null);
                      handleSelectDemo(DEMO_PRODUCTS[0]);
                    }}
                    className="text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Load Sample Food Label
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setNonEdibleNotice(null)}
              className="text-amber-700 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-100 transition-colors"
              title="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Error Notice if analysis fails */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-6 w-full">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Label Reading Notice</h4>
                <p className="text-xs text-amber-900 mt-0.5">{errorMessage}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {scannedPreviewImage && (
                    <button
                      onClick={() => handleAnalyzeImage(scannedPreviewImage, 'image/jpeg')}
                      className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg transition-colors shadow-2xs"
                    >
                      Retry Analysis
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setErrorMessage(null);
                      handleSelectDemo(DEMO_PRODUCTS[0]);
                    }}
                    className="text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg transition-colors"
                  >
                    Explore Sample Cereal Label
                  </button>
                  <button
                    onClick={() => {
                      setErrorMessage(null);
                      handleSelectDemo(DEMO_PRODUCTS[1]);
                    }}
                    className="text-xs font-semibold text-teal-800 bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded-lg transition-colors"
                  >
                    Explore EU Yogurt Label
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main App Content Viewport */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          /* Processing Laser Scanning State */
          <div className="py-12">
            <ProcessingState previewImage={scannedPreviewImage} />
          </div>
        ) : activeView === 'home' ? (
          /* Landing Hero with Direct Demo CTAs */
          <div className="space-y-12">
            <Hero
              onScanClick={() => {
                setActiveView('scan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onUploadClick={() => {
                setActiveView('scan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectDemo={handleSelectDemo}
            />
          </div>
        ) : activeView === 'scan' ? (
          /* Image Capture / Upload / Crop Scanner */
          <div className="py-4">
            <UploadScanner
              onAnalyzeImage={handleAnalyzeImage}
              onSelectDemo={handleSelectDemo}
              isLoading={isLoading}
              onCancel={() => setActiveView(currentProduct ? 'results' : 'home')}
            />
          </div>
        ) : activeView === 'results' && currentProduct ? (
          /* Results Page View: Header -> Summary -> Circular Impact Chart -> Table -> Breakdown */
          <ResultsPage
            product={currentProduct}
            isSaved={Boolean(currentProduct.isSaved)}
            onToggleSave={handleToggleSave}
            onCompare={() => setShowCompareModal(true)}
            onNewScan={() => setActiveView('scan')}
            onSelectAlternative={(altProduct) => {
              storageService.saveScan(altProduct);
              setHistoryScans(storageService.getScans());
              setCurrentProduct(altProduct);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCompareWithAlternative={(altProduct) => {
              setComparisonAlternative(altProduct);
              setShowCompareModal(true);
            }}
          />
        ) : activeView === 'history' || activeView === 'favorites' ? (
          /* Scan History & Favorites Dashboard */
          <HistoryDashboard
            scans={historyScans}
            initialTab={activeView === 'favorites' ? 'saved' : 'all'}
            isLoggedIn={Boolean(user)}
            onOpenAuth={() => openAuthModal('login')}
            onSelectScan={(scan) => {
              setCurrentProduct(scan);
              setActiveView('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleFavorite={handleToggleSave}
            onDeleteScan={handleDeleteScan}
            onClearHistory={handleClearHistory}
            onCompareWith={(scan) => {
              setCurrentProduct(scan);
              setShowCompareModal(true);
            }}
          />
        ) : activeView === 'login' || activeView === 'signup' || activeView === 'forgot-password' || activeView === 'reset-password' ? (
          /* Dedicated Authentication Pages: Login, Sign up, Forgot Password, Reset Password */
          <AuthPage
            initialTab={
              activeView === 'signup'
                ? 'signup'
                : activeView === 'forgot-password'
                ? 'forgot'
                : activeView === 'reset-password'
                ? 'reset'
                : 'login'
            }
            onNavigateHome={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateScan={() => {
              setActiveView('scan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* Fallback view if no product selected */
          <div className="py-12 text-center space-y-4">
            <h3 className="text-xl font-bold text-stone-800">No Food Label Currently Loaded</h3>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              Scan a package label or choose a demo to view nutrition facts and ingredient analyses.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveView('scan')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
              >
                Open Scanner
              </button>
              <button
                onClick={() => handleSelectDemo(DEMO_PRODUCTS[0])}
                className="px-5 py-2.5 rounded-xl bg-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-300"
              >
                Load Demo Product
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Side-by-Side Product Comparison Modal */}
      {showCompareModal && (
        <ProductComparison
          currentProduct={currentProduct || historyScans[0] || DEMO_PRODUCTS[0]}
          allScans={
            comparisonAlternative
              ? [comparisonAlternative, ...historyScans.filter(s => s.id !== comparisonAlternative.id)]
              : historyScans.length > 0 ? historyScans : DEMO_PRODUCTS
          }
          onClose={() => {
            setShowCompareModal(false);
            setComparisonAlternative(null);
          }}
        />
      )}

      {/* Global Footer with Required Non-Medical Disclaimer & Policy Modals */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-800 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-xs shadow-sm">
                FD
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight font-display text-white">
                    <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 bg-clip-text text-transparent">Food</span> Decode
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    AI OCR
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400/90 font-medium -mt-0.5">Prefer scan over search term for 100% packaging fidelity</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 text-xs">
              <button
                onClick={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-emerald-300 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveView('scan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-emerald-300 transition-colors font-medium flex items-center gap-1"
              >
                <Scan className="w-3 h-3 text-emerald-400" />
                Scan Label (Preferred)
              </button>
              <button
                onClick={() => {
                  setActiveView('history');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-emerald-300 transition-colors font-medium"
              >
                History ({historyScans.length})
              </button>
              <button
                onClick={() => setShowCompareModal(true)}
                className="hover:text-emerald-300 transition-colors font-medium"
              >
                Compare Products
              </button>
              <span className="text-stone-700 hidden sm:inline">|</span>
              <button
                onClick={() => setActiveFooterModal('about')}
                className="text-stone-300 hover:text-white font-semibold underline underline-offset-4 decoration-stone-600 hover:decoration-emerald-400 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => setActiveFooterModal('privacy')}
                className="text-stone-300 hover:text-white font-semibold underline underline-offset-4 decoration-stone-600 hover:decoration-emerald-400 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveFooterModal('terms')}
                className="text-stone-300 hover:text-white font-semibold underline underline-offset-4 decoration-stone-600 hover:decoration-emerald-400 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>

          {/* Mandatory Non-Medical Disclaimer */}
          <div className="text-xs text-stone-500 leading-relaxed max-w-4xl space-y-1">
            <p className="font-semibold text-stone-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
              General Educational & Consumer Transparency Notice:
            </p>
            <p>
              Food Decode extracts information visible on packaged food labels using computer vision and standard nutritional databases. We advise consumers to prefer scan over search term to ensure accurate reading of specific batch lot formulations and regional allergen warning boxes. Food Decode is intended solely for consumer education and does not provide medical, dietary, or diagnostic advice.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-600">
            <span>Food Decode AI • Optical Character Recognition & Nutritional Standardization</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveFooterModal('about')} className="hover:text-stone-400">About</button>
              <span>•</span>
              <button onClick={() => setActiveFooterModal('privacy')} className="hover:text-stone-400">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => setActiveFooterModal('terms')} className="hover:text-stone-400">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Modals Dialog */}
      <FooterModals
        activeModal={activeFooterModal}
        onClose={() => setActiveFooterModal(null)}
        onSwitchModal={(type) => setActiveFooterModal(type)}
        onScanClick={() => {
          setActiveView('scan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal />

      {/* Supabase User Profile Modal */}
      <ProfileModal
        totalScansCount={historyScans.length}
        totalFavoritesCount={historyScans.filter(s => s.isSaved).length}
      />
    </div>
  );
}
