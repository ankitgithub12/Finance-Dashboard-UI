import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockAPI } from '../utils/mockApiService';
import { useNotificationStore } from './useNotificationStore';

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      role: 'Viewer', // 'Viewer' | 'Admin'
      theme: 'dark',  // 'dark' | 'light'

      // ─── Theme ─────────────────────────────────────────────────────────
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
      },

      // ─── Role ──────────────────────────────────────────────────────────
      setRole: (role) => set({ role }),

      // ─── Transactions (Async) ──────────────────────────────────────────
      fetchTransactions: async () => {
        set({ isLoading: true });
        try {
          const res = await mockAPI.fetchTransactions();
          set({ transactions: res.data, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch:", error);
          set({ isLoading: false });
        }
      },

      addTransaction: async (transaction) => {
        set({ isLoading: true });
        try {
          const res = await mockAPI.createTransaction(transaction);
          set((state) => ({
            transactions: [res.data, ...state.transactions],
            isLoading: false
          }));
          useNotificationStore.getState().addNotification(
            'Transaction Added', 
            `${transaction.type === 'Income' ? '+$' : '-$'}${transaction.amount} for ${transaction.category}`
          );
        } catch (error) {
           console.error("Failed to add:", error);
           set({ isLoading: false });
        }
      },

      editTransaction: async (updated) => {
        set({ isLoading: true });
        try {
          const res = await mockAPI.updateTransaction(updated);
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === res.data.id ? res.data : t
            ),
            isLoading: false
          }));
          useNotificationStore.getState().addNotification(
            'Transaction Updated', 
            `Successfully modified "${updated.description}"`
          );
        } catch (error) {
           console.error("Failed to update:", error);
           set({ isLoading: false });
        }
      },

      deleteTransaction: async (id) => {
        set({ isLoading: true });
        try {
          await mockAPI.deleteTransaction(id);
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            isLoading: false
          }));
          useNotificationStore.getState().addNotification(
            'Transaction Deleted', 
            'The record has been permanently removed.'
          );
        } catch (error) {
          console.error("Failed to delete:", error);
          set({ isLoading: false });
        }
      },

      resetTransactions: async () => {
        // Just refetch the initial from mock
        get().fetchTransactions();
      },
    }),
    {
      name: 'finance-dashboard-store', // localStorage key
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-apply theme on hydration
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
