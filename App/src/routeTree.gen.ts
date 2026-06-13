import { route as rootRoute } from "@/routes/__root"
import { route as indexRoute } from "@/routes/index"
import { route as studyAreasRoute } from "@/routes/study-areas"

export const routeTree = rootRoute.addChildren([indexRoute, studyAreasRoute])
