import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { CookiesProvider } from 'react-cookie';
import React from 'react'
import { Router, useRouter } from 'next/router'
import NProgress from 'nprogress';
import Loading from 'components/loading'
import MainLayout from 'layouts/MainLayout'

NProgress.configure({ showSpinner: true });




function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const router = useRouter();
  const [pageLoading, setPageLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    const handleStart = () => { setPageLoading(true); };
    const handleComplete = () => { setPageLoading(false); };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);

  return <>

    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <MainLayout>
          {pageLoading && <Loading />}
          <ReactQueryDevtools />
          <Component {...pageProps} />
        </MainLayout>
      </QueryClientProvider>
    </CookiesProvider>
  </>
}
export default MyApp
