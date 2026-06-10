import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      login: (authResponse) => {
        localStorage.setItem('accessToken', authResponse.accessToken);
        set({
          accessToken: authResponse.accessToken,
          user: {
            id: authResponse.userId,
            username: authResponse.username,
            email: authResponse.email,
            fullName: authResponse.fullName,
            role: authResponse.role,
            userType: authResponse.userType,
            avatarUrl: authResponse.avatarUrl,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        set({ accessToken: null, user: null, isAuthenticated: false });
      },

      getToken: () => get().accessToken,
      getUser: () => get().user,
    }),
    {
      name: 'nexcrm-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
