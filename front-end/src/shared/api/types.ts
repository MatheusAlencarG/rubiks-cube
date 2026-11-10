export interface Document {
  documentId: string;
}
export interface Collection<T> {
  data: T[];
  meta: { pagination: { page: number; pageCount: number; total: number } };
}
