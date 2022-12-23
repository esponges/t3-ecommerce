import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loader } from '../molecules/loader';

type Props = {
  children: React.ReactElement;
};

/*
  add the requireAuth property to the page component
  to protect the page from unauthenticated users
  e.g.:
  OrderDetail.requireAuth = true;
  export default OrderDetail;
 */

export const ProtectedLayout = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const authorized = sessionStatus === 'authenticated';  
  const unAuthorized = sessionStatus === 'unauthenticated';
  const loading = sessionStatus === 'loading';

  useEffect(() => {
    if (loading || !router.isReady) return;

    if (unAuthorized) {
      console.log('not authorized')
      // router.push({
      //   pathname: '/login',
      //   query: { returnUrl: router.asPath },
      // });
    }
  }, [loading, unAuthorized, sessionStatus, router]);

  if (loading) {
    return (
      <Loader />
    )
  }

  // return authorized ? <div>{children}</div> : <></>;
  return <div>{children}</div>;
};
