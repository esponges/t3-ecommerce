import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '../atoms/button';

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between py-5 px-10
      fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center">
        <Link href="/">
          <a className="text-2xl font-bold">Store</a>
        </Link>
        <Link href="/cart">
          <a className="ml-4 text-2xl font-bold">Cart</a>
        </Link>
      </div>
      <div className="flex items-center">
        {/* nextauth login */}
        {!session ? (
          <Button variant="primary" onClick={() => signIn('discord')}>
            Login
          </Button>
        ) : (
          <>
            <p className="mr-4">Hello —{session.user?.name}—</p>
            <Button variant="primary" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
