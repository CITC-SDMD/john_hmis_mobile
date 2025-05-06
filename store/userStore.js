import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      currentUsersPage: 1,
      selectedUser: null,

      setUser: (user) => set({ user }),
      setCurrentUsersPage: (page) => set({ currentUsersPage: page }),
      setSelectedUser: (data) => set({ selectedUser: data }),

      resetUser: () => set({ user: null }),
      resetCurrentUsersPage: () => set({ currentUsersPage: 1 }),
      resetSelectedUser: () => set({ selectedUser: null }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
