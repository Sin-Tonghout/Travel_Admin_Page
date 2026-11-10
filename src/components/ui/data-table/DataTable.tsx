/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar/SearchBar";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { EmptyState, NoResults } from "@/components/ui/empty-state/EmptyState";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  pageSize?: number;
  loading?: boolean;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: TData) => void;
}

const SKELETON_ROWS = [0, 1, 2, 3, 4];

export function DataTable<TData>({
  columns,
  data,
  pageSize = 8,
  loading = false,
  searchPlaceholder = "Search…",
  emptyTitle = "Nothing here yet",
  emptyDescription,
  onRowClick,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchKey, setSearchKey] = useState(0);

  const table = useReactTable<TData>({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize: size } = table.getState().pagination;
  const from = filteredCount === 0 ? 0 : pageIndex * size + 1;
  const to = Math.min((pageIndex + 1) * size, filteredCount);
  const columnCount = table.getVisibleLeafColumns().length;

  const clearSearch = () => {
    setGlobalFilter("");
    setSearchKey((k) => k + 1); // remounts SearchBar so its text box empties too
  };

  return (
    <div className="space-y-3">
      <SearchBar
        key={searchKey}
        onSearch={setGlobalFilter}
        placeholder={searchPlaceholder}
        className="max-w-sm"
      />

      <div className="overflow-x-auto rounded-xl border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  const content = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext());

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={
                        sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
                      }
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted"
                    >
                      {canSort && !header.isPlaceholder ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 uppercase hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          {content}
                          {sorted === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        content
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading
              ? SKELETON_ROWS.map((rowIndex) => (
                  <tr key={`skeleton-${rowIndex}`} className="border-b last:border-0">
                    {Array.from({ length: columnCount }, (_unused, colIndex) => colIndex).map(
                      (colIndex) => (
                        <td key={`skeleton-${rowIndex}-${colIndex}`} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ),
                    )}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={cn(
                      "border-b transition-colors last:border-0 hover:bg-surface-muted/60",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && filteredCount === 0 && data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}

      {!loading && filteredCount === 0 && data.length > 0 && <NoResults onClear={clearSearch} />}

      {!loading && filteredCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-foreground-muted">
            Showing {from}–{to} of {filteredCount}
          </p>
          <Pagination
            page={pageIndex + 1}
            pageCount={table.getPageCount()}
            onPageChange={(p) => table.setPageIndex(p - 1)}
          />
        </div>
      )}
    </div>
  );
}