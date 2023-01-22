/* eslint-disable react/display-name */
import type { CellContext } from '@tanstack/react-table';
import { memo } from 'react';

interface Props<T> {
  row?: CellContext<T, string>;
  price?: string|null;
  currency?: string;
}

// same component with React.memo
export const PriceCell = memo(<T,>({ row, price, currency = 'MXN' }: Props<T>) => {
  const value = price ?? row?.getValue();
  return <>{`${currency} $${value ?? ''}`}</>;
});
