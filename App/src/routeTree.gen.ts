import { route as rootRoute } from "@/routes/__root"
import { route as indexRoute } from "@/routes/index"

export const routeTree = rootRoute.addChildren([indexRoute])
