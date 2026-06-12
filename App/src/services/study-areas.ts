const API_BASE_URL = "/api"

export type StudyArea = {
  id: number
  name: string
  studyGoalCount: number
}

type ApiError = {
  error?: string
}

type StudyAreaPayload = {
  name: string
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
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

export function listStudyAreas() {
  return requestJson<StudyArea[]>("/study-areas")
}

export function createStudyArea(payload: StudyAreaPayload) {
  return requestJson<StudyArea>("/study-areas", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function renameStudyArea(id: number, payload: StudyAreaPayload) {
  return requestJson<StudyArea>(`/study-areas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deleteStudyArea(id: number) {
  return requestJson<void>(`/study-areas/${id}`, {
    method: "DELETE",
  })
}
