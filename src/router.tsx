import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { Gallery } from "./routes/gallery";
import { WriteScene } from "./scenes/write/WriteScene";
import { ThinkScene } from "./scenes/think/ThinkScene";
import { CodeScene } from "./scenes/code/CodeScene";
import { AgentScene } from "./scenes/agent/AgentScene";
import { DesktopScene } from "./scenes/desktop/DesktopScene";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Gallery,
});

const writeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/write",
  component: WriteScene,
});

const thinkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/think",
  component: ThinkScene,
});

const codeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/code",
  component: CodeScene,
});

const agentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agent",
  component: AgentScene,
});

const desktopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/desktop",
  component: DesktopScene,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  writeRoute,
  thinkRoute,
  codeRoute,
  agentRoute,
  desktopRoute,
]);

// BASE_URL is "/" in dev and "/say-hi/" on GitHub Pages. TanStack Router
// wants the basepath without trailing slash ("" in dev, "/say-hi" deployed).
const basepath = import.meta.env.BASE_URL.replace(/\/$/, "");

export const router = createRouter({
  routeTree,
  basepath: basepath || undefined,
});
