import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface Entry {
  n: string;
  slug: string;
  title: string;
  kicker: string;
  body: string;
  plate: ReactNode;
  shortcut: string;
}

const ENTRIES: Entry[] = [
  {
    n: "01",
    slug: "/write",
    title: "Write",
    kicker: "drafting the thing",
    body: "A cream page, a serif, a cursor at work. For the moment just before the essay commits.",
    shortcut: "say-hi / write",
    plate: <WritePlate />,
  },
  {
    n: "02",
    slug: "/think",
    title: "Think",
    kicker: "field of thought",
    body: "A slow constellation of labeled ideas, drifting like an observatory notebook mid-sketch.",
    shortcut: "say-hi / think",
    plate: <ThinkPlate />,
  },
  {
    n: "03",
    slug: "/code",
    title: "Code",
    kicker: "tuesday build",
    body: "A warm IDE in a quiet key. Italic keywords, amber cursor, a terminal humming in the back.",
    shortcut: "say-hi / code",
    plate: <CodePlate />,
  },
  {
    n: "04",
    slug: "/agent",
    title: "Agent",
    kicker: "the agent is cooking",
    body: "A transcript in progress. Tool calls, small thoughts in italic serif, a task list ticking off.",
    shortcut: "say-hi / agent",
    plate: <AgentPlate />,
  },
  {
    n: "05",
    slug: "/desktop",
    title: "Desktop",
    kicker: "possessed, gently",
    body: "A haunted desktop cycling through calm, chaos, updates, a kernel panic, and a slow reboot.",
    shortcut: "say-hi / desktop",
    plate: <DesktopPlate />,
  },
];

export function Gallery() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: "#0a0a0b",
        color: "#f4f1ea",
      }}
    >
      {/* Film-grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,241,234,1) 0.8px, transparent 0.8px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "screen",
        }}
      />

      {/* Masthead */}
      <header className="mx-auto flex max-w-[1180px] flex-col gap-3 px-6 pt-16 md:px-10 md:pt-28">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.38em] text-white/40">
          <span>vol. 01</span>
          <span>five plates</span>
          <span>spring issue</span>
        </div>
        <div className="mt-2 h-px w-full bg-white/10" />
        <h1
          className="mt-8 flex items-baseline gap-6"
          style={{
            fontFamily: "'Instrument Serif', 'Newsreader', serif",
            fontSize: "clamp(5rem, 12vw, 12rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.035em",
            fontWeight: 400,
          }}
        >
          <span>say</span>
          <span className="text-white/30">/</span>
          <span style={{ fontStyle: "italic" }}>hi</span>
        </h1>
        <p
          className="mt-6 max-w-[52ch] font-serif text-[18px] leading-[1.55]"
          style={{
            fontFamily: "'Newsreader', serif",
            color: "rgba(244,241,234,0.78)",
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          Five screen scenes for the moment just before you take the photo.
          Fire one up, press <Kbd>F</Kbd>, line up the shot, and let your
          laptop say something for you — without giving anything away.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-[0.32em] text-white/55">
          <Kbd>F</Kbd>
          <span>fullscreen</span>
          <Rule />
          <Kbd>Space</Kbd>
          <span>freeze the frame</span>
          <Rule />
          <Kbd>Esc</Kbd>
          <span>back</span>
        </div>
      </header>

      {/* Index */}
      <section className="mx-auto mt-16 max-w-[1180px] px-6 pb-24 md:mt-20 md:px-10">
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em] text-white/40">
          <span>the scenes</span>
          <span>bookmarkable · shareable · offline</span>
        </div>
        <div className="h-px w-full bg-white/10" />

        <ul>
          {ENTRIES.map((e) => (
            <li key={e.slug}>
              <Link
                to={e.slug}
                className="group block"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="flex flex-col gap-6 py-10 transition-all duration-500 hover:bg-white/[0.015] md:grid md:grid-cols-[60px_180px_1fr_auto] md:items-center md:gap-10">
                  <div
                    className="flex items-center justify-between md:block"
                  >
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40 transition-colors group-hover:text-[#e9d4a8]"
                    >
                      {e.n}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 md:hidden">
                      {e.kicker}
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm ring-1 ring-white/10 transition-all duration-500 group-hover:ring-white/25 md:w-[180px]">
                    {e.plate}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:block">
                      {e.kicker}
                    </div>
                    <h2
                      className="transition-all duration-500 group-hover:translate-x-1"
                      style={{
                        fontFamily: "'Instrument Serif', 'Newsreader', serif",
                        fontSize: "clamp(2.4rem, 4.2vw, 4rem)",
                        lineHeight: 0.95,
                        letterSpacing: "-0.02em",
                        fontWeight: 400,
                      }}
                    >
                      {e.title}
                    </h2>
                    <p
                      className="max-w-[52ch] text-[15px] leading-[1.55]"
                      style={{
                        fontFamily: "'Newsreader', serif",
                        color: "rgba(244,241,234,0.68)",
                        fontStyle: "italic",
                        fontWeight: 300,
                      }}
                    >
                      {e.body}
                    </p>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end md:gap-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                      {e.shortcut}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 transition-all duration-500 group-hover:text-[#e9d4a8]">
                      <span>open</span>
                      <span className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-px w-full bg-white/10" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <footer className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "rgba(244,241,234,0.4)" }}
            >
              the idea
            </div>
            <p
              className="max-w-[48ch] text-[15px] leading-[1.6]"
              style={{
                fontFamily: "'Newsreader', serif",
                color: "rgba(244,241,234,0.68)",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              Your real screen is full of work, secrets, and half-finished
              drafts. You don't want to curate it every time you put the
              laptop in a photo. So borrow one of these instead — a scene
              that looks like you're doing something interesting, without
              ever revealing what.
            </p>
          </div>
          <div className="md:text-right">
            <div
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "rgba(244,241,234,0.4)" }}
            >
              colophon
            </div>
            <p
              className="ml-auto max-w-[42ch] text-[13px] leading-[1.6] md:ml-auto"
              style={{ color: "rgba(244,241,234,0.55)" }}
            >
              Set in Instrument Serif, Newsreader, and JetBrains Mono.
              Offline after first paint. Press <Kbd>Space</Kbd> inside any
              scene to freeze the frame you want.
            </p>
          </div>
        </footer>

        <div className="mt-16 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em] text-white/30">
          <span>say-hi · vol 01 · plate index</span>
          <span>take the photo</span>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ Plates ------------------------------ */

function WritePlate() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #faf4e6 0%, #eadcc1 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(40,28,12,1) 0.8px, transparent 0.8px)",
          backgroundSize: "3px 3px",
        }}
      />
      <div
        className="text-center"
        style={{
          fontFamily: "'Newsreader', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 15,
          lineHeight: 1.2,
          color: "#1f1a14",
          maxWidth: "78%",
        }}
      >
        The thing about
        <br />
        mornings
        <span
          className="ml-[2px] inline-block align-middle"
          style={{
            width: 2,
            height: "0.9em",
            background: "#b54a2b",
            transform: "translateY(2px)",
          }}
        />
      </div>
      <div
        className="absolute left-2 top-2 font-mono text-[7px] uppercase tracking-[0.3em]"
        style={{ color: "rgba(31,26,20,0.4)" }}
      >
        § 03
      </div>
      <div
        className="absolute bottom-2 right-2 font-mono text-[7px]"
        style={{ color: "#b54a2b" }}
      >
        ●
      </div>
    </div>
  );
}

function ThinkPlate() {
  const nodes = [
    { x: 20, y: 30, label: "taste" },
    { x: 60, y: 22, label: "drift" },
    { x: 45, y: 48, label: "cadence" },
    { x: 78, y: 50, label: "grain" },
    { x: 32, y: 66, label: "ritual" },
    { x: 70, y: 78, label: "paper" },
    { x: 15, y: 82, label: "quiet" },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
    [4, 6],
  ];
  return (
    <div className="absolute inset-0" style={{ background: "#050505" }}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {edges.map(([a, b], i) => {
          const na = nodes[a]!;
          const nb = nodes[b]!;
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="rgba(244,241,234,0.2)"
              strokeWidth="0.4"
            />
          );
        })}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="1.1" fill="#f4f1ea" />
            <text
              x={n.x + 2.4}
              y={n.y + 1}
              fontFamily="Newsreader, serif"
              fontSize="4.2"
              fontStyle={i % 2 === 0 ? "italic" : "normal"}
              fill="rgba(244,241,234,0.88)"
            >
              {n.label}
            </text>
          </g>
        ))}
        <g stroke="rgba(244,241,234,0.35)" strokeWidth="0.35">
          <line x1="48" y1="50" x2="52" y2="50" />
          <line x1="50" y1="48" x2="50" y2="52" />
        </g>
      </svg>
      <div
        className="absolute left-2 top-2 font-mono text-[7px] uppercase tracking-[0.3em]"
        style={{ color: "rgba(244,241,234,0.4)" }}
      >
        plate vii
      </div>
    </div>
  );
}

function CodePlate() {
  return (
    <div
      className="absolute inset-0 p-3 font-mono text-[7.5px] leading-[1.7]"
      style={{
        background: "#0b0b0c",
        color: "#f4f1ea",
      }}
    >
      <div className="mb-2 flex items-center gap-1 text-[6px] uppercase tracking-[0.2em]" style={{ color: "#8a857a" }}>
        <span className="inline-block h-1 w-1 rounded-full" style={{ background: "#c8a96a" }} />
        atlas / weave / atlas.ts
      </div>
      <div>
        <span style={{ color: "#57514a", fontStyle: "italic" }}>// atlas · composer</span>
      </div>
      <div>
        <span style={{ color: "#c8a96a", fontStyle: "italic" }}>import</span>
        <span>{" { compose } "}</span>
        <span style={{ color: "#c8a96a", fontStyle: "italic" }}>from</span>
        <span style={{ color: "#9cb184" }}>{" '~/lib'"}</span>
      </div>
      <div>
        <span style={{ color: "#c8a96a", fontStyle: "italic" }}>export async function</span>
        <span style={{ color: "#e9d4a8" }}>{" weave"}</span>
        <span style={{ color: "#6a6258" }}>{"() {"}</span>
      </div>
      <div className="pl-3">
        <span style={{ color: "#c8a96a", fontStyle: "italic" }}>const</span>
        <span>{" rested = "}</span>
        <span style={{ color: "#c8a96a", fontStyle: "italic" }}>await</span>
        <span style={{ color: "#e9d4a8" }}>{" settle"}</span>
        <span style={{ color: "#6a6258" }}>()</span>
        <span
          className="ml-[1px] inline-block align-middle"
          style={{ width: 3, height: 8, background: "#c8a96a", transform: "translateY(1px)" }}
        />
      </div>
      <div>
        <span style={{ color: "#6a6258" }}>{"}"}</span>
      </div>
    </div>
  );
}

function AgentPlate() {
  return (
    <div
      className="absolute inset-0 p-3 font-mono text-[7.5px] leading-[1.8]"
      style={{ background: "#000", color: "#f2f2f2" }}
    >
      <div className="mb-2 text-[6px] uppercase tracking-[0.22em]" style={{ color: "#6e6e73" }}>
        ● claude-code · session 5a2f
      </div>
      <div>
        <span style={{ color: "#c8a96a" }}>▸</span>
        <span> tighten /write italic</span>
      </div>
      <div
        style={{
          fontFamily: "'Newsreader', serif",
          fontStyle: "italic",
          fontSize: 9,
          color: "#6e6e73",
          lineHeight: 1.3,
        }}
      >
        <span style={{ color: "#c8a96a" }}>✻</span> leaning toward
        <br />
        the quieter fix
      </div>
      <div className="mt-1">
        ⏺ <span>Edit</span>
        <span style={{ color: "#6e6e73" }}>(palette)</span>
      </div>
      <div className="ml-2" style={{ color: "#6e6e73" }}>
        ⎿ +2 −1
      </div>
      <div className="mt-1">
        <span style={{ color: "#c8a96a" }}>●</span>
        <span> commit</span>
      </div>
    </div>
  );
}

function DesktopPlate() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, #5c3b6e 0%, #2a2140 35%, #0f1329 75%, #050812 100%)",
      }}
    >
      {/* Moon */}
      <div
        className="absolute"
        style={{
          right: "18%",
          top: "18%",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 38%, #f5ecd4 0%, #c9b988 80%)",
          boxShadow: "0 0 18px rgba(245,236,212,0.3)",
        }}
      />
      {/* Peaks */}
      <svg viewBox="0 0 100 40" className="absolute bottom-0 left-0 h-[38%] w-full" preserveAspectRatio="none">
        <path d="M0,22 L18,14 L32,18 L48,10 L62,16 L78,8 L100,18 L100,40 L0,40 Z" fill="#1a1f36" />
        <path d="M0,28 L24,22 L40,26 L58,18 L74,24 L100,20 L100,40 L0,40 Z" fill="#0a0c18" />
      </svg>
      {/* Dock */}
      <div
        className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-[2px] rounded-sm px-1 py-[2px]"
        style={{
          background: "rgba(20,22,30,0.65)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {["#e9d4a8", "#b8d0f0", "#c8e0c0", "#d0a2bf", "#c5b3e8", "#f0c69c"].map((c, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-[1px]"
            style={{ background: c }}
          />
        ))}
      </div>
      <div
        className="absolute left-2 top-2 font-mono text-[6px] uppercase tracking-[0.25em]"
        style={{ color: "rgba(244,241,234,0.55)" }}
      >
        café os
      </div>
    </div>
  );
}

/* ------------------------------ helpers ------------------------------ */

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className="inline-flex items-center rounded-[3px] px-[6px] py-[2px] font-mono text-[9px]"
      style={{
        background: "rgba(244,241,234,0.08)",
        border: "1px solid rgba(244,241,234,0.15)",
        color: "rgba(244,241,234,0.88)",
      }}
    >
      {children}
    </kbd>
  );
}

function Rule() {
  return <span className="inline-block h-px w-6 bg-white/20" />;
}
