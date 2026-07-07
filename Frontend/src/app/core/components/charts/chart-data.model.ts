export interface ChartDatum {
  label: string;
  count: number;
  /** CSS chart color-role suffix, e.g. 'good' resolves to var(--chart-good). Defaults to 'series-1'. */
  colorRole?: string;
}
