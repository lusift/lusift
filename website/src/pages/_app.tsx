import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { ReactNode } from 'react';
import { NextPageWithLayout } from '../types/page';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { MDXProvider } from '@mdx-js/react';
import MDXComponents from '../components/MDXComponents';
import Lusift from 'lusift';
import 'lusift/dev/lusift.css';
import lusiftContent from '../lib/lusiftContent';

export type Props = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  const router = useRouter();

  useEffect(() => {
    Lusift.resetTrackingState();

    const defaults = {
      tooltip: {
        data: {
          backdrop: {
            disabled: true
          },
          scrollIntoView: false,
        },
        target: {
          path: {
            value: '/docs/tutorial',
            comparator: 'is'
          },
        },
        actions: {
          navSection: {
            disabled: false,
            dismissLink: {
              text: 'skip this one',
              disabled: true,
            }
          },
          closeButton: {
            disabled: true
          }
        }
      }
    }

    Lusift.setContent(lusiftContent, defaults);
    Lusift.showContent('tutorial');
    router.events.on('routeChangeComplete', () => {
      (window['Lusift' as any] as any).refresh();
    });
  }, []);
  return (
    <MDXProvider components={MDXComponents}>
      {getLayout(<Component {...pageProps} />)}
    </MDXProvider>
  );
};

export default App;
