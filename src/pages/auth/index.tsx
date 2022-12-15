import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../../components/atoms/button';

const Login = () => {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen items-center justify-center">
      {!session ? (
        <Button variant="primary" onClick={() => void signIn('discord')}>
          Login
        </Button>
      ) : (
        <div>
          <p>Already logged in</p>
          <Link href="/">
            <Button variant="primary" extraClassName="mt-4">
              Go to home
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Login;
