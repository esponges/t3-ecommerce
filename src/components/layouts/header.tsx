import Link from "next/link";

export const Header = () => {
  return (
    <div className="flex justify-between items-center py-5 px-10">
      <div className="flex items-center">
        <Link href="/">
          <a className="font-bold text-2xl">Vinoreo</a>
        </Link>
      </div>
      <div className="flex items-center">
        <Link href="/cart">
          <a className="font-bold text-2xl">Cart</a>
        </Link>
      </div>
    </div>
  );
};
