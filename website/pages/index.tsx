import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

// TODO: generate sitemap

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1> Welcome to Lusift!</h1>
        <Link href="/docs/overview" as={`/docs/overview`}>
          <a className="hover:underline">Documentation</a>
        </Link>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}

export default Home