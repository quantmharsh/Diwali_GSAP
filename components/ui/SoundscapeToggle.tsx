"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SoundStatus = "starting" | "playing" | "blocked" | "off";

export function SoundscapeToggle() {
  const [status, setStatus] = useState<SoundStatus>("starting");
  const statusRef = useRef<SoundStatus>("starting");
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantsSoundRef = useRef(true);
  const pointerStartedRef = useRef(false);

  const updateStatus = useCallback((next: SoundStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const startAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.42;
      await audio.play();
      updateStatus("playing");
    } catch {
      updateStatus("blocked");
    }
  }, [updateStatus]);

  useEffect(() => {
    // Try autoplay first; if the browser blocks it, the first touch/scroll starts it.
    void startAudio();
    const startAfterGesture = (event: Event) => {
      if (!wantsSoundRef.current || statusRef.current === "playing") return;
      if (event.target instanceof Element && event.target.closest(".sound-toggle")) return;
      void startAudio();
    };
    window.addEventListener("pointerdown", startAfterGesture, { passive: true });
    window.addEventListener("keydown", startAfterGesture);

    return () => {
      window.removeEventListener("pointerdown", startAfterGesture);
      window.removeEventListener("keydown", startAfterGesture);
      audioRef.current?.pause();
    };
  }, [startAudio]);

  const toggleAudio = () => {
    if (pointerStartedRef.current) {
      pointerStartedRef.current = false;
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;
    if (statusRef.current === "playing") {
      wantsSoundRef.current = false;
      audio.pause();
      updateStatus("off");
      return;
    }

    wantsSoundRef.current = true;
    updateStatus("starting");
    void startAudio();
  };

  const playing = status === "playing";
  const label = playing ? "Sound on" : status === "blocked" ? "Tap for sound" : status === "starting" ? "Starting song" : "Sound off";

  return (
    <>
      <audio ref={audioRef} src="/audio/diwali-instrumental.wav" loop preload="auto" aria-hidden="true" />
      <button
        className={`sound-toggle${playing ? " is-playing" : ""}`}
        type="button"
        onPointerDown={() => {
          pointerStartedRef.current = statusRef.current !== "playing";
          if (pointerStartedRef.current) {
            wantsSoundRef.current = true;
            updateStatus("starting");
            void startAudio();
          }
        }}
        onPointerCancel={() => { pointerStartedRef.current = false; }}
        onClick={toggleAudio}
        aria-label={playing ? "Turn Diwali song off" : "Turn Diwali song on"}
        aria-pressed={playing}
      >
        <span className="sound-toggle__icon" aria-hidden="true">{playing ? "♫" : "♪"}</span>
        <span>{label}</span>
        <span className="sound-toggle__bars" aria-hidden="true"><i /><i /><i /></span>
      </button>
    </>
  );
}
