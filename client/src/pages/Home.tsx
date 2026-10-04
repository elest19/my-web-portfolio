import { lazy, Suspense, useEffect, useRef, useState, type ComponentType, type MouseEvent, type TouchEvent } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ArrowUpRight, BadgeCheck, ChevronLeft, ChevronRight, ExternalLink, Github, Linkedin, X } from "lucide-react";
import AccordionGallery from "@/components/AccordionGallery";
import FlipCard from "@/components/FlipCard";
import ProjectArtwork from "@/components/ProjectArtwork";
import PageBackdrop from "@/components/PageBackdrop";
import ScrollReveal from "@/components/ScrollReveal";
import ProjectGrid from "@/components/ProjectGrid";
import SiteNav from "@/components/SiteNav";
import SpecularButton from "@/components/SpecularButton";
import type { PixelBlastProps } from "@/components/PixelBlast";
import type { WebThreadsProps } from "@/components/WebThreads";
import { projectPath, projects } from "@/lib/projects";

/** three + postprocessing are large, so the hero background streams in after first paint. */
const PixelBlast = lazy(async (): Promise<{ default: ComponentType<PixelBlastProps> }> => {
  try {
    return await import("@/components/PixelBlast");
  } catch {
    // A failed chunk must not take the hero down: keep the static #181822 fallback background.
    return { default: () => null };
  }
});

/**
 * ogl is already on hand for the hero, so WebThreads is streamed in the same way:
 * it must never block first paint, and a failure must not take the contact
 * section down with it (the .contact-section background shows through either way).
 */
const WebThreads = lazy(async (): Promise<{ default: ComponentType<WebThreadsProps> }> => {
  try {
    return await import("@/components/WebThreads");
  } catch {
    return { default: () => null };
  }
});

const experiences = [
  {
    period: "June 2026 — PRESENT",
    role: "Freelance Full Stack Web Developer",
    company: "Self-Employed",
    description:
      "Developing and deploying full-stack web applications for clients, utilizing technologies such as React.js, Node.js, Express.js, and PostgreSQL. Collaborating with clients to understand their requirements and deliver high-quality solutions.",
  },
  {
    period: "April 2025 — July 2026",
    role: "Administrative and Management Intern",
    company: "Municipal Population Office, San Fabian, Pangasinan",
    description:
      "Assisted in data management and administrative tasks. Gained experience in office operations, document handling, and customer service within a government setting.",
  },
];
const certificates = [
  {
    title: "JavaScript Foundations Professional Certificate",
    image: "/certificates/JavascriptFoundationsMozilla.jpg",
    verificationUrl: "https://www.linkedin.com/learning/certificates/e791601a236f31383e05aa125383097565d06b2fe7fd92cf2692ff828c6eaed7?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3Boo4SHubZTu2W7TjibOb0Xw%3D%3D",
    issuer: "Mozilla",
    year: "2026",
  },
  {
    title: "React Foundations by Pearsons",
    image: "/certificates/ReactFoundations.png",
    verificationUrl: "https://www.linkedin.com/learning/certificates/33973a98b50d946805beeea4746fc45e4e955684385224f6ab160c57ea5732f4",
    issuer: "Pearsons",
    year: "2026",
  },
  {
    title: "Docker Foundations Professional Certificate",
    image: "/certificates/DockerFoundations.png",
    verificationUrl: "https://www.linkedin.com/learning/certificates/da6bd256dfedf9be30897e617d4675c63dd1f1ec8e5a87559f9938b742ae8d97",
    issuer: "LinkedIn Learning",
    year: "2026",
  },
  {
    title: "SQL Essential Training",
    image: "/certificates/SQLTraining.png",
    verificationUrl: "https://www.linkedin.com/learning/certificates/9df5f218f4a9e468aafc9e42d5a01721604c9870b11a4065cab6160e18363bb0",
    issuer: "Walter Shields",
    year: "2026",
  },
];
const skills = ["JavaScript", "HTML", "CSS", "React.js", "Node.js", "Express.js", "PostgreSQL", "Responsive Design", "Testing & Debugging", "Git", "AI-assisted Development", "TypeScript", "Next.js", "REST APIs", "Problem Solving", "Communication"];
const interests = ["UI/UX design", "Learning new frameworks", "Exploring and maximizing AI-assisted development tools", "Developing useful web applications", "Learning to create mobile applications"];

// The hero accordion is a three-panel spread, so the first three projects are featured
// here while the #work grid further down the page lists the full set.
const featuredProjects = projects.slice(0, 3);

const projectGalleryItems = featuredProjects.map((project) => ({
  label: project.name,
  link: projectPath(project.id),
  alt: `${project.name} project artwork`,
  content: <ProjectArtwork project={project} compact />,
}));

function ProjectCarousel({ activeIndex, onActiveChange }: { activeIndex: number; onActiveChange: (index: number) => void }) {
  const [, navigate] = useLocation();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const swiped = useRef(false);
  const active = featuredProjects[activeIndex];
  const go = (direction: -1 | 1) => onActiveChange((activeIndex + direction + featuredProjects.length) % featuredProjects.length);
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return;
    const distance = touchStart - event.changedTouches[0].clientX;
    if (Math.abs(distance) > 45) {
      swiped.current = true;
      go(distance > 0 ? 1 : -1);
    }
    setTouchStart(null);
  };
  return (
    <div className="projects-preview" aria-label="Project carousel">
      <div className="project-accordion">
        <AccordionGallery
          items={projectGalleryItems}
          defaultIndex={activeIndex}
          expandRatio={0.65}
          trigger="hover"
          accentColor="#ff69ed"
          overlayColor="#181822"
          duration={0.45}
          ease="back.out"
          stagger={0.03}
          height={450}
          gap={7}
          radius={14}
          onActivate={(item, index) => navigate(item.link ?? projectPath(featuredProjects[index].id))}
        />
      </div>
      <div className="mobile-carousel" onTouchStart={(event) => { swiped.current = false; setTouchStart(event.touches[0].clientX); }} onTouchEnd={onTouchEnd}>
        <Link className="mobile-project-card" href={projectPath(active.id)} aria-label={`Open project: ${active.name}`} onClick={(event) => { if (swiped.current) { event.preventDefault(); swiped.current = false; } }}>
          <ProjectArtwork project={active} compact />
          <span className="mobile-project-caption"><span><small>{active.number} / PROJECT</small><strong>{active.name}</strong></span><ArrowUpRight size={18} /></span>
        </Link>
        <div className="mobile-carousel-controls"><button type="button" onClick={() => go(-1)} aria-label="Previous project"><ChevronLeft size={18} /></button><span>{String(activeIndex + 1).padStart(2, "0")} <i>/</i> {String(featuredProjects.length).padStart(2, "0")}</span><button type="button" onClick={() => go(1)} aria-label="Next project"><ChevronRight size={18} /></button></div>
      </div>
    </div>
  );
}

export default function Home() {
  // Starts on the middle panel so the three-panel hero spread reads as deliberate.
  const [activeProject, setActiveProject] = useState(1);
  const [activeCertificate, setActiveCertificate] = useState<(typeof certificates)[number] | null>(null);
  // A shader-driven background is not worth running for visitors who ask for less motion.
  const [reduceMotion] = useState(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  // The projects listing now lives on this page, so in-page links scroll to the work section.
  // Modifier/middle clicks fall through to the plain #work anchor so a new tab still works.
  const goToWork = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById("work");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Deep links arrive as /#section (old /projects links, SiteNav and Business hrefs, refreshes),
  // so land on that section as soon as this page mounts: the browser's own fragment scroll runs
  // before React has rendered the target, so it usually misses.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);

  useEffect(() => {
    if (!activeCertificate) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = () => setActiveCertificate(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab") {
        const focusable = lightboxRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], [tabindex]:not([tabindex='-1'])");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    lightboxCloseRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      lightboxTriggerRef.current?.focus();
    };
  }, [activeCertificate]);

  return (
    <main className="portfolio-page">
      <PageBackdrop />
      <SiteNav />
      <section className="hero landing-hero" id="top">
        {!reduceMotion && (
          <div className="hero-blast" aria-hidden="true">
            <Suspense fallback={null}>
              <PixelBlast
                variant="diamond"
                pixelSize={6}
                color="#d322d3"
                patternScale={2.75}
                patternDensity={1.5}
                pixelSizeJitter={0.15}
                enableRipples
                rippleSpeed={0.4}
                rippleThickness={0.12}
                rippleIntensityScale={1.5}
                liquid
                liquidStrength={0.12}
                liquidRadius={1.2}
                liquidWobbleSpeed={5}
                speed={0.7}
                edgeFade={0.1}
                transparent
              />
            </Suspense>
          </div>
        )}
        <div className="hero-inner landing-hero-inner">
          <div className="profile-block bg-slate-800/40 rounded-xl p-5 ">
            <figure className="profile-photo-wrap">
              <img
                className="profile-photo"
                src="/Portfolio-Profile.png"
                alt="John Paul R. Ruiz"
              />
            </figure>
            <div className="">
              <div className="profile-copy">
                <p className="profile-kicker">HELLO, I’M</p>
                <h1>John Paul R. Ruiz</h1>
                <p className="profile-subtitle">
                  Full Stack Web Developer / Software Engineer
                </p>
              </div>
              <div className="profile-actions">
                <a href="/business-templates" className="profile-button">
                  See Templates
                </a>
                <SpecularButton
                  href="#work"
                  className="hero-specular-button"
                  size="sm"
                  radius={29}
                  tint="#000000"
                  tintOpacity={0.8}
                  blur={0}
                  textColor="#ffffff"
                  lineColor="#ff69ed"
                  baseColor="#000000"
                  intensity={1.35}
                  shineSize={23}
                  shineFade={15}
                  thickness={1.5}
                  speed={reduceMotion ? 0 : 0.5}
                  followMouse={!reduceMotion}
                  proximity={50}
                  autoAnimate
                  onClick={goToWork}
                >
                  Go to Projects <span aria-hidden="true">→</span>
                </SpecularButton>
              </div>
            </div>
          </div>
          <div className="projects-panel bg-black p-3 rounded-xl">
            <div className="projects-panel-heading">
              <div>
                <p className="profile-kicker">A FEW THINGS I’VE BUILT</p>
                <h2>My Projects</h2>
              </div>
              <a href="/#work" className="all-projects-link" onClick={goToWork}>
                View all <ArrowUpRight size={15} />
              </a>
            </div>
            <ProjectCarousel
              activeIndex={activeProject}
              onActiveChange={setActiveProject}
            />
          </div>
        </div>
      </section>
      <section id="about" className="about-section about-redesign ">
        <div className="about-redesign-inner">
          <p className="about-eyebrow">A LITTLE ABOUT ME</p>
          <ScrollReveal containerClassName="about-title">Who I am.</ScrollReveal>
          <ScrollReveal
            as="div"
            containerClassName="about-columns"
            baseRotation={0}
            enableBlur={false}
            stagger={0.12}
          >
            <div className="about-bio-column">
              <div className="about-bio">
                <p>
                  I’m a Computer Science graduate with hands-on experience
                  building full-stack web applications. I work across the front
                  end and back end, with a focus on creating practical,
                  responsive experiences.
                </p>
                <p>
                  My core stack is PERN: PostgreSQL, Express.js, React.js, and
                  Node.js. I’m currently learning TypeScript and Next.js, while
                  exploring React Native to grow into mobile application
                  development.
                </p>
              </div>
            </div>
            <div className="about-interest-column">
              <h3>Personal Interest</h3>
              <ul className="about-interests">
                {interests.map(interest => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal
            as="div"
            containerClassName="about-skills-full"
            baseRotation={0}
            enableBlur={false}
            stagger={0.12}
          >
            <h3>Skills</h3>
            <div className="about-skill-tags">
              <div className="about-skill-row">
                {skills.slice(0, 10).map(skill => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
              <div className="about-skill-row">
                {skills.slice(10).map(skill => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <ScrollReveal
        as="div"
        containerClassName="work-reveal"
        baseRotation={0}
        enableBlur={false}
      >
        <ProjectGrid id="work" />
      </ScrollReveal>
      <section id="experience" className="records-section section-shell">
        <header className="records-section-heading">
          <div>
            <p className="project-grid-eyebrow">CAREER</p>
            <ScrollReveal>Experiences</ScrollReveal>
          </div>
          <span className="records-section-count">
            {String(experiences.length).padStart(2, "0")} ROLES
          </span>
        </header>
        <ScrollReveal
          as="div"
          containerClassName="records-card-grid"
          baseRotation={0}
          enableBlur={false}
          stagger={0.1}
        >
          {experiences.map((item, index) => (
            <FlipCard
              key={item.period}
              className="experience-flip-card"
              ariaLabel={`${item.role}, ${item.period} — press Enter or drag to flip for the description`}
              front={
                <article className="records-card">
                  <div className="records-card-top">
                    <span>0{index + 1} / EXPERIENCE</span>
                    <span>{item.period}</span>
                  </div>
                  <div className="records-card-body">
                    <p className="records-card-label">ROLE</p>
                    <h3>{item.role}</h3>
                    <p className="records-card-detail">{item.company}</p>
                  </div>
                  <footer className="records-card-footer">
                    <span>CAREER HISTORY</span>
                    <span>0{index + 1}</span>
                  </footer>
                </article>
              }
              back={
                <article className="records-card records-card--back">
                  <div className="records-card-top">
                    <span>0{index + 1} / EXPERIENCE</span>
                    <span>{item.period}</span>
                  </div>
                  <div className="records-card-body">
                    <p className="records-card-label">ABOUT THIS ROLE</p>
                    <p className="records-card-description">
                      {item.description}
                    </p>
                  </div>
                  <footer className="records-card-footer">
                    <span>CLICK OR DRAG TO FLIP BACK</span>
                    <span>0{index + 1}</span>
                  </footer>
                </article>
              }
              axis="y"
              width={360}
              height={290}
              radius={0}
              background="#171717"
              color="#f5f5f5"
              tiltMax={10}
              glareOpacity={0.18}
              hoverScale={1.02}
            />
          ))}
        </ScrollReveal>
      </section>
      <section id="credentials" className="records-section section-shell">
        <header className="records-section-heading">
          <div>
            <p className="project-grid-eyebrow">LEARNING &amp; GROWTH</p>
            <ScrollReveal>Certifications</ScrollReveal>
          </div>
          <span className="records-section-count">
            {String(certificates.length).padStart(2, "0")} CREDENTIALS
          </span>
        </header>
        <ScrollReveal
          as="div"
          containerClassName="records-card-grid"
          baseRotation={0}
          enableBlur={false}
          stagger={0.1}
        >
          {certificates.map((item, index) => (
            <article
              className="records-card credential-record-card"
              key={index}
            >
              <div className="records-card-top">
                <span>0{index + 1} / CREDENTIAL</span>
                <BadgeCheck size={16} aria-hidden="true" />
              </div>
              <div className="records-card-body">
                <p className="records-card-label">
                  {item.issuer} · {item.year}
                </p>
                <h3>{item.title}</h3>
                <button
                  ref={lightboxTriggerRef}
                  className="credential-image-trigger"
                  type="button"
                  onClick={event => {
                    lightboxTriggerRef.current = event.currentTarget;
                    setActiveCertificate(item);
                  }}
                  aria-label={`Open credential ${index + 1} image in full-screen preview`}
                >
                  <img
                    className="credential-artwork"
                    src={item.image}
                    alt={`Decorative placeholder artwork for credential ${index + 1}; replace with your certificate image`}
                  />
                </button>
                {item.verificationUrl ? (
                  <a
                    className="credential-verify-link"
                    href={item.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Verify Credential <ExternalLink size={13} />
                  </a>
                ) : (
                  <button
                    className="credential-verify-link is-disabled"
                    type="button"
                    disabled
                    title="Add the official credential verification URL to enable this link"
                    aria-label="Verify Credential; add the official verification URL to enable"
                  >
                    Verify Credential <ExternalLink size={13} />
                  </button>
                )}
                <p className="records-card-detail">Certificate or credential</p>
              </div>
              <footer className="records-card-footer">
                <span>LEARNING &amp; GROWTH</span>
                <span>0{index + 1}</span>
              </footer>
            </article>
          ))}
        </ScrollReveal>
      </section>
      <section id="contact" className="contact-section">
        {/* The threads canvas sits behind the copy as the section backdrop. It is
            aria-hidden because it is purely decorative. */}
        <div className="contact-threads" aria-hidden="true">
          <Suspense fallback={null}>
            <WebThreads
              color1="#ff7ad9"
              color2="#460245"
              color3="#ffd6f4"
              speed={0.15}
              threadCount={6}
              frequency={6.5}
              spread={0.12}
              taper={1.0}
              position={0.46}
              fanMode="center"
              glow={0.02}
              falloff={0.5}
              thickness={1.95}
              brightness={0.6}
              opacity={1.0}
              mirror={true}
              shimmer={false}
              grain={true}
              grainIntensity={0.05}
              mouseInteraction={true}
              mouseStrength={0.3}
            />
          </Suspense>
        </div>
        <div className="contact-inner section-shell">
          <ScrollReveal
            as="div"
            containerClassName="contact-layout"
            baseRotation={0}
            enableBlur={false}
            stagger={0.14}
          >
            <div className="contact-copy">
              <p className="eyebrow">GET IN TOUCH</p>
              <h2>
                Let’s build
                <br />
                <em>something good.</em>
              </h2>
              <p className="contact-description">
                Have a project or role in mind? I’d be happy to hear from you.
              </p>
              <a className="contact-email" href="mailto:johnpaulruiz003@gmail.com">
               johnpaulruiz003@gmail.com <ArrowRight size={18} />
              </a>
            </div>
            <div className="contact-side">
              <span className="contact-side-label">FIND ME ONLINE</span>
              <div className="social-links">
                <a
                  href="https://github.com/elest19"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <Github size={17} />
                </a>
                <a
                  href="https://www.linkedin.com/in/john-paul-ruiz-b6703230b/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={17} />
                </a>
              </div>
            </div>
          </ScrollReveal>
          <div className="contact-bottom">
            <span>Web Portfolio</span>
            <a href="#top">BACK TO TOP ↑</a>
            <span>© JOHN PAUL R. RUIZ</span>
          </div>
        </div>
      </section>
      {activeCertificate && (
        <div
          className="credential-lightbox"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget)
              setActiveCertificate(null);
          }}
        >
          <div
            ref={lightboxRef}
            className="credential-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Certificate image preview"
          >
            <button
              ref={lightboxCloseRef}
              className="credential-lightbox-close"
              type="button"
              onClick={() => setActiveCertificate(null)}
              aria-label="Close certificate preview"
            >
              <X size={21} />
            </button>
            <img
              src={activeCertificate.image}
              alt="Expanded certificate image preview"
            />
            <p>Press Esc or select close to return to the portfolio</p>
          </div>
        </div>
      )}
    </main>
  );
}
