import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'link';
  extraClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, variant, extraClassName, ...rest } = props;

  if (variant === 'primary') {
    return (
      <button
        ref={ref}
        {...rest}
        className={`rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 ${extraClassName ?? ''}`}
      >
        {children}
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        ref={ref}
        {...rest}
        className={`rounded bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100 ${
          extraClassName ?? ''
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      ref={ref}
      {...rest}
      // eslint-disable-next-line max-len
      className={`rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100 ${
        extraClassName ?? ''
      }`}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
