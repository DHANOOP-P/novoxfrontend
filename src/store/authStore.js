import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  bootstrap: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/auth/me');
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return data.user;
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
