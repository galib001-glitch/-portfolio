import { create } from "zustand";

interface BootState {
  booted: boolean;
  setBooted: (v: boolean) => void;
}

export const useBootStore = create<BootState>((set) => ({
  booted: false,
  setBooted: (v) => set({ booted: v }),
}));
