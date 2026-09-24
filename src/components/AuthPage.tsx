import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, ArrowRight, Loader2, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, ArrowLeft, Scan, ShieldCheck } from 'lucide-react';
import { useAuth, AuthTab } from '../context/AuthContext';

interface AuthPageProps {
  initialTab?: 'login' | 'signup' | 'forgot' | 'reset';
  onNavigateHome: () => void;
  onNavigateScan: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = 'login',
  onNavigateHome,
  onNavigateScan
}) => {
  const {
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    isConfigured,
    user
  } = useAuth();

  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // If already logged in, show a friendly status and redirect options
  if (user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-stone-200 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 font-display">You are already signed in</h2>
        <p className="text-xs text-stone-500">
          Signed in as <strong>{user.email}</strong>. Your scans and saved food labels will sync automatically.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onNavigateScan}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Scan className="w-4 h-4" />
            <span>Scan a Food Label</span>
          </button>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (error) {
      setErrorMsg(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (tab !== 'reset' && (!email || !email.includes('@'))) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (tab === 'reset') {
      if (!password || password.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    } else if (tab !== 'forgot' && (!password || password.length < 6)) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (tab === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error);
        } else {
          onNavigateHome();
        }
      } else if (tab === 'signup') {
        const { error } = await signUp(email, password, name);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Account created successfully! Welcome to Food Decode.');
          setTimeout(() => {
            onNavigateHome();
          }, 1200);
        }
      } else if (tab === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Password reset instructions sent. Please check your email inbox.');
        }
      } else if (tab === 'reset') {
        const { error } = await updatePassword(password);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Password has been successfully updated! You can now log in.');
          setTimeout(() => {
            setTab('login');
          }, 1500);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-md">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center space-y-1 pb-4 border-b border-stone-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md mx-auto mb-2">
          FD
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
          {tab === 'login' && 'Sign In to Food Decode'}
          {tab === 'signup' && 'Create Your Free Account'}
          {tab === 'forgot' && 'Reset Your Password'}
          {tab === 'reset' && 'Create a New Password'}
        </h1>
        <p className="text-xs text-stone-500 max-w-xs mx-auto">
          {tab === 'login' && 'Access your saved foods, scan history, and nutrition analytics across devices.'}
          {tab === 'signup' && 'Sign up to keep your scanned food labels and healthy ratings securely saved.'}
          {tab === 'forgot' && 'Enter your account email and we will send you a secure password reset link.'}
          {tab === 'reset' && 'Enter and confirm your new account password below.'}
        </p>
      </div>

      {/* Tab Switcher */}
      {tab !== 'reset' && (
        <div className="flex border-b border-stone-200 bg-stone-100/70 rounded-xl p-1 mt-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Notifications */}
      <div className="mt-4 space-y-3">
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Login button */}
        {(tab === 'login' || tab === 'signup') && (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{tab === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-[10px] text-stone-400 uppercase tracking-widest font-semibold">Or with email</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {tab !== 'reset' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {tab !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 block">
                  {tab === 'reset' ? 'New Password' : 'Password'}
                </label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {tab === 'reset' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {tab === 'login' && (
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="remember-session-page"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
              />
              <label htmlFor="remember-session-page" className="text-xs text-stone-600 select-none cursor-pointer flex items-center gap-1">
                <span>Remember login session on this device</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-700/20 active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : tab === 'login' ? (
              <>
                <span>Sign In to Food Decode</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : tab === 'signup' ? (
              <>
                <span>Create Free Account</span>
                <Sparkles className="w-4 h-4" />
              </>
            ) : tab === 'forgot' ? (
              <>
                <span>Send Reset Link</span>
                <KeyRound className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Update Password & Sign In</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          {tab === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
