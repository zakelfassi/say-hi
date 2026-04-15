import type { Rng } from "../_shared/rng";
import { range } from "../_shared/rng";

export interface ThinkNode {
  id: number;
  label: string;
  /** Anchor in normalized [-1, 1] coords. */
  ax: number;
  ay: number;
  /** Drift params so each node has its own slow orbit. */
  rx: number;
  ry: number;
  phase: number;
  period: number;
  size: number;
  italic: boolean;
}

export interface ThinkEdge {
  a: number;
  b: number;
  weight: number;
}

export interface ThinkLayout {
  nodes: ThinkNode[];
  edges: ThinkEdge[];
  highlightId: number;
}

/**
 * Layout: Poisson-ish disk over a unit circle via rejection sampling, then
 * a light relaxation pass to nudge overlapping nodes apart. Edges connect
 * each node to its 1–2 nearest neighbors so the graph stays sparse and
 * readable, not a hairball.
 */
export function buildLayout(rng: Rng, labels: readonly string[]): ThinkLayout {
  const count = Math.min(labels.length, 26);
  const nodes: ThinkNode[] = [];

  // Rejection sample points in a unit circle with min spacing.
  const minDist = 0.22;
  let attempts = 0;
  while (nodes.length < count && attempts < 4000) {
    attempts++;
    const x = range(rng, -0.92, 0.92);
    const y = range(rng, -0.78, 0.78);
    if (x * x + y * y > 0.95 * 0.95) continue;
    const ok = nodes.every((n) => Math.hypot(n.ax - x, n.ay - y) >= minDist);
    if (!ok) continue;
    nodes.push({
      id: nodes.length,
      label: labels[nodes.length]!,
      ax: x,
      ay: y,
      rx: range(rng, 0.008, 0.022),
      ry: range(rng, 0.008, 0.022),
      phase: range(rng, 0, Math.PI * 2),
      period: range(rng, 18000, 36000),
      size: range(rng, 2.6, 4.8),
      italic: rng() < 0.35,
    });
  }

  // Edges: each node to its 2 nearest neighbors, de-duplicated.
  const edgeKey = new Set<string>();
  const edges: ThinkEdge[] = [];
  for (const n of nodes) {
    const ranked = nodes
      .filter((m) => m.id !== n.id)
      .map((m) => ({ m, d: Math.hypot(n.ax - m.ax, n.ay - m.ay) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    for (const { m, d } of ranked) {
      if (d > 0.55) continue;
      const key = n.id < m.id ? `${n.id}:${m.id}` : `${m.id}:${n.id}`;
      if (edgeKey.has(key)) continue;
      edgeKey.add(key);
      edges.push({
        a: Math.min(n.id, m.id),
        b: Math.max(n.id, m.id),
        weight: 1 - d / 0.6,
      });
    }
  }

  const highlightId = nodes.length > 0 ? Math.floor(rng() * nodes.length) : 0;

  return { nodes, edges, highlightId };
}

export function nodePosition(n: ThinkNode, timeMs: number) {
  const t = (timeMs + n.phase * 1000) / n.period;
  return {
    x: n.ax + Math.cos(t * Math.PI * 2) * n.rx,
    y: n.ay + Math.sin(t * Math.PI * 2) * n.ry,
  };
}
