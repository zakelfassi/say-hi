import { useEffect, useMemo, useState } from "react";
import { SceneFrame } from "../_shared/SceneFrame";
import { mulberry32, sessionSeed } from "../_shared/rng";
import { codeFileTree, terminalPrefixes } from "../_shared/wordbank";
import { tokenize, TOKEN_STYLE } from "./syntaxer";

const PROGRAM: readonly string[] = [
  "// atlas · composer for petal arrangements",
  "import { compose, fold } from '~/lib/prism'",
  "import { cadence } from '~/lib/tempo'",
  "",
  "type Petal = { id: string; weight: number }",
  "",
  "export async function weave(petals: Petal[]) {",
  "  const rested = await settle(petals, 0.4)",
  "  return rested.map((p) => fold(p, cadence('slow')))",
  "}",
  "",
  "async function settle(xs: Petal[], k: number) {",
  "  const quiet = xs.filter((x) => x.weight > k)",
  "  return compose(quiet, { anchor: 'center' })",
  "}",
  "",
  "// tuesday · field trial",
  "const atlas = await weave([",
  "  { id: 'halo', weight: 0.62 },",
  "  { id: 'drift', weight: 0.41 },",
  "  { id: 'grain', weight: 0.77 },",
  "])",
];

const TERMINAL_LINES: readonly string[] = [
  "▸ build · vite v6.4.2 · 1751ms",
  "▸ route / compiled",
  "▸ route /write compiled",
  "▸ route /think compiled",
  "▸ type-check · 0 errors",
  "▸ pack · atlas.bundle · 38.4kb",
  "▸ warm · prism cache ok",
  "▸ trace · weave(petals[3]) · 0.8ms",
  "▸ route /code compiled",
  "▸ settle · quiet=2 · ok",
  "▸ tuesday · field trial · ready",
];

export function CodeScene() {
  const seed = useMemo(() => sessionSeed("code"), []);
  const _rng = useMemo(() => mulberry32(seed), [seed]);
  // prefix/verb variety not used in v1 but seed it so /code looks different per session
  void _rng;
  void terminalPrefixes;

  const [revealedLines, setRevealedLines] = useState(3);
  const [terminalCount, setTerminalCount] = useState(1);
  const [cursorOn, setCursorOn] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setRevealedLines((n) => (n >= PROGRAM.length ? 3 : n + 1));
      setTerminalCount((n) => (n >= TERMINAL_LINES.length ? 1 : n + 1));
    }, 1400);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const id = window.setInterval(() => setCursorOn((c) => !c), 560);
    return () => window.clearInterval(id);
  }, []);

  const visible = PROGRAM.slice(0, revealedLines);
  const cursorLineIdx = Math.min(revealedLines - 1, PROGRAM.length - 1);

  return (
    <SceneFrame
      name="code"
      mood="focus"
      paused={paused}
      togglePause={() => setPaused((p) => !p)}
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: "220px 1fr 62px",
          gridTemplateRows: "40px 1fr 200px",
        }}
      >
        {/* Top bar: breadcrumb */}
        <div
          className="col-span-3 flex items-center justify-between border-b px-5 font-mono text-[11px]"
          style={{
            borderColor: "var(--rule)",
            color: "var(--dim)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span style={{ color: "var(--fg)" }}>atlas</span>
            <span>/</span>
            <span>weave</span>
            <span>/</span>
            <span style={{ color: "var(--fg)" }}>atlas.ts</span>
            <span className="ml-4" style={{ color: "var(--accent)" }}>
              · modified
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span>TypeScript</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span style={{ color: "var(--accent)" }}>tuesday build</span>
          </div>
        </div>

        {/* File tree sidebar */}
        <aside
          className="border-r px-4 py-6 font-mono text-[11px]"
          style={{
            borderColor: "var(--rule)",
            color: "var(--dim)",
          }}
        >
          <div
            className="mb-4 text-[9px] uppercase tracking-[0.28em]"
            style={{ color: "var(--dim)" }}
          >
            workspace
          </div>
          <ul className="flex flex-col gap-[6px] leading-[1.4]">
            {codeFileTree.map((entry, i) => {
              const depth = entry.path.split("/").length - 1;
              const name = entry.path.split("/").pop();
              const isOpen = entry.kind === "dir";
              const isCurrent = entry.path === "app/atlas/index.ts";
              return (
                <li
                  key={i}
                  className="flex items-center gap-2"
                  style={{
                    paddingLeft: depth * 12,
                    color: isCurrent ? "var(--fg)" : "var(--dim)",
                  }}
                >
                  <span style={{ width: 10, opacity: 0.5 }}>
                    {isOpen ? "▾" : entry.kind === "file" ? "·" : ""}
                  </span>
                  <span style={{ fontStyle: isOpen ? "italic" : "normal" }}>
                    {name}
                  </span>
                  {isCurrent && (
                    <span
                      className="ml-1 inline-block h-1 w-1 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main editor */}
        <main className="relative overflow-hidden py-8 pl-8 pr-4">
          <pre
            className="font-mono text-[15px] leading-[1.8]"
            style={{ color: "var(--fg)" }}
          >
            {visible.map((line, idx) => {
              const tokens = tokenize(line);
              const isCursor = idx === cursorLineIdx;
              return (
                <div key={idx} className="flex items-start">
                  <span
                    className="mr-6 select-none text-right"
                    style={{ color: "var(--dim)", width: 24 }}
                  >
                    {(idx + 1).toString().padStart(2, " ")}
                  </span>
                  <span className="whitespace-pre">
                    {tokens.map((t, ti) => (
                      <span key={ti} style={TOKEN_STYLE[t.kind]}>
                        {t.text}
                      </span>
                    ))}
                    {isCursor && (
                      <span
                        className="ml-[1px] inline-block align-middle"
                        style={{
                          width: 8,
                          height: 16,
                          background: "var(--accent)",
                          opacity: cursorOn ? 1 : 0.1,
                        }}
                      />
                    )}
                  </span>
                </div>
              );
            })}
          </pre>
        </main>

        {/* Minimap */}
        <aside
          className="relative overflow-hidden py-8"
          style={{ background: "transparent" }}
        >
          <div className="flex flex-col gap-[3px] px-3">
            {PROGRAM.map((line, i) => {
              const filled = i < revealedLines;
              const w = Math.min(40, Math.max(8, line.trim().length * 0.9));
              return (
                <div
                  key={i}
                  style={{
                    height: 4,
                    width: w,
                    background: filled
                      ? i === cursorLineIdx
                        ? "var(--accent)"
                        : "rgba(244,241,234,0.6)"
                      : "rgba(244,241,234,0.12)",
                  }}
                />
              );
            })}
          </div>
        </aside>

        {/* Terminal */}
        <section
          className="col-span-3 border-t px-6 py-4 font-mono text-[12px]"
          style={{
            borderColor: "var(--rule)",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div
            className="mb-2 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em]"
            style={{ color: "var(--dim)" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span>terminal · atlas</span>
            <span style={{ color: "var(--rule)" }}>│</span>
            <span>pnpm dev</span>
          </div>
          <div className="leading-[1.55]" style={{ color: "var(--fg)" }}>
            {TERMINAL_LINES.slice(0, terminalCount).map((l, i) => (
              <div key={i} style={{ opacity: i === terminalCount - 1 ? 1 : 0.55 }}>
                <span style={{ color: "var(--accent)" }}>{l.slice(0, 2)}</span>
                <span>{l.slice(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SceneFrame>
  );
}
