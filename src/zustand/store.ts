import { create } from "zustand";
import type { UserProfile } from "../interfaces/IStore";

interface StoreState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  NavItemActivate: string;
  setNavItemActivate: (item: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  isLogin: false,
  setIsLogin: (isLoginn) => set({ isLogin: isLoginn }),
  user: null,
  setUser: (user) => set({ user }),
  NavItemActivate: "/",
  setNavItemActivate: (item) => set({ NavItemActivate: item }),
}));
