import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  type?: 'button' | 'submit';
  disabled: boolean;
  onClick?: () => void;
}

export default function IconButton({
  icon: Icon,
  label,
  type = 'button',
  disabled,
  onClick,
}: IconButtonProps) {
  return (
    <button
      type={type}
      className="inline-grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-md border border-solid border-accent bg-canvas p-0 text-on-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent enabled:hover:bg-accent enabled:hover:text-on-accent disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
