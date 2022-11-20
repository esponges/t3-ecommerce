import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

import { trpc } from '../../utils/trpc';
import { useMemo } from 'react';
import Link from 'next/link';

export const ProductSearchbar = ({ extraClassName = '' }) => {
  const [search, setSearch] = useState('');
  const { data, refetch } = trpc.product.search.useQuery({
    name: search,
    limit: 2,
  });

  // refetch data during rerender
  // caused by the debounced handler
  useEffect(() => {
    refetch();
  }, [search, refetch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const debouncedHandleInputChange = useMemo(() => debounce(handleInputChange, 500), []);

  // stop debouncing (if any pending) when the component unmounts
  useEffect(() => {
    return () => {
      debouncedHandleInputChange.cancel();
    };
  }, [debouncedHandleInputChange]);

  const toShow = data?.items;

  return (
    <form onSubmit={handleSearch}>
      <div className={`relative ${extraClassName}`}>
        <input
          type="text"
          className="block w-full rounded-md 
            border-gray-300 bg-gray-200 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search"
          onChange={debouncedHandleInputChange}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Image src="/search.svg" width={20} height={20} alt="search" />
        </div>
        <div className="absolute top-full left-0 right-0 z-10">
          {toShow && toShow.length > 0 ? (
            <ul className="rounded-md border border-gray-300 bg-white">
              {toShow.map((product) => (
                <li key={product.id}>
                  <Link href={`/product/${product.id}`}>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {product.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </form>
  );
};
