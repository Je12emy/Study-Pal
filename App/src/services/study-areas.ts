import { isResponseError, up } from "up-fetch"
import { z } from "zod"

const API_BASE_URL = "/api"

const studyAreaSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  studyGoalCount: z.number().int().nonnegative(),
})

const studyAreasSchema = z.array(studyAreaSchema)

const studyAreaPayloadSchema = z.object({
  name: z.string().trim().min(1, "Study Area name is required."),
})

const apiErrorSchema = z.object({
  error: z.string().min(1),
})

const api = up(fetch, () => ({
  baseUrl: API_BASE_URL,
  retry: { attempts: 0 },
}))

export type StudyArea = z.infer<typeof studyAreaSchema>
export type StudyAreaPayload = z.input<typeof studyAreaPayloadSchema>

function toErrorMessage(error: unknown, fallbackMessage: string) {
  if (isResponseError(error)) {
    const parsedError = apiErrorSchema.safeParse(error.data)
    if (parsedError.success) {
      return parsedError.data.error
    }
  }

  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? fallbackMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

function rethrowAsError(error: unknown, fallbackMessage: string): never {
  throw new Error(toErrorMessage(error, fallbackMessage), {
    cause: error instanceof Error ? error : undefined,
  })
}

function normalizePayload(payload: StudyAreaPayload) {
  return studyAreaPayloadSchema.parse(payload)
}

export async function listStudyAreas(): Promise<StudyArea[]> {
  try {
    return await api("/study-areas", {
      schema: studyAreasSchema,
    })
  } catch (error) {
    rethrowAsError(error, "Failed to load study areas.")
  }
}

export async function createStudyArea(payload: StudyAreaPayload): Promise<StudyArea> {
  try {
    return await api("/study-areas", {
      method: "POST",
      body: normalizePayload(payload),
      schema: studyAreaSchema,
    })
  } catch (error) {
    rethrowAsError(error, "Failed to create study area.")
  }
}

export async function renameStudyArea(
  id: number,
  payload: StudyAreaPayload
): Promise<StudyArea> {
  try {
    return await api(`/study-areas/${id}`, {
      method: "PUT",
      body: normalizePayload(payload),
      schema: studyAreaSchema,
    })
  } catch (error) {
    rethrowAsError(error, "Failed to rename study area.")
  }
}

export async function deleteStudyArea(id: number): Promise<void> {
  try {
    await api(`/study-areas/${id}`, {
      method: "DELETE",
      parseResponse: async () => undefined,
    })
  } catch (error) {
    rethrowAsError(error, "Failed to delete study area.")
  }
}
