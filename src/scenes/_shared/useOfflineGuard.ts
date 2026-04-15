import { useEffect } from "react";

/**
 * In dev, warns if a scene ever tries to hit the network after mount. We
 * want scenes to be fully offline so flaky café wifi can't ruin a shot.
 */
export function useOfflineGuard(sceneName: string) {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const original = window.fetch;
    window.fetch = function patched(...args) {
      const url = typeof args[0] === "string" ? args[0] : (args[0] as Request).url;
      // Allow vite HMR and source maps
      if (url.includes("/@vite") || url.includes("/@fs") || url.includes("/__vite") || url.includes("/src/")) {
        return original.apply(this, args as Parameters<typeof fetch>);
      }
      // eslint-disable-next-line no-console
      console.warn(`[say-hi] offline guard: ${sceneName} attempted fetch("${url}")`);
      return original.apply(this, args as Parameters<typeof fetch>);
    };
    return () => {
      window.fetch = original;
    };
  }, [sceneName]);
}
