import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"

type RouterContext = {
  queryClient: QueryClient
}

export const route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
})
