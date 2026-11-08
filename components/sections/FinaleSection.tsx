"use client";

import { useCallback } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";
import { FinaleParticles } from "@/components/animations/FinaleParticles";
import { FireworksCanvas } from "@/components/animations/FireworksCanvas";
import { createScrubTimeline, useGsapScene } from "@/components/animations/useGsapScene";
import { SectionLabel } from "@/components/ui/SectionLabel";

function TitleLetters({ word }: { word: string }) {
  return <span className="finale-title__word" aria-hidden="true">{Array.from(word).map((letter, index) => <span className="finale-title__letter" key={`${letter}-${index}`}>{letter}</span>)}</span>;
}

export function FinaleSection() {
  const build = useCallback((root: HTMLElement, pin: boolean) => {
    const select = gsap.utils.selector(root);
    // On unpinned screens, end at the document bottom so the last scroll position
    // can finish the title reveal instead of leaving its letters slightly blurred.
    const timeline = createScrubTimeline(root, pin, "+=205%", "bottom bottom");
    const convergence = { value: 0 };
    gsap.set(select(".finale-vignette, .finale-light, .finale-copy, .finale-fireworks"), { autoAlpha: 0 });
    gsap.set(select(".finale-light"), { scale: 0.02, transformOrigin: "50% 50%" });
    gsap.set(select(".finale-title__letter"), { autoAlpha: 0, scale: 0.35, y: 56, rotationX: -65, filter: "blur(14px)" });
    gsap.set(select(".finale-wishes, .finale-replay, .finale-credit"), { autoAlpha: 0, y: 24 });

    timeline
      .to(select(".finale-vignette"), { autoAlpha: 1, duration: 0.7 }, 0)
      .to(select(".finale-light"), { autoAlpha: 1, scale: 1, duration: 1.15, ease: "power2.out" }, 0.4)
      .to(convergence, { value: 1, duration: 1.7, ease: "power1.inOut", onUpdate: () => { root.dataset.finalProgress = String(convergence.value); } }, 0.55)
      .to(select(".finale-copy"), { autoAlpha: 1, duration: 0.2 }, 1.46)
      .to(select(".finale-title__letter"), { autoAlpha: 1, scale: 1, y: 0, rotationX: 0, filter: "blur(0px)", stagger: { each: 0.055, from: "center" }, duration: 0.82, ease: "back.out(1.5)" }, 1.55)
      .to(select(".finale-title__letter"), { textShadow: "0 0 35px rgba(255,191,89,.78)", duration: 0.5, stagger: 0.03 }, 2.2)
      .to(select(".finale-fireworks"), { autoAlpha: 0.82, duration: 0.45 }, 2.45)
      .to(select(".finale-wishes"), { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 2.88)
      .to(select(".finale-replay"), { autoAlpha: 1, y: 0, duration: 0.4 }, 3.6)
      .to(select(".finale-credit"), { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, 3.9);
  }, []);

  const sectionRef = useGsapScene(build);

  return (
    <section className="scene scene--finale" id="finale" ref={sectionRef} aria-labelledby="finale-title">
      <div className="finale-vignette" aria-hidden="true" />
      <div className="finale-light" aria-hidden="true" />
      <FinaleParticles />
      <div className="finale-fireworks" aria-hidden="true"><FireworksCanvas finale /></div>
      <div className="finale-copy">
        <SectionLabel number="06">With warm wishes</SectionLabel>
        <p className="finale-overline">For every light you have shared</p>
        <h2 id="finale-title" aria-label="Happy Diwali"><TitleLetters word="HAPPY" /><TitleLetters word="DIWALI" /></h2>
        <div className="finale-wishes">
          <p>May the light of this Diwali illuminate your life with happiness, success, peace and prosperity.</p>
          <p className="finale-hindi" lang="hi">शुभ दीपावली</p>
          <p className="finale-signoff">With warm wishes <span aria-hidden="true">♥</span></p>
        </div>
        <motion.a className="finale-replay" href="#top" whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.97 }}>
          <span aria-hidden="true">↺</span> Begin the journey again
        </motion.a>
        <p className="finale-credit">Created with light by <span>Quantam-Harsh</span></p>
      </div>
      <span className="scene-index">06 / 06</span>
    </section>
  );
}
