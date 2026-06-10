import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCustomerAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      customer: null,
      isAuthenticated: false,

      login: (authResponse) => {
        localStorage.setItem('gflix_token', authResponse.accessToken);
        set({
          accessToken: authResponse.accessToken,
          customer: {
            id: authResponse.userId,
            name: authResponse.fullName,
            email: authResponse.username,
            role: authResponse.role,
            avatarUrl: authResponse.avatarUrl,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('gflix_token');
        set({ accessToken: null, customer: null, isAuthenticated: false });
      },

      updateCustomer: (data) => set(state => ({ customer: { ...state.customer, ...data } })),

      getToken: () => get().accessToken,
    }),
    {
      name: 'gflix-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useCustomerAuthStore;
