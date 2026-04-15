import { useEffect, useMemo, useRef, useState } from "react";
import { SceneFrame } from "../_shared/SceneFrame";
import { mulberry32, sessionSeed } from "../_shared/rng";
import { thinkNodeLabels } from "../_shared/wordbank";
import { buildLayout, nodePosition } from "./graphLayout";

// Viewport mapped to [-1, 1]^2 with a safe inset.
const VIEW = 1000;
const CENTER = VIEW / 2;
const SCALE = (VIEW / 2) * 0.88;

function toView(nx: number, ny: number) {
  return { x: CENTER + nx * SCALE, y: CENTER + ny * SCALE };
}

export function ThinkScene() {
  const seed = useMemo(() => sessionSeed("think"), []);
  const layout = useMemo(
    () => buildLayout(mulberry32(seed), thinkNodeLabels),
    [seed],
  );

  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedAtRef = useRef<number | null>(null);
  const accumPausedRef = useRef(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    function step(now: number) {
      if (startRef.current == null) startRef.current = now;
      if (!paused) {
        setTime(now - startRef.current - accumPausedRef.current);
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  useEffect(() => {
    if (paused) {
      pausedAtRef.current = performance.now();
    } else if (pausedAtRef.current != null) {
      accumPausedRef.current += performance.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
  }, [paused]);

  const positions = layout.nodes.map((n) => ({
    n,
    ...toView(...Object.values(nodePosition(n, time)) as [number, number]),
  }));

  // Degree-like coordinate readout derived from the highlighted node.
  const hi = positions[layout.highlightId] ?? positions[0];
  const ra = hi
    ? `${Math.floor(((hi.n.ax + 1) * 12) % 24).toString().padStart(2, "0")}h ${Math.floor(((hi.n.ay + 1) * 30) % 60).toString().padStart(2, "0")}m`
    : "00h 00m";
  const dec = hi
    ? `${(hi.n.ay * 60).toFixed(1)}°`
    : "0.0°";

  return (
    <SceneFrame
      name="think"
      mood="night"
      paused={paused}
      togglePause={() => setPaused((p) => !p)}
    >
      <div className="relative h-full w-full">
        {/* Starfield vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,1) 0.8px, transparent 0.8px)",
            backgroundSize: "38px 38px",
          }}
        />

        {/* Chart plate title */}
        <header className="absolute inset-x-0 top-[7%] flex justify-center">
          <div
            className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.38em]"
            style={{ color: "var(--dim)" }}
          >
            <span>plate vii</span>
            <span
              className="inline-block h-px w-10"
              style={{ background: "var(--rule)" }}
            />
            <span style={{ color: "var(--fg)" }}>field of thought</span>
            <span
              className="inline-block h-px w-10"
              style={{ background: "var(--rule)" }}
            />
            <span>mag. 0.8</span>
          </div>
        </header>

        {/* The chart */}
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="plateRing" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="96%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </radialGradient>
          </defs>

          {/* Concentric chart rings */}
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <circle
              key={r}
              cx={CENTER}
              cy={CENTER}
              r={r * SCALE}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={0.6}
              strokeDasharray={r === 1 ? undefined : "2 6"}
            />
          ))}
          {/* Axes */}
          <line
            x1={CENTER - SCALE}
            y1={CENTER}
            x2={CENTER + SCALE}
            y2={CENTER}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={0.6}
          />
          <line
            x1={CENTER}
            y1={CENTER - SCALE}
            x2={CENTER}
            y2={CENTER + SCALE}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={0.6}
          />

          {/* Edges */}
          {layout.edges.map((e, i) => {
            const a = positions[e.a]!;
            const b = positions[e.b]!;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(230,225,210,1)"
                strokeOpacity={0.1 + e.weight * 0.15}
                strokeWidth={0.8}
              />
            );
          })}

          {/* Nodes */}
          {positions.map(({ n, x, y }) => {
            const isHi = n.id === layout.highlightId;
            return (
              <g key={n.id}>
                {isHi && (
                  <circle
                    cx={x}
                    cy={y}
                    r={14}
                    fill="none"
                    stroke="rgba(212,212,216,0.35)"
                    strokeWidth={0.8}
                  >
                    <animate
                      attributeName="r"
                      values="10;18;10"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      values="0.15;0.45;0.15"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={n.size}
                  fill={isHi ? "#f2f2f2" : "rgba(242,242,242,0.88)"}
                />
                <text
                  x={x + 14}
                  y={y + 6}
                  fontFamily="Newsreader, serif"
                  fontStyle={n.italic ? "italic" : "normal"}
                  fontSize={22}
                  fill={isHi ? "#ffffff" : "rgba(242,242,242,0.92)"}
                  fontWeight={isHi ? 500 : 400}
                  letterSpacing="0.01em"
                >
                  {n.label}
                </text>
              </g>
            );
          })}

          {/* Center crosshair */}
          <g stroke="rgba(255,255,255,0.35)" strokeWidth={0.8}>
            <line x1={CENTER - 10} y1={CENTER} x2={CENTER + 10} y2={CENTER} />
            <line x1={CENTER} y1={CENTER - 10} x2={CENTER} y2={CENTER + 10} />
            <circle cx={CENTER} cy={CENTER} r={3} fill="none" />
          </g>
        </svg>

        {/* Coordinate readout */}
        <footer
          className="absolute inset-x-0 bottom-[7%] flex items-end justify-between px-16 font-mono text-[10px] uppercase tracking-[0.32em]"
          style={{ color: "var(--dim)" }}
        >
          <div className="flex flex-col gap-1">
            <span>
              α <span style={{ color: "var(--fg)" }}>{ra}</span>
            </span>
            <span>
              δ <span style={{ color: "var(--fg)" }}>{dec}</span>
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span>observer · tbl 01</span>
            <span>n. {layout.nodes.length.toString().padStart(2, "0")} bodies</span>
          </div>
        </footer>
      </div>
    </SceneFrame>
  );
}
