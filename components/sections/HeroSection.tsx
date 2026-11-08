"use client";

import { useCallback } from "react";
import { gsap } from "gsap";
import { HeroTitleParticles } from "@/components/animations/HeroTitleParticles";
import { createScrubTimeline, useGsapScene } from "@/components/animations/useGsapScene";
import { Diya } from "@/components/ui/Diya";
import { StarField } from "@/components/ui/StarField";

const headline = "DIWALI";

export function HeroSection() {
  const build = useCallback((root: HTMLElement, pin: boolean) => {
    const select = gsap.utils.selector(root);
    const timeline = createScrubTimeline(root, pin, "+=190%");
    const titleProgress = { value: 0 };
    const openingAtTop = root.offsetTop < 2 && window.scrollY < 2;
    if (!openingAtTop) gsap.set(select(".hero-sky, .hero-moon, .hero-copy, .hero-beam"), { autoAlpha: 0 });
    gsap.set(select(".hero-cloud--near"), { xPercent: -12, y: 22 });
    gsap.set(select(".hero-cloud--far"), { xPercent: 10, y: 14 });
    if (!openingAtTop) {
      gsap.set(select(".hero-title__letter"), { yPercent: 120, rotateX: -80, autoAlpha: 0, filter: "blur(10px)" });
      gsap.set(select(".hero-diya .diya__flame"), { scaleY: 0.1, transformOrigin: "50% 100%", autoAlpha: 0 });
    } else {
      gsap.set(select(".hero-diya--center .diya__flame"), { scaleY: 0.42, transformOrigin: "50% 100%", autoAlpha: 0.42 });
      gsap.set(select(".hero-diya--left .diya__flame, .hero-diya--right .diya__flame"), { scaleY: 0.1, transformOrigin: "50% 100%", autoAlpha: 0 });
    }
    gsap.set(select(".hero-title-particles"), { autoAlpha: 0 });

    timeline
      .to(select(".hero-sky"), { autoAlpha: 1, duration: 0.7 }, 0)
      .to(select(".hero-cloud--far"), { xPercent: 0, y: 0, autoAlpha: 0.38, duration: 1.2 }, 0.18)
      .to(select(".hero-moon"), { autoAlpha: 1, scale: 1, y: 0, duration: 0.75, ease: "power2.out" }, 0.48)
      .to(select(".hero-beam"), { autoAlpha: 1, scaleX: 1, duration: 0.75, transformOrigin: "left center" }, 1.12)
      .to(select(".hero-cloud--near"), { xPercent: 0, y: 0, autoAlpha: 0.66, duration: 1.05 }, 1.3)
      .to(select(".hero-diya .diya__flame"), { autoAlpha: 1, scaleY: 1, duration: 0.25, stagger: 0.2, ease: "back.out(2)" }, 2.05)
      .to(select(".hero-copy"), { autoAlpha: 1, duration: 0.2 }, 2.82)
      .to(select(".hero-title-particles"), { autoAlpha: 0.92, duration: 0.18 }, 2.84)
      .to(titleProgress, { value: 1, duration: 0.92, ease: "power1.inOut", onUpdate: () => { root.dataset.titleProgress = String(titleProgress.value); } }, 2.86)
      .to(select(".hero-title__letter"), { yPercent: 0, rotateX: 0, autoAlpha: 1, filter: "blur(0px)", stagger: 0.035, duration: 0.72, ease: "power3.out" }, 2.87)
      .to(select(".hero-title-particles"), { autoAlpha: 0, duration: 0.42 }, 3.78)
      .to(select(".hero-world"), { scale: 1.12, duration: 1.4, ease: "power1.inOut" }, 4.02)
      .to(select(".hero-copy"), { yPercent: -14, autoAlpha: 0.25, duration: 0.55 }, 4.62)
      .to(select(".hero-transition"), { scaleX: 1, duration: 0.7, ease: "power2.in" }, 4.75);
  }, []);

  const sectionRef = useGsapScene(build);

  return (
    <section className="scene scene--hero" id="top" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero-world">
        <div className="hero-sky" aria-hidden="true">
          <StarField />
          <div className="hero-moon"><span /></div>
          <div className="hero-cloud hero-cloud--far"><i /><i /><i /></div>
          <div className="hero-cloud hero-cloud--near"><i /><i /><i /><i /></div>
          <div className="hero-beam" />
          <div className="hero-horizon" />
        </div>
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="The Festival of Lights, home">
            <span className="wordmark__symbol" aria-hidden="true">✳</span>
            <span>THE FESTIVAL<br />OF LIGHTS</span>
          </a>
          <span className="site-header__date">A DIWALI STORY · 2026</span>
          <a className="header-link" href="#finale">A wish for you <span aria-hidden="true">↗</span></a>
        </header>
        <div className="hero-copy">
          <HeroTitleParticles />
          <p className="eyebrow"><span className="eyebrow__dash" />A night made luminous</p>
          <h1 id="hero-title" aria-label="Diwali">
            {Array.from(headline).map((letter, index) => <span className="hero-title__letter" aria-hidden="true" key={`${letter}-${index}`}>{letter}</span>)}
          </h1>
          <p className="hero-subtitle">Where every light brings<br /><em>a new beginning.</em></p>
        </div>
        <div className="hero-lamp-wrap" aria-hidden="true">
          <div className="hero-lamp-glow" />
          <div className="hero-diyas">
            <Diya size="small" className="hero-diya hero-diya--left" />
            <Diya size="large" className="hero-diya hero-diya--center" />
            <Diya size="small" className="hero-diya hero-diya--right" />
          </div>
        </div>
        <div className="hero-scroll"><span className="hero-scroll__line" /><span>Scroll to begin</span><span>01 — 06</span></div>
      </div>
      <div className="scene-transition scene-transition--gold hero-transition" aria-hidden="true" />
    </section>
  );
}
