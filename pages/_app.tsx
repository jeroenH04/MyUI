import React from 'react';
import {
  NextComponentType,
  NextPageContext,
} from 'next';
import type {AppProps} from 'next/app';
import {
  SessionProvider,
  useSession,
} from 'next-auth/react';
import {appWithTranslation} from 'next-i18next';
import {AuthEnabledComponentConfig} from '../utils/auth.utils';
import { 
  QueryClient, 
  QueryClientProvider 
} from "react-query";

import '../styles/App.css';
import '../styles/AppHeader.css';
import '../styles/globals.css';
import '../styles/index.css';

type AppAuthProps = AppProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line max-len
  Component: NextComponentType<NextPageContext, any, {}> &
    Partial<AuthEnabledComponentConfig>;
};

const queryClient = new QueryClient();

/**
 * @param {AppAuthProps} {
 *   Component,
 *   pageProps: { session, ...pageProps },
 * }
 * @return {*}
 */
function MyApp({
  Component,
  pageProps: {
    session,
    ...pageProps
  },
}: AppAuthProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </QueryClientProvider>
  );
}

type Props = {
  children: JSX.Element;
};

/**
 * @param {Props} { children }
 * @return {*}  {JSX.Element}
 */
function Auth({children}: Props): JSX.Element {
  const {status} = useSession({required: true});

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return children;
}

export default appWithTranslation(MyApp);
