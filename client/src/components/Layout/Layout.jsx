import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toaster from '../Toaster';
import { useEffect } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';

export default function Layout() {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    // Advanced Spontaneous Backend Push Simulation Engine
    const mockServerEvents = [
      { title: 'Security Alert', message: 'New device logged in from New York, USA.' },
      { title: 'Market Insight', message: 'Tech stocks are up 2.4% today. Review your portfolio.' },
      { title: 'Budget Warning', message: 'You have reached 80% of your Entertainment budget.' },
      { title: 'Subscription Upcoming', message: 'Netflix ($15.99) will be charged in 3 days.' },
      { title: 'Goal Reached!', message: 'Congratulations! You hit your monthly savings target.' },
      { title: 'System Maintenance', message: 'NexusFin servers will be down for 5 minutes at midnight.' }
    ];

    // Fire a random notification every 45 to 90 seconds
    const loopSimulation = () => {
      const waitTime = Math.floor(Math.random() * (90000 - 45000 + 1)) + 45000;
      
      return setTimeout(() => {
        // Pick a random event
        const event = mockServerEvents[Math.floor(Math.random() * mockServerEvents.length)];
        addNotification(event.title, event.message);
        
        // recursively loop
        timerId = loopSimulation();
      }, waitTime);
    };

    // Give an initial quick demo notification after 15 seconds
    let timerId = setTimeout(() => {
      addNotification('NexusFin Sync', 'Your latest bank transactions have been securely synced.');
      timerId = loopSimulation();
    }, 15000);

    return () => clearTimeout(timerId);
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
