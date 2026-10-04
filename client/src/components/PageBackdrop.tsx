import { useEffect, useState } from "react";

import MoltenMetal from "@/components/MoltenMetal";

/**
 * React Bits MoltenMetal as a fixed, page-wide background layer.
 *
 * Render it as the first child of a page shell. It sits behind all content and
 * is purely decorative, so it is aria-hidden and never takes pointer events.
 *
 * The Hero section deliberately opts out: `.hero.landing-hero` paints its own
 * opaque background, so the layer is not visible behind it.
 */
export default function PageBackdrop() {
  // A full-viewport shader is not worth running for visitors who ask for less motion.
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Re-check at runtime so toggling the OS setting takes effect without a reload.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (reduceMotion) return null;

  return (
    <div className="page-backdrop" aria-hidden="true">
      <MoltenMetal
        color1="#2b0a3a"
        color2="#d400df"
        color3="#f2f5e6"
        speed={0.3}
        scale={4}
        detail={3}
        glow={1.5}
        coreSize={0.1}
        swirl={1}
        fold={-0.2}
        blackPoint={0.05}
        brightness={1.25}
        colorMode="molten"
        grain
        grainIntensity={0.05}
        mouseInteraction
        mouseStrength={0.3}
        opacity={0.85}
      />
      {/* Keeps body copy legible over the brightest filament cores. */}
      <div className="page-backdrop-scrim" />
    </div>
  );
}
