import { useEffect } from 'react';
import { useState } from 'react';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (val: string | number) => void;
  debounce?: number;
}

export const DebouncedInput = ({ value: initialValue, onChange, debounce = 300, ...props }: Props) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('on change', value);
      onChange(value);
    }, debounce);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, onChange, debounce]);

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};
