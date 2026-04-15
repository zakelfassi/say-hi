import { useEffect, useMemo, useRef, useState } from "react";
import { SceneFrame } from "../_shared/SceneFrame";
import { mulberry32, sessionSeed, pickN } from "../_shared/rng";
import { writeOpenings } from "../_shared/wordbank";

type Phase = "typing" | "holding" | "erasing" | "beat";

const TYPE_MS = 62;
const ERASE_MS = 28;
const HOLD_MS = 3800;
const BEAT_MS = 900;

export function WriteScene() {
  const seed = useMemo(() => sessionSeed("write"), []);
  const rng = useMemo(() => mulberry32(seed), [seed]);
  const lines = useMemo(
    () => pickN(rng, writeOpenings, Math.min(5, writeOpenings.length)),
    [rng],
  );

  const [paused, setPaused] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [completed, setCompleted] = useState<string[]>([]);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    let cancelled = false;
    const target = lines[lineIdx % lines.length] ?? "";

    function step() {
      if (cancelled) return;
      if (pausedRef.current) {
        window.setTimeout(step, 180);
        return;
      }

      if (phase === "typing") {
        if (typed.length < target.length) {
          const next = target.slice(0, typed.length + 1);
          setTyped(next);
          const jitter = 0.7 + Math.random() * 0.9;
          const pauseFor = /[,.;:]/.test(next.slice(-1)) ? 260 : 0;
          window.setTimeout(step, TYPE_MS * jitter + pauseFor);
        } else {
          setPhase("holding");
          window.setTimeout(step, HOLD_MS);
        }
      } else if (phase === "holding") {
        setCompleted((prev) => [...prev, target]);
        setPhase("erasing");
        window.setTimeout(step, 40);
      } else if (phase === "erasing") {
        if (typed.length > 0) {
          setTyped(typed.slice(0, -1));
          window.setTimeout(step, ERASE_MS * (0.6 + Math.random() * 0.6));
        } else {
          setPhase("beat");
          window.setTimeout(step, BEAT_MS);
        }
      } else if (phase === "beat") {
        setLineIdx((i) => i + 1);
        setPhase("typing");
        window.setTimeout(step, 40);
      }
    }

    const id = window.setTimeout(step, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [phase, typed, lineIdx, lines]);

  const wordCount = useMemo(() => {
    const fromCompleted = completed.reduce(
      (n, s) => n + s.trim().split(/\s+/).length,
      0,
    );
    const fromCurrent = typed.trim() ? typed.trim().split(/\s+/).length : 0;
    return fromCompleted + fromCurrent;
  }, [completed, typed]);

  return (
    <SceneFrame
      name="write"
      mood="paper"
      paused={paused}
      togglePause={() => setPaused((p) => !p)}
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* Paper grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(rgba(40,28,12,1) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
        {/* Warm vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(60,40,18,0.08) 100%)",
          }}
        />

        {/* Folio marker */}
        <header className="absolute left-0 right-0 top-[10%] flex justify-center">
          <div
            className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "var(--dim)" }}
          >
            <span>an essay in progress</span>
            <span
              className="inline-block h-px w-12"
              style={{ background: "var(--rule)" }}
            />
            <span style={{ color: "var(--accent)" }}>§ {lineIdx + 1}</span>
          </div>
        </header>

        {/* The column itself */}
        <main className="absolute inset-0 flex items-center justify-center px-10">
          <article className="w-full max-w-[28ch] text-center">
            <p
              className="font-serif text-balance"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.4rem, 4.4vw, 4.2rem)",
                lineHeight: 1.15,
                fontWeight: 400,
                color: "var(--fg)",
                fontFeatureSettings: "'liga', 'dlig', 'kern'",
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ fontStyle: "italic", fontWeight: 300 }}>
                {typed}
              </span>
              <span
                aria-hidden
                className="inline-block align-baseline"
                style={{
                  width: "0.07em",
                  height: "0.9em",
                  marginLeft: "0.06em",
                  background: "var(--accent)",
                  transform: "translateY(0.05em)",
                  animation: "writeCursor 1.05s steps(2, end) infinite",
                }}
              />
            </p>
          </article>
        </main>

        {/* Bottom strip: word count, line count, ornament */}
        <footer
          className="absolute inset-x-0 bottom-[9%] flex items-end justify-between px-16 font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "var(--dim)" }}
        >
          <div className="flex flex-col gap-1">
            <span>{wordCount.toString().padStart(4, "0")} words</span>
            <span>line {(lineIdx + 1).toString().padStart(2, "0")} · draft 01</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span>
              <span style={{ color: "var(--accent)" }}>●</span> unsaved
            </span>
            <span
              className="inline-block h-px w-24"
              style={{ background: "var(--rule)" }}
            />
          </div>
        </footer>

        <style>{`
          @keyframes writeCursor {
            0%, 50% { opacity: 1; }
            50.01%, 100% { opacity: 0; }
          }
        `}</style>
      </div>
    </SceneFrame>
  );
}
