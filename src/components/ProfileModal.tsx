import React, { useState } from 'react';
import { X, User, Mail, LogOut, Check, Loader2, Sparkles, ShieldCheck, Database, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  totalScansCount: number;
  totalFavoritesCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  totalScansCount,
  totalFavoritesCount
}) => {
  const {
    user,
    profile,
    isProfileModalOpen,
    closeProfileModal,
    signOut,
    updateProfile,
    isConfigured
  } = useAuth();

  const [name, setName] = useState(profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isProfileModalOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    const { error } = await updateProfile({
      full_name: name.trim(),
      avatar_url: avatarUrl.trim() || undefined
    });

    setIsSaving(false);
    if (error) {
      setErrorMessage(error);
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    closeProfileModal();
  };

  const memberDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : 'Recent Member';

  const userInitial = (name || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={closeProfileModal}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-xs shadow-sm">
              FD
            </div>
            <div>
              <span className="font-extrabold text-stone-900 tracking-tight text-base font-display">User Profile</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Supabase Authenticated
              </span>
            </div>
          </div>

          <button
            onClick={closeProfileModal}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Identity Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-md overflow-hidden shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name || 'Avatar'}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarUrl('')}
                />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base text-stone-900 truncate">
                {name || 'Food Decode Consumer'}
              </h3>
              <p className="text-xs text-stone-500 truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {memberDate}
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Cloud Active</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-center">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                Total Saved Scans
              </span>
              <span className="text-2xl font-black text-emerald-950 font-display mt-0.5 block">
                {totalScansCount}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-center">
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                Favorite Labels
              </span>
              <span className="text-2xl font-black text-teal-950 font-display mt-0.5 block">
                {totalFavoritesCount}
              </span>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Edit Account Details
            </h4>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMessage}
              </div>
            )}

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Avatar Image URL (Optional)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-700/20 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
