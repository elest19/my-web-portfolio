import type { CSSProperties } from "react";
import type { PortfolioProject } from "@/lib/projects";

/**
 * `ratio` is the image's intrinsic width/height. Passing it lets the frame adopt
 * the exact shape of the artwork, so the card can be sized from the image rather
 * than cropping or letterboxing it. Omitted for the CSS-drawn mockups, which
 * have no bitmap and are sized by their own artwork.
 */
export default function ProjectArtwork({ project, compact = false, imageSrc = project.thumbnail, ratio }: { project: PortfolioProject; compact?: boolean; imageSrc?: string; ratio?: number }) {
  const isAsset = !imageSrc.startsWith("mockup:");
  const style = ratio ? ({ "--artwork-ratio": String(ratio) } as CSSProperties) : undefined;
  return (
    <div className={`project-visual ${project.visual}${compact ? " project-visual-compact" : ""}`} data-image-src={imageSrc} style={style}>
      {isAsset ? <img className="project-image-asset" src={imageSrc} alt={`${project.name} project screenshot`} /> : null}
      {!isAsset && project.visual === "nova-visual" && (
        <div className="nova-mock">
          <div className="mock-window">
            <div className="mock-topbar"><i /><i /><i /><span>nova.studio</span></div>
            <div className="nova-sidebar"><b>n.</b><span>⌂</span><span>◫</span><span>◎</span><span>⌁</span></div>
            <div className="nova-content"><div className="mock-greeting">MONDAY, MAY 19 <span>✳</span></div><div className="mock-title">Make space<br />for your <em>best work.</em></div><div className="mock-meter"><span>YOUR WEEK</span><b>72%</b><i><u /></i></div><div className="mock-blocks"><div /><div /><div /></div></div>
          </div><div className="nova-orb" />
        </div>
      )}
      {!isAsset && project.visual === "forme-visual" && (
        <div className="forme-mock"><span className="forme-kicker">OBJECTS FOR SLOW LIVING</span><div className="forme-display"><span>F</span><div className="forme-vase"><i /></div><div className="forme-sun" /></div><div className="forme-bottom"><b>Live lighter.<br /><em>Keep what lasts.</em></b><span>SHOP THE COLLECTION ↗</span></div><div className="forme-wordmark">f o r m e</div></div>
      )}
      {!isAsset && project.visual === "kinetic-visual" && (
        <div className="kinetic-mock"><div className="kinetic-lines"><i /><i /><i /><i /><i /></div><div className="kinetic-type">Move<br /><em>different.</em></div><div className="kinetic-sphere" /><span className="kinetic-tag">KINETIC® CREATIVE STUDIO</span><span className="kinetic-side">DESIGN — MOTION — CULTURE</span></div>
      )}
    </div>
  );
}
