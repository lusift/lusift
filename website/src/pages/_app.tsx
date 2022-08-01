import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { ReactNode } from 'react';
import { NextPageWithLayout } from '../types/page';

import { MDXProvider } from '@mdx-js/react';
import MDXComponents from '../components/MDXComponents';

export type Props = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <MDXProvider components={MDXComponents}>
      {getLayout(<Component {...pageProps} />)}
    </MDXProvider>
  );
};

export default App;
