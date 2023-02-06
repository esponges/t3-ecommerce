import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import { trpc } from '../utils/trpc';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode, ReactElement } from 'react';
import { MainLayout } from '../components/layouts/main';
import { ToastContainer } from 'react-toastify';

import '../styles/globals.scss';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { ProtectedLayout } from '@/components/layouts/protected';
import Head from 'next/head';
import { Transition } from '@/components/layouts/transition';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  requireAuth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: {
    session: Session | null;
  };
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <MainLayout>
        <Transition />
        {page}
      </MainLayout>
    ));
  const layout = getLayout(<Component {...pageProps} />) as JSX.Element;

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Vinoreo</title>
        <meta name="description" content="Tienda de vinos y licores" />
        <link rel="icon" href="/v-icon.ico" />
      </Head>
      <ToastContainer />
      {Component.requireAuth ? <ProtectedLayout>{layout}</ProtectedLayout> : layout}
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
