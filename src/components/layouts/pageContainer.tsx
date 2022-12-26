type Props = {
  children: React.ReactNode;
  // todo: add some reusable page header
  pageHeader?: React.ReactNode;
};

export const PageContainer = ({children}: Props) => {
  return (
    <div className="my-10 mx-auto md:w-1/2">
      {children}
    </div>
  );
};
