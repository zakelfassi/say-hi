/**
 * Every vocabulary here is curated: abstract, pleasant, never real. Scenes
 * that need text pull from these banks so that no real email, path, secret,
 * or name can ever leak into a photo.
 */

export const writeOpenings = [
  "The thing about mornings is that they belong to whoever claims them first.",
  "I have been thinking about how much of taste is memory in costume.",
  "If it is not a little embarrassing, it is probably not ambitious enough.",
  "The café is quiet today in a way that feels earned.",
  "There is a particular softness to a tuesday that nobody warned me about.",
  "Someone should write a field guide for the hours between three and five.",
  "Most of the work is noticing which of the good ideas is the only idea.",
  "The best tools disappear in the hand and return when you set them down.",
  "A day is mostly made of small decisions disguised as habits.",
  "I want to make things that feel like a window left open in early summer.",
];

export const thinkNodeLabels = [
  "curiosity",
  "taste",
  "latency",
  "ritual",
  "café",
  "softness",
  "edges",
  "noise",
  "cadence",
  "attention",
  "craft",
  "memory",
  "evening",
  "rooms",
  "green",
  "porcelain",
  "drift",
  "grain",
  "weight",
  "field",
  "hands",
  "breath",
  "tempo",
  "water",
  "paper",
  "signal",
  "margin",
  "early",
  "late",
  "return",
  "quiet",
  "small",
];

export const codeFileTree: readonly { path: string; kind: "dir" | "file" }[] = [
  { path: "app", kind: "dir" },
  { path: "app/atlas", kind: "dir" },
  { path: "app/atlas/index.ts", kind: "file" },
  { path: "app/atlas/petals.ts", kind: "file" },
  { path: "app/atlas/folds.ts", kind: "file" },
  { path: "app/lantern", kind: "dir" },
  { path: "app/lantern/glow.ts", kind: "file" },
  { path: "app/lantern/halo.ts", kind: "file" },
  { path: "app/mercury", kind: "dir" },
  { path: "app/mercury/pulse.ts", kind: "file" },
  { path: "app/mercury/orbit.ts", kind: "file" },
  { path: "lib", kind: "dir" },
  { path: "lib/prism.ts", kind: "file" },
  { path: "lib/tesserae.ts", kind: "file" },
  { path: "lib/weather.ts", kind: "file" },
  { path: "README", kind: "file" },
  { path: "notes", kind: "dir" },
  { path: "notes/draft.md", kind: "file" },
];

export const codeIdentifiers = [
  "atlas",
  "lantern",
  "mercury",
  "petal",
  "fold",
  "halo",
  "prism",
  "tessera",
  "cadence",
  "orbit",
  "pulse",
  "weather",
  "canvas",
  "murmur",
  "ribbon",
  "ledger",
  "drift",
  "lattice",
];

export const codeVerbs = [
  "compose",
  "fold",
  "gather",
  "settle",
  "bloom",
  "resolve",
  "temper",
  "weave",
  "anchor",
  "align",
  "quiet",
  "steep",
];

export const terminalPrefixes = [
  "▸ build",
  "▸ type-check",
  "▸ pack",
  "▸ route",
  "▸ warm",
  "▸ trace",
];

export const agentThoughts = [
  "reading the room first, then the code",
  "this route wants to be two smaller routes",
  "waiting on a file before committing to the shape",
  "leaning toward the quieter fix",
  "checking the shared primitives before touching the scene",
  "the typography is doing the heavy lifting here",
  "let the animation breathe — 0.4Hz feels right",
  "keep the chrome minimal, the content is the chrome",
];

export const agentTools = [
  { name: "Read", arg: "scenes/write/TypingColumn.tsx" },
  { name: "Grep", arg: "\"heartbeat\" in scenes/_shared" },
  { name: "Edit", arg: "palette.ts (+mood: dusk)" },
  { name: "Glob", arg: "scenes/**/*.tsx" },
  { name: "Read", arg: "routes/__root.tsx" },
  { name: "Bash", arg: "pnpm typecheck" },
  { name: "Write", arg: "scenes/think/graphLayout.ts" },
];

export const agentTasks = [
  "tune the clock tempo",
  "thread pause through every scene",
  "tighten the gallery grid",
  "ship the desktop sequencer",
  "pick the font for /write",
  "verify phone-readable type",
  "draft the readme",
  "take the screenshots",
];

export const desktopFolders = [
  "New Folder",
  "New Folder 2",
  "untitled",
  "drafts",
  "café",
  "thoughts.txt",
  "frame 01",
  "frame 02",
  "atlas.psd",
  "invoice",
  "letters",
  "evening",
  "to sort",
  "receipts",
  "songs",
];

export const desktopTypingLines = [
  "if only the afternoon would commit to being afternoon.",
  "list of things to do once the rain stops: nothing.",
  "it is enough to have made one good thing today.",
  "a café is a kind of library for the slightly distracted.",
  "I will not check the time again until the cup is empty.",
  "the wifi is fine. it is me who is buffering.",
];
