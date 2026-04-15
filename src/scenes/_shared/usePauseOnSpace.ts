import { useEffect } from "react";

/**
 * Binds Space to toggle the scene clock's paused state. Lets the user freeze
 * on a specific frame to line up the photo they want.
 */
export function usePauseOnSpace(toggle: () => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      toggle();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);
}
