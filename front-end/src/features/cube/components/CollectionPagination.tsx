import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import IconButton from '../../../shared/ui/IconButton';

interface CollectionPaginationProps {
  en: boolean;
  label: string;
  page: number;
  pageCount: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

export default function CollectionPagination({
  en,
  label,
  page,
  pageCount,
  disabled,
  onPageChange,
}: CollectionPaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={label}
      className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs"
    >
      <IconButton
        icon={ChevronLeft}
        label={en ? 'Previous' : 'Anterior'}
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      />
      <span aria-live="polite">
        {en ? 'Page' : 'Página'} {page} {en ? 'of' : 'de'} {pageCount}
      </span>
      <IconButton
        icon={ChevronRight}
        label={en ? 'Next' : 'Próxima'}
        disabled={disabled || page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  );
}
