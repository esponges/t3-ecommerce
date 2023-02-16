import { debounce } from '@/lib/utils';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (val: string | number) => void;
  debounceTime?: number;
}

export const DebouncedInput = ({ onChange, debounceTime = 300, ...props }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const debouncedOnChange = debounce(handleChange, debounceTime);

  return <input {...props} onChange={debouncedOnChange} />;
};
