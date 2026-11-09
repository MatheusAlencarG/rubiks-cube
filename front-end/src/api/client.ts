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
  try {
    const response = await fetch(`${STRAPI_URL}/api${route}`, {
      method: options.method || 'GET',
      signal: abort.signal,
      headers: {
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
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
    const response = await api<Collection<T>>(
      `/${resource}?pagination[pageSize]=100&pagination[page]=${page}${query ? `&${query}` : ''}`,
      { token }
    );
    results.push(...response.data);
    if (page >= response.meta.pagination.pageCount) return results;
  }
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
  return (
    await api<{ data: T }>(
      `/${resource}${documentId ? `/${encodeURIComponent(documentId)}` : ''}`,
      {
        token,
        method: documentId ? 'PUT' : 'POST',
        body: { data },
      }
    )
  ).data;
}
