export type Mood = "focus" | "flow" | "shipping" | "night" | "paper";

export interface Palette {
  bg: string;
  fg: string;
  dim: string;
  accent: string;
  accentSoft: string;
  rule: string;
}

const palettes: Record<Mood, Palette> = {
  focus: {
    bg: "#0b0b0c",
    fg: "#f4f1ea",
    dim: "#8a857a",
    accent: "#c8a96a",
    accentSoft: "#3a2f1f",
    rule: "#1b1b1e",
  },
  flow: {
    bg: "#080b12",
    fg: "#e9f0ff",
    dim: "#7a89a8",
    accent: "#8db2ff",
    accentSoft: "#1a2440",
    rule: "#121826",
  },
  shipping: {
    bg: "#050706",
    fg: "#d9fbe3",
    dim: "#4d6b57",
    accent: "#4ade80",
    accentSoft: "#0a2014",
    rule: "#0d1a14",
  },
  night: {
    bg: "#000000",
    fg: "#f2f2f2",
    dim: "#6e6e73",
    accent: "#d4d4d8",
    accentSoft: "#1c1c1f",
    rule: "#161618",
  },
  paper: {
    bg: "#f5f1e8",
    fg: "#1f1a14",
    dim: "#8a7f6a",
    accent: "#b54a2b",
    accentSoft: "#e6dcc6",
    rule: "#d9cfb8",
  },
};

export function getMood(): Mood {
  if (typeof window === "undefined") return "focus";
  const m = new URLSearchParams(window.location.search).get("mood");
  if (m && m in palettes) return m as Mood;
  return "focus";
}

export function getPalette(mood: Mood = getMood()): Palette {
  return palettes[mood];
}

export function paletteVars(p: Palette): React.CSSProperties {
  return {
    ["--bg" as string]: p.bg,
    ["--fg" as string]: p.fg,
    ["--dim" as string]: p.dim,
    ["--accent" as string]: p.accent,
    ["--accent-soft" as string]: p.accentSoft,
    ["--rule" as string]: p.rule,
  } as React.CSSProperties;
}
