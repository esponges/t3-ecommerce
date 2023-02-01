type Props = {
  children: React.ReactNode;
  // todo: add some reusable page header
  pageHeader?: React.ReactNode;
  verticallyCentered?: boolean;
};

export const PageContainer = ({children, verticallyCentered}: Props) => {
  if (verticallyCentered) {
    return (
      <div className="flex flex-col items-center justify-center md:min-h-[60vh]">
        {children}
      </div>
    );
  }

  return <div className="my-10 mx-auto md:w-1/2 md:min-h-[60vh]">{children}</div>;
};
