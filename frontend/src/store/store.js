import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const store = create(
  persist(
    (set) => ({
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    { name: "auth-storage", storage: createJSONStorage(() => sessionStorage) }
  ) // closing tab aur browser reset the state to null
);

// Cart store for live cart count
export const cartStore = create((set) => ({
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  fetchAndSetCartCount: async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart", { withCredentials: true });
      const items = response.data.items || [];
      const count = items.length; // number of different products
      set({ cartCount: count });
    } catch {
      set({ cartCount: 0 });
    }
  },
}));

export default store;
