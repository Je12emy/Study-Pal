import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"

import App from "@/App"
import { studyAreasQueryKey } from "@/hooks/use-study-areas"
import { queryClient } from "@/lib/query-client"
import { listStudyAreas } from "@/services/study-areas"

type RouterContext = {
  queryClient: QueryClient
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: studyAreasQueryKey,
      queryFn: listStudyAreas,
    })
  },
  component: App,
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({
  routeTree,
  context: { queryClient },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
