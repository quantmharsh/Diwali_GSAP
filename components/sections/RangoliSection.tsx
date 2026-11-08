"use client";

import { useCallback } from "react";
import { gsap } from "gsap";
import { createScrubTimeline, useGsapScene } from "@/components/animations/useGsapScene";
import { Diya } from "@/components/ui/Diya";
import { SectionLabel } from "@/components/ui/SectionLabel";

function RangoliArtwork() {
  return (
    <svg className="rangoli-art" viewBox="0 0 600 600" fill="none" aria-hidden="true">
      <circle className="rangoli-stroke rangoli-stroke--outer" cx="300" cy="300" r="276" />
      <circle className="rangoli-stroke rangoli-stroke--fine" cx="300" cy="300" r="252" />
      <circle className="rangoli-stroke" cx="300" cy="300" r="219" />
      <circle className="rangoli-stroke rangoli-stroke--fine" cx="300" cy="300" r="171" />
      <circle className="rangoli-stroke" cx="300" cy="300" r="122" />
      <g className="rangoli-petals">
        {Array.from({ length: 16 }, (_, index) => <ellipse className="rangoli-stroke rangoli-petal" key={index} cx="300" cy="178" rx="42" ry="118" transform={`rotate(${index * 22.5} 300 300)`} />)}
      </g>
      <g className="rangoli-dots">
        {Array.from({ length: 24 }, (_, index) => <circle className="rangoli-dot" key={index} cx="300" cy="35" r="4" transform={`rotate(${index * 15} 300 300)`} />)}
      </g>
      <g className="rangoli-center-flower">
        <path className="rangoli-stroke rangoli-flower" d="M300 210c27 34 27 146 0 180-27-34-27-146 0-180Zm-90 90c34-27 146-27 180 0-34 27-146 27-180 0Zm26-64c43 3 116 76 119 119-43-3-116-76-119-119Zm119 0c-3 43-76 116-119 119 3-43 76-116 119-119Z" />
        <circle className="rangoli-center" cx="300" cy="300" r="13" />
      </g>
    </svg>
  );
}

export function RangoliSection() {
  const build = useCallback((root: HTMLElement, pin: boolean) => {
    const select = gsap.utils.selector(root);
    // Pin on mobile too, keeping the mandala in view until its drawing and reveal finish.
    const timeline = createScrubTimeline(root, pin, "+=180%");
    const strokes = select(".rangoli-stroke") as unknown as SVGGeometryElement[];
    strokes.forEach((stroke) => {
      const length = stroke.getTotalLength();
      gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.set(select(".rangoli-art"), { rotation: -28, scale: 0.68, transformOrigin: "50% 50%" });
    gsap.set(select(".rangoli-glow"), { scale: 0.68, autoAlpha: 0.38, transformOrigin: "50% 50%" });
    gsap.set(select(".rangoli-center"), { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(select(".rangoli-dot"), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" });
    gsap.set(select(".rangoli-petals"), { transformOrigin: "50% 50%" });
    gsap.set(select(".rangoli-copy"), { autoAlpha: 0, x: 42 });
    gsap.set(select(".rangoli-diya .diya__flame"), { autoAlpha: 0, scaleY: 0.1, transformOrigin: "50% 100%" });

    timeline
      .to(select(".rangoli-center"), { scale: 1, duration: 0.4, ease: "back.out(2.4)" }, 0.1)
      .to(select(".rangoli-glow"), { scale: 1.18, autoAlpha: 1, duration: 1.15, ease: "sine.inOut" }, 0.25)
      .to(select(".rangoli-glow"), { scale: 0.92, autoAlpha: 0.68, duration: 1.15, ease: "sine.inOut" }, 1.72)
      .to(strokes, { strokeDashoffset: 0, stagger: 0.19, duration: 1.15, ease: "power1.inOut" }, 0.38)
      .to(select(".rangoli-dot"), { autoAlpha: 1, scale: 1, stagger: { each: 0.03, from: "center" }, duration: 0.3 }, 0.94)
      .fromTo(select(".rangoli-petals"), { rotation: -18 }, { rotation: 18, duration: 1.1, ease: "sine.inOut" }, 1.1)
      .to(select(".rangoli-art"), { rotation: 32, scale: 1, duration: 2.15, ease: "power1.inOut" }, 0.35)
      .to(select(".rangoli-diya .diya__flame"), { autoAlpha: 1, scaleY: 1, duration: 0.25, stagger: 0.18, ease: "back.out(2)" }, 2.12)
      .to(select(".rangoli-copy"), { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out" }, 2.55);
  }, []);

  const sectionRef = useGsapScene(build, true);

  return (
    <section className="scene scene--rangoli" id="rangoli" ref={sectionRef} aria-labelledby="rangoli-title">
      <div className="rangoli-orbit" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="rangoli-composition">
        <div className="rangoli-glow" aria-hidden="true" />
        <RangoliArtwork />
        <div className="rangoli-diya rangoli-diya--one"><Diya size="small" /></div>
        <div className="rangoli-diya rangoli-diya--two"><Diya size="small" /></div>
        <div className="rangoli-diya rangoli-diya--three"><Diya size="small" /></div>
        <div className="rangoli-diya rangoli-diya--four"><Diya size="small" /></div>
      </div>
      <div className="rangoli-copy">
        <SectionLabel number="03">A wish in every colour</SectionLabel>
        <h2 id="rangoli-title">A universe<br />in <em>one circle.</em></h2>
        <p>May joy bloom in every direction, and beauty find its way into the smallest moments.</p>
        <span className="scene-footnote">Drawn in light. Made to be shared.</span>
      </div>
      <span className="scene-index">03 / 06</span>
    </section>
  );
}
