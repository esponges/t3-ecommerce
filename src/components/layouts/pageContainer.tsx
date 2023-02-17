import { Heading } from "../atoms/heading";
import type { HeadingSizes } from "../atoms/heading";

type Props = {
  children: React.ReactNode;
  // todo: add some reusable page heading
  verticallyCentered?: boolean;
  className?: string;
  heading?: {
    title: string;
    size?: HeadingSizes;
    className?: string;
  };
};

export const PageContainer = ({ children, verticallyCentered, className, heading }: Props) => {
  const vertClasses = 'flex flex-col items-center justify-center md:min-h-[60vh]';
  const classes = 'my-10 mx-auto md:min-h-[60vh] md:w-1/2';
 
  return (
    <div className={`${verticallyCentered ? vertClasses : classes} ${className || ''}`}>
      {heading && (
        <Heading size={heading.size} className={`${heading.className || ''} pt-5 uppercase`}>
          {heading.title}
        </Heading>
      )}
      {children}
    </div>
  );
};
