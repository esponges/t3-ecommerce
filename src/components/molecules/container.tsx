interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: Props) => {
  return (
    <div className={`m-auto px-3 py-5 md:w-3/4 md:px-6 ${className || ''}`}>
      {children}
    </div>
  );
};
