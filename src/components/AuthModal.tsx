import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, Loader2, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, Database, ShieldCheck } from 'lucide-react';
import { useAuth, AuthTab } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    isConfigured,
    isGoogleOAuthEnabled
  } = useAuth();

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

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    if (isGoogleOAuthEnabled === false) {
      setErrorMsg('Google Sign-In is not enabled on this Supabase project yet. Please sign in or register with your email and password below.');
      return;
    }
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

    if (authModalTab !== 'reset' && (!email || !email.includes('@'))) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (authModalTab === 'reset') {
      if (!password || password.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    } else if (authModalTab !== 'forgot' && (!password || password.length < 6)) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (authModalTab === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error);
        } else {
          closeAuthModal();
        }
      } else if (authModalTab === 'signup') {
        const { error, requiresConfirmation } = await signUp(email, password, name);
        if (error) {
          setErrorMsg(error);
        } else if (requiresConfirmation) {
          setSuccessMsg('Account created! A confirmation email has been sent to your address. Please verify your email to log in.');
        } else {
          setSuccessMsg('Account created successfully! Welcome to Food Decode.');
          setTimeout(() => {
            closeAuthModal();
          }, 1200);
        }
      } else if (authModalTab === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Password reset email sent! Please check your inbox (and spam folder) for the reset link.');
        }
      } else if (authModalTab === 'reset') {
        const { error } = await updatePassword(password);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Password has been successfully updated! You can now access your account.');
          setTimeout(() => {
            closeAuthModal();
          }, 1500);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={closeAuthModal}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full overflow-hidden text-stone-800 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-xs shadow-sm">
              FD
            </div>
            <div>
              <span className="font-extrabold text-stone-900 tracking-tight text-base font-display">Food Decode</span>
              <span className="text-[10px] text-stone-400 block -mt-0.5">Cloud Vault & Saved Nutrition</span>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missing Supabase Configuration Banner (if unconfigured) */}
        {!isConfigured && (
          <div className="p-4 mx-6 mt-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Database className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Supabase Connection Info</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-800">
              To enable cloud authentication and sync across devices, configure your keys in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code>:
            </p>
            <div className="p-2 rounded-lg bg-amber-100/60 font-mono text-[10px] space-y-0.5 text-amber-950 select-all">
              <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=your-anon-key</div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        {authModalTab !== 'reset' ? (
          <div className="flex border-b border-stone-200 bg-stone-100/60 px-6 gap-2 text-xs font-semibold pt-2">
            <button
              type="button"
              onClick={() => {
                openAuthModal('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                authModalTab === 'login'
                  ? 'border-emerald-600 text-emerald-800 font-bold bg-white/70 rounded-t-lg'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                openAuthModal('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                authModalTab === 'signup'
                  ? 'border-emerald-600 text-emerald-800 font-bold bg-white/70 rounded-t-lg'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                openAuthModal('forgot');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                authModalTab === 'forgot'
                  ? 'border-emerald-600 text-emerald-800 font-bold bg-white/70 rounded-t-lg'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Forgot Password
            </button>
          </div>
        ) : (
          <div className="border-b border-stone-200 bg-emerald-50/70 px-6 py-2.5 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Set New Account Password</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign In Button for Login and Signup */}
          {(authModalTab === 'login' || authModalTab === 'signup') && (
            <div className="space-y-3 pb-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs active:scale-98 disabled:opacity-60 cursor-pointer"
                title={isGoogleOAuthEnabled === false ? "Google Sign-In is not enabled on this Supabase project. Use email & password below." : "Continue with Google"}
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
                <span>
                  {authModalTab === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                </span>
                {isGoogleOAuthEnabled === false && (
                  <span className="text-[10px] text-amber-700 bg-amber-100 font-medium px-1.5 py-0.5 rounded-full border border-amber-200 ml-1">
                    OAuth Setup Needed
                  </span>
                )}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-3 text-[10px] text-stone-400 uppercase tracking-widest font-semibold">Or with email</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name Field (Sign Up Only) */}
            {authModalTab === 'signup' && (
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

            {/* Email Field (Login, Sign Up, Forgot) */}
            {authModalTab !== 'reset' && (
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

            {/* Password Field (Login, Sign Up, Reset) */}
            {authModalTab !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700 block">
                    {authModalTab === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  {authModalTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        openAuthModal('forgot');
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authModalTab === 'signup' && (
                  <p className="text-[10px] text-stone-400">Must be at least 6 characters.</p>
                )}
              </div>
            )}

            {/* Confirm Password (Reset tab only) */}
            {authModalTab === 'reset' && (
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

            {/* Remember Me Session Checkbox (Login tab only) */}
            {authModalTab === 'login' && (
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="remember-session"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <label htmlFor="remember-session" className="text-xs text-stone-600 select-none cursor-pointer flex items-center gap-1">
                  <span>Remember login session on this browser</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </label>
              </div>
            )}

            {/* Submit Button */}
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
              ) : authModalTab === 'login' ? (
                <>
                  <span>Sign In to Food Decode</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : authModalTab === 'signup' ? (
                <>
                  <span>Create Free Account</span>
                  <Sparkles className="w-4 h-4" />
                </>
              ) : authModalTab === 'forgot' ? (
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

            {/* Switch between Sign In / Sign Up */}
            <div className="pt-2 text-center text-xs text-stone-500">
              {authModalTab === 'login' ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Sign up free
                  </button>
                </p>
              ) : authModalTab === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
