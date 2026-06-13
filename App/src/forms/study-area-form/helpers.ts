export function normalizeStudyAreaName(value: string) {
  return value.trim()
}

export function validateStudyAreaName(value: string) {
  return normalizeStudyAreaName(value) ? undefined : "Study area name is required."
}
