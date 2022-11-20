interface HeaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  children: React.ReactNode;
  extraClassName?: string;
}

export const Header = ({ size, children, extraClassName }: HeaderProps) => {
  const sizeClass = size ? `text-${size}` : 'text-2xl';

  return (
    <h1 className={`${sizeClass} font-bold text-gray-700 ${extraClassName ?? ''}`}>{children}</h1>
  );
};
