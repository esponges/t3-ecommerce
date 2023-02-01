interface Props {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export const Label = ({ children, className, htmlFor }: Props) => {
  return (
    <label className={`${className || ''} font-bold text-xl`} htmlFor={htmlFor}>
      {children}
    </label>
  );
};
