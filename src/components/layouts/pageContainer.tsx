import { Header } from "../atoms/header";
import type { HeaderSizes } from "../atoms/header";

type Props = {
  children: React.ReactNode;
  // todo: add some reusable page header
  verticallyCentered?: boolean;
  className?: string;
  header?: {
    title: string;
    size?: HeaderSizes;
    className?: string;
  };
};

export const PageContainer = ({ children, verticallyCentered, className, header }: Props) => {
  const vertClasses = 'flex flex-col items-center justify-center md:min-h-[60vh]'
  const classes = 'my-10 mx-auto md:min-h-[60vh] md:w-1/2'
 
  return (
    <div className={`${verticallyCentered ? vertClasses : classes} ${className || ''}`}>
      {header && (
        <Header size={header.size} className={`${header.className || ''} pt-5 uppercase`}>
          {header.title}
        </Header>
      )}
      {children}
    </div>
  );
};
