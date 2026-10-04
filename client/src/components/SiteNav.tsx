import GooeyNav from "@/components/GooeyNav";

const navItems = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#work" },
  { label: "Experiences", href: "/#experience" },
  { label: "Certifications", href: "/#credentials" },
  { label: "Contact", href: "/#contact" },
];

/**
 * GooeyNav renders its own <a> elements, so the smooth-scroll handler is passed
 * down through the item list and applied on the nav container via capture: the
 * click still reaches GooeyNav's own handler, which drives the gooey animation.
 */
export default function SiteNav() {
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href") ?? "";
    const hash = href.split("#")[1];
    if (!hash || window.location.pathname !== "/") return;
    const target = document.getElementById(hash);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="site-nav">
      <a className="site-nav-business" href="/business-templates">Got a business?</a>
      <nav className="site-nav-links" aria-label="Main navigation" onClickCapture={handleNavClick}>
        <GooeyNav items={navItems} />
      </nav>
      <a className="site-nav-resume" href="/John-Paul-Ruiz-Resume.pdf" download="John-Paul-Ruiz-Resume.pdf">My Resume</a>
    </header>
  );
}