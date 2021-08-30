import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { CookiesProvider } from 'react-cookie';


function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return <>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Component {...pageProps} />
      </QueryClientProvider>
    </CookiesProvider>
  </>
}
export default MyApp
