/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ChevronRight, Loader2, PencilLine, Plus, RefreshCw, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { studyAreaFormHook, validateStudyAreaName } from "@/forms/study-area-form"
import { useStudyAreas } from "@/hooks/use-study-areas"
import { queryClient } from "@/lib/query-client"
import { studyAreasQueryKey } from "@/hooks/use-study-areas"
import type { StudyArea } from "@/services/study-areas"
import { listStudyAreas } from "@/services/study-areas"

async function invalidateStudyAreas() {
  await queryClient.invalidateQueries({ queryKey: studyAreasQueryKey })
}

export const Route = createFileRoute("/study-areas")({
  loader: async () => {
    await queryClient.ensureQueryData({
      queryKey: studyAreasQueryKey,
      queryFn: listStudyAreas,
    })
  },
  component: StudyAreasPage,
})

type StudyAreaCreateFormProps = {
  onCreate: (name: string) => Promise<boolean>
}

function StudyAreaCreateForm({ onCreate }: StudyAreaCreateFormProps) {
  const form = studyAreaFormHook.useAppForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value, formApi }) => {
      const name = value.name.trim()
      if (!name) {
        return
      }

      const success = await onCreate(name)
      if (success) {
        formApi.reset()
      }
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-4"
    >
      <form.AppForm>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">Create Study Area</h2>
          <p className="text-sm text-muted-foreground">
            Use a broad subject name like <span className="font-medium text-foreground">French</span> or{" "}
            <span className="font-medium text-foreground">React</span>.
          </p>
        </div>

        <form.AppField
          name="name"
          validators={{ onChange: ({ value }) => validateStudyAreaName(value) }}
        >
          {(field) => (
            <field.TextField
              label="Name"
              placeholder="Type a unique study area name"
            />
          )}
        </form.AppField>
      </form.AppForm>

      <Button type="submit" disabled={!form.state.canSubmit || form.state.isSubmitting}>
        {form.state.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Add area
      </Button>
    </form>
  )
}

type StudyAreaEditFormProps = {
  area: StudyArea
  isBusy: boolean
  onRename: (id: number, name: string) => Promise<boolean>
  onCancel: () => void
}

function StudyAreaEditForm({ area, isBusy, onRename, onCancel }: StudyAreaEditFormProps) {
  const form = studyAreaFormHook.useAppForm({
    defaultValues: { name: area.name },
    onSubmit: async ({ value }) => {
      const name = value.name.trim()
      if (!name) {
        return
      }

      const success = await onRename(area.id, name)
      if (success) {
        onCancel()
      }
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <form.AppForm>
        <form.AppField
          name="name"
          validators={{ onChange: ({ value }) => validateStudyAreaName(value) }}
        >
          {(field) => (
            <field.TextField
              label="Study area name"
              srOnlyLabel
              disabled={isBusy || form.state.isSubmitting}
            />
          )}
        </form.AppField>
      </form.AppForm>

      <div className="flex gap-2">
        <Button type="submit" disabled={isBusy || form.state.isSubmitting || !form.state.canSubmit}>
          {form.state.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <PencilLine className="size-4" />
          )}
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isBusy || form.state.isSubmitting}
        >
          <X className="size-4" />
          Cancel
        </Button>
      </div>
    </form>
  )
}

function StudyAreasPage() {
  const {
    studyAreasQuery,
    createStudyArea: createStudyAreaMutation,
    renameStudyArea: renameStudyAreaMutation,
    deleteStudyArea: deleteStudyAreaMutation,
  } = useStudyAreas()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const studyAreas = useMemo(() => studyAreasQuery.data ?? [], [studyAreasQuery.data])
  const totalGoals = useMemo(
    () => studyAreas.reduce((sum, area) => sum + area.studyGoalCount, 0),
    [studyAreas]
  )

  async function handleCreate(name: string) {
    setActionError(null)

    try {
      await createStudyAreaMutation({ name })
      await invalidateStudyAreas()
      return true
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to create study area.")
      return false
    }
  }

  function beginEdit(area: StudyArea) {
    setEditingId(area.id)
    setActionError(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleRename(id: number, name: string) {
    setBusyId(id)
    setActionError(null)
    try {
      await renameStudyAreaMutation({ id, name })
      await invalidateStudyAreas()
      return true
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to rename study area.")
      return false
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
    setActionError(null)
    try {
      await deleteStudyAreaMutation(id)
      await invalidateStudyAreas()
      if (editingId === id) {
        cancelEdit()
      }
      return true
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to delete study area.")
      return false
    } finally {
      setBusyId(null)
    }
  }

  const errorMessage =
    actionError ?? (studyAreasQuery.error instanceof Error ? studyAreasQuery.error.message : null)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Study Areas
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
          <StudyAreaCreateForm onCreate={handleCreate} />

          <section className="rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Areas</h2>
                <p className="text-sm text-muted-foreground">
                  Rename or delete an area without leaving the page.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => void studyAreasQuery.refetch()}>
                <RefreshCw className="size-4" />
                Refresh
              </Button>
            </div>

            {errorMessage ? (
              <div className="border-b border-border bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}

            <div className="divide-y divide-border">
              {studyAreasQuery.isLoading ? (
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
                        <StudyAreaEditForm
                          area={area}
                          isBusy={isBusy}
                          onRename={handleRename}
                          onCancel={cancelEdit}
                        />
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

export default StudyAreasPage
