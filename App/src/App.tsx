import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { ChevronRight, Loader2, PencilLine, Plus, RefreshCw, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"

type StudyArea = {
  id: number
  name: string
  studyGoalCount: number
}

type ApiError = {
  error?: string
}

const API_BASE_URL = "/api"

async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const { headers: initHeaders, ...rest } = init ?? {}
  const headers = new Headers(initHeaders)
  headers.set("Content-Type", "application/json")

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...rest,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiError
    throw new Error(payload.error ?? `Request failed with status ${response.status}.`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

function normalizeName(value: string) {
  return value.trim()
}

export function App() {
  const [studyAreas, setStudyAreas] = useState<StudyArea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [busyId, setBusyId] = useState<number | null>(null)

  const totalGoals = useMemo(
    () => studyAreas.reduce((sum, area) => sum + area.studyGoalCount, 0),
    [studyAreas]
  )

  const loadStudyAreas = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await requestJson<StudyArea[]>("/study-areas")
      setStudyAreas(result)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load study areas.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStudyAreas()
  }, [loadStudyAreas])

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = normalizeName(newName)
    if (!name) {
      setError("Study Area name is required.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const created = await requestJson<StudyArea>("/study-areas", {
        method: "POST",
        body: JSON.stringify({ name }),
      })

      setStudyAreas((current) => [...current, created].sort((left, right) =>
        left.name.localeCompare(right.name)
      ))
      setNewName("")
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create study area.")
    } finally {
      setSaving(false)
    }
  }

  function beginEdit(area: StudyArea) {
    setEditingId(area.id)
    setEditingName(area.name)
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName("")
  }

  async function handleRename(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault()

    const name = normalizeName(editingName)
    if (!name) {
      setError("Study Area name is required.")
      return
    }

    setBusyId(id)
    setError(null)

    try {
      const updated = await requestJson<StudyArea>(`/study-areas/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      })

      setStudyAreas((current) =>
        current
          .map((area) => (area.id === id ? updated : area))
          .sort((left, right) => left.name.localeCompare(right.name))
      )
      cancelEdit()
    } catch (renameError) {
      setError(renameError instanceof Error ? renameError.message : "Failed to rename study area.")
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this Study Area?")
    if (!confirmed) {
      return
    }

    setBusyId(id)
    setError(null)

    try {
      await requestJson<void>(`/study-areas/${id}`, { method: "DELETE" })
      setStudyAreas((current) => current.filter((area) => area.id !== id))
      if (editingId === id) {
        cancelEdit()
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete study area.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Study Pal
            </p>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">Study Areas</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Organize broad subjects, keep the list unique, and attach goals underneath each area.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">
              {studyAreas.length} areas
            </span>
            <span className="rounded-full border border-border px-3 py-1">
              {totalGoals} goals
            </span>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <form
            onSubmit={handleCreate}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-4"
          >
            <div className="space-y-1">
              <h2 className="text-sm font-semibold">Create Study Area</h2>
              <p className="text-sm text-muted-foreground">
                Use a broad subject name like <span className="font-medium text-foreground">French</span> or{" "}
                <span className="font-medium text-foreground">React</span>.
              </p>
            </div>

            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </span>
              <input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Type a unique study area name"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
              />
            </label>

            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add area
            </Button>
          </form>

          <section className="rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Areas</h2>
                <p className="text-sm text-muted-foreground">
                  Rename or delete an area without leaving the page.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => void loadStudyAreas()}>
                <RefreshCw className="size-4" />
                Refresh
              </Button>
            </div>

            {error ? (
              <div className="border-b border-border bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="divide-y divide-border">
              {loading ? (
                <div className="flex min-h-52 items-center justify-center gap-2 px-4 py-10 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading study areas
                </div>
              ) : studyAreas.length === 0 ? (
                <div className="px-4 py-10 text-sm text-muted-foreground">
                  No study areas yet. Create the first one on the left.
                </div>
              ) : (
                studyAreas.map((area) => {
                  const isEditing = editingId === area.id
                  const isBusy = busyId === area.id

                  return (
                    <div key={area.id} className="flex flex-col gap-4 px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-base font-medium">{area.name}</h3>
                            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                              {area.studyGoalCount}
                              <ChevronRight className="size-3" />
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {area.studyGoalCount === 1
                              ? "1 study goal attached"
                              : `${area.studyGoalCount} study goals attached`}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => beginEdit(area)}
                            disabled={isBusy}
                          >
                            <PencilLine className="size-4" />
                            Rename
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleDelete(area.id)}
                            disabled={isBusy}
                          >
                            {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            Delete
                          </Button>
                        </div>
                      </div>

                      {isEditing ? (
                        <form onSubmit={(event) => void handleRename(event, area.id)} className="flex flex-col gap-3 sm:flex-row">
                          <input
                            value={editingName}
                            onChange={(event) => setEditingName(event.target.value)}
                            className="h-11 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
                          />
                          <div className="flex gap-2">
                            <Button type="submit" disabled={isBusy}>
                              {isBusy ? <Loader2 className="size-4 animate-spin" /> : <PencilLine className="size-4" />}
                              Save
                            </Button>
                            <Button type="button" variant="outline" onClick={cancelEdit} disabled={isBusy}>
                              <X className="size-4" />
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : null}
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

export default App
