import { useEffect, useMemo, useRef, type ElementType, type ReactNode, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

export type ScrollRevealProps = {
  /** The text to animate. A string is split into words; anything else renders as-is. */
  children: ReactNode;
  /** Optional scroll container. Defaults to the window. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  /** Enables the blur animation on the words. */
  enableBlur?: boolean;
  /** Initial opacity of the words before the animation. */
  baseOpacity?: number;
  /** Starting rotation in degrees for the container. */
  baseRotation?: number;
  /** Blur in pixels applied at the start. */
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  /** Scroll trigger end for the container rotation. */
  rotationEnd?: string;
  /** Scroll trigger end for the word opacity and blur animations. */
  wordAnimationEnd?: string;
  /**
   * Element used for the container. Defaults to `h2` as upstream, which is right
   * for a heading; pass "div" or "section" when wrapping block content.
   */
  as?: ElementType;
  /** Seconds between each word or block as it is revealed. */
  stagger?: number;
};

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  as = "h2",
  stagger = 0.05,
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLElement>(null);

  // Only plain text can be split into words. Anything richer (a grid of cards, a
  // whole component) is revealed as blocks instead: the element children become
  // the stagger targets, so the same effect works without flattening the markup
  // into a heading.
  const isPlainText = typeof children === "string";

  const splitText = useMemo(() => {
    if (typeof children !== "string") return null;
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);


  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Words for a text reveal; for block content the direct element children are
    // the units, so a grid of cards cascades instead of the whole block popping in
    // as one piece.
    const targets: Element[] = el.querySelectorAll(".word").length
      ? Array.from(el.querySelectorAll(".word"))
      : Array.from(el.children);

    // GSAP drives inline styles, so the project's global
    // `prefers-reduced-motion` transition reset cannot reach it. Visitors who ask
    // for less motion get the finished state instead of the scrubbed animation.
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { rotate: 0 });
      if (targets.length) {
        gsap.set(targets, { opacity: 1, filter: "blur(0px)", willChange: "auto" });
      }
      return;
    }

    const scroller = scrollContainerRef?.current ?? window;

    // Collected so cleanup kills only what this instance created. Upstream calls
    // ScrollTrigger.getAll().kill(), which would also tear down the accordion
    // gallery's animations elsewhere on the page.
    const triggers: ScrollTrigger[] = [];
    const track = (vars: ScrollTrigger.Vars) => {
      const trigger = ScrollTrigger.create(vars);
      triggers.push(trigger);
      return trigger;
    };

    const rotationTween = gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: track({
          trigger: el,
          scroller,
          start: "top bottom",
          end: rotationEnd,
          scrub: true,
        }),
      }
    );

    if (targets.length) {
      gsap.fromTo(
        targets,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger,
          scrollTrigger: track({
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          }),
        }
      );

      if (enableBlur) {
        gsap.fromTo(
          targets,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger,
            scrollTrigger: track({
              trigger: el,
              scroller,
              start: "top bottom-=20%",
              end: wordAnimationEnd,
              scrub: true,
            }),
          }
        );
      }
    }

    // Web fonts and the hero canvas settle after mount, which shifts the measured
    // positions these triggers were created against.
    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      rotationTween.kill();
      if (targets.length) gsap.set(targets, { clearProps: "all" });
      gsap.set(el, { clearProps: "all" });
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength, stagger, isPlainText]);

  const Container = as;
  return (
    <Container ref={containerRef} className={`scroll-reveal ${containerClassName}`.trim()}>
      {isPlainText ? (
        <p className={`scroll-reveal-text ${textClassName}`.trim()}>{splitText}</p>
      ) : (
        // Rendered directly, with no inner <p>: a wrapper paragraph would be
        // invalid markup for block content and would inherit text styles.
        children
      )}
    </Container>
  );
};

export default ScrollReveal;
