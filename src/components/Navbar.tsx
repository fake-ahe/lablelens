import React from 'react';
import { Sparkles, Scan, History, Scale, User, Bookmark, LogOut, UserPlus, LogIn } from 'lucide-react';
import { LabelAnalysisResult } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onScanClick: () => void;
  onDemoClick: () => void;
  onHistoryClick: () => void;
  onFavoritesClick: () => void;
  onCompareClick: () => void;
  onHomeClick: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  historyCount: number;
  favoritesCount: number;
  currentProduct: LabelAnalysisResult | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScanClick,
  onDemoClick,
  onHistoryClick,
  onFavoritesClick,
  onCompareClick,
  onHomeClick,
  onLoginClick,
  onSignUpClick,
  historyCount,
  favoritesCount,
  currentProduct
}) => {
  const { user, profile, openAuthModal, openProfileModal, signOut } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userInitial = (displayName || 'U').charAt(0).toUpperCase();

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      openAuthModal('login');
    }
  };

  const handleSignUp = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      openAuthModal('signup');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          id="nav-brand-logo"
          onClick={onHomeClick}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/40 group-hover:scale-105 transition-all">
            <Scan className="w-5 h-5 text-white drop-shadow-xs" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight flex items-center gap-1.5 font-display">
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-xs">
                Food
              </span>
              <span className="text-white font-extrabold tracking-tight">
                Decode
              </span>
              <span className="text-[9px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                AI SCAN
              </span>
            </span>
            <p className="text-[11px] text-stone-400 -mt-0.5 hidden sm:block">
              <span className="text-emerald-400/90 font-medium">Prefer scan over search term</span> • Nutrition Decoded
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Try Demo Button */}
          <button
            id="nav-try-demo-btn"
            onClick={onDemoClick}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Try Demo
          </button>

          {/* Compare Button */}
          <button
            id="nav-compare-btn"
            onClick={onCompareClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-stone-300 bg-stone-800/80 border border-stone-700/80 hover:bg-stone-700/80 transition-colors cursor-pointer"
            title="Compare two food labels"
          >
            <Scale className="w-3.5 h-3.5 text-teal-400" />
            <span>Compare</span>
          </button>

          {/* Always Available: Primary Scan Button (Users can scan without logging in!) */}
          <button
            id="nav-scan-cta-btn"
            onClick={onScanClick}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm hover:shadow-emerald-400/20 active:scale-95 cursor-pointer"
            title="Scan any food label (no login required)"
          >
            <Scan className="w-4 h-4" />
            <span className="hidden xs:inline">Scan Label</span>
          </button>

          {/* ========================================================================= */}
          {/* WHEN LOGGED IN: Profile, History, Saved Foods, Logout                      */}
          {/* ========================================================================= */}
          {user ? (
            <>
              {/* Saved Foods Button */}
              <button
                id="nav-saved-foods-btn"
                onClick={onFavoritesClick}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg text-stone-300 bg-stone-800/80 border border-stone-700/80 hover:bg-stone-700/80 transition-colors relative cursor-pointer"
                title="View your saved foods"
              >
                <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Saved Foods</span>
                {favoritesCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* History Button */}
              <button
                id="nav-history-btn"
                onClick={onHistoryClick}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg text-stone-300 bg-stone-800/80 border border-stone-700/80 hover:bg-stone-700/80 transition-colors relative cursor-pointer"
                title="View your scan history"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">History</span>
                {historyCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                    {historyCount}
                  </span>
                )}
              </button>

              {/* Profile Button */}
              <button
                id="nav-user-profile-btn"
                onClick={openProfileModal}
                className="inline-flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold transition-all cursor-pointer group"
                title={`Signed in as ${user.email}. Click to view profile.`}
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-[11px] font-black shrink-0 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <span className="max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline text-stone-200 group-hover:text-white">
                  {displayName}
                </span>
              </button>

              {/* Logout Button */}
              <button
                id="nav-logout-btn"
                onClick={() => signOut()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition-colors cursor-pointer"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            /* ========================================================================= */
            /* WHEN LOGGED OUT: Login, Sign up                                           */
            /* ========================================================================= */
            <>
              {/* Login Button */}
              <button
                id="nav-login-btn"
                onClick={handleLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-stone-300 bg-stone-800/80 border border-stone-700/80 hover:bg-stone-700/80 hover:text-white transition-all cursor-pointer"
                title="Log in to your Food Decode account"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login</span>
              </button>

              {/* Sign up Button */}
              <button
                id="nav-signup-btn"
                onClick={handleSignUp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 hover:bg-emerald-900/80 hover:text-emerald-200 transition-all shadow-2xs cursor-pointer"
                title="Create a free Food Decode account"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign up</span>
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
};
