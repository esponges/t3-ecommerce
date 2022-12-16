import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '@/components/atoms/button';
import { AuthProviders } from '@/types';
import { Icon } from 'semantic-ui-react';

const Login = () => {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen items-center justify-center">
      {!session ? (
        <Button variant="secondary" onClick={() => void signIn(AuthProviders.Discord)}>
          Login with Discord <Icon name="discord" size='huge' />
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
