import styles from '../styles/markdown.module.css';
import { HelloWorld } from '../components/HelloWorld';
import { Browser } from '../components/Browser';
import { Result1, Result2 } from '../components/Tutorial';
import Head from 'next/head';
import Link from 'next/link';

const CustomH1 = ({ id, ...rest }) => {
  if (id) {
    return (
      <Link href={`#${id}`}>
        <a>
          <h1 id={id} {...rest} />
        </a>
      </Link>
    );
  }
  return <h1 {...rest} />;
};

const CustomH2 = ({ id, ...rest }) => {
  if (id) {
    return (
      <Link href={`#${id}`}>
        <a>
          <h2 id={id} {...rest} />
        </a>
      </Link>
    );
  }
  return <h2 {...rest} />;
};

const CustomH3 = ({ id, ...rest }) => {
  if (id) {
    return (
      <Link href={`#${id}`}>
        <a>
          <h3 id={id} {...rest} />
        </a>
      </Link>
    );
  }
  return <h3 {...rest} />;
};

const CustomH4 = ({ id, ...rest }) => {
  if (id) {
    return (
      <Link href={`#${id}`}>
        <a>
          <h4 id={id} {...rest} />
        </a>
      </Link>
    );
  }
  return <h4 {...rest} />;
};

const CustomH5 = ({ id, ...rest }) => {
  if (id) {
    return (
      <Link href={`#${id}`}>
        <a>
          <h5 id={id} {...rest} />
        </a>
      </Link>
    );
  }
  return <h5 {...rest} />;
};

const CustomH6 = ({ id, ...rest }) => {
  if (id) {
    return (
      <Link href={`#${id}`}>
        <a>
          <h6 id={id} {...rest} />
        </a>
      </Link>
    );
  }
  return <h6 {...rest} />;
};

const MDXComponents = {
  Head,
  a: (props: any) => <a {...props} className={styles.link} />,
  h1: (props: any) => <CustomH1 {...props} className={styles.postTitle} />,
  h2: (props: any) => <CustomH2 {...props} className={styles.postTitle} />,
  h3: (props: any) => <CustomH3 {...props} className={styles.postTitle} />,
  h4: (props: any) => <CustomH4 {...props} className={styles.postTitle} />,
  h5: (props: any) => <CustomH5 {...props} className={styles.postTitle} />,
  h6: (props: any) => <CustomH6 {...props} className={styles.postTitle} />,
  code: (props: any) => <code {...props} className={styles.code} />,
  pre: (props: any) => <pre {...props} className={styles.pre} />,
  HelloWorld,
  Browser,
  Result1,
  Result2,
};

export default MDXComponents;
