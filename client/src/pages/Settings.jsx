import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useFinanceStore } from '../store/useFinanceStore';
import { User, Mail, Shield, Key, Moon, Sun, Bell, MapPin, Eye, EyeOff, Check, X } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';

export default function Settings() {
  const { user, updatePassword, isLoading } = useAuthStore();
  const { role, theme, toggleTheme } = useFinanceStore();
  const { addNotification } = useNotificationStore();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState(null);

  // Real-time validation checks
  const validations = {
    length: passwordForm.newPassword.length >= 8,
    upper: /[A-Z]/.test(passwordForm.newPassword),
    lower: /[a-z]/.test(passwordForm.newPassword),
    number: /[0-9]/.test(passwordForm.newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword),
  };

  const isNewPasswordValid = Object.values(validations).every(Boolean);
  const passwordsMatch = passwordForm.newPassword === passwordForm.confirmNewPassword;

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isNewPasswordValid) {
      setError('Please ensure your new password meets all the security requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('New passwords do not match.');
      return;
    }

    const res = await updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmNewPassword: passwordForm.confirmNewPassword
    });

    if (res.success) {
      addNotification('Security Updated', 'Your password was successfully changed.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      setError(res.message || 'Failed to update password.');
    }
  };

  return (
    <div className="space-y-6 pb-10 page-enter max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-textMain tracking-tight">Account Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Info & Preferences */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 card-enter" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Full Name</p>
                <div className="px-3 py-2 bg-surface-2 border border-borderLight rounded-lg text-textMain font-medium">
                  {user?.name || 'Authorized User'}
                </div>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Email Address</p>
                <div className="px-3 py-2 bg-surface-2 border border-borderLight rounded-lg text-textMain font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-textMuted" /> {user?.email}
                </div>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase tracking-wider mb-1">System Role</p>
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-2 border border-borderLight rounded-lg">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span className="text-secondary font-semibold">{role || user?.role || 'Viewer'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Location / Timezone</p>
                <div className="px-3 py-2 bg-surface-2 border border-borderLight rounded-lg text-textMuted text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Detected (Local)
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 card-enter" style={{ animationDelay: '150ms' }}>
            <h3 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-accent" /> Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-textMain">Dashboard Theme</p>
                  <p className="text-xs text-textMuted mt-0.5">Toggle light & dark mode</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="p-2 bg-surface-2 border border-borderLight rounded-lg hover:border-primary transition-colors text-textMain"
                >
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                <div>
                  <p className="text-sm font-medium text-textMain">Email Notifications</p>
                  <p className="text-xs text-textMuted mt-0.5">Weekly summary reports</p>
                </div>
                <button disabled className="p-2 bg-surface-2 border border-borderLight rounded-lg text-textMuted">
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security (Password Update) */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 card-enter" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" /> Security Setting
            </h3>
            <p className="text-sm text-textMuted mb-6">
              Ensure your account is using a long, random password to stay secure. 
            </p>

            {error && (
              <div className="mb-6 p-3 bg-accent/10 border border-accent/20 text-accent text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPwd.current ? "text" : "password"} 
                    required
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                    className="input-field pr-10"
                    placeholder="Enter current password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain"
                  >
                    {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showPwd.new ? "text" : "password"} 
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="input-field pr-10"
                    placeholder="Enter new password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain"
                  >
                    {showPwd.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Visual Validation Checklist */}
                {passwordForm.newPassword.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div className={validations.length ? "text-secondary flex items-center gap-1" : "text-textMuted flex items-center gap-1"}>
                      {validations.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-textDim" />} At least 8 characters
                    </div>
                    <div className={validations.upper && validations.lower ? "text-secondary flex items-center gap-1" : "text-textMuted flex items-center gap-1"}>
                      {validations.upper && validations.lower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-textDim" />} Upper & lowercase
                    </div>
                    <div className={validations.number ? "text-secondary flex items-center gap-1" : "text-textMuted flex items-center gap-1"}>
                      {validations.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-textDim" />} At least one number
                    </div>
                    <div className={validations.special ? "text-secondary flex items-center gap-1" : "text-textMuted flex items-center gap-1"}>
                      {validations.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-textDim" />} Special character
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showPwd.confirm ? "text" : "password"} 
                    required
                    value={passwordForm.confirmNewPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, confirmNewPassword: e.target.value }))}
                    className="input-field pr-10"
                    placeholder="Re-enter new password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain"
                  >
                    {showPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.confirmNewPassword.length > 0 && !passwordsMatch && (
                  <p className="text-[11px] text-accent mt-1 flex items-center gap-1"><X className="w-3 h-3" /> Passwords do not match</p>
                )}
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading || (passwordForm.newPassword.length > 0 && !isNewPasswordValid) || (passwordForm.confirmNewPassword.length > 0 && !passwordsMatch)}
                  className="btn-primary w-full sm:w-auto px-8 py-2.5 flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline fallback icon for preferences to avoid excessive imports
function SettingsIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}
