import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toaster from '../Toaster';
import { useEffect } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';

export default function Layout() {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    // Simulated Backend Push Engine
    const timers = [];

    // Push an alert after 30 seconds to demonstrate Real-Time capabilities
    timers.push(setTimeout(() => {
      addNotification('Security Alert', 'New login detected from simulated IP 192.168.x.x');
    }, 15000));

    // Push an actionable insight after 60 seconds
    timers.push(setTimeout(() => {
      addNotification('Market Insight', 'Tech stocks are up. Review your portfolio allocations.');
    }, 45000));

    return () => timers.forEach(clearTimeout);
  }, [addNotification]);
  return (
    <div className="flex h-screen bg-background text-textMain overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50 p-6 relative">
          {/* Subtle glowing effects for glassmorphism background */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto z-10 relative">
             <Outlet />
          </div>
        </main>
      </div>
      {/* Global Realtime Toaster */}
      <Toaster />
    </div>
  );
}
