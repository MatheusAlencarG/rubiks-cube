import useSWR from 'swr';
import { useAuth } from '../Contexts/AuthContext';
import { useContext } from 'react';
import { Context } from '../Contexts/GeneralConfigContext/Context';
import { listAll, listPage } from './client';
import type { Collection, Tutorial } from './types';

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

export function useTutorials() {
  const { currentLanguage } = useContext(Context).language;
  const locale = currentLanguage === 'pt-br' ? 'pt-BR' : 'en-US';
  return useSWR(['tutorials', locale], ([, language]: string[]) =>
    listAll<Tutorial>('tutorials', null, `locale=${language}&sort[0]=displayOrder:asc`)
  );
}
