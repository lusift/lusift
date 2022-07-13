import Link from 'next/link';
import Layout from '../layouts/layout';
import { CustomHead } from '../components/CustomHead';
import { NextPageWithLayout } from '../types/page';
import { useRouter } from 'next/router';

const Home: NextPageWithLayout = () => {
  const description = `Create Product Guides/tours with Lusift`;
  const title = `Lusift | Build Product Guides/tours`;
  const pathname = useRouter().pathname;

  return (
    <div>
      <CustomHead
        title={title}
        description={description}
        pathname={pathname}/>

      <div>
        <h1> Welcome to Lusift!</h1>
        <Link href="/docs/overview" as={`/docs/overview`}>
          <a className="hover:underline">Documentation</a>
        </Link>
      </div>

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
