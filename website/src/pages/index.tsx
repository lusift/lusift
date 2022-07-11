import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Layout from '../layouts/layout';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';
import { CustomHead } from '../components/CustomHead';
import { NextPageWithLayout } from '../types/page';
import { useRouter } from 'next/router';

const Home: NextPageWithLayout = () => {
  const description = `Create Product Guides/tours with Lusift`;
  const title = `Lusift | Build Product Guides/tours`;
  const pathname = useRouter().pathname;

  return (
    <div className={styles.container}>
      <CustomHead
        title={title}
        description={description}
        pathname={pathname}/>

      <main className={styles.main}>
        <Nav />
        <h1 className={styles.heading}> Welcome to Lusift!</h1>
        <Link href="/docs/overview" as={`/docs/overview`}>
          <a className="hover:underline">Documentation</a>
        </Link>
      </main>

      <Footer />
    </div>
  );
}

Home.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default Home
