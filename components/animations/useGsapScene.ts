"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SceneBuilder = (root: HTMLElement, pin: boolean) => void;

export function useGsapScene(build: SceneBuilder, pinMobile = false) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeMode = "";
    let context: gsap.Context | undefined;

    const rebuild = () => {
      const nextMode = motionPreference.matches ? "reduced" : window.innerWidth >= 901 ? "desktop" : "mobile";
      if (nextMode === activeMode) return;

      context?.revert();
      context = undefined;
      root.classList.remove("gsap-enhanced");
      root.removeAttribute("data-final-progress");
      root.removeAttribute("data-title-progress");
      activeMode = nextMode;

      if (nextMode === "reduced") return;

      root.classList.add("gsap-enhanced");
      const shouldPin = nextMode === "desktop" || (nextMode === "mobile" && pinMobile);
      context = gsap.context(() => build(root, shouldPin), root);
      ScrollTrigger.refresh();
    };

    rebuild();
    window.addEventListener("resize", rebuild);
    motionPreference.addEventListener("change", rebuild);

    return () => {
      window.removeEventListener("resize", rebuild);
      motionPreference.removeEventListener("change", rebuild);
      context?.revert();
      root.classList.remove("gsap-enhanced");
      root.removeAttribute("data-final-progress");
      root.removeAttribute("data-title-progress");
    };
  }, [build, pinMobile]);

  return ref;
}

export function createScrubTimeline(root: HTMLElement, pin: boolean, distance = "+=130%", mobileEnd = "bottom 18%") {
  return gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root,
      pin: pin ? root : false,
      pinSpacing: true,
      start: pin ? "top top" : "top 82%",
      end: pin ? distance : mobileEnd,
      scrub: pin ? 0.85 : 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}
