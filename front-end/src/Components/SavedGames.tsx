import React from 'react';
import type { SavedGame } from '../api/types';
interface SavedGamesProps {
  en: boolean;
  games?: SavedGame[];
  loading: boolean;
  disabled: boolean;
  onResume: (game: SavedGame) => void;
  onDelete: (game: SavedGame) => void;
}
export default function SavedGames({
  en,
  games,
  loading,
  disabled,
  onResume,
  onDelete,
}: SavedGamesProps) {
  return (
    <>
      <h3>{en ? 'Saved games' : 'Partidas salvas'}</h3>
      {loading && <p role="status">{en ? 'Loading…' : 'Carregando…'}</p>}
      {games?.length === 0 && <p>{en ? 'No saved games yet.' : 'Nenhuma partida salva ainda.'}</p>}
      {games?.map(game => (
        <div key={game.documentId} className="mb-2 flex flex-wrap items-center gap-2">
          <span>
            {game.name} · {(game.elapsedMs / 1000).toFixed(2)}s · {game.moves.length}{' '}
            {en ? 'moves' : 'movimentos'}
          </span>
          <button className="app-button" disabled={disabled} onClick={() => onResume(game)}>
            {en ? 'Resume' : 'Retomar'}
          </button>
          <button className="app-button" disabled={disabled} onClick={() => onDelete(game)}>
            {en ? 'Delete game' : 'Excluir partida'}
          </button>
        </div>
      ))}
    </>
  );
}
