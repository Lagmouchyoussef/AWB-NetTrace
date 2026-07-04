export interface DataTableColumn<T> {
  key: string;
  headerKey: string;
  cell: (row: T) => string;
  sortable?: boolean;
}
