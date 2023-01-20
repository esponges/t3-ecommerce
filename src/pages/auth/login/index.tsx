import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '@/components/atoms/button';
import { AuthProviders } from '@/types';
import { Icon } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { env } from '@/env/client.mjs';

const Login = () => {
  const { data: session } = useSession();
  
  const router = useRouter();

  // if user is already logged in and has a returnUrl, redirect to it
  useEffect(() => {
    if (session && router.query.returnUrl) {

      const url = router.query.returnUrl as string;
      // remove base url from returnUrl
      // comes in this format: http://${baseUrl}/${route}
      const route = url.replace(`${env.NEXT_PUBLIC_NEXTAUTH_URL}`, '');

      if (route.startsWith('/') && !route.startsWith(env.NEXT_PUBLIC_NEXTAUTH_URL)) {
        router.push(route);
      }
    }
  }, [router, session]);

  return (
    <div className="flex h-screen items-center justify-center">
      {!session ? (
        <Button variant="secondary" onClick={() => void signIn(AuthProviders.Discord)}>
          Login con Discord <Icon name="discord" size='huge' />
        </Button>
      ) : (
        <div>
          <p>Sesión active</p>
          <Link href="/">
            <Button variant="primary" extraClassName="mt-4">
              Regresar al inicio
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Login;
