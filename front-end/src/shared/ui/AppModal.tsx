import React, { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface AppModalProps {
  title: string;
  closeLabel: string;
  trigger: ReactNode;
  triggerClass: string;
  panelClass: string;
  overlayClass?: string;
  keepMounted?: boolean;
  children: ReactNode;
}

export default function AppModal({
  title,
  closeLabel,
  trigger,
  triggerClass,
  panelClass,
  overlayClass = '',
  keepMounted = false,
  children,
}: AppModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const opener = triggerRef.current;
    closeButtonRef.current?.focus();

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        wrapDialogFocus(event, dialogRef.current);
      }
    }

    document.addEventListener('keydown', handleDialogKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDialogKeyDown);
      opener?.focus();
    };
  }, [isOpen]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) setIsOpen(false);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-label={title}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        {trigger}
      </button>

      {(isOpen || keepMounted) && (
        <div
          className={`fixed inset-0 z-50 items-center justify-center bg-black/50 ${overlayClass} ${isOpen ? 'flex' : 'hidden'}`}
          aria-hidden={!isOpen}
          data-app-modal-open={isOpen ? '' : undefined}
          onClick={handleBackdropClick}
        >
          <div
            ref={dialogRef}
            className={`relative overflow-auto rounded-[10px] border-2 border-solid border-accent bg-canvas text-center text-on-canvas ${panelClass}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute right-[10px] top-[10px] grid h-[30px] w-[30px] cursor-pointer place-items-center border-0 bg-transparent p-0 text-on-canvas"
              aria-label={closeLabel}
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            <h3 id={titleId} className="capitalize">
              {title}
            </h3>

            {children}
          </div>
        </div>
      )}
    </>
  );
}

function wrapDialogFocus(event: KeyboardEvent, dialog: HTMLDivElement) {
  const focusableElements = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]'
    )
  ).filter(element => !element.closest('[inert]'));

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const boundary = event.shiftKey ? first : last;
  const next = event.shiftKey ? last : first;

  if (document.activeElement === boundary || !dialog.contains(document.activeElement)) {
    event.preventDefault();
    next?.focus();
  }
}
