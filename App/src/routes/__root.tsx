/* eslint-disable react-refresh/only-export-components */
import { Link, Outlet, createRootRoute } from "@tanstack/react-router"

export const route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            Study Pal
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="rounded-full border border-border px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
              activeProps={{
                className: "rounded-full border border-border px-3 py-1.5 text-foreground",
              }}
            >
              Study Areas
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
