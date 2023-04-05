export enum HeadingSizes {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  '2xl' = '2xl',
  '3xl' = '3xl',
  '4xl' = '4xl',
  '5xl' = '5xl',
  '6xl' = '6xl',
  '7xl' = '7xl',
  '8xl' = '8xl',
  '9xl' = '9xl',
}

interface HeadingProps {
  size?: HeadingSizes;
  children: React.ReactNode;
  className?: string;
  color?: string;
  onClick?: () => void;
  dataTestId?: string;
}

export const Heading = ({ size, children, className = '', color, onClick, dataTestId }: HeadingProps) => {
  const sizeClass = size ? `text-${size}` : 'text-2xl';
  const colorClass = color ? `text-${color}` : 'text-gray-900';

  return (
    <h1
      className={`${sizeClass}  ${className} ${colorClass} font-bold`}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {children}
    </h1>
  );
};
