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

/** Formate le message d’erreur API + détails de validation pour affichage (toast, etc.) */
export function formatApiErrorMessage(err: unknown): string {
  if (!err || typeof err !== "object" || !("message" in err)) {
    return "Une erreur est survenue.";
  }
  const apiErr = err as ApiError;
  const message = String(apiErr.message ?? "Une erreur est survenue").trim();
  if (!apiErr.errors || Object.keys(apiErr.errors).length === 0) {
    return message;
  }
  const details = Object.entries(apiErr.errors)
    .map(([field, messages]) => {
      const msgs = Array.isArray(messages) ? messages : [String(messages)];
      return `${field}: ${msgs.join(", ")}`;
    })
    .join(" ; ");
  return `${message} — ${details}`;
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

export interface LabeledSettingItem {
  id: number;
  name: string;
  value: string;
  label: string;
  code?: string | null;
  member_type_id?: number | null;
  family_id?: number | null;
  display_order?: number | null;
  member_type?: { id: number; name: string };
  family?: { id: number; name: string };
}

export interface PublicOptionItem {
  id: number;
  name: string;
  value: string;
  label?: string;
  code?: string | null;
  city_id?: number | null;
  member_type_id?: number | null;
  family_id?: number | null;
  display_order?: number | null;
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

function normalizeLabeledSettingItem(item: Record<string, unknown>): LabeledSettingItem {
  const label = String(item.label ?? item.name ?? item.value ?? "").trim();
  const value = String(item.value ?? item.code ?? label).trim();

  return {
    id: Number(item.id ?? 0),
    name: label,
    label,
    value,
    code: item.code == null ? null : String(item.code),
    member_type_id: item.member_type_id == null ? null : Number(item.member_type_id),
    family_id: item.family_id == null ? null : Number(item.family_id),
    display_order: item.display_order == null ? null : Number(item.display_order),
    member_type:
      item.member_type && typeof item.member_type === "object"
        ? {
            id: Number((item.member_type as { id?: unknown }).id ?? 0),
            name: String((item.member_type as { name?: unknown }).name ?? ""),
          }
        : undefined,
    family:
      item.family && typeof item.family === "object"
        ? {
            id: Number((item.family as { id?: unknown }).id ?? 0),
            name: String((item.family as { name?: unknown }).name ?? ""),
          }
        : undefined,
  };
}

function createLabeledCrudApi(
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
      const payload = await handleResponse<ListResponse<Record<string, unknown>>>(res);
      const rawItems = Array.isArray(payload.data) ? payload.data : [];

      return {
        ...payload,
        data: rawItems.map((item) => normalizeLabeledSettingItem(item)),
      };
    },
    create: async (token: string, data: Record<string, unknown>) => {
      const res = await fetchWithAuth(path, { method: "POST", body: JSON.stringify(toBody(data)) }, token);
      return handleResponse<CreateResponse<LabeledSettingItem>>(res);
    },
    update: async (token: string, id: number, data: Record<string, unknown>) => {
      const res = await fetchWithAuth(`${path}/${id}`, { method: "PUT", body: JSON.stringify(toBody(data)) }, token);
      return handleResponse<CreateResponse<LabeledSettingItem>>(res);
    },
    delete: async (token: string, id: number) => {
      const res = await fetchWithAuth(`${path}/${id}`, { method: "DELETE" }, token);
      return handleResponse<{ status: string; message: string }>(res);
    },
  };
}

function normalizePublicOptionItem(item: Record<string, unknown>): PublicOptionItem {
  const label = String(item.label ?? item.name ?? item.value ?? "").trim();
  const value = String(item.value ?? item.id ?? label).trim();

  return {
    id: Number(item.id ?? 0),
    name: label,
    label,
    value,
    code: item.code == null ? null : String(item.code),
    city_id: item.city_id == null ? null : Number(item.city_id),
    member_type_id: item.member_type_id == null ? null : Number(item.member_type_id),
    family_id: item.family_id == null ? null : Number(item.family_id),
    display_order: item.display_order == null ? null : Number(item.display_order),
  };
}

async function fetchPublicOptions(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<PublicOptionItem[]> {
  const sp = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      sp.set(key, String(value));
    }
  });

  const query = sp.toString();
  const res = await fetch(apiUrl(`${path}/options${query ? `?${query}` : ""}`), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await handleResponse<{ data?: unknown }>(res);
  const rawItems = Array.isArray(payload.data) ? payload.data : [];

  return rawItems.map((item) => normalizePublicOptionItem(item as Record<string, unknown>));
}

export const memberTypesApi = createCrudApi<MemberType>("/member-types");
export const departmentsApi = createCrudApi<{ id: number; name: string }>("/service-departments");
export const citiesApi = createCrudApi<{ id: number; name: string; code?: string | null }>("/cities", (d) => ({
  name: d.name,
  code: d.code ?? null,
}));
export const nationalitiesApi = createCrudApi<{ id: number; name: string; code?: string | null; display_order?: number | null }>("/nationalities", (d) => ({
  name: String(d.name ?? "").trim(),
  code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 20) || null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
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

/** Options des statuts (endpoint public pour les selects) */
export async function fetchMemberStatusOptions(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(apiUrl("/member-statuses/options"), {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const payload = await handleResponse<{ data?: { id: number; name: string }[] }>(res);
  const arr = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return arr.map((x) => ({ id: Number(x.id), name: String(x.name ?? "") }));
}
export const memberLevelsApi = createLabeledCrudApi("/member-levels", (d) => ({
  value: String(d.value ?? "").trim(),
  label: String(d.label ?? "").trim(),
  code: d.code ? String(d.code).trim() : null,
  member_type_id: Number(d.member_type_id) || 0,
  family_id: d.family_id != null && d.family_id !== "" ? Number(d.family_id) : null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : null,
}));
export const academicLevelsApi = createLabeledCrudApi("/academic-levels", (d) => ({
  value: String(d.value ?? "").trim(),
  label: String(d.label ?? "").trim(),
  code: d.code ? String(d.code).trim() : null,
  member_type_id: Number(d.member_type_id) || 0,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : null,
}));
export const knowledgeSourcesApi = createLabeledCrudApi("/heard-about-sources", (d) => ({
  value: String(d.value ?? "").trim(),
  label: String(d.label ?? "").trim(),
  code: d.code ? String(d.code).trim() : null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : null,
}));
export const familiesApi = createCrudApi<{ id: number; name: string; description?: string | null }>("/families", (d) => ({
  name: d.name,
  description: d.description ?? null,
}));
export const groupsApi = createCrudApi<{ id: number; name: string; family_id?: number; description?: string | null }>("/groups", (d) => ({
  name: d.name,
  family_id: d.family_id,
  description: d.description ?? null,
}));

// ─── Paramètres événements ─────────────────────────────────────────────────

export const eventCategoriesApi = createCrudApi<{ id: number; name: string; code?: string | null; display_order?: number | null }>(
  "/event-categories",
  (d) => ({
    name: String(d.name ?? "").trim(),
    code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 20) || null,
    display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
  })
);

export const accommodationTypesApi = createCrudApi<{
  id: number;
  name: string;
  code?: string | null;
  price_surcharge?: number | null;
  display_order?: number | null;
}>("/accommodation-types", (d) => ({
  name: String(d.name ?? "").trim(),
  code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 20) || null,
  price_surcharge: d.price_surcharge != null && d.price_surcharge !== "" ? Number(d.price_surcharge) : null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
}));

export const mealPreferencesApi = createCrudApi<{ id: number; name: string; code?: string | null; display_order?: number | null }>(
  "/meal-preferences",
  (d) => ({
    name: String(d.name ?? "").trim(),
    code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 20) || null,
    display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
  })
);

export const workshopOptionsApi = createCrudApi<{
  id: number;
  name: string;
  event_id?: number | null;
  display_order?: number | null;
}>("/workshop-options", (d) => ({
  name: String(d.name ?? "").trim(),
  event_id: d.event_id != null && d.event_id !== "" ? Number(d.event_id) : null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
}));

// ─── Paramètres offres ─────────────────────────────────────────────────────

export const offerCategoriesApi = createCrudApi<{ id: number; name: string; code?: string | null; display_order?: number | null }>(
  "/offer-categories",
  (d) => ({
    name: String(d.name ?? "").trim(),
    code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 20) || null,
    display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
  })
);

export const offerTypesApi = createCrudApi<{ id: number; name: string; code?: string | null; offer_category_id?: number | null; display_order?: number | null }>(
  "/offer-types",
  (d) => ({
    name: String(d.name ?? "").trim(),
    code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 50) || null,
    offer_category_id: d.offer_category_id != null && d.offer_category_id !== "" ? Number(d.offer_category_id) : null,
    display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
  })
);

export const publicOptionsApi = {
  memberTypes: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/member-types", params),
  departments: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/service-departments", params),
  cities: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/cities", params),
  districts: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/districts", params),
  trainingDomains: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/fields-of-study", params),
  serviceDomains: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/service-domains", params),
  nationalities: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/nationalities", params),
  academicYears: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/academic-years", params),
  memberLevels: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/member-levels", params),
  academicLevels: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/academic-levels", params),
  knowledgeSources: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/heard-about-sources", params),
  eventCategories: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/event-categories", params),
  accommodationTypes: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/accommodation-types", params),
  mealPreferences: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/meal-preferences", params),
  workshopOptions: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/workshop-options", params),
  offerCategories: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/offer-categories", params),
  offerTypes: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/offer-types", params),
  newsCategories: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/news-categories", params),
  blogCategories: (params?: Record<string, string | number | undefined>) =>
    fetchPublicOptions("/blog-categories", params),
};

// ─── Paramètres offres & actualités ────────────────────────────────────────

export const offerCategoriesApi = createCrudApi<{
  id: number;
  name: string;
  code?: string | null;
  display_order?: number | null;
}>("/offer-categories", (d) => ({
  name: String(d.name ?? "").trim(),
  code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 20) || null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
}));

export const offerTypesApi = createCrudApi<{
  id: number;
  name: string;
  code?: string | null;
  offer_category_id?: number | null;
  display_order?: number | null;
}>("/offer-types", (d) => ({
  name: String(d.name ?? "").trim(),
  code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 50) || null,
  offer_category_id: d.offer_category_id != null && d.offer_category_id !== "" ? Number(d.offer_category_id) : null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
}));

export const newsCategoriesApi = createCrudApi<{
  id: number;
  name: string;
  code?: string | null;
  display_order?: number | null;
}>("/news-categories", (d) => ({
  name: String(d.name ?? "").trim(),
  code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 50) || null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
}));

export const blogCategoriesApi = createCrudApi<{
  id: number;
  name: string;
  code?: string | null;
  sort_order?: number | null;
}>("/blog-categories", (d) => ({
  name: String(d.name ?? "").trim(),
  code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 50) || null,
  sort_order: d.sort_order != null && d.sort_order !== "" ? Number(d.sort_order) : 0,
}));

export const devotionalCategoriesApi = createCrudApi<{
  id: number;
  name: string;
  code?: string | null;
  display_order?: number | null;
}>("/devotional-categories", (d) => ({
  name: String(d.name ?? "").trim(),
  code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 50) || null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
}));

export const galleryMediaCategoriesApi = createCrudApi<{
  id: number;
  name: string;
  code?: string | null;
  display_order?: number | null;
}>("/gallery-media-categories", (d) => ({
  name: String(d.name ?? "").trim(),
  code: d.code == null || d.code === "" ? null : String(d.code).trim().slice(0, 50) || null,
  display_order: d.display_order != null && d.display_order !== "" ? Number(d.display_order) : 0,
}));

/** Options des catégories galerie (public, pour les formulaires) */
export async function fetchGalleryMediaCategoryOptions(): Promise<{ id: number; name: string }[]> {
  try {
    const res = await fetch(apiUrl("/gallery-media-categories/options"), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const raw = await res.json();
    const data = (raw as { data?: { id: number; name: string }[] }).data;
    const arr = Array.isArray(data) ? data : [];
    return arr.map((x) => ({ id: Number(x.id), name: String(x.name ?? "") }));
  } catch {
    return [];
  }
}

// ─── Offres (emploi, stage, bourse, bénévolat) ─────────────────────────────

export type OfferCategory = "emploi" | "stage" | "bourse" | "benevolat";

export interface Offer {
  id: number;
  title: string;
  organization: string;
  category: OfferCategory;
  location: string;
  type: string;
  deadline: string;
  description: string;
  requirements: string[];
  salary?: string | null;
  duration?: string | null;
  external_link: string | null;
  created_at?: string;
  updated_at?: string;
  is_published?: boolean;
  offer_category_id?: number | null;
  offer_type_id?: number | null;
  offer_category?: { id: number; name: string; code?: string | null };
  offer_type?: { id: number; name: string; code?: string | null };
}

export const offersApi = {
  list: async (
    token: string,
    params?: {
      page?: number;
      per_page?: number;
      search?: string;
      category?: OfferCategory;
      include_expired?: boolean | 0 | 1;
      include_unpublished?: boolean | 0 | 1;
    }
  ) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.search) sp.set("search", params.search);
    if (params?.category) sp.set("category", params.category);
    if (params?.include_expired) sp.set("include_expired", "1");
    if (params?.include_unpublished) sp.set("include_unpublished", "1");
    const q = sp.toString();
    const res = await fetchWithAuth(`/offers${q ? `?${q}` : ""}`, { method: "GET" }, token);
    return handleResponse<{
      data: Offer[];
      meta?: { total?: number; last_page?: number };
      total?: number;
      last_page?: number;
    }>(res);
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/offers/${id}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: Offer } | Offer>(res);
    return (typeof raw === "object" && raw !== null && "data" in raw ? (raw as { data: Offer }).data : raw) as Offer;
  },
  create: async (token: string, data: Record<string, unknown>) => {
    const deadlineRaw = String(data.deadline ?? "").trim();
    const deadline = deadlineRaw
      ? deadlineRaw.includes("T")
        ? deadlineRaw
        : `${deadlineRaw}T12:00:00.000Z`
      : "";
    const body: Record<string, unknown> = {
      title: String(data.title ?? "").trim(),
      organization: String(data.organization ?? "").trim(),
      offer_category_id: data.offer_category_id != null && data.offer_category_id !== "" ? Number(data.offer_category_id) : null,
      offer_type_id: data.offer_type_id != null && data.offer_type_id !== "" ? Number(data.offer_type_id) : null,
      location: data.location ? String(data.location).trim() : null,
      deadline,
      description: data.description ? String(data.description).trim() : null,
      salary: data.salary ? String(data.salary).trim() : null,
      duration: data.duration ? String(data.duration).trim() : null,
      external_link: String(data.external_link ?? "").trim() ? String(data.external_link ?? "").trim() : null,
      requirements: Array.isArray(data.requirements)
        ? data.requirements
        : String(data.requirements ?? "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
    };
    const res = await fetchWithAuth("/offers", { method: "POST", body: JSON.stringify(body) }, token);
    return handleResponse<{ status: string; message: string; data: Offer }>(res);
  },
  update: async (token: string, id: number, data: Record<string, unknown>) => {
    const deadlineRaw = String(data.deadline ?? "").trim();
    const deadline = deadlineRaw
      ? deadlineRaw.includes("T")
        ? deadlineRaw
        : `${deadlineRaw}T12:00:00.000Z`
      : "";
    const body: Record<string, unknown> = {
      title: String(data.title ?? "").trim(),
      organization: String(data.organization ?? "").trim(),
      offer_category_id: data.offer_category_id != null && data.offer_category_id !== "" ? Number(data.offer_category_id) : null,
      offer_type_id: data.offer_type_id != null && data.offer_type_id !== "" ? Number(data.offer_type_id) : null,
      location: data.location ? String(data.location).trim() : null,
      deadline,
      description: data.description ? String(data.description).trim() : null,
      salary: data.salary ? String(data.salary).trim() : null,
      duration: data.duration ? String(data.duration).trim() : null,
      external_link: String(data.external_link ?? "").trim() ? String(data.external_link ?? "").trim() : null,
      requirements: Array.isArray(data.requirements)
        ? data.requirements
        : String(data.requirements ?? "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
    };
    const res = await fetchWithAuth(`/offers/${id}`, { method: "PUT", body: JSON.stringify(body) }, token);
    return handleResponse<{ status: string; message: string; data: Offer }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/offers/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  publish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/offers/${id}/publish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data: Offer }>(res);
  },
  unpublish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/offers/${id}/unpublish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data: Offer }>(res);
  },
};

// ─── Actualités (news) ─────────────────────────────────────────────────────

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  /** ID de la catégorie (API) */
  news_category_id?: number | null;
  /** Nom ou objet catégorie (selon API) */
  category?: string | { id: number; name: string; code?: string | null } | null;
  news_category?: { id: number; name: string; code?: string | null } | null;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  cover_image_path?: string | null;
  cover_image_url?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  author_avatar_path?: string | null;
  author_avatar_url?: string | null;
  reading_time?: string | null;
  reading_time_minutes?: number | null;
  views_count?: number | null;
  /** Date/heure de publication (ISO) */
  published_at?: string | null;
  /** ID de l’événement lié (certaines API renvoient event_id) */
  linked_event_id?: number | null;
  event_id?: number | null;
  linked_event?: { id: number; name?: string; title?: string | null; label?: string | null } | null;
  event?: { id: number; name?: string; title?: string | null; label?: string | null } | null;
  custom_cta_label?: string | null;
  custom_cta_url?: string | null;
  cta_label?: string | null;
  cta_link?: string | null;
  comments_enabled?: boolean | null;
  reactions_enabled?: boolean | null;
  gallery_images?: string[] | null;
  gallery?: string[] | null;
  gallery_urls?: string[] | null;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const NEWS_CATEGORIES = [
  "Événements",
  "Projets",
  "Formations",
  "Témoignages",
  "Galerie",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

function buildNewsFormData(
  body: Record<string, unknown>,
  options?: {
    imageFile?: File | null;
    authorAvatarFile?: File | null;
    galleryFiles?: File[];
  },
  methodOverride?: "PUT"
): FormData {
  const fd = new FormData();
  if (methodOverride) fd.append("_method", methodOverride);
  fd.append("title", String(body.title ?? "").trim());
  if (body.slug) fd.append("slug", String(body.slug).trim());
  // Catégorie : uniquement l’ID entier (évite validation.integer)
  const categoryId = body.news_category_id != null && body.news_category_id !== ""
    ? String(body.news_category_id).trim()
    : (typeof body.category === "string" ? body.category.trim() : "");
  if (categoryId && /^\d+$/.test(categoryId)) {
    fd.append("news_category_id", categoryId);
  }
  fd.append("excerpt", String(body.excerpt ?? "").trim());
  fd.append("content", String(body.content ?? "").trim());
  if (body.author_name) fd.append("author_name", String(body.author_name).trim());
  if (body.author_role) fd.append("author_role", String(body.author_role).trim());
  // Temps de lecture (en minutes) : toujours envoyé pour enregistrement / null
  const rawReading = String(body.reading_time ?? "").trim();
  const readingMatch = rawReading.match(/\d+/);
  fd.append("reading_time_minutes", readingMatch ? readingMatch[0] : "");
  // Vues initiales
  if (body.views_count != null && body.views_count !== "") {
    fd.append("initial_views", String(body.views_count));
  }
  if (body.published_at) {
    fd.append("published_at", String(body.published_at).trim());
  }
  if (body.linked_event_id != null && body.linked_event_id !== "") {
    const eventId = String(body.linked_event_id);
    fd.append("event_id", eventId);
  }
  fd.append("cta_label", String(body.custom_cta_label ?? "").trim());
  fd.append("cta_link", String(body.custom_cta_url ?? "").trim());
  if (body.comments_enabled != null) {
    fd.append("comments_enabled", body.comments_enabled ? "1" : "0");
  }
  if (body.reactions_enabled != null) {
    fd.append("reactions_enabled", body.reactions_enabled ? "1" : "0");
  }
  if (body.publish != null) {
    fd.append("is_published", body.publish ? "1" : "0");
  }
  if (options?.imageFile) {
    fd.append("cover_image", options.imageFile, options.imageFile.name);
  }
  if (options?.authorAvatarFile) {
    fd.append("author_avatar", options.authorAvatarFile, options.authorAvatarFile.name);
  }
  if (options?.galleryFiles?.length) {
    options.galleryFiles.forEach((file) => {
      fd.append("gallery_images[]", file, file.name);
    });
  }
  return fd;
}

export const newsApi = {
  /** Liste admin : GET /news/admin — renvoie toutes les actualités (publiées + dépubliées). */
  list: async (
    token: string,
    params?: {
      page?: number;
      per_page?: number;
      search?: string;
      /** published | draft pour filtrer ; undefined ou "all" = toutes */
      status?: "published" | "draft" | "all";
    }
  ) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.search) sp.set("search", params.search);
    if (params?.status && params.status !== "all") sp.set("status", params.status);
    const q = sp.toString();
    const res = await fetchWithAuth(`/news/admin${q ? `?${q}` : ""}`, { method: "GET" }, token);
    return handleResponse<{
      data: NewsArticle[];
      meta?: { total?: number; last_page?: number };
      total?: number;
      last_page?: number;
    }>(res);
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/news/${id}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: NewsArticle } | NewsArticle>(res);
    return (typeof raw === "object" && raw !== null && "data" in raw
      ? (raw as { data: NewsArticle }).data
      : raw) as NewsArticle;
  },
  create: async (
    token: string,
    body: {
      title: string;
      slug?: string;
      /** ID de la catégorie (entier), pas le nom */
      news_category_id?: string;
      category?: string;
      excerpt: string;
      content: string;
      author_name?: string;
      author_role?: string;
      reading_time?: string;
      views_count?: number | "";
      published_at?: string;
      linked_event_id?: number | "";
      custom_cta_label?: string;
      custom_cta_url?: string;
      comments_enabled?: boolean;
      reactions_enabled?: boolean;
      publish: boolean;
    },
    options?: {
      imageFile?: File | null;
      authorAvatarFile?: File | null;
      galleryFiles?: File[];
    }
  ) => {
    const fd = buildNewsFormData(body, options);
    const res = await fetchWithAuthFormData("/news", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: NewsArticle }>(res);
  },
  update: async (
    token: string,
    id: number,
    body: {
      title: string;
      slug?: string;
      news_category_id?: string;
      category?: string;
      excerpt: string;
      content: string;
      author_name?: string;
      author_role?: string;
      reading_time?: string;
      views_count?: number | "";
      published_at?: string;
      linked_event_id?: number | "";
      custom_cta_label?: string;
      custom_cta_url?: string;
      comments_enabled?: boolean;
      reactions_enabled?: boolean;
      publish: boolean;
    },
    options?: {
      imageFile?: File | null;
      authorAvatarFile?: File | null;
      galleryFiles?: File[];
    }
  ) => {
    const fd = buildNewsFormData(body, options, "PUT");
    const res = await fetchWithAuthFormData(`/news/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: NewsArticle }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/news/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  /** Publication d'une actualité (admin) - POST /news/{id}/publish */
  publish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/news/${id}/publish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: unknown }>(res);
  },
  /** Dépublication d'une actualité (admin) - POST /news/{id}/unpublish */
  unpublish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/news/${id}/unpublish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: unknown }>(res);
  },
};

// ─── Blog (même champs et fonctionnalités que les actualités) ─────────────────

export interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  blog_category_id?: number | null;
  news_category_id?: number | null;
  category?: string | { id: number; name: string; code?: string | null } | null;
  blog_category?: { id: number; name: string; code?: string | null } | null;
  news_category?: { id: number; name: string; code?: string | null } | null;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  cover_image_path?: string | null;
  cover_image_url?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  author_avatar_path?: string | null;
  author_avatar_url?: string | null;
  reading_time?: string | null;
  reading_time_minutes?: number | null;
  views_count?: number | null;
  published_at?: string | null;
  linked_event_id?: number | null;
  event_id?: number | null;
  linked_event?: { id: number; name: string; title?: string | null } | null;
  custom_cta_label?: string | null;
  custom_cta_url?: string | null;
  cta_label?: string | null;
  cta_link?: string | null;
  comments_enabled?: boolean | null;
  reactions_enabled?: boolean | null;
  gallery_images?: string[] | null;
  gallery?: string[] | null;
  gallery_urls?: string[] | null;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

function buildBlogFormData(
  body: Record<string, unknown>,
  options?: {
    imageFile?: File | null;
    authorAvatarFile?: File | null;
    galleryFiles?: File[];
  },
  methodOverride?: "PUT"
): FormData {
  const fd = new FormData();
  if (methodOverride) fd.append("_method", methodOverride);
  fd.append("title", String(body.title ?? "").trim());
  if (body.slug) fd.append("slug", String(body.slug).trim());
  const blogCat =
    body.blog_category_id != null && body.blog_category_id !== ""
      ? String(body.blog_category_id).trim()
      : "";
  const newsCat =
    body.news_category_id != null && body.news_category_id !== ""
      ? String(body.news_category_id).trim()
      : "";
  if (blogCat && /^\d+$/.test(blogCat)) {
    fd.append("blog_category_id", blogCat);
    fd.append("news_category_id", "");
  } else if (newsCat && /^\d+$/.test(newsCat)) {
    fd.append("news_category_id", newsCat);
    fd.append("blog_category_id", "");
  } else {
    if (Object.prototype.hasOwnProperty.call(body, "blog_category_id")) {
      fd.append("blog_category_id", blogCat || "");
    }
    if (Object.prototype.hasOwnProperty.call(body, "news_category_id")) {
      fd.append("news_category_id", newsCat || "");
    }
  }
  fd.append("excerpt", String(body.excerpt ?? "").trim());
  fd.append("content", String(body.content ?? "").trim());
  if (body.author_name) fd.append("author_name", String(body.author_name).trim());
  if (body.author_role) fd.append("author_role", String(body.author_role).trim());
  const rawReading = String(body.reading_time ?? "").trim();
  const readingMatch = rawReading.match(/\d+/);
  fd.append("reading_time_minutes", readingMatch ? readingMatch[0] : "");
  if (body.views_count != null && body.views_count !== "") {
    fd.append("initial_views", String(body.views_count));
  }
  if (body.published_at) {
    fd.append("published_at", String(body.published_at).trim());
  }
  if (body.linked_event_id != null && body.linked_event_id !== "") {
    fd.append("event_id", String(body.linked_event_id));
  }
  fd.append("cta_label", String(body.custom_cta_label ?? "").trim());
  fd.append("cta_link", String(body.custom_cta_url ?? "").trim());
  if (body.comments_enabled != null) {
    fd.append("comments_enabled", body.comments_enabled ? "1" : "0");
  }
  if (body.reactions_enabled != null) {
    fd.append("reactions_enabled", body.reactions_enabled ? "1" : "0");
  }
  if (body.publish != null) {
    fd.append("is_published", body.publish ? "1" : "0");
  }
  if (options?.imageFile) {
    fd.append("cover_image", options.imageFile, options.imageFile.name);
  }
  if (options?.authorAvatarFile) {
    fd.append("author_avatar", options.authorAvatarFile, options.authorAvatarFile.name);
  }
  if (options?.galleryFiles?.length) {
    options.galleryFiles.forEach((file) => {
      fd.append("gallery[]", file, file.name);
    });
  }
  return fd;
}

export const blogApi = {
  list: async (
    token: string,
    params?: { page?: number; per_page?: number; search?: string; status?: "all" | "published" | "draft" }
  ) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.search) sp.set("search", params.search ?? "");
    if (params?.status && params.status !== "all") sp.set("status", params.status);
    const q = sp.toString();
    const res = await fetchWithAuth(`/blogs/admin${q ? `?${q}` : ""}`, { method: "GET" }, token);
    return handleResponse<{
      data: BlogArticle[];
      meta?: { total?: number; last_page?: number };
      total?: number;
      last_page?: number;
    }>(res);
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/blogs/${id}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: BlogArticle } | BlogArticle>(res);
    return (typeof raw === "object" && raw !== null && "data" in raw
      ? (raw as { data: BlogArticle }).data
      : raw) as BlogArticle;
  },
  create: async (
    token: string,
    body: {
      title: string;
      slug?: string;
      news_category_id?: string;
      excerpt: string;
      content: string;
      author_name?: string;
      author_role?: string;
      reading_time?: string;
      views_count?: number | "";
      published_at?: string;
      linked_event_id?: number | "";
      custom_cta_label?: string;
      custom_cta_url?: string;
      comments_enabled?: boolean;
      reactions_enabled?: boolean;
      publish: boolean;
    },
    options?: {
      imageFile?: File | null;
      authorAvatarFile?: File | null;
      galleryFiles?: File[];
    }
  ) => {
    const fd = buildBlogFormData(body, options);
    const res = await fetchWithAuthFormData("/blogs", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: BlogArticle }>(res);
  },
  update: async (
    token: string,
    id: number,
    body: {
      title: string;
      slug?: string;
      news_category_id?: string;
      excerpt: string;
      content: string;
      author_name?: string;
      author_role?: string;
      reading_time?: string;
      views_count?: number | "";
      published_at?: string;
      linked_event_id?: number | "";
      custom_cta_label?: string;
      custom_cta_url?: string;
      comments_enabled?: boolean;
      reactions_enabled?: boolean;
      publish: boolean;
    },
    options?: {
      imageFile?: File | null;
      authorAvatarFile?: File | null;
      galleryFiles?: File[];
    }
  ) => {
    const fd = buildBlogFormData(body, options, "PUT");
    const res = await fetchWithAuthFormData(`/blogs/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: BlogArticle }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/blogs/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  publish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/blogs/${id}/publish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: BlogArticle }>(res);
  },
  unpublish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/blogs/${id}/unpublish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: BlogArticle }>(res);
  },
};

// ─── Dévotionnels ────────────────────────────────────────────────────────────

export interface Devotional {
  id: number;
  title: string;
  slug: string;
  devotional_category_id?: number | null;
  category?: { id: number; name: string; code?: string | null } | null;
  scripture_reference?: string | null;
  verse_text?: string | null;
  excerpt?: string | null;
  content: string;
  practical_application?: string | null;
  reflection_questions?: string | null;
  prayer?: string | null;
  cover_image_path?: string | null;
  cover_image_url?: string | null;
  reading_time?: string | null;
  is_published?: boolean;
  published_at?: string | null;
  comments_enabled?: boolean;
  reactions_enabled?: boolean;
  views_count?: number;
  amen_count?: number;
  beni_count?: number;
  edifiant_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

function buildDevotionalFormData(
  body: Record<string, unknown>,
  options?: { imageFile?: File | null },
  methodOverride?: "PUT"
): FormData {
  const fd = new FormData();
  if (methodOverride) fd.append("_method", methodOverride);
  fd.append("title", String(body.title ?? "").trim());
  if (body.slug) fd.append("slug", String(body.slug).trim());
  if (body.devotional_category_id != null && body.devotional_category_id !== "") {
    fd.append("devotional_category_id", String(body.devotional_category_id));
  } else {
    fd.append("devotional_category_id", "");
  }
  if (body.scripture_reference) fd.append("scripture_reference", String(body.scripture_reference).trim());
  if (body.verse_text) fd.append("verse_text", String(body.verse_text).trim());
  fd.append("excerpt", String(body.excerpt ?? "").trim());
  fd.append("content", String(body.content ?? "").trim());
  if (body.practical_application) fd.append("practical_application", String(body.practical_application).trim());
  if (body.reflection_questions) fd.append("reflection_questions", String(body.reflection_questions).trim());
  if (body.prayer) fd.append("prayer", String(body.prayer).trim());
  if (body.reading_time) fd.append("reading_time", String(body.reading_time ?? "").trim());
  if (body.published_at) fd.append("published_at", String(body.published_at).trim());
  if (body.is_published != null) fd.append("is_published", body.is_published ? "1" : "0");
  if (body.comments_enabled != null) fd.append("comments_enabled", body.comments_enabled ? "1" : "0");
  if (body.reactions_enabled != null) fd.append("reactions_enabled", body.reactions_enabled ? "1" : "0");
  if (body.remove_cover_image) fd.append("remove_cover_image", "1");
  if (options?.imageFile) {
    fd.append("cover_image", options.imageFile, options.imageFile.name);
  }
  return fd;
}

export const devotionalsApi = {
  list: async (
    token: string,
    params?: { page?: number; per_page?: number; search?: string; status?: "all" | "published" | "draft" }
  ) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.search) sp.set("search", params.search ?? "");
    if (params?.status && params.status !== "all") sp.set("status", params.status);
    const q = sp.toString();
    const res = await fetchWithAuth(`/devotionals/admin${q ? `?${q}` : ""}`, { method: "GET" }, token);
    return handleResponse<{
      data: Devotional[];
      meta?: { total?: number; last_page?: number };
      total?: number;
      last_page?: number;
    }>(res);
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/devotionals/${id}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: Devotional } | Devotional>(res);
    return (typeof raw === "object" && raw !== null && "data" in raw
      ? (raw as { data: Devotional }).data
      : raw) as Devotional;
  },
  create: async (
    token: string,
    body: Record<string, unknown>,
    options?: { imageFile?: File | null }
  ) => {
    const fd = buildDevotionalFormData(body, options);
    const res = await fetchWithAuthFormData("/devotionals", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: Devotional }>(res);
  },
  update: async (
    token: string,
    id: number,
    body: Record<string, unknown>,
    options?: { imageFile?: File | null; remove_cover_image?: boolean }
  ) => {
    const fd = buildDevotionalFormData(
      { ...body, remove_cover_image: options?.remove_cover_image },
      options,
      "PUT"
    );
    const res = await fetchWithAuthFormData(`/devotionals/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: Devotional }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/devotionals/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  publish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/devotionals/${id}/publish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: Devotional }>(res);
  },
  unpublish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/devotionals/${id}/unpublish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: Devotional }>(res);
  },
};

// ─── Sermons (même modèle que dévotionnel + type, speaker, video_url, audio_url) ───

export interface Sermon {
  id: number;
  title: string;
  slug: string;
  type: "video" | "audio" | "text";
  speaker?: string | null;
  scripture_reference?: string | null;
  verse_text?: string | null;
  excerpt?: string | null;
  content?: string | null;
  cover_image_path?: string | null;
  cover_image_url?: string | null;
  reading_time?: string | null;
  video_url?: string | null;
  audio_url?: string | null;
  is_published?: boolean;
  published_at?: string | null;
  comments_enabled?: boolean;
  reactions_enabled?: boolean;
  views_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

function buildSermonFormData(
  body: Record<string, unknown>,
  options?: { imageFile?: File | null },
  methodOverride?: "PUT"
): FormData {
  const fd = new FormData();
  if (methodOverride) fd.append("_method", methodOverride);
  fd.append("title", String(body.title ?? "").trim());
  fd.append("type", String(body.type ?? "text"));
  if (body.slug) fd.append("slug", String(body.slug).trim());
  if (body.speaker != null) fd.append("speaker", String(body.speaker).trim());
  if (body.scripture_reference) fd.append("scripture_reference", String(body.scripture_reference).trim());
  if (body.verse_text) fd.append("verse_text", String(body.verse_text ?? "").trim());
  if (body.excerpt != null) fd.append("excerpt", String(body.excerpt).trim());
  if (body.content != null) fd.append("content", String(body.content).trim());
  if (body.reading_time) fd.append("reading_time", String(body.reading_time ?? "").trim());
  if (body.video_url != null) fd.append("video_url", String(body.video_url).trim());
  if (body.audio_url != null) fd.append("audio_url", String(body.audio_url).trim());
  if (body.published_at) fd.append("published_at", String(body.published_at).trim());
  if (body.is_published != null) fd.append("is_published", body.is_published ? "1" : "0");
  if (body.comments_enabled != null) fd.append("comments_enabled", body.comments_enabled ? "1" : "0");
  if (body.reactions_enabled != null) fd.append("reactions_enabled", body.reactions_enabled ? "1" : "0");
  if (body.remove_cover_image) fd.append("remove_cover_image", "1");
  if (options?.imageFile) {
    fd.append("cover_image", options.imageFile, options.imageFile.name);
  }
  return fd;
}

export const sermonsApi = {
  list: async (
    token: string,
    params?: { page?: number; per_page?: number; search?: string; type?: string; status?: "all" | "published" | "draft" }
  ) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.search) sp.set("search", params.search ?? "");
    if (params?.type) sp.set("type", params.type);
    if (params?.status && params.status !== "all") sp.set("status", params.status);
    const q = sp.toString();
    const res = await fetchWithAuth(`/sermons/admin${q ? `?${q}` : ""}`, { method: "GET" }, token);
    return handleResponse<{
      data: Sermon[];
      meta?: { total?: number; last_page?: number };
      total?: number;
      last_page?: number;
    }>(res);
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/sermons/${id}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: Sermon } | Sermon>(res);
    return (typeof raw === "object" && raw !== null && "data" in raw
      ? (raw as { data: Sermon }).data
      : raw) as Sermon;
  },
  create: async (
    token: string,
    body: Record<string, unknown>,
    options?: { imageFile?: File | null }
  ) => {
    const fd = buildSermonFormData(body, options);
    const res = await fetchWithAuthFormData("/sermons", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: Sermon }>(res);
  },
  update: async (
    token: string,
    id: number,
    body: Record<string, unknown>,
    options?: { imageFile?: File | null; remove_cover_image?: boolean }
  ) => {
    const fd = buildSermonFormData(
      { ...body, remove_cover_image: options?.remove_cover_image },
      options,
      "PUT"
    );
    const res = await fetchWithAuthFormData(`/sermons/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: Sermon }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/sermons/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  publish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/sermons/${id}/publish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: Sermon }>(res);
  },
  unpublish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/sermons/${id}/unpublish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: Sermon }>(res);
  },
};

// ─── Galerie média (photos page d'accueil / galerie) ─────────────────────────

export interface GalleryMediaItem {
  id: number;
  title: string;
  category?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  display_order?: number;
  order?: number;
  is_published?: boolean;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

function buildGalleryMediaFormData(
  body: { title: string; category?: string; display_order?: number },
  imageFile?: File | null,
  methodOverride?: "PUT" | "PATCH"
): FormData {
  const fd = new FormData();
  if (methodOverride) fd.append("_method", methodOverride);
  fd.append("title", String(body.title ?? "").trim());
  fd.append("category", String(body.category ?? "").trim() || "");
  fd.append("display_order", String(Math.max(0, Number(body.display_order ?? 0))));
  if (imageFile) fd.append("image", imageFile, imageFile.name);
  return fd;
}

export const galleryMediaApi = {
  list: async (
    token: string,
    params?: { page?: number; per_page?: number; search?: string; status?: "all" | "published" | "draft" }
  ) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.search) sp.set("search", params.search ?? "");
    if (params?.status && params.status !== "all") sp.set("status", params.status);
    const q = sp.toString();
    const res = await fetchWithAuth(`/gallery-media${q ? `?${q}` : ""}`, { method: "GET" }, token);
    const raw = await handleResponse<{
      data?: GalleryMediaItem[] | { data?: GalleryMediaItem[]; meta?: { total?: number; last_page?: number } };
      meta?: { total?: number; last_page?: number };
      total?: number;
      last_page?: number;
    }>(res);
    const payload = raw.data;
    const list = Array.isArray(payload) ? payload : (payload && typeof payload === "object" && Array.isArray(payload.data) ? payload.data : []);
    const meta = (payload && typeof payload === "object" && "meta" in payload ? (payload as { meta?: { total?: number; last_page?: number } }).meta : raw.meta) ?? {};
    const total = meta.total ?? (raw as { total?: number }).total;
    const lastPage = meta.last_page ?? (raw as { last_page?: number }).last_page ?? 1;
    return { data: list, meta: { total, last_page: lastPage }, total, last_page: lastPage };
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/gallery-media/${id}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: GalleryMediaItem } | GalleryMediaItem>(res);
    return (typeof raw === "object" && raw !== null && "data" in raw ? (raw as { data: GalleryMediaItem }).data : raw) as GalleryMediaItem;
  },
  create: async (
    token: string,
    body: { title: string; category?: string; display_order?: number },
    imageFile?: File | null
  ) => {
    const fd = buildGalleryMediaFormData(body, imageFile);
    const res = await fetchWithAuthFormData("/gallery-media", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: GalleryMediaItem }>(res);
  },
  update: async (
    token: string,
    id: number,
    body: { title: string; category?: string; display_order?: number; remove_image?: boolean },
    imageFile?: File | null
  ) => {
    const fd = buildGalleryMediaFormData(body, imageFile, "PUT");
    if (body.remove_image) fd.append("remove_image", "1");
    const res = await fetchWithAuthFormData(`/gallery-media/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: GalleryMediaItem }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/gallery-media/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  publish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/gallery-media/${id}/publish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: GalleryMediaItem }>(res);
  },
  unpublish: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/gallery-media/${id}/unpublish`, { method: "POST" }, token);
    return handleResponse<{ status: string; message: string; data?: GalleryMediaItem }>(res);
  },
};

/** Liste publique des photos galerie (sans auth) — page d'accueil, section galerie */
export async function fetchGalleryMediaPublished(limit?: number): Promise<GalleryMediaItem[]> {
  try {
    const url = limit != null ? apiUrl(`/gallery-media/published?limit=${limit}`) : apiUrl("/gallery-media/published");
    const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const raw = await res.json();
    const data = (raw as { data?: GalleryMediaItem[] }).data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Commentaire dévotionnel (site public) */
export interface DevotionalSiteComment {
  id: number;
  author_name: string;
  author_avatar_url?: string | null;
  content: string;
  created_at?: string;
}

/** API publique dévotionnels (site, sans auth) : détail, commentaires, réactions */
export const devotionalsSiteApi = {
  getBySlugOrId: async (slugOrId: string): Promise<Devotional> => {
    const res = await fetch(apiUrl(`/devotionals/site/${encodeURIComponent(slugOrId)}`), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const raw = await handleResponse<{ data: Devotional } | Devotional>(res);
    return (typeof raw === "object" && raw !== null && "data" in raw
      ? (raw as { data: Devotional }).data
      : raw) as Devotional;
  },

  getComments: async (
    slugOrId: string,
    params?: { page?: number; per_page?: number }
  ): Promise<{ data: DevotionalSiteComment[]; meta?: { total?: number; current_page?: number; last_page?: number } }> => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    const q = sp.toString();
    const res = await fetch(apiUrl(`/devotionals/site/${encodeURIComponent(slugOrId)}/comments${q ? `?${q}` : ""}`), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const payload = await handleResponse<{ data: DevotionalSiteComment[]; meta?: { total?: number; current_page?: number; last_page?: number } }>(res);
    return {
      data: Array.isArray(payload.data) ? payload.data : [],
      meta: payload.meta,
    };
  },

  addComment: async (
    slugOrId: string,
    body: { author_name: string; author_avatar_url?: string | null; content: string; captcha_token: string }
  ) => {
    const res = await fetch(apiUrl(`/devotionals/site/${encodeURIComponent(slugOrId)}/comments`), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleResponse<{ status: string; message: string; data: DevotionalSiteComment }>(res);
  },

  react: async (slugOrId: string, body: { type: "amen" | "beni" | "edifiant" }): Promise<Devotional> => {
    const res = await fetch(apiUrl(`/devotionals/site/${encodeURIComponent(slugOrId)}/react`), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const raw = await handleResponse<{ status: string; data: Devotional }>(res);
    return (raw as { data: Devotional }).data;
  },
};

// ─── Actualités (site) : commentaires publics ────────────────────────────────

export interface NewsSiteComment {
  id: number;
  author_name: string;
  author_avatar_url?: string | null;
  content: string;
  created_at?: string;
}

type NewsCommentsListPayload = { data: NewsSiteComment[] } | NewsSiteComment[];

/** Liste des commentaires publics pour une actualité (endpoint site, sans auth admin) */
export async function fetchNewsSiteComments(slugOrId: string): Promise<NewsSiteComment[]> {
  if (!slugOrId) return [];
  const res = await fetch(apiUrl(`/news/site/${encodeURIComponent(slugOrId)}/comments`), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const payload = await handleResponse<NewsCommentsListPayload>(res);
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload.data) ? payload.data : [];
}

/** Ajout d'un commentaire public sur une actualité (endpoint site, avec CAPTCHA) */
export async function createNewsSiteComment(
  slugOrId: string,
  body: {
    author_name: string;
    content: string;
    captcha_token: string;
    author_avatar_url?: string | null;
  }
): Promise<{ status: string; message: string; data: NewsSiteComment }> {
  const res = await fetch(apiUrl(`/news/site/${encodeURIComponent(slugOrId)}/comments`), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<{ status: string; message: string; data: NewsSiteComment }>(res);
}

// ─── Événements ────────────────────────────────────────────────────────────

export interface Event {
  id: number;
  name: string;
  title: string;
  slug: string;
  event_category_id: number;
  event_category?: { id: number; name: string };
  start_date: string;
  end_date: string;
  expected_attendees?: string | null;
  location?: string | null;
  price?: string | null;
  image_url?: string | null;
  is_published: boolean;
  registration_open: boolean;
  created_at?: string;
  updated_at?: string;
}

function buildEventFormData(body: Record<string, unknown>, imageFile?: File | null): FormData {
  const fd = new FormData();
  fd.append("name", String(body.name ?? "").trim());
  fd.append("title", String(body.title ?? body.name ?? "").trim());
  if (body.slug) fd.append("slug", String(body.slug).trim());
  fd.append("event_category_id", String(Number(body.event_category_id) || 0));
  fd.append("start_date", String(body.start_date ?? "").trim());
  fd.append("end_date", String(body.end_date ?? "").trim());
  fd.append("expected_attendees", body.expected_attendees ? String(body.expected_attendees).trim() : "");
  fd.append("location", body.location ? String(body.location).trim() : "");
  fd.append("price", body.price ? String(body.price).trim() : "");
  fd.append("is_published", body.is_published ? "1" : "0");
  fd.append("registration_open", body.registration_open ? "1" : "0");
  if (imageFile) {
    fd.append("image", imageFile, imageFile.name);
  }
  return fd;
}

function buildEventUpdateFormData(
  body: Record<string, unknown>,
  imageFile?: File | null,
  removeImage?: boolean
): FormData {
  const fd = buildEventFormData(body, imageFile);
  fd.append("_method", "PUT");
  fd.append("remove_image", removeImage ? "1" : "0");
  return fd;
}

export const eventsApi = {
  list: async (
    token: string,
    params?: { page?: number; per_page?: number; search?: string; published?: 0 | 1 }
  ) => {
    const sp = new URLSearchParams();
    if (params?.published !== undefined) sp.set("published", String(params.published));
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.search) sp.set("search", params.search);
    const q = sp.toString();
    const res = await fetchWithAuth(`/events${q ? `?${q}` : ""}`, { method: "GET" }, token);
    return handleResponse<{ data: Event[]; meta?: { total?: number; last_page?: number }; total?: number; last_page?: number }>(res);
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/events/${id}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: Event } | Event>(res);
    return (typeof raw === "object" && raw !== null && "data" in raw ? (raw as { data: Event }).data : raw) as Event;
  },
  create: async (token: string, data: Record<string, unknown>, imageFile?: File | null) => {
    const fd = buildEventFormData(data, imageFile);
    const res = await fetchWithAuthFormData("/events", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: Event }>(res);
  },
  update: async (
    token: string,
    id: number,
    data: Record<string, unknown>,
    options?: { imageFile?: File | null; removeImage?: boolean }
  ) => {
    const fd = buildEventUpdateFormData(data, options?.imageFile, options?.removeImage);
    const res = await fetchWithAuthFormData(`/events/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data: Event }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/events/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
};

// ─── Actualités (news) ─────────────────────────────────────────────────────

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  author_avatar_url?: string | null;
  reading_time?: string | null;
  views_count?: number | null;
  /** Date/heure de publication (ISO) */
  published_at?: string | null;
  linked_event_id?: number | null;
  linked_event?: { id: number; name: string; title?: string | null } | null;
  custom_cta_label?: string | null;
  custom_cta_url?: string | null;
  comments_enabled?: boolean | null;
  reactions_enabled?: boolean | null;
  gallery_images?: string[] | null;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Offres (emploi, stage, bourse, bénévolat) ───────────────────────────────

export type OfferCategory = "emploi" | "stage" | "bourse" | "benevolat";

export interface Offer {
  id: number;
  title: string;
  organization: string;
  category: OfferCategory;
  location: string;
  type: string;
  deadline: string;
  description: string;
  requirements: string[];
  salary?: string | null;
  duration?: string | null;
  external_link: string | null;
  created_at?: string;
  updated_at?: string;
  is_published?: boolean;
  offer_category_id?: number | null;
  offer_type_id?: number | null;
  offer_category?: { id: number; name: string; code?: string | null };
  offer_type?: { id: number; name: string; code?: string | null };
}


// ─── Membres ───────────────────────────────────────────────────────────────

export interface AdminMemberCreateBody {
  firstname: string;
  lastname: string;
  sex: "homme" | "femme";
  phone: string;
  member_type_id: number;
  member_level_id: number;
  birth_date?: string | null;
  birth_place?: string | null;
  nationality_id?: number | null;
  identity_photo?: File | null;
  email?: string | null;
  address?: string | null;
  city_id?: number | null;
  district_id?: number | null;
  desired_service_department_id?: number | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  academic_level_id?: number | null;
  institution?: string | null;
  field_of_study?: string | null;
  profession?: string | null;
  company?: string | null;
  local_church?: string | null;
  pastor_name?: string | null;
  is_born_again?: boolean | null;
  is_baptized?: boolean | null;
  church_service_experience?: string | null;
  heard_about_source_id?: number | null;
  motivation?: string | null;
  identity_document?: File | null;
  pastor_attestation?: File | null;
  student_certificate?: File | null;
  accept_charter?: boolean;
  accept_payment?: boolean;
  service_domain_ids?: number[] | null;
}

export interface AdminMemberCreateFiles {
  identityPhoto?: File | null;
  identityDocument?: File | null;
  pastorAttestation?: File | null;
  studentCertificate?: File | null;
}

function buildAdminMemberFormData(
  body: AdminMemberCreateBody,
  files?: AdminMemberCreateFiles | File | null
): FormData {
  const identityPhoto = typeof files === "object" && files !== null && !(files instanceof File) ? files.identityPhoto : (files as File | null);
  const identityDocument = typeof files === "object" && files !== null && !(files instanceof File) ? files.identityDocument : null;
  const pastorAttestation = typeof files === "object" && files !== null && !(files instanceof File) ? files.pastorAttestation : null;
  const studentCertificate = typeof files === "object" && files !== null && !(files instanceof File) ? files.studentCertificate : null;

  const fd = new FormData();
  fd.append("firstname", String(body.firstname ?? "").trim());
  fd.append("lastname", String(body.lastname ?? "").trim());
  fd.append("sex", String(body.sex ?? "").trim());
  fd.append("phone", String(body.phone ?? "").trim());
  fd.append("member_type_id", String(Number(body.member_type_id) || 0));
  fd.append("member_level_id", String(Number(body.member_level_id) || 0));
  if (body.birth_date != null && body.birth_date !== "") {
    fd.append("birth_date", String(body.birth_date).trim());
  }
  if (body.birth_place != null && body.birth_place !== "") {
    fd.append("birth_place", String(body.birth_place).trim());
  }
  if (body.nationality_id != null && body.nationality_id !== 0) {
    fd.append("nationality_id", String(body.nationality_id));
  }
  const photo = identityPhoto ?? body.identity_photo;
  if (photo) {
    fd.append("identity_photo", photo, photo.name);
  }
  if (body.email != null && body.email !== "") {
    fd.append("email", String(body.email).trim());
  }
  if (body.address != null && body.address !== "") {
    fd.append("address", String(body.address).trim());
  }
  if (body.city_id != null && body.city_id !== 0) {
    fd.append("city_id", String(body.city_id));
  }
  if (body.district_id != null && body.district_id !== 0) {
    fd.append("district_id", String(body.district_id));
  }
  if (body.desired_service_department_id != null && body.desired_service_department_id !== 0) {
    fd.append("desired_service_department_id", String(body.desired_service_department_id));
  }
  if (body.emergency_contact_name != null && body.emergency_contact_name !== "") {
    fd.append("emergency_contact_name", String(body.emergency_contact_name).trim());
  }
  if (body.emergency_contact_phone != null && body.emergency_contact_phone !== "") {
    fd.append("emergency_contact_phone", String(body.emergency_contact_phone).trim());
  }
  if (body.academic_level_id != null && body.academic_level_id !== 0) {
    fd.append("academic_level_id", String(body.academic_level_id));
  }
  if (body.institution != null && body.institution !== "") {
    fd.append("institution", String(body.institution).trim());
  }
  if (body.field_of_study != null && body.field_of_study !== "") {
    fd.append("field_of_study", String(body.field_of_study).trim());
  }
  if (body.profession != null && body.profession !== "") {
    fd.append("profession", String(body.profession).trim());
  }
  if (body.company != null && body.company !== "") {
    fd.append("company", String(body.company).trim());
  }
  if (body.local_church != null && body.local_church !== "") {
    fd.append("local_church", String(body.local_church).trim());
  }
  if (body.pastor_name != null && body.pastor_name !== "") {
    fd.append("pastor_name", String(body.pastor_name).trim());
  }
  if (body.is_born_again != null) {
    fd.append("is_born_again", body.is_born_again ? "1" : "0");
  }
  if (body.is_baptized != null) {
    fd.append("is_baptized", body.is_baptized ? "1" : "0");
  }
  if (body.church_service_experience != null && body.church_service_experience !== "") {
    fd.append("church_service_experience", String(body.church_service_experience).trim());
  }
  if (body.heard_about_source_id != null && body.heard_about_source_id !== 0) {
    fd.append("heard_about_source_id", String(body.heard_about_source_id));
  }
  if (body.motivation != null && body.motivation !== "") {
    fd.append("motivation", String(body.motivation).trim());
  }
  const idDoc = identityDocument ?? body.identity_document;
  if (idDoc) {
    fd.append("identity_document", idDoc, idDoc.name);
  }
  const pastorAtt = pastorAttestation ?? body.pastor_attestation;
  if (pastorAtt) {
    fd.append("pastor_attestation", pastorAtt, pastorAtt.name);
  }
  const studentCert = studentCertificate ?? body.student_certificate;
  if (studentCert) {
    fd.append("student_certificate", studentCert, studentCert.name);
  }
  fd.append("accept_charter", body.accept_charter ? "1" : "0");
  fd.append("accept_payment", body.accept_payment ? "1" : "0");
  if (body.service_domain_ids != null && Array.isArray(body.service_domain_ids) && body.service_domain_ids.length > 0) {
    body.service_domain_ids.forEach((id) => fd.append("service_domain_ids[]", String(id)));
  }
  return fd;
}

export interface AdminMemberListItem {
  id: number;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  email?: string | null;
  phone?: string | null;
  member_type?: { id: number; label?: string; name?: string } | null;
  [key: string]: unknown;
}

/** ID du statut « Actif » en base (member_status_id: 1) */
export const ACTIVE_MEMBER_STATUS_ID = 1;

/** Indique si un membre est actif (member_status_id === 1, ou name/code contient "actif"/"validé") */
export function isMemberActive(member: AdminMemberListItem): boolean {
  const id = member.member_status_id ?? (member.member_status as { id?: number } | undefined)?.id;
  if (id != null && id === ACTIVE_MEMBER_STATUS_ID) return true;
  const ms = (member.member_status ?? member.memberStatus) as { name?: string; code?: string } | undefined;
  const name = (ms?.name ?? member.status ?? "").toString().toLowerCase();
  const code = (ms?.code ?? "").toString().toLowerCase();
  return /actif|validé|valide/.test(`${name} ${code}`.trim());
}

export const adminMembersApi = {
  list: async (
    token: string,
    params?: { page?: number; per_page?: number; search?: string }
  ) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.per_page) q.set("per_page", String(params.per_page));
    if (params?.search?.trim()) q.set("search", params.search.trim());
    const res = await fetchWithAuth(`/members${q.toString() ? `?${q}` : ""}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: AdminMemberListItem[]; meta?: { total?: number; last_page?: number }; total?: number; last_page?: number }>(res);
    const data = Array.isArray(raw.data) ? raw.data : [];
    const meta = raw.meta ?? {};
    return {
      data: data.map((m) => ({
        ...m,
        name: m.fullname ?? ([m.firstname, m.lastname].filter(Boolean).join(" ") || `Membre #${m.id}`),
      })),
      meta: { total: meta.total ?? raw.total ?? data.length, last_page: meta.last_page ?? raw.last_page ?? 1 },
    };
  },
  get: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/members/${id}`, { method: "GET" }, token);
    const raw = await handleResponse<{ data: AdminMemberListItem } | AdminMemberListItem>(res);
    const m = (typeof raw === "object" && raw !== null && "data" in raw ? (raw as { data: AdminMemberListItem }).data : raw) as AdminMemberListItem;
    return {
      ...m,
      name: m.fullname ?? ([m.firstname, m.lastname].filter(Boolean).join(" ") || `Membre #${m.id}`),
    };
  },
  create: async (token: string, body: AdminMemberCreateBody, files?: AdminMemberCreateFiles | File | null) => {
    const fd = buildAdminMemberFormData(body, files);
    const res = await fetchWithAuthFormData("/members", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data?: unknown }>(res);
  },
  update: async (token: string, id: number, body: AdminMemberCreateBody, files?: AdminMemberCreateFiles | File | null) => {
    const fd = buildAdminMemberFormData(body, files);
    fd.append("_method", "PUT");
    const res = await fetchWithAuthFormData(`/members/${id}`, fd, token, "POST");
    return handleResponse<{ status: string; message: string; data?: unknown }>(res);
  },
  delete: async (token: string, id: number) => {
    const res = await fetchWithAuth(`/members/${id}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
  },
  updateStatus: async (token: string, id: number, member_status_id: number | null) => {
    const res = await fetchWithAuth(`/members/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ member_status_id }),
    }, token);
    return handleResponse<{ status: string; message: string; data?: unknown }>(res);
  },
  downloadImportTemplate: async (token: string) => {
    const res = await fetchWithAuth("/members/import/template", { method: "GET" }, token);
    if (!res.ok) throw new Error("Impossible de télécharger le modèle");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modele-import-membres-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  },
  importFromExcel: async (token: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file, file.name);
    const res = await fetchWithAuthFormData("/members/import", fd, token, "POST");
    return handleResponse<{ status?: string; message?: string; data?: unknown; imported?: number; errors?: unknown[] }>(res);
  },
};

/** Création d'un membre depuis le formulaire public (sans auth admin, endpoint public) */
export async function createPublicMember(
  body: AdminMemberCreateBody,
  files?: AdminMemberCreateFiles | File | null
): Promise<{ status: string; message: string; data?: unknown }> {
  const fd = buildAdminMemberFormData(body, files);
  // Endpoint public dédié aux adhésions du site
  const res = await fetch(apiUrl("/site/members"), {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: fd,
  });
  return handleResponse<{ status: string; message: string; data?: unknown }>(res);
}

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

/** Résout l'URL d'une image membre (photo, documents) */
export function resolveMemberImageUrl(path: string | undefined): string {
  return resolveImageUrl(path);
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
  onActivityCallback?.();
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

// ─── Mot du président ──────────────────────────────────────────────────────

export interface PresidentMessage {
  id?: number;
  section_label?: string | null;
  badge?: string | null;
  title?: string | null;
  salutation?: string | null;
  message?: string | null;
  quote?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_published?: boolean;
  published?: boolean;
}

function normalizePresidentMessage(m: PresidentMessage): PresidentMessage & { imageUrl?: string } {
  const rawImage = m.image_url ?? m.image ?? "";
  const imageUrl = rawImage ? resolveImageUrl(rawImage) : "";
  return {
    ...m,
    imageUrl: imageUrl || undefined,
    is_published: m.is_published ?? m.published ?? false,
  };
}

function buildPresidentMessageFormData(
  body: {
    sectionLabel: string;
    badge: string;
    title: string;
    salutation: string;
    message: string;
    quote: string;
    publish: boolean;
  },
  imageFile?: File | null
): FormData {
  const fd = new FormData();
  fd.append("section_label", String(body.sectionLabel ?? "").trim());
  fd.append("badge", String(body.badge ?? "").trim());
  fd.append("title", String(body.title ?? "").trim());
  fd.append("salutation", String(body.salutation ?? "").trim());
  fd.append("message", String(body.message ?? "").trim());
  fd.append("quote", String(body.quote ?? "").trim());
  fd.append("publish", body.publish ? "1" : "0");
  if (imageFile) {
    fd.append("image", imageFile, imageFile.name);
  }
  return fd;
}

export const presidentMessageApi = {
  get: async (token: string) => {
    const res = await fetchWithAuth("/president-message", { method: "GET" }, token);
    const raw = await handleResponse<unknown>(res);
    const data = (raw as { data?: PresidentMessage }).data ?? (raw as PresidentMessage);
    return { data: data ? normalizePresidentMessage(data) : null };
  },
  create: async (
    token: string,
    body: Parameters<typeof buildPresidentMessageFormData>[0],
    imageFile?: File | null
  ) => {
    const fd = buildPresidentMessageFormData(body, imageFile);
    const res = await fetchWithAuthFormData("/president-message", fd, token, "POST");
    const data = await handleResponse<{ status: string; message: string; data?: PresidentMessage }>(res);
    return {
      ...data,
      data: data.data ? normalizePresidentMessage(data.data) : undefined,
    };
  },
};

// ─── Histoire ──────────────────────────────────────────────────────────────

export interface HistorySection {
  id?: number;
  section_label?: string | null;
  title?: string | null;
  content?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_published?: boolean;
  published?: boolean;
}

function normalizeHistorySection(h: HistorySection): HistorySection & { imageUrl?: string } {
  const rawImage = h.image_url ?? h.image ?? "";
  const imageUrl = rawImage ? resolveImageUrl(rawImage) : "";
  return {
    ...h,
    imageUrl: imageUrl || undefined,
    is_published: h.is_published ?? h.published ?? false,
  };
}

function buildHistoryFormData(
  body: {
    sectionLabel: string;
    title: string;
    content: string;
    removeImage?: boolean;
    publish: boolean;
  },
  imageFile?: File | null
): FormData {
  const fd = new FormData();
  fd.append("section_label", String(body.sectionLabel ?? "").trim());
  fd.append("title", String(body.title ?? "").trim());
  fd.append("content", String(body.content ?? "").trim());
  fd.append("remove_image", body.removeImage ? "1" : "0");
  fd.append("publish", body.publish ? "1" : "0");
  if (imageFile) {
    fd.append("image", imageFile, imageFile.name);
  }
  return fd;
}

export const historySectionApi = {
  get: async (token: string) => {
    const res = await fetchWithAuth("/history", { method: "GET" }, token);
    const raw = await handleResponse<unknown>(res);
    const data = (raw as { data?: HistorySection }).data ?? (raw as HistorySection);
    return { data: data ? normalizeHistorySection(data) : null };
  },
  create: async (
    token: string,
    body: Parameters<typeof buildHistoryFormData>[0],
    imageFile?: File | null
  ) => {
    const fd = buildHistoryFormData(body, imageFile);
    const res = await fetchWithAuthFormData("/history", fd, token, "POST");
    const data = await handleResponse<{ status: string; message: string; data?: HistorySection }>(res);
    return {
      ...data,
      data: data.data ? normalizeHistorySection(data.data) : undefined,
    };
  },
};

// ─── Notre devise (Connaître, Aimer, Servir) ──────────────────────────────

export interface DevisePillar {
  icon: string;
  title: string;
  description: string;
}

export interface DeviseSection {
  id?: number;
  section_label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  quote?: string | null;
  pillars?: DevisePillar[] | null;
  is_published?: boolean;
  published?: boolean;
}

export const deviseSectionApi = {
  get: async (token: string) => {
    const res = await fetchWithAuth("/motto", { method: "GET" }, token);
    const raw = await handleResponse<unknown>(res);
    const data = (raw as { data?: DeviseSection }).data ?? (raw as DeviseSection);
    if (data) {
      data.is_published = data.is_published ?? (data as { published?: boolean }).published ?? false;
    }
    return { data: data ?? null };
  },
  save: async (
    token: string,
    body: {
      section_label: string;
      title: string;
      subtitle: string;
      quote: string;
      pillars: DevisePillar[];
      publish: boolean;
    }
  ) => {
    const res = await fetchWithAuth(
      "/motto",
      {
        method: "POST",
        body: JSON.stringify({
          section_label: String(body.section_label ?? "").trim(),
          title: String(body.title ?? "").trim(),
          subtitle: String(body.subtitle ?? "").trim(),
          quote: String(body.quote ?? "").trim(),
          pillars: body.pillars,
          publish: body.publish ? 1 : 0,
        }),
      },
      token
    );
    return handleResponse<{ status: string; message: string; data?: DeviseSection }>(res);
  },
};

// ─── Vision, Mission & Valeurs ─────────────────────────────────────────────

export interface VisionMissionValuesSection {
  id?: number;
  section_label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  vision?: string | null;
  mission?: string | null;
  valeurs?: string | null;
  is_published?: boolean;
  published?: boolean;
}

export const visionMissionValuesApi = {
  get: async (token: string) => {
    const res = await fetchWithAuth("/vision-mission-values", { method: "GET" }, token);
    const raw = await handleResponse<unknown>(res);
    const data = (raw as { data?: VisionMissionValuesSection }).data ?? (raw as VisionMissionValuesSection);
    if (data) {
      const anyData = data as unknown as {
        vision_text?: string | null;
        mission_text?: string | null;
        values_text?: string | null;
        published?: boolean;
      };
      if (anyData.vision_text != null && data.vision == null) data.vision = anyData.vision_text;
      if (anyData.mission_text != null && data.mission == null) data.mission = anyData.mission_text;
      if (anyData.values_text != null && data.valeurs == null) data.valeurs = anyData.values_text;
      data.is_published = data.is_published ?? anyData.published ?? false;
    }
    return { data: data ?? null };
  },
  save: async (
    token: string,
    body: {
      section_label: string;
      title: string;
      subtitle: string;
      vision: string;
      mission: string;
      valeurs: string;
      publish: boolean;
    }
  ) => {
    const res = await fetchWithAuth(
      "/vision-mission-values",
      {
        method: "POST",
        body: JSON.stringify({
          section_label: String(body.section_label ?? "").trim(),
          title: String(body.title ?? "").trim(),
          subtitle: String(body.subtitle ?? "").trim(),
          vision_text: String(body.vision ?? "").trim(),
          mission_text: String(body.mission ?? "").trim(),
          values_text: String(body.valeurs ?? "").trim(),
          publish: body.publish ? 1 : 0,
        }),
      },
      token
    );
    return handleResponse<{ status: string; message: string; data?: VisionMissionValuesSection }>(res);
  },
};

// ─── Notre organisation ────────────────────────────────────────────────────

export interface OrganisationCard {
  title: string;
  description: string;
}

export interface OrganisationSection {
  id?: number;
  section_label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  cards?: OrganisationCard[] | null;
  is_published?: boolean;
  published?: boolean;
}

export const organisationSectionApi = {
  get: async (token: string) => {
    const res = await fetchWithAuth("/organization", { method: "GET" }, token);
    const raw = await handleResponse<unknown>(res);
    const data = (raw as { data?: OrganisationSection }).data ?? (raw as OrganisationSection);
    if (data) {
      data.is_published = data.is_published ?? (data as { published?: boolean }).published ?? false;
    }
    return { data: data ?? null };
  },
  save: async (
    token: string,
    body: {
      section_label: string;
      title: string;
      subtitle: string;
      cards: OrganisationCard[];
      publish: boolean;
    }
  ) => {
    const res = await fetchWithAuth(
      "/organization",
      {
        method: "POST",
        body: JSON.stringify({
          section_label: String(body.section_label ?? "").trim(),
          title: String(body.title ?? "").trim(),
          subtitle: String(body.subtitle ?? "").trim(),
          cards: body.cards,
          publish: body.publish ? 1 : 0,
        }),
      },
      token
    );
    return handleResponse<{ status: string; message: string; data?: OrganisationSection }>(res);
  },
};

// ─── Documents officiels ───────────────────────────────────────────────────

export interface OfficialDocument {
  id?: number;
  title: string;
  description: string;
  file_url?: string | null;
}

export interface DocumentsSection {
  id?: number;
  section_label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  documents?: OfficialDocument[] | null;
  is_published?: boolean;
  published?: boolean;
}

export const documentsSectionApi = {
  get: async (token: string) => {
    const res = await fetchWithAuth("/documents", { method: "GET" }, token);
    const raw = await handleResponse<unknown>(res);
    const data = (raw as { data?: DocumentsSection }).data ?? (raw as DocumentsSection);
    if (data) {
      data.is_published = data.is_published ?? (data as { published?: boolean }).published ?? false;
    }
    return { data: data ?? null };
  },
  save: async (
    token: string,
    body: {
      section_label: string;
      title: string;
      subtitle: string;
      documents: { title: string; description: string }[];
      publish: boolean;
    },
    files?: (File | null)[]
  ) => {
    const fd = new FormData();
    fd.append("section_label", String(body.section_label ?? "").trim());
    fd.append("title", String(body.title ?? "").trim());
    fd.append("subtitle", String(body.subtitle ?? "").trim());
    fd.append("publish", body.publish ? "1" : "0");
    body.documents.forEach((doc, i) => {
      fd.append(`documents[${i}][title]`, doc.title.trim());
      fd.append(`documents[${i}][description]`, doc.description.trim());
      if (files && files[i]) {
        fd.append(`documents[${i}][file]`, files[i] as File);
      }
    });
    const res = await fetchWithAuthFormData("/documents", fd, token, "POST");
    return handleResponse<{ status: string; message: string; data?: DocumentsSection }>(res);
  },
  delete: async (token: string, docId: number) => {
    const res = await fetchWithAuth(`/documents/${docId}`, { method: "DELETE" }, token);
    return handleResponse<{ status: string; message: string }>(res);
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

// ——— Formulaire de contact (public) ———

export interface ContactMessagePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Envoi d'un message depuis le formulaire de contact (public, sans auth) */
export async function submitContactMessage(payload: ContactMessagePayload): Promise<{ status: string; message: string; data?: ContactMessage }> {
  const res = await fetch(apiUrl("/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ status: string; message: string; data?: ContactMessage }>(res);
}

/** API admin : messages du formulaire de contact */
export const contactMessagesApi = {
  list: async (
    token: string,
    params?: { page?: number; per_page?: number; unread_only?: boolean }
  ): Promise<{ data: ContactMessage[]; meta?: { total?: number; current_page?: number; last_page?: number } }> => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    if (params?.unread_only) sp.set("unread_only", "1");
    const q = sp.toString();
    const res = await fetchWithAuth(`/contact-messages${q ? `?${q}` : ""}`, { method: "GET" }, token);
    const raw = await res.json();
    if (!res.ok) throw (raw as ApiError);
    const payload = (raw as { data?: { data?: ContactMessage[]; meta?: { total?: number; current_page?: number; last_page?: number } } }).data;
    const list = Array.isArray(payload?.data) ? payload.data : [];
    const meta = payload?.meta;
    return { data: list, meta };
  },
  get: async (token: string, id: number): Promise<ContactMessage> => {
    const res = await fetchWithAuth(`/contact-messages/${id}`, { method: "GET" }, token);
    const raw = await res.json();
    if (!res.ok) throw (raw as ApiError);
    const body = raw as { data?: ContactMessage };
    return body.data ?? (raw as ContactMessage);
  },
  markRead: async (token: string, id: number): Promise<ContactMessage> => {
    const res = await fetchWithAuth(`/contact-messages/${id}/read`, { method: "PATCH" }, token);
    const raw = await res.json();
    if (!res.ok) throw (raw as ApiError);
    const body = raw as { data?: ContactMessage };
    return body.data ?? (raw as ContactMessage);
  },
};

// ——— Informations de contact (page contact) ———

export interface ContactInfoRegional {
  region: string;
  contact?: string;
  email?: string;
}

export interface ContactInfo {
  id: number;
  phone: string | null;
  email: string | null;
  address: string | null;
  map_embed_url: string | null;
  hours_mon_fri: string | null;
  hours_saturday: string | null;
  hours_sunday: string | null;
  regional_contacts: ContactInfoRegional[];
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Informations de contact publiées (public, pour la page contact) */
export async function fetchContactInfoPublished(): Promise<ContactInfo | null> {
  try {
    const res = await fetch(apiUrl("/contact-info/published"), { method: "GET", headers: { Accept: "application/json" } });
    const raw = await res.json();
    if (!res.ok) return null;
    const data = (raw as { data?: ContactInfo }).data ?? (raw as ContactInfo);
    return data ?? null;
  } catch {
    return null;
  }
}

/** API admin : informations de contact (édition) */
export const contactInfoApi = {
  get: async (token: string): Promise<ContactInfo> => {
    const res = await fetchWithAuth("/contact-info", { method: "GET" }, token);
    const raw = await res.json();
    if (!res.ok) throw (raw as ApiError);
    const body = raw as { data?: ContactInfo };
    return body.data ?? (raw as ContactInfo);
  },
  save: async (token: string, data: Partial<ContactInfo>): Promise<ContactInfo> => {
    const res = await fetchWithAuth("/contact-info", {
      method: "PUT",
      body: JSON.stringify(data),
    }, token);
    const raw = await res.json();
    if (!res.ok) throw (raw as ApiError);
    const body = raw as { data?: ContactInfo };
    return body.data ?? (raw as ContactInfo);
  },
};

/** Handler pour rafraîchir le token en cas de 401. Retourne le nouveau token ou null. */
let refreshTokenHandler: (() => Promise<string | null>) | null = null;
let onActivityCallback: (() => void) | null = null;

export function setRefreshTokenHandler(handler: (() => Promise<string | null>) | null) {
  refreshTokenHandler = handler;
}

/** Permet à AuthContext de notifier une activité lors des requêtes API */
export function setOnApiActivity(cb: (() => void) | null) {
  onActivityCallback = cb;
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

  onActivityCallback?.();
  let res = await doFetch(token);

  if (res.status === 401 && refreshTokenHandler) {
    refreshPromise = refreshPromise ?? refreshTokenHandler();
    const newToken = await refreshPromise;
    refreshPromise = null;
    if (newToken) {
      onActivityCallback?.();
      res = await doFetch(newToken);
    }
  }

  return res;
}
