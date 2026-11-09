import useSWR from 'swr';
import { useAuth } from '../Contexts/AuthContext';
import { useContext } from 'react';
import { Context } from '../Contexts/GeneralConfigContext/Context';
import { listAll } from './client';
import type { Tutorial } from './types';

export function usePrivateCollection<T>(resource: string, query = '') {
  const { token, user } = useAuth();
  return useSWR<T[]>(
    token && user ? [resource, token, query] : null,
    ([name, jwt, filter]: string[]) => listAll<T>(name, jwt, filter),
    { shouldRetryOnError: false }
  );
}
export function useTutorials() {
  const { currentLanguage } = useContext(Context).language;
  const locale = currentLanguage === 'pt-br' ? 'pt-BR' : 'en-US';
  return useSWR(['tutorials', locale], ([, language]: string[]) =>
    listAll<Tutorial>('tutorials', null, `locale=${language}&sort[0]=displayOrder:asc`)
  );
}
