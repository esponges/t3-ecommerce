// export type HeaderSizes =
//   | 'xs'
//   | 'sm'
//   | 'md'
//   | 'lg'
//   | 'xl'
//   | '2xl'
//   | '3xl'
//   | '4xl'
//   | '5xl'
//   | '6xl'
//   | '7xl'
//   | '8xl'
//   | '9xl';

export enum HeaderSizes {
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

interface HeaderProps {
  size?: HeaderSizes;
  children: React.ReactNode;
  extraClassName?: string;
}

export const Header = ({ size, children, extraClassName }: HeaderProps) => {
  const sizeClass = size ? `text-${size}` : 'text-2xl';

  return <h1 className={`${sizeClass} font-bold text-gray-700 ${extraClassName ?? ''}`}>{children}</h1>;
};
