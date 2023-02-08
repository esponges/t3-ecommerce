import Image from "next/image";

interface Props {
  onIncrease: (qty: number) => void;
  onDecrease: (qty: number) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  count: number;
  className?: string;
  id: string;
}

export const Counter = ({ onIncrease, onDecrease, onChange, count, className, id }: Props) => {
  return (
    <div className={`counter flex items-center align-center justify-center ${className ??''}`}>
      <button
        className="border-0 p-0 text-center hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
        type="button"
        onClick={() => onDecrease(-1)}
      >
        <Image src="/minus.svg" width={20} height={20} alt="minus" />
      </button>
      {/* hidden label for accessibility - go Lighthouse! */}
      <label htmlFor={id}>
        <input
          className="w-10 text-gray-700 border-0 p-0 
        hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
          type="number"
          name={id}
          id={id}
          value={count}
          onChange={onChange}
        />
      </label>
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
