import debounce from 'lodash/debounce';
import Image from 'next/image';
import { useMemo, useEffect, useCallback } from 'react';

interface Props {
  className?: string;
  inputClassName?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (e: React.MouseEvent<HTMLLIElement>) => void;
  debouncedTime?: number;
  inputType?: 'text' | 'number';
  placeholder?: string;
  searchResults?: {
    id: string | number;
    name?: string;
  }[];
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Searchbar = ({
  className = '',
  inputClassName = 'border-gray-300 bg-gray-200 pl-10 sm:text-sm',
  onChange,
  onSelect,
  debouncedTime = 500, // pass 0 to disable debouncing
  searchResults = [],
  inputType = 'text',
  inputProps,
  placeholder = 'Buscar',
}: Props) => {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
    },
    [onChange]
  );

  const handleDebounceInputChange = useMemo(
    () => debounce(handleInputChange, debouncedTime),
    [debouncedTime, handleInputChange]
  );
  // stop debouncing (if any pending) when the component unmounts
  useEffect(() => {
    return () => {
      handleDebounceInputChange.cancel();
    };
  }, [handleDebounceInputChange]);

  return (
    <div className={`relative ${className}`}>
      <input
        type={inputType}
        className={`${inputClassName} block w-full rounded-md
        focus:border-indigo-500 focus:ring-indigo-500`}
        placeholder={placeholder}
        // onChange wasn't working, probably because of the debouncing
        onInput={handleDebounceInputChange}
        {...inputProps}
      />
      <div className="pointer-events-none absolute inset-y-0 -left-10 flex items-center pl-3">
        <Image src="/search.svg" alt="search" width={20} height={20} />
      </div>
      {searchResults.length > 0 && (
        <ul className="absolute top-full left-0 w-full rounded-md border border-gray-300 bg-white shadow-md">
          {searchResults.map((item) => (
            <li key={item?.id ?? item.name} className="cursor-pointer p-2 hover:bg-gray-100" onClick={onSelect}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
