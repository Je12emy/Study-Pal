import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { queryClient } from "@/lib/query-client"
import { AppRouter } from "@/router-provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
