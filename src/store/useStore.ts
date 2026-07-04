import { create } from "zustand";

export type QualityTier = "high" | "low";

interface PortfolioStore {
  act: number;
  setAct: (act: number) => void;
  quality: QualityTier;
  setQuality: (quality: QualityTier) => void;
}

export const useStore = create<PortfolioStore>((set) => ({
  act: 0,
  setAct: (act) => set({ act }),
  quality: "high",
  setQuality: (quality) => set({ quality }),
}));
