import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Logo } from './Logo';
import { ExternalLink } from './ExternalLink';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { DEMO_APP_URL } from '../lib/constants';

const repoUrl = 'https://github.com/lusift/lusift';

export const Nav: React.FC = () => {

  const distinctBorderClass = 'border-b border-gray-200';
  const router = useRouter();
  const [dynamicClass, setDynamicClass] = useState('');

  useScrollPosition(({ prevPos, currPos }) => {
    if (router.pathname !== '/') return;
    if (currPos.y === 0) {
      setDynamicClass('');
    } else {
      setDynamicClass(distinctBorderClass);
    }
  }, [router.pathname]);

  useEffect(() => {
    const defaultDynamicClass = router.pathname === '/' ? '' : distinctBorderClass;
    setDynamicClass(defaultDynamicClass);
  }, [router.pathname]);


  return (
    <nav className={`bg-white bg-[hsla(209, 62%, 50%, 1)] ${dynamicClass}`}>
      <div className="sm:px-0 px-2 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3 flex items-center justify-between h-16">
            <div>
              <Link href="/" as="/">
                <a>
                  <span className="sr-only">Home</span>
                  <Logo />
                </a>
              </Link>
            </div>
          </div>
          <div className="md:col-span-9 items-center flex justify-between md:justify-end  space-x-6 h-16">
            <div className="flex justify-between md:justify-end items-center flex-1 md:space-x-2">
              <div>
                <Link href="/docs/overview">
                  <a className="rounded-md py-2 px-3 inline-flex items-center leading-5 font-medium text-gray-900 betterhover:hover:bg-gray-50 betterhover:hover:text-gray-900 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out">
                    Docs
                  </a>
                </Link>
              </div>

              <div>
                <Link href={DEMO_APP_URL}>
                  <a className="rounded-md py-2 px-3 inline-flex items-center leading-5 font-medium text-gray-900 betterhover:hover:bg-gray-50 betterhover:hover:text-gray-900 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out">
                    Demo
                  </a>
                </Link>
              </div>

              <div>
                <ExternalLink
                  href={repoUrl}
                  className="rounded-md py-2 px-3 inline-flex items-center leading-5 font-medium text-gray-900 betterhover:hover:bg-gray-50 betterhover:hover:text-gray-900 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="fill-current w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>GitHub</title>
                    <path d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0" />
                  </svg>
                </ExternalLink>
              </div>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
