import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loader } from '../molecules/loader';

type Props = {
  children: React.ReactElement;
  requireAdmin?: boolean;
};

/*
  add the requireAuth property to the page component
  to protect the page from unauthenticated users
  e.g.:
  OrderDetail.requireAuth = true;
  export default OrderDetail;
 */

export const ProtectedLayout = ({ children, requireAdmin }: Props): JSX.Element => {
  const router = useRouter();

  const { status: sessionStatus, data } = useSession();
  const authorized = sessionStatus === 'authenticated';  
  const unAuthorized = sessionStatus === 'unauthenticated';
  const loading = sessionStatus === 'loading';

  console.log('sessionStatus', sessionStatus);

  const user = data?.user;
  const isAdmin = user?.admin;

  useEffect(() => {
    if (loading || !router.isReady) return;

    if (unAuthorized) {
      router.push({
        pathname: '/auth/login',
        query: { returnUrl: router.asPath },
      });
    }

    if (!isAdmin && requireAdmin) {
      console.warn('not authorized');
      router.push({
        pathname: '/',
      });
    }
  }, [loading, unAuthorized, sessionStatus, router, isAdmin, requireAdmin]);

  if (loading) {
    return (
      <Loader />
    );
  }

  return authorized ? <div>{children}</div> : <></>;
};
