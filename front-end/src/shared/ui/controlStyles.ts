const buttonBase =
  'cursor-pointer rounded-lg border border-solid border-accent px-3 py-2 text-sm font-semibold transition-colors [font-family:inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50';

export const buttonClass =
  buttonBase +
  ' bg-canvas text-on-canvas hover:bg-accent hover:text-on-accent disabled:hover:bg-canvas disabled:hover:text-on-canvas';

export const primaryButtonClass =
  buttonBase + ' bg-accent text-on-accent enabled:hover:bg-canvas enabled:hover:text-on-canvas';

export const inputClass =
  'box-border block w-full rounded-lg border border-solid border-detail bg-canvas px-2 py-2 text-sm text-on-canvas [font-family:inherit] placeholder:text-muted-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export const compactButtonClass = buttonClass + ' !px-2 !py-1 !text-xs';
export const compactInputClass = inputClass + ' !px-2 !py-1 !text-xs';
