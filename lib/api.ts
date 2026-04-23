/**
 * Capa de comunicación con la API de NutriApp.
 * Base URL → NEXT_PUBLIC_API_URL (definida en .env.local)
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string
  nombre: string
  email: string
}

export interface AuthResponse {
  user: ApiUser
  token: string
}

export interface AssessmentPayload {
  gender: string
  age: string
  height: string
  weight: string
  familyHistory: string
  favc: string
  fcvc: string
  ncp: string
  caec: string
  smoke: string
  ch2o: string
  scc: string
  faf: string
  tue: string
  calc: string
  mtrans: string
}

export interface AssessmentResult {
  id: string
  imc: number
  NObeyesdad: string
  nivelRiesgo: "bajo" | "moderado" | "alto"
  diagnostico: string
  createdAt: string
}

// ── Utilidad interna ──────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data?.message ?? `Error ${res.status}`)
  }
  return data as T
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function apiRegister(
  nombre: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nombre, email, password }),
  })
}

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function apiLogout(token: string): Promise<void> {
  await request("/auth/logout", { method: "POST" }, token).catch(() => {})
}

// ── Consentimiento ────────────────────────────────────────────────────────────

export async function apiPostConsent(token: string): Promise<void> {
  await request("/consent", { method: "POST" }, token)
}

export async function apiGetConsent(token: string): Promise<{ exists: boolean }> {
  return request<{ exists: boolean }>("/consent", {}, token)
}

// ── Evaluación ────────────────────────────────────────────────────────────────

export async function apiPostAssessment(
  token: string,
  payload: AssessmentPayload
): Promise<AssessmentResult> {
  const body = {
    Gender: payload.gender,
    Age: parseFloat(payload.age),
    Height: parseFloat(payload.height),
    Weight: parseFloat(payload.weight),
    family_history_with_overweight: payload.familyHistory,
    FAVC: payload.favc,
    FCVC: parseFloat(payload.fcvc),
    NCP: parseFloat(payload.ncp),
    CAEC: payload.caec,
    SMOKE: payload.smoke,
    CH2O: parseFloat(payload.ch2o),
    SCC: payload.scc,
    FAF: parseFloat(payload.faf),
    TUE: parseFloat(payload.tue),
    CALC: payload.calc,
    MTRANS: payload.mtrans,
  }
  const data = await request<{ assessment: AssessmentResult }>(
    "/assessment",
    { method: "POST", body: JSON.stringify(body) },
    token
  )
  return data.assessment
}

export async function apiGetHistory(
  token: string,
  page = 1,
  limit = 10
): Promise<{ assessments: AssessmentResult[]; total: number }> {
  return request(`/assessment/history?page=${page}&limit=${limit}`, {}, token)
}
