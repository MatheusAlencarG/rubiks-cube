import React, { useEffect, useRef, useState } from 'react';
import { Check, Pencil, Play, Trash2, X } from 'lucide-react';

import type { Collection, SavedGame } from '../api/types';
import { countManualMoves } from '../cube/session';
import CollectionPagination from './CollectionPagination';
import IconButton from './IconButton';
import { compactInputClass } from './controlStyles';

interface SavedGamesProps {
  en: boolean;
  collection?: Collection<SavedGame>;
  loading: boolean;
  disabled: boolean;
  resumeDisabled: boolean;
  onPageChange: (page: number) => void;
  onRename: (game: SavedGame, name: string) => Promise<boolean>;
  onResume: (game: SavedGame) => void;
  onDelete: (game: SavedGame) => void;
}

const cellClass = 'px-2 py-2 align-middle';

export default function SavedGames({
  en,
  collection,
  loading,
  disabled,
  resumeDisabled,
  onPageChange,
  onRename,
  onResume,
  onDelete,
}: SavedGamesProps) {
  const title = en ? 'Saved games' : 'Partidas salvas';
  const games = collection?.data;
  const { page = 1, pageCount = 0, total = 0 } = collection?.meta.pagination ?? {};

  return (
    <section className="flex min-w-0 flex-col rounded-lg border border-solid border-gray-500/40 bg-canvas p-3 text-on-canvas">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-semibold">{title}</h3>
        {collection && (
          <span className="whitespace-nowrap text-xs opacity-75">
            {total} {en ? (total === 1 ? 'game' : 'games') : total === 1 ? 'partida' : 'partidas'}
          </span>
        )}
      </div>

      {loading && <p role="status">{en ? 'Loading games…' : 'Carregando partidas…'}</p>}
      {total === 0 && games?.length === 0 && (
        <p className="mb-0">{en ? 'No saved games yet.' : 'Nenhuma partida salva ainda.'}</p>
      )}

      {Boolean(games?.length) && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[285px] border-collapse text-left text-xs">
            <caption className="sr-only">{title}</caption>
            <thead className="bg-surface text-ink">
              <tr>
                <th scope="col" className={cellClass}>
                  {en ? 'Name' : 'Nome'}
                </th>
                <th scope="col" className={cellClass}>
                  {en ? 'Time' : 'Tempo'}
                </th>
                <th scope="col" className={cellClass}>
                  {en ? 'Moves' : 'Movimentos'}
                </th>
                <th scope="col" className={cellClass}>
                  {en ? 'Actions' : 'Ações'}
                </th>
              </tr>
            </thead>
            <tbody>
              {games?.map(game => (
                <SavedGameRow
                  key={game.documentId}
                  game={game}
                  en={en}
                  disabled={disabled}
                  resumeDisabled={resumeDisabled}
                  onRename={onRename}
                  onResume={onResume}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-auto">
        <CollectionPagination
          en={en}
          label={en ? 'Saved games pages' : 'Páginas de partidas salvas'}
          page={page}
          pageCount={pageCount}
          disabled={disabled || loading}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}

type SavedGameRowProps = Pick<
  SavedGamesProps,
  'en' | 'disabled' | 'resumeDisabled' | 'onRename' | 'onResume' | 'onDelete'
> & {
  game: SavedGame;
};

function SavedGameRow({
  game,
  en,
  disabled,
  resumeDisabled,
  onRename,
  onResume,
  onDelete,
}: SavedGameRowProps) {
  const [editing, setEditing] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      nameInput.current?.focus();
      nameInput.current?.select();
    }
  }, [editing]);

  async function saveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get('name') ?? '').trim();

    if (name === game.name || (await onRename(game, name))) setEditing(false);
  }

  return (
    <tr className="border-0 border-t border-solid border-gray-500/40">
      <th
        scope="row"
        className={cellClass + ' w-full break-words font-medium [overflow-wrap:anywhere]'}
      >
        {editing ? (
          <form className="flex min-w-[110px] flex-wrap gap-1" onSubmit={saveName}>
            <input
              ref={nameInput}
              className={compactInputClass}
              name="name"
              aria-label={en ? 'Game name' : 'Nome da partida'}
              defaultValue={game.name}
              maxLength={80}
              pattern={'.*\\S.*'}
              required
              disabled={disabled}
            />
            <IconButton
              icon={Check}
              label={en ? 'Save name' : 'Salvar nome'}
              type="submit"
              disabled={disabled}
            />
            <IconButton
              icon={X}
              label={en ? 'Cancel' : 'Cancelar'}
              disabled={disabled}
              onClick={() => setEditing(false)}
            />
          </form>
        ) : (
          game.name
        )}
      </th>
      <td className={cellClass + ' whitespace-nowrap tabular-nums'}>
        {formatGameTime(game.elapsedMs, en)}
      </td>
      <td className={cellClass + ' text-center tabular-nums'}>{countManualMoves(game.moves)}</td>
      <td className={cellClass}>
        <div className="flex gap-1">
          <IconButton
            icon={Play}
            label={en ? 'Resume' : 'Retomar'}
            disabled={disabled || resumeDisabled}
            onClick={() => onResume(game)}
          />
          <IconButton
            icon={Pencil}
            label={en ? 'Rename' : 'Renomear'}
            disabled={disabled || editing}
            onClick={() => setEditing(true)}
          />
          <IconButton
            icon={Trash2}
            label={en ? 'Delete game' : 'Excluir partida'}
            disabled={disabled}
            onClick={() => onDelete(game)}
          />
        </div>
      </td>
    </tr>
  );
}

function formatGameTime(elapsedMs: number, en: boolean) {
  const totalSeconds = Math.round(elapsedMs / 10) / 100;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formatted = seconds.toLocaleString(en ? 'en-US' : 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return minutes ? minutes + ' min ' + formatted + ' s' : formatted + ' s';
}
