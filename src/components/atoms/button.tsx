import { forwardRef } from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'link';
  extraClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { onClick, children, variant, extraClassName } = props;

  if (variant === 'primary') {
    return (
      <button
        onClick={onClick}
        ref={ref}
        className={`rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 ${extraClassName}`}
      >
        {children}
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`rounded bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100 ${extraClassName}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      ref={ref}
      // eslint-disable-next-line max-len
      className={`rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100 ${extraClassName}`}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
