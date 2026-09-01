import type { ReactNode } from 'react';
import type { LearningItem } from '@/lib/content/types';

/**
 * Generic, content-type-agnostic table component with two modes:
 *  - 'grid': a two-axis chart (e.g. the pinyin initial x final chart), cell
 *    content fully controlled by the caller via renderCell.
 *  - 'list': a flat column-configured table (for future flat modules like
 *    an HSK vocab list or a radicals index).
 *
 * New content types reuse this component as-is; only the props (axis
 * functions / column config) change.
 */

export interface TableViewGridProps<T extends LearningItem> {
  mode: 'grid';
  items: T[];
  rows: string[];
  columns: string[];
  rowLabel?: (row: string) => ReactNode;
  columnLabel?: (col: string) => ReactNode;
  getRowKey: (item: T) => string;
  getColKey: (item: T) => string;
  /** Whether (row, col) is a phonologically/grammatically valid combination
   * at all, independent of whether data has been authored for it yet. */
  isValidCombination?: (row: string, col: string) => boolean;
  renderCell: (cellItems: T[], row: string, col: string, valid: boolean) => ReactNode;
}

export interface TableViewListColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

export interface TableViewListProps<T extends LearningItem> {
  mode: 'list';
  items: T[];
  columns: TableViewListColumn<T>[];
  getRowId?: (item: T) => string;
}

export type TableViewProps<T extends LearningItem> = TableViewGridProps<T> | TableViewListProps<T>;

export function TableView<T extends LearningItem>(props: TableViewProps<T>) {
  if (props.mode === 'grid') return <GridTable {...props} />;
  return <ListTable {...props} />;
}

function GridTable<T extends LearningItem>({
  items,
  rows,
  columns,
  rowLabel,
  columnLabel,
  getRowKey,
  getColKey,
  isValidCombination,
  renderCell,
}: TableViewGridProps<T>) {
  const byCell = new Map<string, T[]>();
  for (const item of items) {
    const key = `${getRowKey(item)}::${getColKey(item)}`;
    const existing = byCell.get(key);
    if (existing) existing.push(item);
    else byCell.set(key, [item]);
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 border-b border-r border-neutral-200 bg-neutral-50 px-3 py-2 text-left font-medium text-neutral-500" />
            {columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-center font-medium text-neutral-500"
              >
                {columnLabel ? columnLabel(col) : col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <th className="sticky left-0 z-10 whitespace-nowrap border-r border-neutral-200 bg-neutral-50 px-3 py-2 text-left font-medium text-neutral-500">
                {rowLabel ? rowLabel(row) : row}
              </th>
              {columns.map((col) => {
                const cellItems = byCell.get(`${row}::${col}`) ?? [];
                const valid = isValidCombination ? isValidCombination(row, col) : true;
                return (
                  <td key={col} className="border-t border-neutral-100 px-2 py-1.5 text-center align-middle">
                    {renderCell(cellItems, row, col, valid)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListTable<T extends LearningItem>({ items, columns, getRowId }: TableViewListProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-left font-medium text-neutral-500"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={getRowId ? getRowId(item) : item.id ?? i} className="border-t border-neutral-100">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 align-middle">
                  {col.render ? col.render(item) : String((item as unknown as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
