import { useContext } from 'react';
import { Trophy } from 'lucide-react';
import useSWR from 'swr';

import { PreferencesContext } from '../preferences/PreferencesContext';
import { api } from '../../shared/api/strapiClient';
import { buttonClass } from '../../shared/ui/controlStyles';

interface RankingEntry {
  position: number;
  username: string;
  durationMs: number;
  moveCount: number;
}

export default function RankingPage() {
  const { currentLanguage } = useContext(PreferencesContext).language;
  const en = currentLanguage === 'en-us';
  const { data, error, isLoading, mutate } = useSWR('/ranking', route =>
    api<{ data: RankingEntry[] }>(route)
  );
  const players = data?.data ?? [];

  return (
    <section className="box-border min-h-0 w-full flex-1 overflow-y-auto px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="text-center">
          <h2 className="m-0 flex items-center justify-center gap-2 text-2xl font-bold">
            <Trophy className="h-6 w-6 text-accent" aria-hidden="true" />
            {en ? 'Player rankings' : 'Ranking de jogadores'}
          </h2>
          <p className="mb-0 text-sm text-muted-ink">
            {en
              ? 'Best eligible time per player on the 3×3 cube.'
              : 'Melhor tempo elegível por jogador no cubo 3×3.'}
          </p>
        </header>

        {error && (
          <div className="rounded-xl border border-solid border-detail bg-canvas p-4 text-center text-on-canvas">
            <p className="mt-0" role="alert">
              {en ? 'Unable to load the rankings.' : 'Não foi possível carregar o ranking.'}
            </p>
            <button className={buttonClass} type="button" onClick={() => void mutate()}>
              {en ? 'Try again' : 'Tentar novamente'}
            </button>
          </div>
        )}
        {isLoading && (
          <p className="text-center" role="status">
            {en ? 'Loading rankings…' : 'Carregando ranking…'}
          </p>
        )}
        {!isLoading && !error && players.length === 0 && (
          <p className="text-center text-muted-ink">
            {en
              ? 'No solves qualify for the rankings yet.'
              : 'Ainda não há resoluções elegíveis para o ranking.'}
          </p>
        )}
        {players.length > 0 && <RankingTable players={players} en={en} />}
      </div>
    </section>
  );
}

function RankingTable({ players, en }: { players: RankingEntry[]; en: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-solid border-detail">
      <table className="w-full border-collapse bg-canvas text-left text-sm text-on-canvas">
        <caption className="sr-only">{en ? 'Best solve times' : 'Melhores tempos'}</caption>
        <thead className="bg-surface text-ink">
          <tr>
            <th className="px-2 py-3 sm:px-3" scope="col">
              {en ? 'Rank' : 'Pos.'}
            </th>
            <th className="w-full px-2 py-3 sm:px-3" scope="col">
              {en ? 'Player' : 'Jogador'}
            </th>
            <th className="whitespace-nowrap px-2 py-3 text-right sm:px-3" scope="col">
              {en ? 'Best time' : 'Tempo'}
            </th>
            <th className="px-2 py-3 text-right sm:px-3" scope="col">
              {en ? 'Moves' : 'Movimentos'}
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map(({ position, username, durationMs, moveCount }) => (
            <tr key={position} className="border-0 border-t border-solid border-detail">
              <td
                className={`px-2 py-3 font-semibold sm:px-3 ${position <= 3 ? 'text-accent' : ''}`}
              >
                {position}
              </td>
              <th className="px-2 py-3 font-medium [overflow-wrap:anywhere] sm:px-3" scope="row">
                {username}
              </th>
              <td className="whitespace-nowrap px-2 py-3 text-right font-bold tabular-nums sm:px-3">
                <time dateTime={`PT${durationMs / 1000}S`}>{formatTime(durationMs, en)}</time>
              </td>
              <td className="whitespace-nowrap px-2 py-3 text-right tabular-nums sm:px-3">
                {moveCount?.toLocaleString(en ? 'en-US' : 'pt-BR') ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatTime(durationMs: number, en: boolean) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toLocaleString(en ? 'en-US' : 'pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
    minimumIntegerDigits: minutes ? 2 : 1,
  });

  return minutes ? `${minutes} min ${seconds} s` : `${seconds} s`;
}
