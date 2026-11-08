"use client";

import { useCallback } from "react";
import { gsap } from "gsap";
import { FireworksCanvas } from "@/components/animations/FireworksCanvas";
import { createScrubTimeline, useGsapScene } from "@/components/animations/useGsapScene";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StarField } from "@/components/ui/StarField";

function NightSkyline() {
  return (
    <svg className="fireworks-skyline" viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="M0 283h88v-36h67v-78l37-36 38 36v78h51v-54h84v-83l46-42 47 42v83h74v-52h58v52h85v-92l46-45 47 45v92h68v-61h76v-53l42-38 43 38v53h85v-98l54-51 53 51v98h63v-63h72v63h87v-80l44-43 45 43v80h103v-63h59v63h50v77H0Z" fill="#0b0812" stroke="#d0a160" strokeOpacity=".35" strokeWidth="2" />
      <path d="M0 284h1600" stroke="#e0b76e" strokeOpacity=".54" strokeWidth="2" />
      <g className="skyline-window-group">
        <path className="skyline-window" d="M110 279v-19q12-16 24 0v19Zm110 0v-23q12-16 24 0v23Zm197 0v-24q13-18 26 0v24Zm96 0v-19q12-16 24 0v19Zm220 0v-22q12-17 24 0v22Zm151 0v-18q12-15 24 0v18Zm180 0v-24q13-18 26 0v24Zm143 0v-19q12-16 24 0v19Zm151 0v-22q12-17 24 0v22Z" fill="#ffc96c" />
      </g>
    </svg>
  );
}

export function FireworksSection() {
  const build = useCallback((root: HTMLElement) => {
    const select = gsap.utils.selector(root);
    const timeline = createScrubTimeline(root, false, "+=150%");
    gsap.set(select(".fireworks-copy"), { autoAlpha: 0, y: 34 });
    gsap.set(select(".fireworks-title__line"), { yPercent: 115, autoAlpha: 0, filter: "blur(8px)" });
    gsap.set(select(".fireworks-subtitle"), { autoAlpha: 0, y: 20 });
    gsap.set(select(".fireworks-skyline"), { yPercent: 22, autoAlpha: 0 });
    gsap.set(select(".fireworks-haze"), { scaleY: 0.45, transformOrigin: "50% 100%" });
    gsap.set(select(".skyline-window"), { autoAlpha: 0.12 });
    gsap.set(select(".fireworks-transition"), { scale: 0, transformOrigin: "50% 50%" });

    timeline
      .to(select(".fireworks-skyline"), { yPercent: 0, autoAlpha: 1, duration: 0.85, ease: "power2.out" }, 0.1)
      .to(select(".fireworks-haze"), { scaleY: 1.12, duration: 1.2, ease: "sine.inOut" }, 0.45)
      .to(select(".fireworks-haze"), { scaleY: 0.9, duration: 1.05, ease: "sine.inOut" }, 1.9)
      .to(select(".skyline-window"), { autoAlpha: 1, stagger: { each: 0.12, from: "random" }, duration: 0.26 }, 0.62)
      .to(select(".fireworks-copy"), { autoAlpha: 1, y: 0, duration: 0.48, ease: "power2.out" }, 1.05)
      .to(select(".fireworks-title__line"), { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", stagger: 0.22, duration: 0.7, ease: "power3.out" }, 1.2)
      .to(select(".fireworks-subtitle"), { autoAlpha: 1, y: 0, duration: 0.42 }, 2.28)
      .to(select(".fireworks-title__line"), { scale: 1.08, textShadow: "0 0 42px rgba(255,190,88,.8)", duration: 0.9, stagger: 0.1 }, 2.7)
      .to(select(".fireworks-transition"), { scale: 36, duration: 0.82, ease: "power2.in" }, 3.5);
  }, []);

  const sectionRef = useGsapScene(build);

  return (
    <section className="scene scene--fireworks" id="celebration" ref={sectionRef} aria-labelledby="fireworks-title">
      <div className="fireworks-night" aria-hidden="true"><StarField /><div className="fireworks-haze" /></div>
      <FireworksCanvas />
      <NightSkyline />
      <div className="fireworks-copy">
        <SectionLabel number="05">The night answers back</SectionLabel>
        <h2 id="fireworks-title" aria-label="Tonight, the sky answers back">
          <span className="fireworks-title__line" aria-hidden="true">Tonight, the</span>
          <span className="fireworks-title__line fireworks-title__line--gold" aria-hidden="true">sky answers back.</span>
        </h2>
        <p className="fireworks-subtitle">A hundred little suns, all saying the same thing:<br />there is still so much to celebrate.</p>
      </div>
      <span className="scene-index">05 / 06</span>
      <div className="fireworks-transition" aria-hidden="true" />
    </section>
  );
}
