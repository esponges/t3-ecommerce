import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactElement;
};

export const ProtectedLayout = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [authorized, setAuthorized] = useState(false);

  const authCheck = (url:string) => {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/'];
    const path = url.split('?')[0];
    if (!session && sessionStatus === 'loading' && path && !publicPaths.includes(path)) {
      setAuthorized(false);
      // router.push({
      //   pathname: '/login',
      //   query: { returnUrl: router.asPath },
      // });
    } else {
      setAuthorized(true);
    }
  };

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // return authorized ? <div>{children}</div> : <></>;
  return <div>{children}</div>;
};
