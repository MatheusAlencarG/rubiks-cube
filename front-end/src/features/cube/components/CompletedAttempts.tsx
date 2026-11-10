import { compactButtonClass } from '../../../shared/ui/controlStyles';
import type { Collection } from '../../../shared/api/types';
import type { Attempt } from '../model/cubeTypes';
import CollectionPagination from './CollectionPagination';

interface CompletedAttemptsProps {
  en: boolean;
  collection?: Collection<Attempt>;
  loading: boolean;
  disabled: boolean;
  canRecord: boolean;
  onPageChange: (page: number) => void;
  onRecord: () => void;
  onDelete: (documentId: string) => void;
}

export default function CompletedAttempts({
  en,
  collection,
  loading,
  disabled,
  canRecord,
  onPageChange,
  onRecord,
  onDelete,
}: CompletedAttemptsProps) {
  const { page = 1, pageCount = 0 } = collection?.meta.pagination ?? {};

  return (
    <section className="rounded-lg border border-solid border-detail bg-canvas p-3 text-on-canvas lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-semibold">
          {en ? 'Completed attempts' : 'Tentativas concluídas'}
        </h3>
        <button
          type="button"
          className={compactButtonClass}
          disabled={!canRecord}
          onClick={onRecord}
        >
          {en ? 'Record solved attempt' : 'Registrar tentativa resolvida'}
        </button>
      </div>

      {loading && <p role="status">{en ? 'Loading attempts…' : 'Carregando tentativas…'}</p>}
      {collection?.data.map(attempt => (
        <div
          key={attempt.documentId}
          className="mt-2 flex flex-wrap items-center justify-between gap-2 border-0 border-t border-solid border-detail pt-2 text-xs"
        >
          <div className="flex flex-wrap gap-2">
            <strong>{(attempt.durationMs / 1000).toFixed(2)} s</strong>
            <time dateTime={attempt.completedAt} className="text-muted-ink">
              {new Date(attempt.completedAt).toLocaleString(en ? 'en-US' : 'pt-BR')}
            </time>
          </div>
          <button
            type="button"
            className={compactButtonClass}
            disabled={disabled}
            onClick={() => onDelete(attempt.documentId)}
          >
            {en ? 'Delete attempt' : 'Excluir tentativa'}
          </button>
        </div>
      ))}
      <CollectionPagination
        en={en}
        label={en ? 'Completed attempts pages' : 'Páginas de tentativas concluídas'}
        page={page}
        pageCount={pageCount}
        disabled={disabled || loading}
        onPageChange={onPageChange}
      />
    </section>
  );
}
