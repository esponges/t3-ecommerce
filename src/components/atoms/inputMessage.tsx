interface Props {
  message: string;
  type: 'error' | 'success';
}

export const InputMessage = ({ message, type }: Props): JSX.Element => {
  const className = type === 'error' ? 'text-red-500' : 'text-green-500';

  return <span className={`text-sm ${className}`}>{message}</span>;
};
