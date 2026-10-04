import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useRoute } from "wouter";
import PageBackdrop from "@/components/PageBackdrop";
import { ScrollArea } from "@/components/ui/scroll-area";
import OptionWheel from "@/components/OptionWheel";
import ProjectGalleryArtwork from "@/components/ProjectGalleryArtwork";
import SiteNav from "@/components/SiteNav";
import { projectPath, projects } from "@/lib/projects";

export default function ProjectDetail() {
  const [, params] = useRoute<{ id: string }>("/projects/:id");
  const project = projects.find((item) => item.id === params?.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  useEffect(() => setCurrentIndex(0), [params?.id]);

  if (!project) return <main className="project-detail-page"><SiteNav /><div className="project-detail-inner section-shell"><p className="profile-kicker">PROJECT NOT FOUND</p><h1>This project isn’t here.</h1><Link className="detail-back" href="/#work"><ArrowLeft size={16} /> All projects</Link></div></main>;

  const currentImage = project.images[currentIndex];
  // Only the description follows the gallery. Skills describe the project as a
  // whole, so they come from the project's main image and never change while the
  // user pages through the shots.
  const projectSkills = project.images[0].skills;
  // 5+ skills scroll inside a fixed-height box (three visible) so the overview
  // column does not turn into an endless wall of text.
  const SKILLS_SCROLL_THRESHOLD = 5;
  const isSkillsScrollable = projectSkills.length >= SKILLS_SCROLL_THRESHOLD;
  // popcom and lakayago carry the widest captures in the set, so their wheel
  // borrows a little of the column gap to show the shot larger. Gated by a media
  // query in CSS so it only applies where the two-column layout has the room.
  const isWideWheel = project.id === "popcom" || project.id === "lakayago";
  // One wheel option per project image; on desktop the wheel itself is the
  // gallery, so scrolling or dragging it moves between shots.
  const wheelItems = project.images.map((image) => image.label);
  const changeImage = (direction: number) => {
    setCurrentIndex((current) => (current + direction + project.images.length) % project.images.length);
  };
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const distance = touchStartX.current - event.changedTouches[0].clientX;
    if (Math.abs(distance) > 42) changeImage(distance > 0 ? 1 : -1);
    touchStartX.current = null;
  };
  const projectIndex = projects.findIndex((item) => item.id === project.id);
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main className="project-detail-page">
      <PageBackdrop />
      <SiteNav />
      <article className="project-detail-inner section-shell">
        <p className="project-detail-eyebrow">Project Overview</p>
        <h1>{project.name}<span className="accent-dot">.</span></h1>
        <div className="project-detail-layout">
          {/* Only the description is a live region: it is the sole thing that
              changes as the gallery moves, so a screen reader announces just the
              new copy instead of re-reading the static skills and links. */}
          <section className="project-detail-info">
            <h2>Project Overview</h2>
            <p className="project-detail-description" aria-live="polite">{currentImage.description}</p>
            <h2 className="project-detail-skills-heading">Skills</h2>
            {isSkillsScrollable ? (
              /* No border and no chrome around the box — just the scroll. The
                 height is pinned to five skills so the list scrolls in place
                 instead of stretching the overview column. */
              <ScrollArea className="project-detail-skill-scroll">
                <ul className="project-detail-skill-list">
                  {projectSkills.map((skill) => (
                    <li key={skill.name}>
                      <strong>{skill.name}</strong>
                      <span>{skill.note}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <ul className="project-detail-skill-list">
                {projectSkills.map((skill) => (
                  <li key={skill.name}>
                    <strong>{skill.name}</strong>
                    <span>{skill.note}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="project-detail-action-links"><a href={project.githubUrl} target="_blank" rel="noreferrer">Github <ArrowUpRight size={14} /></a><a href={project.liveDemoUrl} target="_blank" rel="noreferrer">Live Demo <ArrowUpRight size={14} /></a></div>
          </section>
          {/* Desktop: the wheel is the gallery, so each option renders its own
              image and the one in the middle is the selected shot. Mobile swaps
              this for the plain stage + arrows carousel below (see the media
              query that hides one and shows the other). */}
          <section
            className={`project-gallery${isWideWheel ? " project-gallery--wide" : ""}`}
            aria-label={`${project.name} screenshots`}
          >
            <div className="project-gallery-wheel">
              <OptionWheel
                items={wheelItems}
                defaultSelected={currentIndex}
                onChange={setCurrentIndex}
                textColor="#8a8f86"
                activeColor="#f2f4ed"
                side="right"
                fontSize={0.95}
                spacing={28.9}
                curve={1.5}
                tilt={25}
                blur={1.8}
                fade={0.42}
                minOpacity={0.12}
                smoothing={140}
                inset={0}
                loop={false}
                draggable
                renderItem={(_, index) => <ProjectGalleryArtwork project={project} image={project.images[index]} compact />}
              />
            </div>
            <div
              className="project-gallery-stage"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={handleTouchEnd}
            >
              <div key={currentImage.src} className="project-gallery-frame">
                <ProjectGalleryArtwork project={project} image={currentImage} />
              </div>
              <button className="project-gallery-arrow project-gallery-prev" type="button" onClick={() => changeImage(-1)} aria-label="Previous image">
                <ArrowLeft size={19} />
              </button>
              <button className="project-gallery-arrow project-gallery-next" type="button" onClick={() => changeImage(1)} aria-label="Next image">
                <ArrowRight size={19} />
              </button>
            </div>
            {/* One hint per input method: desktop drives the OptionWheel with the
                scroll wheel, mobile gets the arrow/swipe carousel, so the wording
                differs. CSS swaps them at the same breakpoint that swaps the
                gallery itself. */}
            <p className="project-gallery-caption" aria-live="polite">
              <span className="project-gallery-hint-desktop">
                <b>SCROLL UP / DOWN TO VIEW OTHER IMAGES</b>
              </span>
              <span className="project-gallery-hint-mobile">
                <b>MOVE LEFT / RIGHT TO VIEW OTHER IMAGES</b>
              </span>
              <span className="project-gallery-position">
                {String(currentIndex + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
              </span>
            </p>
          </section>
        </div>
        <div className="project-detail-footer"><Link href="/#work"><ArrowLeft size={15} /> Back to all projects</Link><Link href={projectPath(nextProject.id)}>Next project <ArrowUpRight size={15} /></Link></div>
      </article>
    </main>
  );
}
