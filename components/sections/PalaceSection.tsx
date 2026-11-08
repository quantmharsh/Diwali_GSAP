"use client";

import { useCallback } from "react";
import { gsap } from "gsap";
import { createScrubTimeline, useGsapScene } from "@/components/animations/useGsapScene";
import { MarigoldPetals } from "@/components/ui/MarigoldPetals";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StarField } from "@/components/ui/StarField";

function PalaceSilhouette() {
  return (
    <svg className="palace-art" viewBox="0 0 1440 650" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="palace-stone" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#4c304a" /><stop offset="1" stopColor="#120c1c" /></linearGradient>
        <linearGradient id="palace-edge" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#d4a663" stopOpacity=".76" /><stop offset="1" stopColor="#513048" stopOpacity=".15" /></linearGradient>
      </defs>
      <path className="palace-mountain palace-mountain--far" d="M0 430 150 310l120 90 156-180 160 170 147-136 157 161 117-114 170 155 122-85 141 97v182H0Z" />
      <path className="palace-mountain palace-mountain--near" d="M0 485 145 388l130 72 155-131 172 128 146-82 127 99 153-122 145 95 115-84 152 91v194H0Z" />
      <path d="M0 551h1440v99H0Z" fill="#0b0810" />
      <path d="M80 551V350h110v-83q55-84 110 0v83h135V310h100V225q54-75 108 0v85h115v-40h86v40h96V260q64-88 128 0v60h94v-85q58-80 116 0v316Z" fill="url(#palace-stone)" stroke="url(#palace-edge)" strokeWidth="2" />
      <path d="M80 352h110m110 0h135m100-40h108m115-2h86m96-2h128m94 0h116" stroke="#e6bd78" strokeOpacity=".45" strokeWidth="3" />
      <path d="M190 551V267q55-84 110 0v284M435 551V225q54-75 108 0v326M844 551V260q64-88 128 0v291M1066 551V235q58-80 116 0v316" fill="#150e1f" stroke="#bb8e5a" strokeOpacity=".5" strokeWidth="2" />
      <g className="palace-window-group">
        <path className="palace-window" d="M111 551v-82q24-38 48 0v82Z" />
        <path className="palace-window" d="M225 551v-76q24-36 48 0v76Z" />
        <path className="palace-window" d="M305 551v-95q28-43 56 0v95Z" />
        <path className="palace-window" d="M365 551v-75q24-37 48 0v75Z" />
        <path className="palace-window" d="M463 551V438q28-44 56 0v113Z" />
        <path className="palace-window" d="M558 551v-88q24-38 48 0v88Z" />
        <path className="palace-window" d="M638 551V426q28-44 56 0v125Z" />
        <path className="palace-window" d="M738 551v-90q25-40 50 0v90Z" />
        <path className="palace-window" d="M885 551V430q28-43 56 0v121Z" />
        <path className="palace-window" d="M974 551v-88q24-38 48 0v88Z" />
        <path className="palace-window" d="M1096 551v-95q27-43 54 0v95Z" />
        <path className="palace-window" d="M1190 551v-80q25-39 50 0v80Z" />
        <path className="palace-window" d="M1282 551v-104q29-45 58 0v104Z" />
      </g>
      <path d="M0 550h1440" stroke="#e7bc68" strokeOpacity=".4" strokeWidth="2" />
    </svg>
  );
}

const lanterns = [
  { left: "12%", top: "27%", delay: "0s" },
  { left: "29%", top: "17%", delay: ".3s" },
  { left: "68%", top: "22%", delay: ".6s" },
  { left: "84%", top: "31%", delay: ".15s" },
];

export function PalaceSection() {
  const build = useCallback((root: HTMLElement) => {
    const select = gsap.utils.selector(root);
    const timeline = createScrubTimeline(root, false, "+=155%");
    gsap.set(select(".palace-copy, .palace-sky, .palace-art, .palace-lantern"), { autoAlpha: 0 });
    gsap.set(select(".palace-art"), { y: 32 });
    gsap.set(select(".palace-window"), { autoAlpha: 0, filter: "brightness(.35)" });
    gsap.set(select(".palace-mountain--far"), { xPercent: -5 });
    gsap.set(select(".palace-mountain--near"), { xPercent: 4 });
    gsap.set(select(".palace-petals .petal-field__petal"), { autoAlpha: 0, y: -20, rotation: -40 });
    gsap.set(select(".palace-transition"), { scaleX: 0, transformOrigin: "left center" });

    timeline
      .to(select(".palace-sky"), { autoAlpha: 1, duration: 0.7 }, 0)
      .to(select(".palace-mountain--far"), { xPercent: 0, duration: 1.1 }, 0.1)
      .to(select(".palace-mountain--near"), { xPercent: 0, duration: 1.2 }, 0.05)
      .to(select(".palace-art"), { autoAlpha: 1, y: 0, duration: 0.65 }, 0.2)
      .to(select(".palace-window"), { autoAlpha: 1, filter: "brightness(1.7)", stagger: { each: 0.09, from: "center" }, duration: 0.32, ease: "power2.out" }, 0.78)
      .to(select(".palace-lantern"), { autoAlpha: 1, y: -34, x: (index) => (index % 2 ? 13 : -13), stagger: 0.17, duration: 0.85, ease: "sine.inOut" }, 1.38)
      .to(select(".palace-petals .petal-field__petal"), { autoAlpha: 0.88, x: (index) => (index % 2 ? 70 : -84), y: (index) => 100 + (index % 5) * 38, rotation: (index) => 180 + index * 25, stagger: { each: 0.045, from: "random" }, duration: 1.25, ease: "sine.inOut" }, 1.52)
      .to(select(".palace-copy"), { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 2.1)
      .to(select(".palace-transition"), { scaleX: 1, duration: 0.8, ease: "power2.in" }, 3.35);
  }, []);

  const sectionRef = useGsapScene(build);

  return (
    <section className="scene scene--palace" id="palace" ref={sectionRef} aria-labelledby="palace-title">
      <div className="palace-sky"><StarField /><div className="palace-haze" /></div>
      <div className="palace-depth palace-depth--far" aria-hidden="true" />
      <div className="palace-depth palace-depth--near" aria-hidden="true" />
      <div className="palace-lanterns" aria-hidden="true">
        {lanterns.map((lantern, index) => <span key={index} className="palace-lantern" style={{ left: lantern.left, top: lantern.top, animationDelay: lantern.delay }}><i /><b /></span>)}
      </div>
      <MarigoldPetals className="palace-petals" />
      <PalaceSilhouette />
      <div className="palace-copy">
        <SectionLabel number="02">The palace of lights</SectionLabel>
        <h2 id="palace-title">A thousand<br /><em>windows wake.</em></h2>
        <p>Every doorway glows a little brighter when the people we love are near.</p>
      </div>
      <span className="scene-index">02 / 06</span>
      <div className="scene-transition scene-transition--gold palace-transition" aria-hidden="true" />
    </section>
  );
}
