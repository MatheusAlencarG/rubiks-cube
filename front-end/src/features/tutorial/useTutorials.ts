import { useContext } from 'react';
import useSWR from 'swr';
import { PreferencesContext } from '../preferences/PreferencesContext';
import { listAll } from '../../shared/api/strapiClient';
import type { Tutorial } from './tutorialTypes';

export function useTutorials() {
  const { currentLanguage } = useContext(PreferencesContext).language;
  const locale = currentLanguage === 'pt-br' ? 'pt-BR' : 'en-US';
  return useSWR(['tutorials', locale], ([, language]: string[]) =>
    listAll<Tutorial>('tutorials', null, `locale=${language}&sort[0]=displayOrder:asc`)
  );
}
