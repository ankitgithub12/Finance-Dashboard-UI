import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [
    { 
      id: 'init-1', 
      title: 'Welcome to NexusFin', 
      message: 'Your personal finance engine is ready to track.', 
      read: false, 
      time: Date.now() 
    },
  ],
  toasts: [], // For on-screen rapid popups
  
  addNotification: (title, message) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newNotif = { id, title, message, read: false, time: Date.now() };
    
    // Push into persistent list and active toasts
    set(state => ({
      notifications: [newNotif, ...state.notifications].slice(0, 50), // keep history clean
      toasts: [...state.toasts, newNotif]
    }));

    // Automatically dismiss the toast visual after 4.5 seconds
    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 4500);
  },

  markAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllAsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  }))
}));
