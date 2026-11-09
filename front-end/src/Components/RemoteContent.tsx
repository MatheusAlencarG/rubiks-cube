import React, { useContext } from 'react';
import { buttonClass } from './controlStyles';
import { Context } from '../Contexts/GeneralConfigContext/Context';
import DOMPurify from 'dompurify';

export function RichText({ value }: { value: string }) {
  const html = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['strong', 'b', 'em', 'i', 'br', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function RemoteContent({
  loading,
  error,
  empty,
  retry,
}: {
  loading: boolean;
  error?: unknown;
  empty?: boolean;
  retry: () => unknown;
}) {
  const en = useContext(Context).language.currentLanguage === 'en-us';
  let message = '';

  if (error) {
    message = en ? 'Unable to load content.' : 'Não foi possível carregar o conteúdo.';
  } else if (loading) {
    message = en ? 'Loading…' : 'Carregando…';
  } else if (empty) {
    message = en
      ? 'No published content for this language.'
      : 'Nenhum conteúdo publicado neste idioma.';
  }

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center p-5 text-center"
      role={error ? 'alert' : 'status'}
    >
      <p>{message}</p>
      {!loading && (
        <button className={buttonClass} onClick={() => retry()}>
          {en ? 'Try again' : 'Tentar novamente'}
        </button>
      )}
    </div>
  );
}
