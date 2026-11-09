import type { Collection } from './types';

export const STRAPI_URL = (process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337').replace(
  /\/+$/,
  ''
);

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export async function api<T>(
  route: string,
  options: { token?: string | null; method?: string; body?: unknown } = {}
): Promise<T> {
  const abort = new AbortController();
  const timeout = window.setTimeout(() => abort.abort(), 15000);
  const { body: payload } = options;
  const multipart = payload instanceof FormData;

  try {
    const response = await fetch(`${STRAPI_URL}/api${route}`, {
      method: options.method || 'GET',
      signal: abort.signal,
      headers: {
        ...(payload !== undefined && !multipart ? { 'Content-Type': 'application/json' } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: multipart ? payload : JSON.stringify(payload),
    });

    const body = response.status === 204 ? null : await response.json();
    if (!response.ok)
      throw new ApiError(response.status, body?.error?.message || `HTTP ${response.status}`);

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Não foi possível conectar ao servidor. / Unable to reach the server.');
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function listAll<T>(
  resource: string,
  token?: string | null,
  query = ''
): Promise<T[]> {
  const results: T[] = [];

  for (let page = 1; ; page++) {
    const response = await listPage<T>(resource, page, 100, token, query);

    results.push(...response.data);
    if (page >= response.meta.pagination.pageCount) return results;
  }
}

export function listPage<T>(
  resource: string,
  page: number,
  pageSize: number,
  token?: string | null,
  query = ''
) {
  return api<Collection<T>>(
    `/${resource}?pagination[pageSize]=${pageSize}&pagination[page]=${page}${query ? `&${query}` : ''}`,
    { token }
  );
}

export function mediaUrl(value: string) {
  const url = new URL(value, `${STRAPI_URL}/`);
  return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
}

export async function writeDocument<T>(
  resource: string,
  token: string,
  data: unknown,
  documentId?: string
) {
  const path = documentId ? `/${resource}/${encodeURIComponent(documentId)}` : `/${resource}`;
  const response = await api<{ data: T }>(path, {
    token,
    method: documentId ? 'PUT' : 'POST',
    body: { data },
  });

  return response.data;
}
