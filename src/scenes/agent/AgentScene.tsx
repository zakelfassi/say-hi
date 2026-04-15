import { useEffect, useMemo, useState } from "react";
import { SceneFrame } from "../_shared/SceneFrame";
import { mulberry32, pickN, sessionSeed } from "../_shared/rng";
import { agentTasks, agentThoughts, agentTools } from "../_shared/wordbank";

type Entry =
  | { kind: "prompt"; text: string }
  | { kind: "thought"; text: string }
  | { kind: "tool"; name: string; arg: string; result: string }
  | { kind: "commit"; text: string };

const PROMPT = "tighten the /write scene until the italic reads at 1m";

const TOOL_RESULTS = [
  "read 84 lines · 1.2kb",
  "2 matches",
  "+2 lines · −1 lines",
  "compiled · 0 errors",
  "118 files",
  "0.6ms",
  "wrote 62 lines",
];

export function AgentScene() {
  const seed = useMemo(() => sessionSeed("agent"), []);
  const rng = useMemo(() => mulberry32(seed), [seed]);

  const transcript = useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    out.push({ kind: "prompt", text: PROMPT });
    const thoughts = pickN(rng, agentThoughts, 5);
    const tools = pickN(rng, agentTools, 5);
    const results = pickN(rng, TOOL_RESULTS, 5);
    for (let i = 0; i < 5; i++) {
      out.push({ kind: "thought", text: thoughts[i]! });
      out.push({
        kind: "tool",
        name: tools[i]!.name,
        arg: tools[i]!.arg,
        result: results[i]!,
      });
    }
    out.push({
      kind: "commit",
      text: "lift to 4.2vw · tighten tracking · hold 3.8s",
    });
    return out;
  }, [rng]);

  const tasks = useMemo(
    () => pickN(rng, agentTasks, 6),
    [rng],
  );

  const [revealed, setRevealed] = useState(1);
  const [ticked, setTicked] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0.4);
  const [ctxK, setCtxK] = useState(12.8);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setRevealed((n) => (n >= transcript.length ? 1 : n + 1));
      setTicked((n) => (n >= tasks.length ? 0 : Math.min(n + 1, tasks.length)));
      setElapsed((e) => +(e + 0.3 + Math.random() * 0.4).toFixed(1));
      setCtxK((k) => +(k + 0.2 + Math.random() * 0.5).toFixed(1));
    }, 1400);
    return () => window.clearInterval(id);
  }, [paused, transcript.length, tasks.length]);

  return (
    <SceneFrame
      name="agent"
      mood="night"
      paused={paused}
      togglePause={() => setPaused((p) => !p)}
    >
      <div className="relative grid h-full w-full grid-cols-[1fr_280px]">
        {/* Main transcript column */}
        <main className="flex flex-col overflow-hidden px-[10%] py-[7%]">
          {/* Header */}
          <div
            className="mb-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: "var(--dim)" }}
          >
            <div className="flex items-center gap-4">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span style={{ color: "var(--fg)" }}>claude-code</span>
              <span>session 5a2f</span>
              <span>opus 4.6 · 1m</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{elapsed.toFixed(1)}s</span>
              <span>{ctxK.toFixed(1)}k ctx</span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "var(--accent)",
                    animation: "agentPulse 2.2s ease-in-out infinite",
                  }}
                />
                <span>running</span>
              </span>
            </div>
          </div>

          <div
            className="mb-6 h-px"
            style={{ background: "var(--rule)" }}
          />

          {/* Transcript */}
          <div className="flex flex-1 flex-col gap-5 font-mono text-[13px] leading-[1.7]">
            {transcript.slice(0, revealed).map((e, i) => {
              if (e.kind === "prompt") {
                return (
                  <div key={i} className="flex gap-3">
                    <span style={{ color: "var(--accent)" }}>▸</span>
                    <span style={{ color: "var(--fg)" }}>{e.text}</span>
                  </div>
                );
              }
              if (e.kind === "thought") {
                return (
                  <div
                    key={i}
                    className="flex gap-3"
                    style={{
                      fontFamily: "Newsreader, serif",
                      fontStyle: "italic",
                      fontSize: 16,
                      color: "var(--dim)",
                    }}
                  >
                    <span style={{ color: "var(--accent)" }}>✻</span>
                    <span>{e.text}</span>
                  </div>
                );
              }
              if (e.kind === "tool") {
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-3">
                      <span style={{ color: "var(--fg)" }}>⏺</span>
                      <span style={{ color: "var(--fg)" }}>
                        {e.name}
                        <span style={{ color: "var(--dim)" }}>({e.arg})</span>
                      </span>
                    </div>
                    <div
                      className="ml-7 flex items-center gap-2"
                      style={{ color: "var(--dim)" }}
                    >
                      <span>⎿</span>
                      <span>{e.result}</span>
                    </div>
                  </div>
                );
              }
              // commit
              return (
                <div key={i} className="flex gap-3">
                  <span style={{ color: "var(--accent)" }}>●</span>
                  <span style={{ color: "var(--fg)" }}>{e.text}</span>
                </div>
              );
            })}
            {/* Blinking caret at tail */}
            <div className="mt-1 h-[14px]">
              <span
                className="inline-block"
                style={{
                  width: 8,
                  height: 14,
                  background: "var(--accent)",
                  animation: "agentCursor 1s steps(2, end) infinite",
                }}
              />
            </div>
          </div>
        </main>

        {/* Task rail */}
        <aside
          className="flex flex-col border-l pb-[7%] pl-8 pr-10 pt-20"
          style={{ borderColor: "var(--rule)" }}
        >
          <div
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--dim)" }}
          >
            tasks
          </div>
          <ul className="flex flex-col gap-4">
            {tasks.map((t, i) => {
              const done = i < ticked;
              const active = i === ticked;
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 font-mono text-[12px] leading-[1.55]"
                  style={{
                    color: done ? "var(--dim)" : active ? "var(--fg)" : "var(--dim)",
                    textDecorationLine: done ? "line-through" : "none",
                    textDecorationColor: "var(--rule)",
                    textDecorationStyle: "solid",
                  }}
                >
                  <span
                    className="mt-[3px] inline-flex h-3 w-3 items-center justify-center rounded-sm"
                    style={{
                      border: `1px solid ${done ? "var(--accent)" : "var(--rule)"}`,
                      background: done ? "var(--accent)" : "transparent",
                    }}
                  >
                    {done && (
                      <span
                        style={{
                          color: "var(--bg)",
                          fontSize: 9,
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </span>
                  <span>{t}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto pt-6">
            <div
              className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em]"
              style={{ color: "var(--dim)" }}
            >
              progress
            </div>
            <div
              className="h-px w-full"
              style={{
                background: "var(--rule)",
                position: "relative",
              }}
            >
              <span
                className="absolute left-0 top-0 block h-px transition-all duration-700"
                style={{
                  width: `${Math.round((ticked / tasks.length) * 100)}%`,
                  background: "var(--accent)",
                }}
              />
            </div>
            <div
              className="mt-2 flex justify-between font-mono text-[10px]"
              style={{ color: "var(--dim)" }}
            >
              <span>{ticked}/{tasks.length}</span>
              <span>{Math.round((ticked / tasks.length) * 100)}%</span>
            </div>
          </div>
        </aside>

        <style>{`
          @keyframes agentCursor {
            0%, 50% { opacity: 1; }
            50.01%, 100% { opacity: 0; }
          }
          @keyframes agentPulse {
            0%, 100% { opacity: 0.35; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.35); }
          }
        `}</style>
      </div>
    </SceneFrame>
  );
}
