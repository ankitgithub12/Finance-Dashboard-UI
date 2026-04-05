import { create } from 'zustand';
import { authAPI } from '../utils/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('authUser')) || null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  // ─── Signup ─────────────────────────────────────────────────────────────
  signup: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.signup(formData);
      const { token, user } = res.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed.';
      const errors = err.response?.data?.errors || {};
      set({ isLoading: false, error: message });
      return { success: false, message, errors };
    }
  },

  // ─── Login ──────────────────────────────────────────────────────────────
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.login(credentials);
      const { token, user } = res.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed.';
      const errors = err.response?.data?.errors || {};
      set({ isLoading: false, error: message });
      return { success: false, message, errors };
    }
  },

  // ─── Forgot Password ─────────────────────────────────────────────────────
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.forgotPassword({ email });
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Request failed.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  // ─── Reset Password ──────────────────────────────────────────────────────
  resetPassword: async (token, passwords) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.resetPassword(token, passwords);
      const { token: authToken, user } = res.data;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(user));
      set({ user, token: authToken, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Reset failed.';
      const errors = err.response?.data?.errors || {};
      set({ isLoading: false, error: message });
      return { success: false, message, errors };
    }
  },

  // ─── Update Password ─────────────────────────────────────────────────────
  updatePassword: async (passwords) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.updatePassword(passwords);
      const { token: authToken, user } = res.data;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(user));
      set({ user, token: authToken, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password update failed.';
      const errors = err.response?.data?.errors || {};
      set({ isLoading: false, error: message });
      return { success: false, message, errors };
    }
  },

  // ─── Logout ──────────────────────────────────────────────────────────────
  logout: async () => {
    try { await authAPI.logout(); } catch (_) {}
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
