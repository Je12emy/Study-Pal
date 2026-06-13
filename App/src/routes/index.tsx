import { createRoute } from "@tanstack/react-router"

import App from "@/App"
import { route as rootRoute } from "@/routes/__root"
import { studyAreasQueryKey } from "@/hooks/use-study-areas"
import { listStudyAreas } from "@/services/study-areas"

export const route = createRoute({
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
