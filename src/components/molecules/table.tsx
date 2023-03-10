import { useState } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';

import { DebouncedInput } from '../atoms/debouncedInput';
import { filterFns } from '../../lib/table';

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  showFooter?: boolean;
  showNavigation?: boolean;
  showGlobalFilter?: boolean;
  filterFn?: FilterFn<T>;
  pageSize?: number;
  isMobile?: boolean;
}

export const Table = <T extends object>({
  data,
  columns,
  showFooter = true,
  showNavigation = true,
  showGlobalFilter = false,
  filterFn = filterFns.fuzzy,
  pageSize = 15,
  isMobile = false,
}: ReactTableProps<T>) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSizeState, setPageSize] = useState(pageSize);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageSize: pageSizeState,
        pageIndex: pageIndex,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterFn,
    enableColumnResizing: true,
  });

  const { pagination } = table.getState();

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    setPageIndex(0);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handleNextPage = () => {
    setPageIndex(pagination.pageIndex + 1);
  };

  const handlePreviousPage = () => {
    setPageIndex(pagination.pageIndex - 1);
  };

  const handleFilterChange = (value: string | number) => {
    setGlobalFilter(String(value));
  };

  return (
    <div className="flex flex-col text-center">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-4 sm:px-6 lg:px-8">
          <div className="p-2">
            {showGlobalFilter ? (
              <DebouncedInput
                onChange={handleFilterChange}
                className="font-lg border-block mb-2 border p-2 shadow"
                placeholder="Filter..."
                debounceTime={500}
              />
            ) : null}
            <table className="min-w-full text-center">
              <thead className="border-b bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className=" px-2 py-4 text-sm font-medium text-gray-900 md:px-6"
                        colSpan={header.colSpan}
                        style={{
                          position: 'relative',
                          width: header.getSize()
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="max-w-full">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='border-b" bg-white'>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className="
                        text-sm whitespace-nowrap font-light text-gray-900 
                        px-2 md:px-6 py-4 overflow-ellipsis overflow-hidden
                        "
                        key={cell.id}
                        style={{
                          maxWidth: cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {showFooter ? (
                <tfoot className="border-t bg-gray-50">
                  {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.footer, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              ) : null}
            </table>
            {showNavigation ? (
              <>
                <div className="mt-5 h-2" />
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="cursor-pointer rounded border p-1"
                    onClick={() => handlePageChange(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {'<<'}
                  </button>
                  <button
                    className="cursor-pointer rounded border p-1"
                    onClick={() => handlePreviousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {'<'}
                  </button>
                  <button
                    className="cursor-pointer rounded border p-1"
                    onClick={() => handleNextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {'>'}
                  </button>
                  <button
                    className="cursor-pointer rounded border p-1"
                    onClick={() => handlePageChange(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    {'>>'}
                  </button>
                  <span className="flex cursor-pointer items-center gap-1">
                    <div>Page</div>
                    <strong>
                      {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1">
                    | Go to:
                    <input
                      type="number"
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        handlePageChange(page);
                      }}
                      className="w-16 rounded border p-1"
                    />
                  </span>
                  <select value={table.getState().pagination.pageSize} onChange={handlePageSizeChange}>
                    {[10, 20, 30, 40, 50].map((size) => (
                      <option key={size} value={size}>
                        See {size}
                      </option>
                    ))}
                  </select>
                  <div className="h-4" />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
