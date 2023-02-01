type Props = {
  children: React.ReactNode;
  // todo: add some reusable page header
  pageHeader?: React.ReactNode;
  verticallyCentered?: boolean;
  className?: string;
};

export const PageContainer = ({ children, verticallyCentered, className }: Props) => {
  const vertClasses = 'flex flex-col items-center justify-center md:min-h-[60vh]'
  const classes = 'my-10 mx-auto md:min-h-[60vh] md:w-1/2'
 
  return (
    <div className={`${verticallyCentered ? vertClasses : classes} ${className || ''}`}>
      {children}
    </div>
  );
};
