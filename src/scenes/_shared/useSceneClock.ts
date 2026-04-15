import { useEffect, useRef, useState } from "react";

export type Speed = "slow" | "normal" | "fast";

const BASE_HEARTBEAT_MS = 1600;
const SPEED_MULTIPLIER: Record<Speed, number> = {
  slow: 1.8,
  normal: 1,
  fast: 0.55,
};

function readSpeed(): Speed {
  if (typeof window === "undefined") return "normal";
  const s = new URLSearchParams(window.location.search).get("speed");
  if (s === "slow" || s === "fast" || s === "normal") return s;
  return "normal";
}

export interface SceneClock {
  tick: number;
  paused: boolean;
  setPaused: (p: boolean) => void;
  togglePaused: () => void;
  heartbeatMs: number;
}

/**
 * A slow, shared "heartbeat" clock. Every scene reads `tick` and re-renders
 * when it advances, which keeps animation tempo consistent across the app
 * and friendly to phone camera shutters.
 */
export function useSceneClock(intervalMs?: number): SceneClock {
  const speed = useRef<Speed>(readSpeed());
  const heartbeatMs = Math.round((intervalMs ?? BASE_HEARTBEAT_MS) * SPEED_MULTIPLIER[speed.current]);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pausedRef.current) setTick((t) => t + 1);
    }, heartbeatMs);
    return () => window.clearInterval(id);
  }, [heartbeatMs]);

  return {
    tick,
    paused,
    setPaused,
    togglePaused: () => setPaused((p) => !p),
    heartbeatMs,
  };
}
