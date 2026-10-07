import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import PageBackdrop from "@/components/PageBackdrop";
import SiteNav from "@/components/SiteNav";

type BusinessTemplate = {
  type: string;
  slug: string;
  name: string;
  brand: string;
  nav: string;
  eyebrow: string;
  headline: string;
  action: string;
  url: string;
  previewImage?: string;
  stack: string[];
  features: string[];
  note: string;
};

const businessTemplates: BusinessTemplate[] = [
  {
    type: "01 / RESTAURANT",
    slug: "restaurant",
    name: "Restaurant",
    brand: "THE LAUREL",
    nav: "MENU · VISIT",
    eyebrow: "A neighborhood table",
    headline: "Gather around good food.",
    action: "RESERVE A TABLE",
    url: "https://johnpaulruiz-restaurant-template-1.vercel.app/",
    stack: ["restaurant-01"],
    features: ["Menu & reservations", "Dine-in & takeaway", "Online ordering"],
    note: "Ideal for walk-ins, weekends, and high-street footfall.",
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
    url: "https://johnpaulruiz-coffee-template-1.vercel.app/",
    stack: ["coffee-01"],
    features: ["Seasonal drinks", "Food pairings", "Mobile ordering"],
    note: "A cozy spot for morning meetings and catch-ups.",
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
    url: "https://johnpaulruiz-commercial-template-1.vercel.app/",
    stack: ["boutique-01"],
    features: ["Curated collection", "Lookbook gallery", "Shop by occasion"],
    note: "Elegant designs for the modern discerning shopper.",
  },
  {
    type: "04 / DENTAL CLINIC",
    slug: "clinic",
    name: "Dental Clinic",
    brand: "SMILE CARE",
    nav: "SERVICES · APPOINTMENTS",
    eyebrow: "Your smile, our priority",
    headline: "Professional dental care for everyone.",
    action: "Book an Appointment",
    previewImage: "/templates/dental-clinic-1.png",
    url: "https://johnpaulruiz-dental-template-1.vercel.app/",
    stack: ["Next.js, Framer Motion, Tailwind CSS"],
    features: ["Online booking", "Email & SMS notifications", "Admin Dashboard"],
    note: "Modern dental care with a focus on patient comfort.",
  },
];

export default function Business() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTemplate =
    activeId === null
      ? null
      : businessTemplates.find((template) => template.slug === activeId) ?? null;

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
          {businessTemplates.map((template) => (
            <motion.article
              key={template.slug}
              layoutId={`card-${template.slug}`}
              className="business-template-card"
              onClick={() => setActiveId(template.slug)}
              style={{ cursor: "pointer" }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                layoutId={`thumb-${template.slug}`}
                className="business-template-preview"
                aria-label={`${template.name} website template preview`}
              >
                {template.previewImage ? (
                  <img
                    className="business-template-preview-image"
                    src={template.previewImage}
                    alt={`${template.name} website preview`}
                  />
                ) : (
                  <>
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
                  </>
                )}
              </motion.div>

              <div className="business-template-copy">
                <div>
                  <span>{template.type}</span>
                  <h3>{template.name}</h3>
                </div>
                <span className="business-template-index">↗</span>
              </div>

              <button
                type="button"
                className="business-template-link"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveId(template.slug);
                }}
              >
                See Details <ArrowUpRight size={14} />
              </button>
            </motion.article>
          ))}
        </div>

        <AnimatePresence>
          {activeTemplate && (
            <motion.div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-[#07070a]/80 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveId(null)}
            >
              <motion.div
                layoutId={`card-${activeTemplate.slug}`}
                className="relative z-[121] w-full max-w-5xl overflow-hidden rounded-[22px] border border-white/10 bg-[#121212] shadow-[0_32px_80px_rgba(0,0,0,0.55)]"
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Close template details"
                  className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition hover:bg-white/10"
                  onClick={() => setActiveId(null)}
                >
                  <X size={16} />
                </button>

                <div className="grid grid-cols-1 overflow-hidden md:grid-cols-[1.15fr_0.85fr]">
                  <motion.div
                    layoutId={`thumb-${activeTemplate.slug}`}
                    className="min-h-[260px] bg-[#f0eee8]"
                  >
                    {activeTemplate.previewImage ? (
                      <img
                        src={activeTemplate.previewImage}
                        alt={`${activeTemplate.name} preview`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#f0eee8] text-[#27231f]">
                        <div className="h-[75%] w-[75%] rounded-lg border border-black/10 bg-[#f7f2ea] shadow-inner" />
                      </div>
                    )}
                  </motion.div>

                  <div className="flex flex-col justify-center bg-[#121212] p-6 text-white sm:p-8">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#d4d4d4]">
                      {activeTemplate.brand}
                    </span>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                      {activeTemplate.name}
                    </h2>
                    <p className="mt-4 text-sm text-[#e5d8c8]">
                      Built with: {activeTemplate.stack.join(", ")}
                    </p>
                    <div className="mt-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#d8d8d8]">
                        Available features
                      </p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#f2f2f2]">
                        {activeTemplate.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-4 text-sm text-[#e5d8c8]">
                     <i>"Changes can be made to the template and features to fit your business needs."</i>
                    </p>

                    <a
                      href={activeTemplate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-7 inline-flex items-center gap-2 self-start rounded-full border border-[#171717]/10 bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0f0f0f]"
                    >
                      Visit Website Demo <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
