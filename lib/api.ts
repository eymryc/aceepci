/**
 * Client API ACEEPCI
 * Base URL configurable via NEXT_PUBLIC_API_URL (défaut: https://api.aceepci.org)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.aceepci.org";
const API_PREFIX = "/api/v1";

export const apiUrl = (path: string) => `${API_BASE}${API_PREFIX}${path}`;

export interface ApiUser {
  id: number;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  username: string;
  phone: string | null;
  email_verified_at: string | null;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: ApiUser;
  };
}

export interface LogoutResponse {
  status: string;
  message: string;
  data: string | null;
}

export interface RefreshResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user?: ApiUser;
  } | string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: ApiError = {
      message: (data as { message?: string }).message || "Une erreur est survenue",
      errors: (data as { errors?: Record<string, string[]> }).errors,
    };
    throw err;
  }
  return data as T;
}

export async function login(loginId: string, password: string): Promise<LoginResponse> {
  const res = await fetch(apiUrl("/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ login: loginId, password }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function logout(token: string): Promise<LogoutResponse> {
  const res = await fetch(apiUrl("/logout"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<LogoutResponse>(res);
}

export async function refreshToken(token: string): Promise<RefreshResponse> {
  const res = await fetch(apiUrl("/refresh"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<RefreshResponse>(res);
}

// ─── Member Types ─────────────────────────────────────────────────────────

export interface MemberType {
  id: number;
  name: string;
}

// ─── Generic CRUD helpers for settings resources ───────────────────────────

type ListResponse<T> = {
  data: T[];
  meta?: { total?: number; last_page?: number };
  total?: number;
  last_page?: number;
};

type CreateResponse<T> = { status: string; message: string; data: T };

function createCrudApi<T extends { id: number; name: string }>(
  path: string,
  createBody?: (data: Record<string, unknown>) => Record<string, unknown>
) {
  const toBody = createBody ?? ((d: Record<string, unknown>) => d);
  return {
    list: async (token: string, params?: { page?: number; per_page?: number; search?: string }) => {
      const sp = new URLSearchParams();
      if (params?.page) sp.set("page", String(params.page));
      if (params?.per_page) sp.set("per_page", String(params.per_page));
      if (params?.search) sp.set("search", params.search);
      const q = sp.toString();
      const res = await fetchWithAuth(`${path}${q ? `?${q}` : ""}`, { method: "GET" }, token);
      return handleResponse<ListResponse<T>>(res);
    },
    create: async (token: string, data: Record<string, unknown>) => {
      const res = await fetchWithAuth(path, { method: "POST", body: JSON.stringify(toBody(data)) }, token);
      return handleResponse<CreateResponse<T>>(res);
    },
    update: async (token: string, id: number, data: Record<string, unknown>) => {
      const res = await fetchWithAuth(`${path}/${id}`, { method: "PUT", body: JSON.stringify(toBody(data)) }, token);
      return handleResponse<CreateResponse<T>>(res);
    },
    delete: async (token: string, id: number) => {
      const res = await fetchWithAuth(`${path}/${id}`, { method: "DELETE" }, token);
      return handleResponse<{ status: string; message: string }>(res);
    },
  };
}

export const memberTypesApi = createCrudApi<MemberType>("/member-types");
export const departmentsApi = createCrudApi<{ id: number; name: string }>("/service-departments");
export const citiesApi = createCrudApi<{ id: number; name: string; code?: string | null }>("/cities", (d) => ({
  name: d.name,
  code: d.code ?? null,
}));
export const districtsApi = createCrudApi<{ id: number; name: string; city_id?: number }>("/districts", (d) => ({
  name: d.name,
  city_id: d.city_id,
}));
export const academicYearsApi = createCrudApi<{ id: number; name: string; year_start?: number; year_end?: number | null; is_current?: boolean }>("/academic-years", (d) => ({
  name: String(d.name ?? "").trim(),
  year_start: Number(d.year_start) || 0,
  year_end: d.year_end != null && d.year_end !== "" ? Number(d.year_end) : null,
  is_current: Boolean(d.is_current),
}));
export const trainingDomainsApi = createCrudApi<{ id: number; name: string }>("/fields-of-study");
export const serviceDomainsApi = createCrudApi<{ id: number; name: string }>("/service-domains");
export const memberStatusesApi = createCrudApi<{ id: number; name: string }>("/member-statuses");
export const familiesApi = createCrudApi<{ id: number; name: string; description?: string | null }>("/families", (d) => ({
  name: d.name,
  description: d.description ?? null,
}));
export const groupsApi = createCrudApi<{ id: number; name: string; family_id?: number; description?: string | null }>("/groups", (d) => ({
  name: d.name,
  family_id: d.family_id,
  description: d.description ?? null,
}));

/**
 * Effectue une requête fetch authentifiée avec le token Bearer.
 * Utile pour les appels API protégés.
 */
export async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
  token: string
): Promise<Response> {
  const url = path.startsWith("http") ? path : apiUrl(path);
  return fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
