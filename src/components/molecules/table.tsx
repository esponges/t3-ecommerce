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

  return (
    <div className="flex flex-col text-center">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-4 sm:px-6 lg:px-8">
          <div className="p-2">
            {showGlobalFilter ? (
              <DebouncedInput
                value={globalFilter ?? ''} onChange={(value) => setGlobalFilter(String(value))}
                className="font-lg border-block border p-2 shadow mb-2"
                placeholder="Filtrar..."
              />
            ) : null}
            <table className="min-w-full text-center">
              <thead className="border-b bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className=" px-2 md:px-6 py-4 text-sm font-medium text-gray-900">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='border-b" bg-white'>
                    {row.getVisibleCells().map((cell) => (
                      <td 
                        className="whitespace-nowrap px-2 md:px-6 py-4 text-sm font-light text-gray-900" 
                        key={cell.id}
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
                <div className="flex items-center gap-2 justify-center">
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
                    <div>{!isMobile ? 'Página' : 'Pag'}</div>
                    <strong>
                      {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1">
                    | Ir a:
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
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={handlePageSizeChange}
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Ver {pageSize}
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
