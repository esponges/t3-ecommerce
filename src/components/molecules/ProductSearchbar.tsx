import Image from "next/image";
import React, { useEffect, useState } from "react";
import { debounce } from "../../lib/utils";
import { trpc } from "../../utils/trpc";

export const ProductSearchbar = ({ extraClassName = '' }) => {
  const [search, setSearch] = useState('');
  const { data, refetch } = trpc.product.search.useQuery({
    name: search,
    limit: 2,
  });

  // refetch data during rerender
  useEffect(() => {
    refetch();
  }, [search, refetch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch('');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(e.target.value, search);
  };

  const handleDebouncedSearch = debounce(handleInputChange, 500);

  const toShow = data?.items;

  return (
    <form onSubmit={handleSearch}>
      <div className={`relative ${extraClassName}`}>
        <input
          type="text"
          className="bg-gray-200 focus:ring-indigo-500 focus:border-indigo-500 
            block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="Search"
          onChange={handleDebouncedSearch}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Image
            src="/search.svg"
            width={20}
            height={20}
            alt="search"
          />
        </div>
        {/* todo: improve dropdown styling */}
        <div className="absolute top-full left-0 right-0 z-10">
          {toShow?.map((product) => (
            <div key={product.id}>
              {product.name}
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
