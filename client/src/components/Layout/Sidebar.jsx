import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, PieChart, Wallet, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
    { name: 'Insights', path: '/insights', icon: PieChart },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 border-r border-borderLight bg-surface/50 backdrop-blur-xl flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center space-x-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">NexusFin</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-textMuted hover:bg-surface hover:text-textMain"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full" />
                  )}
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-textMuted group-hover:text-textMain")} />
                  <span>{link.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-6 text-xs text-textMuted/60 text-center">
        &copy; 2026 NexusFin Demo
      </div>
    </aside>
  );
}
