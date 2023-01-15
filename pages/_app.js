import '../styles/globals.css'
import Head from 'next/head';
import Layout from '../src/components/layout/Layout'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import DataContextProvider from '../src/contexts/DataContext';


export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Prediction App</title>
      </Head>
      <main>
        <Layout>
          <DataContextProvider>
            <Component {...pageProps} />
          </DataContextProvider>
        </Layout>
      </main>
    </>
  );
}
