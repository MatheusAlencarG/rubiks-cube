import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { CubeSession } from '../model/CubeSession';
import IconButton from '../../../shared/ui/IconButton';

interface GameTimerProps {
  session: CubeSession;
  en: boolean;
  disabled: boolean;
  onTogglePause: () => void;
}

export default function GameTimer({ session, en, disabled, onTogglePause }: GameTimerProps) {
  const [, tick] = useState(0);
  const { running, paused } = session;

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => tick(value => value + 1), 100);
    return () => window.clearInterval(interval);
  }, [running, session]);

  const label = paused
    ? en
      ? 'Resume timer'
      : 'Retomar cronômetro'
    : en
      ? 'Pause timer'
      : 'Pausar cronômetro';

  return (
    <div className="mx-auto mt-3 flex w-fit items-center gap-3 rounded-xl bg-canvas px-3 py-1 text-on-canvas">
      <span
        role="timer"
        aria-label={en ? 'Elapsed time' : 'Tempo decorrido'}
        className="text-3xl font-semibold tabular-nums leading-none sm:text-4xl"
      >
        {formatTimer(session.elapsed(), en)}
      </span>
      <IconButton
        icon={paused ? Play : Pause}
        label={label}
        disabled={disabled}
        onClick={onTogglePause}
      />
    </div>
  );
}

function formatTimer(elapsedMs: number, en: boolean) {
  const minutes = String(Math.floor(elapsedMs / 60000)).padStart(2, '0');
  const seconds = String(Math.floor(elapsedMs / 1000) % 60).padStart(2, '0');
  const tenths = Math.floor(elapsedMs / 100) % 10;

  return `${minutes}:${seconds}${en ? '.' : ','}${tenths}`;
}
