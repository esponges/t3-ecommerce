import Link from 'next/link';

interface PillProps {
  className?: string;
  href?: string;
  children: React.ReactNode;
  bg?: string;
}

export const Pill = ({ children, className = '', href, bg = 'bg-gray-200', ...props }: PillProps) => {
  const renderChildren = () => {
    if (href) {
      return (
        <Link href={href}>
          {children}
        </Link>
      );
    }
    return children;
  };

  return (
    <div
      className={`${bg} inline-flex items-center rounded-full px-3 py-1 text-sm text-gray-700 ${className}`}
      {...props}
    >
      {renderChildren()}
    </div>
  );
};
