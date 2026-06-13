import { up } from "up-fetch"

const API_BASE_URL = "/api"

export const api = up(fetch, () => ({
  baseUrl: API_BASE_URL,
  retry: { attempts: 0 },
}))
