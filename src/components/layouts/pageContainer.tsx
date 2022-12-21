export const PageContainer = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="my-10 mx-auto md:w-1/2">
      {children}
    </div>
  );
};
