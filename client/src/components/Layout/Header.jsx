import { useFinanceStore } from '../../store/useFinanceStore';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Bell, Shield, Eye, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';

export default function Header() {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();
  const { user, logout } = useAuthStore();
  const { notifications, markAllAsRead, markAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

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
              role === 'Viewer' ? "bg-surface text-textMain shadow-md border-border" : "text-textMuted hover:text-textMain border-transparent"
            )}
          >
            <Eye className="w-4 h-4" />
            <span>Viewer</span>
          </button>
          <button
            onClick={() => setRole('Admin')}
            className={cn(
              "flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
              role === 'Admin' ? "bg-primary/20 text-primary shadow-md border-primary/30" : "text-textMuted hover:text-textMain border-transparent"
            )}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-textMuted hover:text-textMain transition-colors rounded-lg hover:bg-surface-2 border border-transparent hover:border-borderLight"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-surface"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel p-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200 shadow-2xl">
              <div className="flex justify-between items-center border-b border-borderLight pb-2 mb-3">
                <h4 className="text-sm font-bold text-textMain">Notifications {unreadCount > 0 && `(${unreadCount})`}</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-[11px] text-primary hover:underline font-medium">Mark all read</button>
                )}
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 select-none">
                {notifications.length === 0 ? (
                  <p className="text-sm text-textMuted text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        "text-sm p-2 -mx-2 rounded-lg cursor-pointer transition-colors relative",
                        !n.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-2"
                      )}
                    >
                      {!n.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-primary rounded-r-full" />}
                      <p className={cn("font-medium", !n.read ? "text-textMain" : "text-textMuted")}>{n.title}</p>
                      <p className="text-xs mt-1 text-textMuted line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-textDim mt-2">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 text-textMuted hover:text-textMain transition-colors rounded-lg hover:bg-surface-2 border border-transparent hover:border-borderLight"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-borderLight/50">
          <div className="text-right hidden md:block">
             <p className="text-sm font-medium text-textMain">{user?.name || 'User'}</p>
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
