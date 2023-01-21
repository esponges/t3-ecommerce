import type { CellContext } from '@tanstack/react-table';
import { useMemo } from 'react';

interface Props<T> {
  row?: CellContext<T, string>;
  price?: string|null;
  currency?: string;
}

// comma in the generic fixes a compiler error
export const PriceCell = <T,>({ row, price, currency = 'MXN' }: Props<T>) => {
  const value = price ?? row?.getValue();
  const formatted = useMemo(() => `${currency} $${value ?? ''}`, [value, currency]);
  return <>{formatted}</>;
};
