import { useEffect, useMemo, useRef, useState } from "react";
import { SceneFrame } from "../_shared/SceneFrame";
import { chance, mulberry32, pick, range, sessionSeed, type Rng } from "../_shared/rng";
import { desktopFolders, desktopTypingLines } from "../_shared/wordbank";

type State = "calm" | "chaos" | "typing" | "updating" | "panic" | "rebooting";

const SEQUENCE: { state: State; ms: number }[] = [
  { state: "calm", ms: 5200 },
  { state: "chaos", ms: 6400 },
  { state: "typing", ms: 5800 },
  { state: "updating", ms: 5200 },
  { state: "panic", ms: 3400 },
  { state: "rebooting", ms: 3600 },
];

function readLockedState(): State | null {
  if (typeof window === "undefined") return null;
  const l = new URLSearchParams(window.location.search).get("lock");
  if (!l) return null;
  const valid: State[] = ["calm", "chaos", "typing", "updating", "panic", "rebooting"];
  return valid.includes(l as State) ? (l as State) : null;
}

export function DesktopScene() {
  const seed = useMemo(() => sessionSeed("desktop"), []);
  const rngRef = useRef<Rng>(mulberry32(seed));

  const locked = useMemo(() => readLockedState(), []);
  const lockedIdx = locked
    ? SEQUENCE.findIndex((s) => s.state === locked)
    : 0;

  const [stepIdx, setStepIdx] = useState(lockedIdx);
  const [stateStart, setStateStart] = useState(performance.now());
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const pauseStartRef = useRef<number | null>(null);
  const pauseAccumRef = useRef(0);

  useEffect(() => {
    if (paused) {
      pauseStartRef.current = performance.now();
    } else if (pauseStartRef.current != null) {
      pauseAccumRef.current += performance.now() - pauseStartRef.current;
      pauseStartRef.current = null;
    }
  }, [paused]);

  const step = SEQUENCE[stepIdx % SEQUENCE.length]!;

  useEffect(() => {
    if (paused || locked) return;
    const now = performance.now();
    const elapsedInState = now - stateStart - pauseAccumRef.current;
    const remaining = Math.max(100, step.ms - elapsedInState);
    const id = window.setTimeout(() => {
      setStepIdx((i) => i + 1);
      setStateStart(performance.now());
      pauseAccumRef.current = 0;
    }, remaining);
    return () => window.clearTimeout(id);
  }, [stepIdx, paused, step.ms, stateStart, locked]);

  // Clock for per-state sub-animations. Fast enough for cursor drift.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    function loop(now: number) {
      if (!pausedRef.current && now - last > 60) {
        setTick((t) => t + 1);
        last = now;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <SceneFrame
      name="desktop"
      mood="flow"
      paused={paused}
      togglePause={() => setPaused((p) => !p)}
    >
      <div className="relative h-full w-full overflow-hidden bg-black">
        {step.state === "calm" && <CalmState tick={tick} />}
        {step.state === "chaos" && <ChaosState tick={tick} rng={rngRef.current} />}
        {step.state === "typing" && <TypingState tick={tick} rng={rngRef.current} />}
        {step.state === "updating" && <UpdatingState tick={tick} />}
        {step.state === "panic" && <PanicState rng={rngRef.current} />}
        {step.state === "rebooting" && <RebootingState tick={tick} />}

        {/* Top menu bar — present in calm/chaos/typing/updating only */}
        {(step.state === "calm" ||
          step.state === "chaos" ||
          step.state === "typing" ||
          step.state === "updating") && <MenuBar />}
      </div>
    </SceneFrame>
  );
}

/* ------------------------------- MENU BAR ------------------------------- */

function MenuBar() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-7 items-center justify-between px-5 text-[11px]"
      style={{
        background: "rgba(14,16,22,0.62)",
        color: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-5 font-mono tracking-tight">
        <span>◆</span>
        <span style={{ fontWeight: 600 }}>Café OS</span>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Window</span>
      </div>
      <div className="flex items-center gap-4 font-mono text-[10px]">
        <span>∿</span>
        <span>◐</span>
        <span>⏻</span>
      </div>
    </div>
  );
}

/* ------------------------------- BACKGROUND ------------------------------- */

function Wallpaper() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #5c3b6e 0%, #2a2140 30%, #0f1329 70%, #050812 100%)",
        }}
      />
      {/* distant peaks */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-[38%] w-full"
        viewBox="0 0 1000 380"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="peakA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1d2240" />
            <stop offset="100%" stopColor="#0a0c1a" />
          </linearGradient>
          <linearGradient id="peakB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0c0e1c" />
            <stop offset="100%" stopColor="#050611" />
          </linearGradient>
        </defs>
        <path
          d="M0,240 L120,180 L220,210 L320,140 L440,220 L560,160 L680,200 L820,130 L1000,220 L1000,380 L0,380 Z"
          fill="url(#peakA)"
          opacity="0.82"
        />
        <path
          d="M0,300 L140,260 L260,280 L360,230 L520,290 L640,240 L780,280 L900,220 L1000,270 L1000,380 L0,380 Z"
          fill="url(#peakB)"
        />
      </svg>
      {/* small moon */}
      <div
        className="absolute"
        style={{
          left: "78%",
          top: "14%",
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 38%, #f5ecd4 0%, #c9b988 80%, rgba(201,185,136,0) 100%)",
          boxShadow: "0 0 80px rgba(245,236,212,0.18)",
        }}
      />
    </div>
  );
}

/* ------------------------------- CALM STATE ------------------------------- */

const CALM_ICONS = [
  { label: "drafts", x: 4, y: 2, color: "#e9d4a8" },
  { label: "frame 01", x: 4, y: 3, color: "#b8d0f0" },
  { label: "atlas.psd", x: 4, y: 4, color: "#d0a2bf" },
  { label: "café", x: 4, y: 5, color: "#c8e0c0" },
];

function CalmState({ tick: _tick }: { tick: number }) {
  return (
    <>
      <Wallpaper />
      <DesktopIconGrid icons={CALM_ICONS} />
      <Dock active={0} />
    </>
  );
}

/* ------------------------------ CHAOS STATE ------------------------------ */

function ChaosState({ tick, rng }: { tick: number; rng: Rng }) {
  const icons = useMemo(() => {
    // Start from tidy grid, then scramble positions + spawn extras.
    const base = CALM_ICONS.map((ic, i) => ({ ...ic, id: `base-${i}` }));
    const extras = Array.from({ length: 8 }, (_, i) => ({
      id: `e-${i}`,
      label: pick(rng, desktopFolders),
      x: Math.floor(range(rng, 4, 18)),
      y: Math.floor(range(rng, 2, 8)),
      color: pick(rng, ["#e9d4a8", "#b8d0f0", "#d0a2bf", "#c8e0c0", "#c5b3e8"]),
    }));
    return [...base, ...extras];
  }, [rng]);

  // Scramble icons every few ticks by rotating their positions.
  const shuffled = icons.map((ic, i) => {
    const shift = Math.floor(tick / 6) + i;
    const dx = Math.sin((tick + i * 7) * 0.3) * 1.2;
    const dy = Math.cos((tick + i * 3) * 0.22) * 0.8;
    return {
      ...ic,
      x: ((ic.x + shift) % 20) + dx,
      y: ((ic.y + Math.floor(shift / 3)) % 9) + dy,
    };
  });

  // Fake cursor dart across screen
  const cx = 20 + ((tick * 12) % 1200);
  const cy = 200 + Math.sin(tick * 0.35) * 120 + Math.cos(tick * 0.18) * 80;

  return (
    <>
      <Wallpaper />
      <DesktopIconGrid icons={shuffled} />
      <FinderWindow tick={tick} />
      <Cursor x={cx} y={cy} />
      <Dock active={(Math.floor(tick / 8)) % 6} />
    </>
  );
}

/* ------------------------------ TYPING STATE ------------------------------ */

function TypingState({ tick, rng }: { tick: number; rng: Rng }) {
  const lines = useMemo(
    () => [
      pick(rng, desktopTypingLines),
      pick(rng, desktopTypingLines),
      pick(rng, desktopTypingLines),
    ],
    [rng],
  );

  // Typing state: which line + how many chars revealed + phase
  const totalChars = lines.reduce((n, l) => n + l.length, 0);
  const c = (tick * 2) % (totalChars + 40);
  let remaining = c;
  const rendered: string[] = [];
  for (const line of lines) {
    if (remaining <= 0) {
      rendered.push("");
    } else if (remaining >= line.length) {
      rendered.push(line);
      remaining -= line.length;
    } else {
      rendered.push(line.slice(0, remaining));
      remaining = 0;
    }
  }

  return (
    <>
      <Wallpaper />
      <Dock active={2} />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(720px, 68%)",
          height: "min(460px, 58%)",
          background: "rgba(250,247,239,0.97)",
          color: "#1a1712",
          borderRadius: 10,
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.25)",
          overflow: "hidden",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Traffic lights */}
        <div
          className="flex items-center gap-2 px-4"
          style={{
            height: 34,
            background: "rgba(245,238,225,0.98)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "#ff5f57" }}
          />
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "#febc2e" }}
          />
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "#28c840" }}
          />
          <span
            className="ml-4 font-mono text-[11px]"
            style={{ color: "rgba(26,23,18,0.55)" }}
          >
            Untitled · Notes
          </span>
        </div>
        {/* Note body */}
        <div
          className="px-10 py-8"
          style={{
            fontFamily: "Newsreader, serif",
            fontSize: 22,
            lineHeight: 1.6,
            color: "#1a1712",
          }}
        >
          {rendered.map((line, i) => (
            <p key={i} style={{ margin: 0, marginBottom: 12, minHeight: "1em" }}>
              {line}
              {rendered.findIndex((r, j) => j > i && r.length > 0) === -1 &&
                line.length < (lines[i]?.length ?? 0) && (
                  <span
                    className="inline-block align-middle"
                    style={{
                      width: 2,
                      height: "0.9em",
                      background: "#1a1712",
                      marginLeft: 2,
                      animation: "desktopCursor 0.9s steps(2, end) infinite",
                    }}
                  />
                )}
            </p>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes desktopCursor {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}

/* ----------------------------- UPDATING STATE ---------------------------- */

function UpdatingState({ tick }: { tick: number }) {
  const pct = Math.min(97, 15 + (tick * 3) % 90);
  return (
    <>
      <Wallpaper />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(6px)" }}
      >
        <div
          className="flex flex-col items-center gap-6 rounded-2xl px-14 py-12 text-center"
          style={{
            background: "rgba(20,22,30,0.96)",
            color: "rgba(255,255,255,0.92)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
            minWidth: 520,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Spinner */}
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="3"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="#8db2ff"
              strokeWidth="3"
              strokeDasharray="138"
              strokeDashoffset="60"
              strokeLinecap="round"
              transform={`rotate(${tick * 12} 28 28)`}
            />
          </svg>
          <div className="flex flex-col gap-2">
            <div
              style={{
                fontFamily: "Newsreader, serif",
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              Installing Café OS 26.3
            </div>
            <div
              className="font-mono text-[12px]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              about 7 minutes remaining · do not close your laptop
            </div>
          </div>
          <div
            className="relative mt-2 h-[3px] w-[400px] overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background:
                  "linear-gradient(90deg, #8db2ff 0%, #a0c0ff 100%)",
              }}
            />
          </div>
          <div
            className="font-mono text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            step 4 of 7 · optimizing system preferences
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------- PANIC STATE ------------------------------- */

function PanicState({ rng }: { rng: Rng }) {
  // Randomized each cycle, stable within cycle.
  const isBSOD = useMemo(() => chance(rng, 0.55), [rng]);
  return isBSOD ? <BSODPanic /> : <KernelPanic />;
}

function BSODPanic() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-[8%] text-center"
      style={{
        background: "#0a63c7",
        color: "#ffffff",
        fontFamily: "Newsreader, serif",
      }}
    >
      <div
        className="mb-10"
        style={{ fontSize: 140, lineHeight: 1, fontWeight: 300 }}
      >
        :(
      </div>
      <div
        className="max-w-[720px]"
        style={{ fontSize: 26, lineHeight: 1.4, fontWeight: 300 }}
      >
        Your laptop ran into a problem and needs to restart. We're just
        collecting some information, and then we'll restart for you.
      </div>
      <div
        className="mt-12 font-mono text-[13px]"
        style={{ opacity: 0.82 }}
      >
        89% complete
      </div>
      <div
        className="mt-8 flex items-center gap-6 font-mono text-[11px]"
        style={{ opacity: 0.7 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-14 w-14"
            style={{
              background: "#ffffff",
              padding: 4,
            }}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "repeating-linear-gradient(0deg, #000 0 2px, #fff 2px 4px), repeating-linear-gradient(90deg, #000 0 2px, #fff 2px 4px)",
                backgroundBlendMode: "multiply",
              }}
            />
          </div>
          <div className="text-left">
            <div>For more information, scan the code.</div>
            <div style={{ opacity: 0.6 }}>Or visit café.os/restart</div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-10 left-10 font-mono text-[11px]"
        style={{ opacity: 0.72 }}
      >
        <div>Stop code: CAFÉ_OS_MEMORY_MANAGEMENT</div>
        <div>What failed: atlas.bundle</div>
      </div>
    </div>
  );
}

function KernelPanic() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-[10%]"
      style={{
        background: "#000",
        color: "rgba(255,255,255,0.92)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div
        className="max-w-[780px] text-left text-[13px] leading-[1.7]"
        style={{ letterSpacing: "0.01em" }}
      >
        <div className="mb-2">panic(cpu 6 caller 0xfffff ): kernel trap</div>
        <div className="mb-2">
          debugger called from kernel: weave/atlas.ts · settle() unresolved
        </div>
        <div className="mb-4">bsd: backtrace 0 · 1 · 2 · 3 · 4 · 5</div>
        <div className="my-5 h-px w-full opacity-30" style={{ background: "white" }} />
        <div
          className="mb-3"
          style={{
            fontFamily: "Newsreader, serif",
            fontSize: 22,
            fontStyle: "italic",
            fontWeight: 400,
            opacity: 0.94,
          }}
        >
          You need to restart your computer.
        </div>
        <div className="mb-2 opacity-70">
          Hold down the Power button until it turns off, then press it again.
        </div>
        <div className="mt-6 text-[11px] opacity-55">
          Vous devez redémarrer votre ordinateur · Sie müssen Ihren Computer
          neu starten · コンピュータを再起動する必要があります
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- REBOOTING STATE ---------------------------- */

function RebootingState({ tick }: { tick: number }) {
  // Logo + thin progress bar that creeps from 0 to 100 over the state duration.
  const pct = Math.min(100, (tick % 58) * 1.9);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 bg-black">
      <div
        className="relative flex h-[84px] w-[84px] items-center justify-center rounded-2xl"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, #f4f1ea 0%, #d5cdb4 60%, #6d6553 100%)",
          boxShadow: "0 0 50px rgba(245,236,212,0.18)",
        }}
      >
        <div
          className="absolute inset-[14px] rounded-full"
          style={{
            background: "#0b0b0c",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.6)",
          }}
        />
        <div
          className="relative h-3 w-3 rounded-full"
          style={{ background: "#f4f1ea" }}
        />
      </div>
      <div
        className="relative h-[2px] w-[180px] overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.12)" }}
      >
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width: `${pct}%`,
            background: "rgba(244,241,234,0.85)",
            transition: "width 500ms linear",
          }}
        />
      </div>
    </div>
  );
}

/* --------------------------------- PIECES -------------------------------- */

function Dock({ active }: { active: number }) {
  const icons = [
    { color: "#e9d4a8" },
    { color: "#b8d0f0" },
    { color: "#c8e0c0" },
    { color: "#d0a2bf" },
    { color: "#c5b3e8" },
    { color: "#f0c69c" },
  ];
  return (
    <div
      className="absolute inset-x-0 bottom-5 z-30 mx-auto flex h-[64px] items-center justify-center gap-4 rounded-2xl px-5"
      style={{
        background: "rgba(20,22,30,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        width: "fit-content",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      {icons.map((ic, i) => (
        <div
          key={i}
          className="relative h-10 w-10 rounded-[10px] transition-transform"
          style={{
            background: `linear-gradient(140deg, ${ic.color} 0%, rgba(255,255,255,0.08) 120%)`,
            boxShadow: "0 6px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
            transform: i === active ? "translateY(-4px) scale(1.08)" : "translateY(0)",
          }}
        >
          {i === active && (
            <div
              className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
              style={{ background: "rgba(255,255,255,0.85)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

interface IconProps {
  label: string;
  x: number;
  y: number;
  color: string;
  id?: string;
}

function DesktopIconGrid({ icons }: { icons: IconProps[] }) {
  return (
    <div className="absolute inset-0 z-10 pt-12">
      {icons.map((ic, i) => {
        const left = `${86 - ic.x * 5}%`;
        const top = `${ic.y * 10 + 4}%`;
        return (
          <div
            key={ic.id ?? `${ic.label}-${i}`}
            className="absolute flex w-[74px] flex-col items-center gap-1 transition-all duration-700"
            style={{ left, top }}
          >
            <div
              className="h-[42px] w-[54px] rounded-[6px]"
              style={{
                background:
                  "linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)",
                border: `1px solid ${ic.color}33`,
                boxShadow: `0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 ${ic.color}55`,
              }}
            />
            <div
              className="max-w-full truncate px-1 text-[10px]"
              style={{
                color: "rgba(255,255,255,0.92)",
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              }}
            >
              {ic.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FinderWindow({ tick }: { tick: number }) {
  const shake = Math.sin(tick * 0.8) * 2 + Math.cos(tick * 1.3) * 1;
  return (
    <div
      className="absolute z-20"
      style={{
        left: "28%",
        top: "32%",
        width: 460,
        height: 300,
        background: "rgba(240,236,226,0.96)",
        color: "#1a1712",
        borderRadius: 10,
        boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.25)",
        transform: `translate(${shake}px, ${-shake * 0.6}px)`,
      }}
    >
      <div
        className="flex items-center gap-2 px-4"
        style={{
          height: 34,
          background: "rgba(230,224,208,0.98)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: "#ff5f57" }}
        />
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: "#febc2e" }}
        />
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: "#28c840" }}
        />
        <span
          className="ml-4 font-mono text-[11px]"
          style={{ color: "rgba(26,23,18,0.55)" }}
        >
          drafts
        </span>
      </div>
      <div className="grid grid-cols-4 gap-4 p-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="h-[34px] w-[42px] rounded-[5px]"
              style={{
                background:
                  "linear-gradient(140deg, #c8a96a 0%, #f5ecd4 100%)",
                border: "1px solid rgba(0,0,0,0.15)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
              }}
            />
            <div
              className="truncate text-[9px]"
              style={{ color: "rgba(26,23,18,0.7)", maxWidth: 60 }}
            >
              {desktopFolders[i % desktopFolders.length]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cursor({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="pointer-events-none absolute z-50"
      width="18"
      height="22"
      style={{
        left: `${Math.max(0, Math.min(1200, x))}px`,
        top: `${Math.max(0, Math.min(700, y))}px`,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
      }}
      viewBox="0 0 18 22"
    >
      <path
        d="M1,1 L1,17 L5,13 L8,20 L11,19 L8,12 L14,12 Z"
        fill="white"
        stroke="black"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
