import styles from '../styles/markdown.module.css';
import { HelloWorld } from '../components/HelloWorld';
import Head from 'next/head';

const MDXComponents = {
  Head,
  a: (props: any) => <a {...props} className={styles.link} />,
  h1: (props: any) => <h1 {...props} className={styles.postTitle} />,
  code: (props: any) => <code {...props} className={styles.code} />,
  pre: (props: any) => <pre {...props} className={styles.pre} />,
  HelloWorld,
};

export default MDXComponents;
