import Image from "next/image";

interface Props {
  onIncrease: (qty: number) => void;
  onDecrease: (qty: number) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  count: number;
  extraClassName?: string;
}

export const Counter = ({ onIncrease, onDecrease, onChange, count, extraClassName }: Props) => {
  return (
    <div className={`counter flex items-center align-center justify-center ${extraClassName ??''}`}>
      <button
        className="border-0 p-0 text-center hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
        type="button"
        onClick={() => onDecrease(-1)}
      >
        <Image src="/minus.svg" width={20} height={20} alt="minus" />
      </button>
      <input
        className="w-10 border-0 p-0 text-center text-center hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
        type="number"
        value={count}
        onChange={onChange}
      />
      <button
        className="border-0 p-0 text-center hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
        type="button"
        onClick={() => onIncrease(1)}
      >
        <Image src="/plus.svg" width={20} height={20} alt="plus" />
      </button>
    </div>
  );
};
