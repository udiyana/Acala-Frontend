import { useEffect, useMemo, useState } from "react";

export interface CmsContent {
  id: number;
  page: string;
  section: string;
  label: string | null;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image: string | null;
  cta_label: string | null;
  cta_url: string | null;
  metadata: Record<string, unknown> | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CmsContentPayload {
  page: string;
  section: string;
  label: string | null;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image: string | null;
  cta_label: string | null;
  cta_url: string | null;
  metadata: Record<string, unknown> | null;
  sort_order: number;
  is_published: boolean;
}

export interface CmsDataset {
  id: number;
  key: string;
  label: string;
  description: string | null;
  data: unknown;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CmsDatasetPayload {
  key: string;
  label: string;
  description: string | null;
  data: unknown;
  sort_order: number;
  is_published: boolean;
}

export interface CmsUser {
  id: number;
  name: string;
  email: string;
}

type CmsIndexResponse = {
  data: CmsContent[];
};

type CmsContentResponse = {
  data: CmsContent;
  message?: string;
};

type CmsDatasetIndexResponse = {
  data: CmsDataset[];
};

type CmsDatasetResponse = {
  data: CmsDataset;
  message?: string;
};

type CmsLoginResponse = {
  message: string;
  csrf_token: string;
  user: CmsUser;
};

type CmsLogoutResponse = {
  message: string;
  csrf_token: string;
};

type CmsMeResponse = {
  authenticated: boolean;
  user?: CmsUser;
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginCms(email: string, password: string): Promise<CmsUser> {
  const response = await fetch("/api/cms/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw await cmsError(response);
  }

  const payload = (await response.json()) as CmsLoginResponse;
  syncCsrfTokenFromResponse(response, payload.csrf_token);

  return payload.user;
}

export async function logoutCms(): Promise<void> {
  const response = await fetch("/api/cms/logout", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
  });

  if (!response.ok) {
    throw await cmsError(response);
  }

  const payload = (await response.json().catch(() => null)) as CmsLogoutResponse | null;
  syncCsrfTokenFromResponse(response, payload?.csrf_token);
}

export async function fetchCmsMe(): Promise<CmsMeResponse> {
  const response = await fetch("/api/cms/me", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  return (await response.json()) as CmsMeResponse;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function mapCmsContentsBySection(contents: CmsContent[]): Record<string, CmsContent> {
  return contents.reduce<Record<string, CmsContent>>((blocks, content) => {
    blocks[content.section] = content;
    return blocks;
  }, {});
}

type TextField = "label" | "eyebrow" | "title" | "subtitle" | "body" | "image" | "cta_label" | "cta_url";

export function cmsText(
  block: CmsContent | undefined,
  field: TextField,
  fallback: string,
): string {
  const value = block?.[field];

  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

export function cmsParagraphs(block: CmsContent | undefined, fallback: string[]): string[] {
  const body = cmsText(block, "body", "");

  if (!body) {
    return fallback;
  }

  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

// ─── CMS Page Hook ───────────────────────────────────────────────────────────

export function usePublishedCmsPage(page: string) {
  const [contents, setContents] = useState<CmsContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Increment this to trigger a re-fetch (e.g., on visibility change)
  const [fetchKey, setFetchKey] = useState(0);

  // Re-fetch when the browser tab becomes visible again so that
  // edits made in the CMS admin panel are immediately reflected.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setFetchKey((k) => k + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError(null);

    fetchPublishedCmsPage(page)
      .then((data) => {
        if (active) {
          setContents(data);
        }
      })
      .catch((fetchError: unknown) => {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to load CMS content.");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  // fetchKey triggers a re-fetch when the tab becomes visible
  }, [page, fetchKey]);

  const blocks = useMemo(() => mapCmsContentsBySection(contents), [contents]);

  return { blocks, contents, isLoading, error };
}

// ─── CMS Images Hook ─────────────────────────────────────────────────────────

/** key→{ path, alt } map returned by /api/cms/public-images */
type CmsImageMap = Record<string, { path: string; alt: string }>;

let _imageCache: CmsImageMap | null = null;

async function fetchPublishedCmsImages(): Promise<CmsImageMap> {
  if (_imageCache) return _imageCache;
  const response = await fetch("/api/cms/public-images", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) return {};
  const payload = (await response.json()) as { data: CmsImageMap };
  _imageCache = payload.data;
  return _imageCache;
}

/**
 * Returns the CMS-managed path and alt for a given image key.
 * Falls back to the provided static values if the CMS has no entry yet.
 */
export function cmsImg(
  images: CmsImageMap,
  key: string,
  fallbackPath: string,
  fallbackAlt = "",
): { src: string; alt: string } {
  const entry = images[key];
  return {
    src: entry?.path || fallbackPath,
    alt: entry?.alt || fallbackAlt,
  };
}

export function usePublishedCmsImages() {
  const [images, setImages] = useState<CmsImageMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        _imageCache = null; // bust cache on tab focus
        setFetchKey((k) => k + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchPublishedCmsImages()
      .then((data) => { if (active) setImages(data); })
      .catch(() => { /* silent – fall back to static paths */ })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [fetchKey]);

  return { images, isLoading };
}

// ─── API – Contents ──────────────────────────────────────────────────────────

export async function fetchPublishedCmsPage(page: string): Promise<CmsContent[]> {
  const response = await fetch(`/api/cms/public/${encodeURIComponent(page)}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw await cmsError(response);
  }

  const payload = (await response.json()) as CmsIndexResponse;
  return payload.data;
}

export async function fetchCmsContents(page?: string): Promise<CmsContent[]> {
  const search = page ? `?page=${encodeURIComponent(page)}` : "";
  const payload = await cmsRequest<CmsIndexResponse>(`/api/cms/contents${search}`, {});

  return payload.data;
}

export async function createCmsContent(data: CmsContentPayload): Promise<CmsContent> {
  const payload = await cmsRequest<CmsContentResponse>("/api/cms/contents", {
    method: "POST",
    data,
  });

  return payload.data;
}

export async function updateCmsContent(id: number, data: CmsContentPayload): Promise<CmsContent> {
  const payload = await cmsRequest<CmsContentResponse>(`/api/cms/contents/${id}`, {
    method: "PUT",
    data,
  });

  return payload.data;
}

export async function deleteCmsContent(id: number): Promise<void> {
  await cmsRequest(`/api/cms/contents/${id}`, { method: "DELETE" });
}

// ─── Image Library ───────────────────────────────────────────────────────────

export interface CmsImage {
  id: number;
  key: string;
  group: string;
  label: string;
  path: string;
  alt: string;
  created_at?: string;
  updated_at?: string;
}

type CmsImageIndexResponse = { data: CmsImage[] };
type CmsImageResponse = { data: CmsImage; message?: string };

export async function fetchCmsImages(): Promise<CmsImage[]> {
  const payload = await cmsRequest<CmsImageIndexResponse>('/api/cms/images', {});
  return payload.data;
}

export async function updateCmsImage(
  key: string,
  opts: { alt?: string; file?: File | null },
): Promise<CmsImage> {
  const formData = new FormData();
  if (opts.alt !== undefined) formData.append('alt', opts.alt);
  if (opts.file) formData.append('file', opts.file);

  const response = await fetch(`/api/cms/images/${encodeURIComponent(key)}`, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'X-CSRF-TOKEN': getCsrfToken(),
    },
    body: formData,
  });

  if (!response.ok) throw await cmsError(response);
  syncCsrfTokenFromResponse(response);
  const payload = (await response.json()) as CmsImageResponse;
  return payload.data;
}

// ─── API – Media ─────────────────────────────────────────────────────────────

export async function uploadCmsMedia(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/cms/media/upload", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
    body: formData,
  });

  if (!response.ok) {
    throw await cmsError(response);
  }

  syncCsrfTokenFromResponse(response);
  const data = await response.json();
  return data.url;
}

// ─── API – Datasets ──────────────────────────────────────────────────────────

export async function fetchCmsDatasets(): Promise<CmsDataset[]> {
  const payload = await cmsRequest<CmsDatasetIndexResponse>("/api/cms/datasets", {});

  return payload.data;
}

export async function createCmsDataset(data: CmsDatasetPayload): Promise<CmsDataset> {
  const payload = await cmsRequest<CmsDatasetResponse>("/api/cms/datasets", {
    method: "POST",
    data,
  });

  return payload.data;
}

export async function updateCmsDataset(id: number, data: CmsDatasetPayload): Promise<CmsDataset> {
  const payload = await cmsRequest<CmsDatasetResponse>(`/api/cms/datasets/${id}`, {
    method: "PUT",
    data,
  });

  return payload.data;
}

export async function deleteCmsDataset(id: number): Promise<void> {
  await cmsRequest(`/api/cms/datasets/${id}`, { method: "DELETE" });
}

// ─── API – Analytics ──────────────────────────────────────────────────────────

export interface CmsAnalyticsData {
  isConfigured: boolean;
  ga4: {
    users: number;
    usersTrend: string;
    pageviews: number;
    pageviewsTrend: string;
    topPages: { path: string; views: number; avgDuration: string }[];
  };
  gsc: {
    clicks: number;
    clicksTrend: string;
    impressions: number;
    impressionsTrend: string;
    topKeywords: { keyword: string; clicks: number; impressions: number; position: number }[];
  };
}

export async function fetchCmsAnalytics(): Promise<CmsAnalyticsData> {
  const payload = await cmsRequest<CmsAnalyticsData>("/api/cms/analytics", {});
  return payload;
}

// ─── Internal ────────────────────────────────────────────────────────────────

async function cmsRequest<T>(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    data?: CmsContentPayload | CmsDatasetPayload;
  },
): Promise<T> {
  const response = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
    body: options.data ? JSON.stringify(options.data) : undefined,
  });

  if (!response.ok) {
    throw await cmsError(response);
  }

  syncCsrfTokenFromResponse(response);

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? "";
}

function setCsrfToken(token?: string | null): void {
  if (!token) {
    return;
  }

  let meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "csrf-token";
    document.head.appendChild(meta);
  }

  meta.content = token;

  const axios = (window as typeof window & {
    axios?: { defaults?: { headers?: { common?: Record<string, string> } } };
  }).axios;

  if (axios?.defaults?.headers?.common) {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
  }
}

function syncCsrfTokenFromResponse(response: Response, fallbackToken?: string | null): void {
  setCsrfToken(response.headers.get("X-CSRF-TOKEN") ?? fallbackToken);
}

async function cmsError(response: Response): Promise<Error> {
  if (response.status === 419) {
    alert("Sesi Anda telah berakhir atau tidak valid (CSRF mismatch). Halaman akan dimuat ulang.");
    window.location.reload();
    return new Error("Sesi berakhir. Halaman dimuat ulang...");
  }

  const payload = await response.json().catch(() => null);

  if (payload && typeof payload.message === "string") {
    return new Error(payload.message);
  }

  if (payload && payload.errors) {
    const firstError = Object.values(payload.errors as Record<string, string[]>)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return new Error(firstError[0]);
    }
  }

  return new Error(`CMS request failed with status ${response.status}.`);
}
