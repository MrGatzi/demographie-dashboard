import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DebugState {
  isDebugEnabled: boolean;
  toggleDebug: () => void;
  enableDebug: () => void;
  disableDebug: () => void;
}

export const useDebugStore = create<DebugState>()(
  persist(
    (set) => ({
      isDebugEnabled: false,
      toggleDebug: () =>
        set((state) => ({ isDebugEnabled: !state.isDebugEnabled })),
      enableDebug: () => set({ isDebugEnabled: true }),
      disableDebug: () => set({ isDebugEnabled: false }),
    }),
    {
      name: "debug-settings", // localStorage key
    }
  )
);
