import { rankItem } from '@tanstack/match-sorter-utils';
import type { FilterFn } from '@tanstack/react-table';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const genericFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
