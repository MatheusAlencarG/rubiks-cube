import React, { useEffect, useState } from 'react';
import { CircleAlert, Info, TriangleAlert } from 'lucide-react';

const noticeStyles = {
  info: { icon: Info, colors: 'border-sky-400 bg-sky-950 text-sky-100' },
  warning: { icon: TriangleAlert, colors: 'border-amber-400 bg-amber-950 text-amber-100' },
  error: { icon: CircleAlert, colors: 'border-red-400 bg-red-950 text-red-100' },
};

interface GameNoticeProps {
  tone: keyof typeof noticeStyles;
  role?: 'alert' | 'status';
  children: React.ReactNode;
}

export function TimedGameNotice({
  durationMs,
  occurrence,
  ...notice
}: GameNoticeProps & { durationMs: number; occurrence: number | object }) {
  const [expiredOccurrence, setExpiredOccurrence] = useState<typeof occurrence>();

  useEffect(() => {
    const timeout = window.setTimeout(() => setExpiredOccurrence(occurrence), durationMs);
    return () => window.clearTimeout(timeout);
  }, [durationMs, occurrence]);

  return expiredOccurrence === occurrence ? null : <GameNotice {...notice} />;
}

export default function GameNotice({ tone, role, children }: GameNoticeProps) {
  const { icon: Icon, colors } = noticeStyles[tone];

  return (
    <div
      role={role}
      aria-live={role ? undefined : 'polite'}
      className={`box-border flex w-fit max-w-full items-center gap-2 rounded-md border border-solid px-3 py-2 text-xs ${colors}`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex min-w-0 flex-wrap items-center gap-2 break-words">{children}</div>
    </div>
  );
}
