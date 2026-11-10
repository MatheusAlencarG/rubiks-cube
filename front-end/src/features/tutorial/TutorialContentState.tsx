import React, { useContext } from 'react';
import { buttonClass } from '../../shared/ui/controlStyles';
import { PreferencesContext } from '../preferences/PreferencesContext';
import DOMPurify from 'dompurify';

const move = "(?:['’]\\s*)?(?:[WASDQE]|🠻)(?:['’])?";
const tutorialCommands = new RegExp(
  `(\\b(?:movimento|move)\\s+)(${move})(?!\\w)|(^|[\\s:(])(${move}(?:\\s*,\\s*${move})+)(?!\\w)`,
  'gu'
);

function highlightTutorialCommands(root: HTMLElement) {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    if (node.parentElement?.closest('kbd')) continue;

    const matches = Array.from(node.data.matchAll(tutorialCommands));
    if (!matches.length) continue;

    const document = root.ownerDocument;
    const formatted = document.createDocumentFragment();
    let offset = 0;

    for (const match of matches) {
      const [, singlePrefix, single, sequencePrefix, sequence] = match;
      const start = (match.index ?? 0) + (singlePrefix ?? sequencePrefix).length;
      const end = start + (single ?? sequence).length;
      const command = document.createElement('kbd');

      command.textContent = node.data.slice(start, end);
      formatted.append(node.data.slice(offset, start), command);
      offset = end;
    }

    formatted.append(node.data.slice(offset));
    node.replaceWith(formatted);
  }
}

export function RichText({
  value,
  highlightMoves = false,
}: {
  value: string;
  highlightMoves?: boolean;
}) {
  const sanitized = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['strong', 'b', 'em', 'i', 'br', 'p', 'ul', 'ol', 'li', 'kbd'],
    ALLOWED_ATTR: [],
    RETURN_DOM_FRAGMENT: true,
  });
  const content = document.createElement('div');
  content.append(sanitized);

  if (highlightMoves) highlightTutorialCommands(content);

  return (
    <span
      className="[&_kbd]:font-bold [&_kbd]:text-accent [&_kbd]:[font-family:inherit]"
      dangerouslySetInnerHTML={{ __html: content.innerHTML }}
    />
  );
}

export default function TutorialContentState({
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
  const en = useContext(PreferencesContext).language.currentLanguage === 'en-us';
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
