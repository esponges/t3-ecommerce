import { useRouter } from 'next/router';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'link';
  className?: string;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, variant, className, href, ...rest } = props;
  const router = useRouter();

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  if (variant === 'primary') {
    return (
      <button
        ref={ref}
        {...rest}
        className={`rounded bg-primary-blue py-2 px-4 font-bold text-white hover:bg-secondary-blue ${
          className ?? ''
        }`}
      >
        {children}
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        ref={ref}
        onClick={() => handleNavigate(href ?? '')}
        className={`rounded bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100 ${
          className ?? ''
        }`}
        {...rest}
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
        className ?? ''
      }`}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
