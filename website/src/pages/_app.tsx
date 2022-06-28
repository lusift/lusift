import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { ReactNode } from 'react';
import { NextPageWithLayout } from '../types/page';

type Props = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return getLayout(<Component {...pageProps} />);
};

export default App;
