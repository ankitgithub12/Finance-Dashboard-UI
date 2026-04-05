import { useFinanceStore } from '../../store/useFinanceStore';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Bell, Shield, Eye, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Header() {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-20 px-8 border-b border-borderLight flex items-center justify-between bg-surface/30 backdrop-blur-md z-20">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-br from-white to-textMuted bg-clip-text text-transparent">Overview</h2>
        <p className="text-sm text-textMuted">Welcome back, here's your financial summary.</p>
      </div>

      <div className="flex items-center space-x-6">
        {/* Role Toggle */}
        <div className="flex items-center bg-background rounded-full p-1 border border-borderLight/50">
          <button
            onClick={() => setRole('Viewer')}
            className={cn(
              "flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
              role === 'Viewer' ? "bg-surface text-white shadow-md" : "text-textMuted hover:text-white"
            )}
          >
            <Eye className="w-4 h-4" />
            <span>Viewer</span>
          </button>
          <button
            onClick={() => setRole('Admin')}
            className={cn(
              "flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
              role === 'Admin' ? "bg-primary/20 text-primary shadow-md" : "text-textMuted hover:text-white"
            )}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        <button className="relative p-2 text-textMuted hover:text-white transition-colors rounded-lg hover:bg-surface-2 border border-transparent hover:border-borderLight">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-surface"></span>
        </button>

        <button 
          onClick={toggleTheme}
          className="p-2 text-textMuted hover:text-white transition-colors rounded-lg hover:bg-surface-2 border border-transparent hover:border-borderLight"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-borderLight/50">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-textMuted">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
            <div className="w-full h-full bg-surface rounded-full flex items-center justify-center">
               <UserCircle className="w-6 h-6 text-textMain" />
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 text-textMuted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
