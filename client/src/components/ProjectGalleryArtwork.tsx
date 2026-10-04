import type { CSSProperties } from "react";
import ProjectArtwork from "@/components/ProjectArtwork";
import type { PortfolioProject, ProjectImage } from "@/lib/projects";

export default function ProjectGalleryArtwork({
  project,
  image,
  compact = false,
}: {
  project: PortfolioProject;
  image: ProjectImage;
  compact?: boolean;
}) {
  // Real screenshots carry their intrinsic size, so the stage can be shaped to
  // match them instead of cropping. The CSS-drawn mockups have no bitmap and
  // keep the stage's own ratio.
  const ratio = image.width && image.height ? image.width / image.height : undefined;
  const style = ratio ? ({ "--artwork-ratio": String(ratio) } as CSSProperties) : undefined;

  if (image.src === project.thumbnail || image.visualVariant === "main") {
    return <ProjectArtwork project={project} imageSrc={image.src} compact={compact} ratio={ratio} />;
  }
  if (!image.src.startsWith("mockup:")) {
    return <div className={`gallery-artwork gallery-artwork-asset ${project.color}${compact ? " gallery-artwork-compact" : ""}`} data-image-src={image.src} style={style}><img src={image.src} alt={image.label} /></div>;
  }

  return (
    <div className={`gallery-artwork gallery-artwork-${image.visualVariant} ${project.color}${compact ? " gallery-artwork-compact" : ""}`} data-image-src={image.src} aria-label={image.label}>
      <div className="gallery-browser">
        <div className="gallery-browser-bar"><i /><i /><i /><span>{project.id}.app / {image.src.split(":").at(-1)}</span></div>
        {image.visualVariant === "interface" ? (
          <div className="gallery-interface-layout">
            <aside><b>{project.number}</b><i /><i /><i /><i /></aside>
            <div className="gallery-interface-content">
              <div className="gallery-interface-greeting" />
              <div className="gallery-interface-title" />
              <div className="gallery-interface-cards"><i /><i /><i /></div>
              <div className="gallery-interface-chart"><i /><i /><i /><i /><i /><i /><i /></div>
            </div>
          </div>
        ) : (
          <div className="gallery-data-layout">
            <div className="gallery-data-label" />
            <div className="gallery-schema">
              <div><b>users</b><i /><i /><i /></div>
              <span />
              <div><b>projects</b><i /><i /><i /></div>
              <span />
              <div><b>activity</b><i /><i /><i /></div>
            </div>
          </div>
        )}
      </div>
      <span className="gallery-art-caption">{image.label.toUpperCase()}</span>
    </div>
  );
}
