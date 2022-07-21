import Link from 'next/link';
import DemoLayout from '../layouts/demoLayout';
import { CustomHead } from '../components/CustomHead';
import { NextPageWithLayout } from '../types/page';
import { useRouter } from 'next/router';

const Demo: NextPageWithLayout = () => {
  const description = `Create Product Guides/tours with Lusift`;
  const title = `Lusift Demo | Build Product Guides/tours`;
  const pathname = useRouter().pathname;

  return (
    <div>
      <CustomHead
        title={title}
        description={description}
        pathname={pathname}/>

      <div>
        <h1>Demo</h1>
      </div>

    </div>
  );
}

Demo.getLayout = (page) => {
  return (
    <DemoLayout>
      {page}
    </DemoLayout>
  );
}

export default Demo;
