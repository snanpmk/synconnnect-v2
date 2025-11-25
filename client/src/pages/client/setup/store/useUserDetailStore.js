import { create } from "zustand";

const useUserDetailStore = create((set) => ({
  user: {},
  setUser: (user) => set({ user }),
}));

export default useUserDetailStore;
