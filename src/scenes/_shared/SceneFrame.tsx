import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useFullscreen, useIdleCursor } from "./useFullscreen";
import { usePauseOnSpace } from "./usePauseOnSpace";
import { useOfflineGuard } from "./useOfflineGuard";
import { getPalette, paletteVars, type Mood } from "./palette";

interface SceneFrameProps {
  name: string;
  mood?: Mood;
  children: ReactNode;
  paused?: boolean;
  togglePause?: () => void;
  /** Show the tiny gallery-return affordance. Hidden when fullscreen. */
  hint?: string;
}

/**
 * Shared scene shell. Every scene renders inside this: it sets up fullscreen,
 * pause-on-space, idle cursor hiding, palette CSS variables, and the tiny
 * corner affordances that tell you the keys work.
 *
 * The affordances are deliberately dim and in the far corners so they don't
 * land in a photo taken at ~1m distance from the laptop.
 */
export function SceneFrame({
  name,
  mood,
  children,
  paused,
  togglePause,
  hint,
}: SceneFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isFull = useFullscreen();
  useIdleCursor(ref);
  useOfflineGuard(name);
  usePauseOnSpace(() => togglePause?.());

  const palette = getPalette(mood);

  return (
    <div
      ref={ref}
      className="relative h-screen w-screen overflow-hidden"
      style={{
        background: palette.bg,
        color: palette.fg,
        ...paletteVars(palette),
      }}
    >
      {children}

      {/* Corner affordances — intentionally tiny and in far corners */}
      {!isFull && (
        <div
          className="pointer-events-none absolute inset-0 font-mono text-[10px] uppercase tracking-[0.2em]"
          style={{ color: palette.dim }}
        >
          <div className="absolute left-4 top-4 pointer-events-auto">
            <Link
              to="/"
              className="opacity-60 transition hover:opacity-100"
              style={{ color: palette.dim }}
            >
              say-hi / {name}
            </Link>
          </div>
          <div className="absolute right-4 top-4 opacity-60">
            <kbd className="font-mono">F</kbd> fullscreen ·{" "}
            <kbd className="font-mono">Space</kbd> freeze
          </div>
          {hint && (
            <div className="absolute bottom-4 left-4 opacity-60">{hint}</div>
          )}
          {paused && (
            <div className="absolute bottom-4 right-4 opacity-80">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: palette.accent }}
              />
              <span className="ml-2 align-middle">frozen</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
