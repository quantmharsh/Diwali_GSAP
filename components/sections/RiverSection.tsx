"use client";

import { useCallback } from "react";
import { gsap } from "gsap";
import { createScrubTimeline, useGsapScene } from "@/components/animations/useGsapScene";
import { Diya } from "@/components/ui/Diya";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StarField } from "@/components/ui/StarField";

function RiverWater() {
  return (
    <div className="river-water" aria-hidden="true">
      <svg className="river-surface" viewBox="0 0 1600 600" preserveAspectRatio="none">
        <path className="river-bank river-bank--far" d="M0 62c210-58 300 21 485 0s296-72 460-17 334 64 655 2v553H0Z" />
        <path className="river-wave river-wave--one" d="M0 109c170-48 295 35 454 0s290-53 436-8 390 69 710 0v499H0Z" />
        <path className="river-wave river-wave--two" d="M0 180c190-46 280 35 476 0s290-47 438 2 388 53 686-2v420H0Z" />
        <path className="river-wave river-wave--three" d="M0 262c214-56 339 46 530-4s287-24 424 6 405 40 646-4v340H0Z" />
      </svg>
      <div className="river-reflection river-reflection--one" />
      <div className="river-reflection river-reflection--two" />
      <div className="river-ripples"><i /><i /><i /><i /><i /><i /><i /></div>
    </div>
  );
}

export function RiverSection() {
  const build = useCallback((root: HTMLElement, pin: boolean) => {
    const select = gsap.utils.selector(root);
    const timeline = createScrubTimeline(root, pin, "+=175%");
    gsap.set(select(".river-sky, .river-copy"), { autoAlpha: 0 });
    gsap.set(select(".river-water"), { clipPath: "inset(100% 0 0 0)" });
    gsap.set(select(".river-moon"), { y: 24, scale: 0.78, autoAlpha: 0, transformOrigin: "50% 50%" });
    gsap.set(select(".river-diya--follow"), { x: () => -window.innerWidth * 0.82, y: 0, rotation: -5, autoAlpha: 0 });
    gsap.set(select(".river-diya:not(.river-diya--follow)"), { autoAlpha: 0, y: 22 });
    gsap.set(select(".river-diya .diya__flame"), { autoAlpha: 0, scaleY: 0.1, transformOrigin: "50% 100%" });
    gsap.set(select(".river-reflection"), { scaleX: 0, transformOrigin: "left center" });
    gsap.set(select(".river-sparks i"), { autoAlpha: 0, y: 28, scale: 0.4 });
    gsap.set(select(".river-transition"), { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 100%" });

    timeline
      .to(select(".river-sky"), { autoAlpha: 1, duration: 0.5 }, 0)
      .to(select(".river-moon"), { y: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: "back.out(1.2)" }, 0.12)
      .to(select(".river-moon"), { scale: 1.08, duration: 1.4, yoyo: true, repeat: 1, ease: "sine.inOut" }, 1.45)
      .to(select(".river-water"), { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "power2.inOut" }, 0.15)
      .to(select(".river-copy"), { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.5)
      .to(select(".river-diya--follow"), { x: () => window.innerWidth * 0.82, y: -24, rotation: 5, autoAlpha: 1, duration: 4.25, ease: "none" }, 0.8)
      .to(select(".river-diya:not(.river-diya--follow)"), { autoAlpha: 1, y: 0, stagger: 0.32, duration: 0.42 }, 1.1)
      .to(select(".river-diya .diya__flame"), { autoAlpha: 1, scaleY: 1, stagger: 0.28, duration: 0.28, ease: "back.out(2)" }, 1.25)
      .to(select(".river-reflection"), { scaleX: 1, stagger: 0.22, duration: 1.4, ease: "sine.inOut" }, 1.35)
      .to(select(".river-ripples i"), { x: (index) => (index % 2 ? 46 : -38), scaleX: 1.8, opacity: 0.72, stagger: 0.08, duration: 1.7, ease: "sine.inOut" }, 1.7)
      .to(select(".river-sparks i"), { autoAlpha: 1, y: -88, scale: 1, stagger: { each: 0.07, from: "random" }, duration: 1.1, ease: "power1.out" }, 3.3)
      .to(select(".river-transition"), { autoAlpha: 1, scaleY: 1, duration: 0.75, ease: "power2.in" }, 4.25);
  }, []);

  const sectionRef = useGsapScene(build);

  return (
    <section className="scene scene--river" id="river" ref={sectionRef} aria-labelledby="river-title">
      <div className="river-sky"><StarField /><div className="river-moon" /></div>
      <RiverWater />
      <div className="river-copy">
        <SectionLabel number="04">A river of light</SectionLabel>
        <h2 id="river-title">Carry your<br />wishes <em>forward.</em></h2>
        <p>One diya. One quiet hope. A thousand reflections travelling together.</p>
      </div>
      <div className="river-diya river-diya--follow" aria-hidden="true"><Diya size="medium" /></div>
      <div className="river-diya river-diya--still river-diya--still-one" aria-hidden="true"><Diya size="small" /></div>
      <div className="river-diya river-diya--still river-diya--still-two" aria-hidden="true"><Diya size="small" /></div>
      <div className="river-diya river-diya--still river-diya--still-three" aria-hidden="true"><Diya size="small" /></div>
      <div className="river-sparks" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ left: `${(index * 43 + 11) % 100}%`, bottom: `${(index * 17 + 12) % 50}%` }} />)}</div>
      <span className="scene-index">04 / 06</span>
      <div className="scene-transition scene-transition--reflection river-transition" aria-hidden="true" />
    </section>
  );
}
