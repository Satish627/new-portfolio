"use client";

import { useEffect } from "react";
import { useStore, type SectionId } from "@/store/useStore";

const SECTIONS: SectionId[] = [
  "hero",
  "work",
  "about",
  "experience",
  "contact",
];

function sectionFocus(id: string): number {
  const el = document.getElementById(id);
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const delta =
    (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
  const t = Math.min(1, Math.max(0, 1 - Math.abs(delta) / 0.6));
  return t * t * (3 - 2 * t);
}

export default function ScrollProgress() {
  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      const act = Math.min(4, Math.round(progress * 4));

      const focus = Object.fromEntries(
        SECTIONS.map((id) => [id, sectionFocus(id)])
      ) as Record<SectionId, number>;

      useStore.setState({ progress, act, focus });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
