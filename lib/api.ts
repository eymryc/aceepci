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

// ─── Slides (bannière accueil) ─────────────────────────────────────────────

export interface HeroSlide {
  id: number;
  title: string;
  image?: string;
  image_url?: string;
  eyebrow?: string;
  short_subtitle?: string;
  subtitle?: string;
  description?: string;
  display_order?: number;
  order?: number;
  is_published?: boolean;
}

export interface HeroSlidesListResponse {
  data: HeroSlide[];
}

/** Transforme un chemin relatif d'image en URL absolue (API) */
function resolveImageUrl(path: string | undefined): string {
  if (!path || !path.trim()) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function normalizeSlide(s: HeroSlide & { published?: boolean }): HeroSlide {
  const rawImage = s.image ?? s.image_url ?? "";
  const image = resolveImageUrl(rawImage);
  return {
    ...s,
    image,
    eyebrow: s.eyebrow ?? s.short_subtitle ?? "",
    order: s.order ?? s.display_order ?? 0,
    is_published: s.is_published ?? s.published ?? false,
  };
}

/** Liste publique des slides (sans auth) — pour la page d'accueil */
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(apiUrl("/slides"), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const raw = (await res.json()) as HeroSlidesListResponse | HeroSlide[];
    const list = Array.isArray(raw) ? raw : (Array.isArray((raw as HeroSlidesListResponse).data) ? (raw as HeroSlidesListResponse).data : []);
    return list.map(normalizeSlide).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return [];
  }
}

function buildSlideFormData(
  body: Record<string, unknown>,
  imageFile?: File | null,
  methodOverride?: "PUT" | "PATCH"
): FormData {
  const fd = new FormData();
  if (methodOverride) fd.append("_method", methodOverride);
  fd.append("title", String(body.title ?? "").trim());
  fd.append("short_subtitle", String(body.eyebrow ?? body.short_subtitle ?? "").trim() || "");
  fd.append("subtitle", String(body.subtitle ?? "").trim() || "");
  fd.append("description", String(body.description ?? "").trim() || "");
  fd.append("display_order", String(Math.max(0, Number(body.order ?? body.display_order ?? 0))));
  if (imageFile) {
    fd.append("image", imageFile, imageFile.name);
  }
  return fd;
}

async function fetchWithAuthFormData(
  path: string,
  formData: FormData,
  token: string,
  method: "POST" | "PUT" | "PATCH"
): Promise<Response> {
  const url = path.startsWith("http") ? path : apiUrl(path);
  return fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

export const heroSlidesApi = {
  list: async (token: string) => {
    const res = await fetchWithAuth("/slides", { method: "GET" }, token);
    const data = await handleResponse<HeroSlidesListResponse>(res);
    const list = Array.isArray(data.data) ? data.data : [];
    return { data: list.map(normalizeSlide).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) };
  },
  create: async (token: string, body: Record<string, unknown>, imageFile?: File | null) => {
    const fd = buildSlideFormData(body, imageFile);
    const res = await fetchWithAuthFormData("/slides", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: HeroSlide }>(res);
  },
  update: async (token: string, id: number, body: Record<string, unknown>, imageFile?: File | null) => {
    const fd = buildSlideFormData(body, imageFile, "PUT");
    const res = await fetchWithAuthFormData(`/slides/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: HeroSlide }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/slides/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  publish: async (token: string, id: number, publish: boolean) => {
    const res = await fetchWithAuth(`/slides/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publish }),
    }, token);
    return handleResponse<{ status: string; message: string; data?: HeroSlide }>(res);
  },
};

// ─── Verset du jour ────────────────────────────────────────────────────────

export interface DailyVerse {
  id: number;
  primary_text: string;
  primary_reference: string;
  secondary_text?: string | null;
  secondary_reference?: string | null;
  image?: string | null;
  image_url?: string | null;
  image_label?: string | null;
  image_quote?: string | null;
  is_published?: boolean;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DailyVerseListResponse {
  data: DailyVerse[];
}

function buildVerseFormData(
  body: {
    text: string;
    reference: string;
    secondaryText?: string;
    secondaryReference?: string;
    imageLabel?: string;
    imageQuote?: string;
    publish?: boolean;
  },
  imageFile?: File | null,
  methodOverride?: "PUT" | "PATCH"
): FormData {
  const fd = new FormData();
  if (methodOverride) fd.append("_method", methodOverride);
  fd.append("primary_text", String(body.text ?? "").trim());
  fd.append("primary_reference", String(body.reference ?? "").trim());
  fd.append("secondary_text", String(body.secondaryText ?? "").trim() || "");
  fd.append("secondary_reference", String(body.secondaryReference ?? "").trim() || "");
  const label = body.imageLabel != null ? String(body.imageLabel).trim() : "";
  const quote = body.imageQuote != null ? String(body.imageQuote).trim() : "";
  if (label) fd.append("image_label", label);
  if (quote) fd.append("image_quote", quote);
  if (body.publish != null) fd.append("publish", body.publish ? "1" : "0");
  if (imageFile) {
    fd.append("image", imageFile, imageFile.name);
  }
  return fd;
}

function normalizeDailyVerse(v: DailyVerse): DailyVerse & { text: string; reference: string; secondaryText?: string; secondaryReference?: string; imageUrl?: string } {
  const rawImg = v.image_url ?? v.image ?? "";
  const imageUrl = rawImg ? resolveImageUrl(rawImg) : "";
  return {
    ...v,
    text: v.primary_text ?? "",
    reference: v.primary_reference ?? "",
    secondaryText: v.secondary_text ?? undefined,
    secondaryReference: v.secondary_reference ?? undefined,
    imageUrl: imageUrl || undefined,
    is_published: v.is_published ?? v.published ?? false,
  };
}

export const dailyVersesApi = {
  list: async (token: string, params?: { page?: number; per_page?: number; search?: string }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.search) sp.set("search", params.search);
    const q = sp.toString();
    const res = await fetchWithAuth(`/daily-verses${q ? `?${q}` : ""}`, { method: "GET" }, token);
    const raw = await handleResponse<unknown>(res);
    const data = raw as { data?: DailyVerse[]; meta?: { last_page?: number; total?: number } };
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(raw) ? raw : [];
    const normalized = list.map(normalizeDailyVerse);
    normalized.sort((a, b) => {
      const da = a.created_at ?? "";
      const db = b.created_at ?? "";
      return db.localeCompare(da);
    });
    return {
      data: normalized,
      meta: data.meta,
      last_page: data.meta?.last_page ?? 1,
    };
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/daily-verses/${id}`, { method: "GET" }, token);
    const data = await handleResponse<{ data: DailyVerse }>(res);
    return { data: normalizeDailyVerse(data.data) };
  },
  create: async (token: string, body: Parameters<typeof buildVerseFormData>[0], imageFile?: File | null) => {
    const fd = buildVerseFormData(body, imageFile);
    const res = await fetchWithAuthFormData("/daily-verses", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: DailyVerse }>(res);
  },
  update: async (token: string, id: number, body: Parameters<typeof buildVerseFormData>[0], imageFile?: File | null) => {
    const fd = buildVerseFormData(body, imageFile, "PUT");
    const res = await fetchWithAuthFormData(`/daily-verses/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: DailyVerse }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/daily-verses/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  publish: async (token: string, id: number, publish: boolean) => {
    const res = await fetchWithAuth(`/daily-verses/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publish }),
    }, token);
    return handleResponse<{ status: string; message: string; data?: DailyVerse }>(res);
  },
};

/** Verset publié (public, sans auth) */
export async function fetchDailyVerse(): Promise<(DailyVerse & { text: string; reference: string; secondaryText?: string; secondaryReference?: string; imageUrl?: string }) | null> {
  try {
    const res = await fetch(apiUrl("/daily-verses"), { method: "GET", headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const raw = await res.json();
    const d = (raw as { data?: DailyVerse }).data ?? raw as DailyVerse;
    if (!d) return null;
    return normalizeDailyVerse(d);
  } catch {
    return null;
  }
}

/** Handler pour rafraîchir le token en cas de 401. Retourne le nouveau token ou null. */
let refreshTokenHandler: (() => Promise<string | null>) | null = null;

export function setRefreshTokenHandler(handler: (() => Promise<string | null>) | null) {
  refreshTokenHandler = handler;
}

/** Évite les appels concurrents au refresh. */
let refreshPromise: Promise<string | null> | null = null;

/**
 * Effectue une requête fetch authentifiée avec le token Bearer.
 * En cas de 401, tente de rafraîchir le token et réessaie une fois.
 */
export async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
  token: string
): Promise<Response> {
  const url = path.startsWith("http") ? path : apiUrl(path);

  const doFetch = (t: string) =>
    fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
        ...options.headers,
      },
    });

  let res = await doFetch(token);

  if (res.status === 401 && refreshTokenHandler) {
    refreshPromise = refreshPromise ?? refreshTokenHandler();
    const newToken = await refreshPromise;
    refreshPromise = null;
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  return res;
}
