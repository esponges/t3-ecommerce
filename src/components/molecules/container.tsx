interface Props {
  children: React.ReactNode;
  extraClassName?: string;
}

export const Container = ({ children, extraClassName }: Props) => {
  return (
    <div className={`m-auto px-3 py-5 md:w-3/4 md:px-6 ${extraClassName ? extraClassName : ''}`}>
      {children}
    </div>
  );
};
