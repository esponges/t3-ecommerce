import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../atoms/button";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center py-5 px-10">
      <div className="flex items-center">
        <Link href="/">
          <a className="font-bold text-2xl">Vinoreo</a>
        </Link>
      </div>
      <div className="flex items-center">
        <Link href="/cart">
          <Button variant='link' extraClassName="mr-2">
            Cart
          </Button>
        </Link>
        {/* nextauth login */}
        {!session ? (
        <Button variant="primary" onClick={() => signIn('discord')}>
          Login
        </Button>
        ) : (
        <Button variant="primary" onClick={() => signOut()}>
          Logout
        </Button>
        )}
      </div>
    </div>
  );
};
