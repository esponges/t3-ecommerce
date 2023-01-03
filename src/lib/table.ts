/* eslint-disable @typescript-eslint/no-explicit-any */
import { rankItem, rankings } from '@tanstack/match-sorter-utils';
import type { RankingInfo } from '@tanstack/match-sorter-utils';
import type { Row } from '@tanstack/react-table';

// most of table work acceptably well with this function
const fuzzy = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  columnId: string,
  filterValue: string | number,
  addMeta: (item: RankingInfo) => void
) => {
  const itemRank = rankItem(row.getValue(columnId), filterValue as string, {
    threshold: rankings.MATCHES,
  });
  addMeta(itemRank);
  return itemRank.passed;
};

//  if the value is falsy, then the columnFilters state entry for that filter will removed from that array.
// https://github.com/KevinVandy/material-react-table/discussions/223#discussioncomment-4249221
fuzzy.autoRemove = (val: any) => !val;

const contains = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    row
      .getValue<string | number>(id)
      .toString()
      .toLowerCase()
      .trim()
      .includes(filterValue.toString().toLowerCase().trim());

contains.autoRemove = (val: any) => !val;

const startsWith = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    row
      .getValue<string | number>(id)
      .toString()
      .toLowerCase()
      .trim()
      .startsWith(filterValue.toString().toLowerCase().trim());

startsWith.autoRemove = (val: any) => !val;

export const filterFns = {
  fuzzy,
  contains,
  startsWith,
};
