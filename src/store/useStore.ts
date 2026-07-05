import { create } from "zustand";

export type QualityTier = "high" | "low";

export type SectionId =
  | "home"
  | "about"
  | "projects"
  | "education"
  | "contact";

export type FocusMap = Record<SectionId, number>;

interface PortfolioStore {
  act: number;
  progress: number;
  focus: FocusMap;
  quality: QualityTier;
  setQuality: (quality: QualityTier) => void;
}

export const useStore = create<PortfolioStore>((set) => ({
  act: 0,
  progress: 0,
  focus: { home: 1, about: 0, projects: 0, education: 0, contact: 0 },
  quality: "high",
  setQuality: (quality) => set({ quality }),
}));
