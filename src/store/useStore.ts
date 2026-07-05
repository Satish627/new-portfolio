import { create } from "zustand";

export type QualityTier = "high" | "low";

interface PortfolioStore {
  act: number;
  progress: number;
  quality: QualityTier;
  setQuality: (quality: QualityTier) => void;
}

export const useStore = create<PortfolioStore>((set) => ({
  act: 0,
  progress: 0,
  quality: "high",
  setQuality: (quality) => set({ quality }),
}));
