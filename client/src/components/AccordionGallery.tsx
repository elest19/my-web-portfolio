import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { gsap } from "gsap";

import "./AccordionGallery.css";

export type AccordionGalleryItem = {
  /** Image for the panel. Used when `content` is not provided. */
  image?: string;
  /** Caption revealed on the expanded panel. */
  label?: string;
  /** Optional destination. When set the panel renders as an anchor. */
  link?: string;
  /** Accessible description for the panel artwork. */
  alt?: string;
  /** Custom panel content rendered instead of an <img> (this portfolio feeds its ProjectArtwork here). */
  content?: ReactNode;
};

export type AccordionGalleryProps = {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
  /**
   * Called when the already expanded panel is activated. Lets a client-side
   * router (wouter) take over navigation instead of a full page load.
   */
  onActivate?: (item: AccordionGalleryItem, index: number) => void;
};

const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  { image: "https://picsum.photos/id/1015/900/1200", label: "Canyon", link: "#" },
  { image: "https://picsum.photos/id/1018/900/1200", label: "Ridgeline", link: "#" },
  { image: "https://picsum.photos/id/1039/900/1200", label: "Falls", link: "#" },
];

export default function AccordionGallery({
  items = DEFAULT_ITEMS,
  defaultIndex = 1,
  accentColor = "#ffffff",
  overlayColor = "#060010",
  textColor = "#ffffff",
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.70,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  className = "",
  onActivate
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(() => Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)));

  const prefersReduced =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp: gsap.TweenVars = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              "--ag-gray": gray,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [active, count, expandRatio, duration, ease, vertical, tilt, parallax, grayscale, showLabels, stagger, prefersReduced]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = (i: number) => {
    if (trigger === "hover") setActive(i);
  };

  const handleClick = (i: number, event: MouseEvent<HTMLElement>) => {
    if (i !== active) {
      event.preventDefault();
      setActive(i);
      return;
    }
    if (onActivate && items[i]?.link) {
      event.preventDefault();
      onActivate(items[i], i);
    }
  };

  const handleKeyDown = (i: number, event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i + 1) % count);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  if (!count) return null;

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? " accordion-gallery--vertical" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          "--ag-accent": accentColor,
          "--ag-overlay": overlayColor,
          "--ag-text": textColor,
          "--ag-gap": `${gap}px`,
          "--ag-radius": `${radius}px`,
          height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
        } as CSSProperties
      }
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const panelProps = {
          className: `ag-panel${isActive ? " ag-panel--active" : ""}`,
          style: { borderRadius: `${radius}px` } as CSSProperties,
          onClick: (event: MouseEvent<HTMLElement>) => handleClick(i, event),
          onMouseEnter: () => handleEnter(i),
          onFocus: () => setActive(i),
          onKeyDown: (event: KeyboardEvent<HTMLElement>) => handleKeyDown(i, event),
          role: "listitem" as const,
          tabIndex: 0,
          "aria-current": isActive ? ("true" as const) : undefined,
          "aria-label": item.label
        };
        const panelInner = (
          <>
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={(element) => { mediaRefs.current[i] = element; }}>
                {item.content ?? (item.image ? <img src={item.image} alt={item.alt || item.label || ""} draggable="false" /> : null)}
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={(element) => { barRefs.current[i] = element; }} />
                <span className="ag-panel__text" ref={(element) => { textRefs.current[i] = element; }}>{item.label}</span>
              </span>
            )}
          </>
        );

        return item.link ? (
          <a key={i} {...panelProps} ref={(element) => { panelRefs.current[i] = element; }} href={item.link}>{panelInner}</a>
        ) : (
          <div key={i} {...panelProps} ref={(element) => { panelRefs.current[i] = element; }}>{panelInner}</div>
        );
      })}
    </div>
  );
}
