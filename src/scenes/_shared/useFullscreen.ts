import { useEffect, useState } from "react";

/**
 * Binds `F` to request fullscreen on <html>, `Esc` to exit. Returns
 * the current fullscreen state so scenes can optionally react.
 */
export function useFullscreen(): boolean {
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "f" || e.key === "F") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        const el = document.documentElement;
        if (!document.fullscreenElement) {
          el.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      }
    }
    function onChange() {
      setIsFull(Boolean(document.fullscreenElement));
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, []);

  return isFull;
}

/** Hides the mouse cursor after `idleMs` of no movement over the target element. */
export function useIdleCursor(ref: React.RefObject<HTMLElement | null>, idleMs = 2000) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: number | undefined;
    function show() {
      if (!el) return;
      el.dataset.sceneCursor = "shown";
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (el) el.dataset.sceneCursor = "hidden";
      }, idleMs);
    }
    el.dataset.sceneCursor = "hidden";
    el.addEventListener("mousemove", show);
    el.addEventListener("mouseleave", show);
    return () => {
      if (timer) window.clearTimeout(timer);
      el.removeEventListener("mousemove", show);
      el.removeEventListener("mouseleave", show);
    };
  }, [ref, idleMs]);
}
