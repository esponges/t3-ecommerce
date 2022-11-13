import React, { useState } from "react";
import { debounce } from "../../lib/utils";

export const Searchbar = ({ extraClassName = '' }) => {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch('');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleDebouncedSearch = debounce(handleInputChange, 500);

  return (
    <form onSubmit={handleSearch}>
      <div className={`relative ${extraClassName}`}>
        <input
          type="text"
          name="search"
          id="search"
          className="bg-gray-200 focus:ring-indigo-500 focus:border-indigo-500 
            block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="Search"
          onChange={handleDebouncedSearch}
        />
        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div> */}
      </div>
    </form>
  );
};
