export interface R<T> {
  data: T;
  status: number;
}

export interface PagedResponse<T> {
  data: T[];
  meta: {
    total: number;
    offset: number;
    limit: number;
  };
}
