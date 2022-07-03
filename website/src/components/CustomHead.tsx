import Head from 'next/head';
import { SITE_URL } from '../lib/constants';

export interface CustomHeadProps {
  title: string;
  description: string;
  pathname: string;
}

export const CustomHead = ({ title, description, pathname }: CustomHeadProps) => {
  const favicon = '/images/lusift.ico';
  const image = '/images/lusift-2.png';
  const baseUrl = SITE_URL;

  return (
    <Head>
      <title key="title">{title}</title>
      <meta name="description" key="description" content={description} />
      <link rel="icon" type="image/x-icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon} />

      {/* OPEN GRAPH */}
      <meta property="og:type" key="og:type" content="website" />
      <meta
        property="og:url"
        key="og:url"
        content={`${baseUrl}${pathname}`}
      />
      <meta property="og:title" content={title} key="og:title" />
      <meta
        property="og:description"
        key="og:description"
        content={description}
      />
      <meta
        property="og:image"
        key="og:image"
        content={`${baseUrl}${image}`}
      />
    </Head>
  );
}
