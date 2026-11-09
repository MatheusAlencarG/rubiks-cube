import React, { useContext } from 'react';
import { Context } from '../Contexts/GeneralConfigContext/Context';
import DOMPurify from 'dompurify';

export function RichText({ value }: { value: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(value, {
          ALLOWED_TAGS: ['strong', 'b', 'em', 'i', 'br', 'p', 'ul', 'ol', 'li'],
          ALLOWED_ATTR: [],
        }),
      }}
    />
  );
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
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center p-5 text-center"
      role={error ? 'alert' : 'status'}
    >
      <p>
        {error
          ? en
            ? 'Unable to load content.'
            : 'Não foi possível carregar o conteúdo.'
          : loading
            ? en
              ? 'Loading…'
              : 'Carregando…'
            : empty
              ? en
                ? 'No published content for this language.'
                : 'Nenhum conteúdo publicado neste idioma.'
              : ''}
      </p>
      {!loading && (
        <button className="app-button" onClick={() => retry()}>
          {en ? 'Try again' : 'Tentar novamente'}
        </button>
      )}
    </div>
  );
}
