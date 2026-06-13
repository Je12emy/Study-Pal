import { createRoute } from "@tanstack/react-router"

import { route as rootRoute } from "@/routes/__root"

export const route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => null,
})
