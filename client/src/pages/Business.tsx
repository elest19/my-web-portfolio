import { ArrowUpRight } from "lucide-react";
import PageBackdrop from "@/components/PageBackdrop";
import SiteNav from "@/components/SiteNav";

const businessTemplates = [
  {
    type: "01 / RESTAURANT",
    slug: "restaurant",
    name: "Restaurant",
    brand: "THE LAUREL",
    nav: "MENU · VISIT",
    eyebrow: "A neighborhood table",
    headline: "Gather around good food.",
    action: "RESERVE A TABLE",
    url: "",
  },
  {
    type: "02 / COFFEE SHOP",
    slug: "coffee",
    name: "Coffee Shop",
    brand: "DAYBREAK COFFEE",
    nav: "OUR COFFEE · FIND US",
    eyebrow: "Your daily ritual",
    headline: "Good mornings, brewed slowly.",
    action: "EXPLORE THE MENU",
    url: "",
  },
  {
    type: "03 / BOUTIQUE",
    slug: "boutique",
    name: "Boutique Shop",
    brand: "FORM & FIELD",
    nav: "COLLECTION · ABOUT",
    eyebrow: "Objects with intention",
    headline: "Find your next favorite.",
    action: "SHOP THE EDIT",
    url: "",
  },
];

export default function Business() {
  return (
    <main className="business-page-shell">
      <PageBackdrop />
      <SiteNav />
      <section className="business-section business-page-section section-shell">
        <div className="business-page-backline">
          <a href="/">← Back to portfolio</a>
          <span>WEB EXPERIENCES FOR LOCAL BUSINESS</span>
        </div>
        <header className="business-section-heading">
          <div>
            <p className="project-grid-eyebrow">BUILT FOR LOCAL BUSINESS</p>
            <h1>
              Could your next customer
              <br />
              find you online<span className="accent-dot">?</span>
            </h1>
            <p className="business-section-intro">
              Your website is your always-open storefront: one reliable place to
              discover what you offer, trust your business, and take the next
              step.
            </p>
          </div>
        </header>
        <blockquote className="business-quote">
          <div>
            <p>
              Your doors may close for the night. Your first impression doesn’t
              have to.
            </p>
            <cite>
              A thoughtful website keeps your business easy to find, understand,
              and contact.
            </cite>
          </div>
          
        </blockquote>
        <div
          className="business-benefits"
          aria-label="Benefits of having a business website"
        >
          <article>
            <span>01 / DISCOVERY</span>
            <h2>Can people find you after hours?</h2>
            <p>
              Share your location, opening times, services, and menu whenever a
              potential customer is ready to look.
            </p>
          </article>
          <article>
            <span>02 / TRUST</span>
            <h2>Can they see what makes you worth choosing?</h2>
            <p>
              Bring your story, work, products, and practical details together
              in one clear, professional home.
            </p>
          </article>
          <article>
            <span>03 / ACTION</span>
            <h2>Is the next step simple?</h2>
            <p>
              Guide visitors to book, browse, call, request a quote, or find
              your shop without searching through scattered posts.
            </p>
          </article>
        </div>
        <div className="business-examples-heading">
          <span>START WITH A STYLE THAT FITS</span>
          <p>
            Explore a few concepts for the kind of business you’re building.
          </p>
        </div>
        <div className="business-template-grid">
          {businessTemplates.map(template => (
            <article className="business-template-card" key={template.slug}>
              <div
                className="business-template-preview"
                aria-label={`${template.name} website template preview`}
              >
                <div className="business-preview-nav">
                  <span>{template.brand}</span>
                  <span>{template.nav}</span>
                </div>
                <div className="business-preview-hero">
                  <div>
                    <small>{template.eyebrow}</small>
                    <strong>{template.headline}</strong>
                    <i>
                      {template.action} <ArrowUpRight size={11} />
                    </i>
                  </div>
                  <div className="business-preview-visual" aria-hidden="true">
                    <span />
                    <b />
                    <i />
                  </div>
                </div>
                <div className="business-preview-footer">
                  <span>WEBSITE TEMPLATE PREVIEW</span>
                  <span>SCROLL ↓</span>
                </div>
              </div>
              <div className="business-template-copy">
                <div>
                  <span>{template.type}</span>
                  <h3>{template.name}</h3>
                </div>
                <span className="business-template-index">↗</span>
              </div>
              {template.url ? (
                <a
                  className="business-template-link"
                  href={template.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View live website <ArrowUpRight size={14} />
                </a>
              ) : (
                <button
                  className="business-template-link is-disabled"
                  type="button"
                  disabled
                  title="Add the live website URL to activate this template link"
                >
                  Website link coming soon <ArrowUpRight size={14} />
                </button>
              )}
            </article>
          ))}
        </div>
        <div className="business-contact-cta">
          <p>Ready to give your business a home online?</p>
          <a href="/#contact">
            Let’s talk about your website <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
    </main>
  );
}
