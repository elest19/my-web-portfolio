import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import ProjectArtwork from "@/components/ProjectArtwork";
import { projectPath, projects } from "@/lib/projects";

export default function ProjectGrid({ id }: { id?: string }) {
  return (
    <section id={id} className="project-grid-section section-shell">
      <header className="project-grid-heading">
        <p className="project-grid-eyebrow">MY WORKS</p>
        <h2>Projects</h2>
      </header>
      <div className="project-overview-grid">
        {projects.map((project) => {
          const thumbnailData = project.images[0];
          return (
            <article className="project-grid-card" key={project.id}>
              <Link className="project-grid-main" href={projectPath(project.id)} aria-label={`Open ${project.name} project detail`}>
                <ProjectArtwork project={project} imageSrc={project.thumbnail} ratio={project.thumbnailWidth && project.thumbnailHeight ? project.thumbnailWidth / project.thumbnailHeight : undefined} />
                <span className="project-grid-footer"><strong>{project.name}</strong><ArrowUpRight size={17} /></span>
              </Link>
              <div className="project-grid-detail">
                <Link className="project-grid-detail-copy" href={projectPath(project.id)} aria-label={`Open ${project.name} project detail`}>
                  <h3>{project.name}</h3>
                  <span className="project-detail-label">Brief Description</span>
                  <p>{thumbnailData.description}</p>
                  <span className="project-detail-label">Links</span>
                </Link>
                <div className="project-grid-external-links">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Github</a>
                  <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Live Demo</a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
