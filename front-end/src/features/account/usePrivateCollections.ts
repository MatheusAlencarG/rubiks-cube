import useSWR from 'swr';
import { useAuth } from './AuthProvider';
import { listAll, listPage } from '../../shared/api/strapiClient';
import type { Collection } from '../../shared/api/types';

export function usePrivateCollection<T>(resource: string, query = '') {
  const { token, user } = useAuth();
  return useSWR<T[]>(
    token && user ? [resource, token, query] : null,
    ([name, jwt, filter]: string[]) => listAll<T>(name, jwt, filter),
    { shouldRetryOnError: false }
  );
}

export function usePrivatePage<T>(resource: string, page: number, pageSize: number, query = '') {
  const { token, user } = useAuth();
  const key = token && user ? ([resource, token, query, page, pageSize] as const) : null;

  return useSWR<Collection<T>>(key, () => listPage<T>(resource, page, pageSize, token, query), {
    shouldRetryOnError: false,
    dedupingInterval: 0,
  });
}
