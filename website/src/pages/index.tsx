import Link from 'next/link';
import Layout from '../layouts/layout';
import { CustomHead } from '../components/CustomHead';
import { NextPageWithLayout } from '../types/page';
import { useRouter } from 'next/router';
import { BsFillPlayFill } from 'react-icons/bs';

/*
 * === section 1 ===
 * headline: Javascript product tour library
 * description:
 * button1: Get started | button 2: View demo
 *
 * === section 2 ===
 * a gif/video
 *
 * === section 3 ===
 * feature/benefit overview
 *
 * === section 4 ===
 * call to action banner
 * === footer ===
 */

const LinkAsButton: React.FC<{ bg: string; url: string; name: string; }> = ({ bg, url, name }) => {
  return (
    <Link href={url} as={url}>
      {/*dynamically adding bg-${color} not working*/}
      <a className={`text-white ${bg} p-2.5 px-4 rounded-md mx-2
        hover:no-underline opacity-90 hover:opacity-100 text-md transition-all duration-100
        `}>
        {name}
      </a>
    </Link>
  );
}

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

      <section className="flex justify-center">
        <div className="max-w-4xl border-2 border-solid border-white flex flex-col items-center justify-center p-12 py-24">
          <h1 className="text-center font-heading leading-none font-black capitalize text-gray-900 text-7xl">
            Javascript product
            <span className="text-center block text-primary mt-3">
              &nbsp;tour library
            </span>
          </h1>
          <p className="my-5 font-body text-xl text-gray-700 text-center">
            A bunch of text here to describe our library here. So cool, this thing. Literally the best thing to have been whipped up in
            javascript ever!
          </p>
          <div className="flex my-1">
            <LinkAsButton
              bg={'bg-blue-600'}
              name={'Documentation'}
              url={'/docs/overview'} />
            <LinkAsButton
              bg={'bg-gray-800'}
              name={'Open Demo App'}
              url={'/demo'} />
          </div>
        </div>
      </section>

      <section>
        <div className="py-4 text-white my-2 justify-center flex">
          <div className="max-w-5xl w-11/12 border-2 border-solid border-white relative flex flex-col items-center justify-center p-[1.5] py-5">
            <div>
              <video className="w-full" controls={false} loop autoPlay>
                <source src="/lusift-demo.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
              <Link href={'/demo'} as={'/demo'}>
                <a className={`border-2 border-gray-200 p-3 px-7 shadow-md border-solid rounded-4xl bg-white bottom-0 absolute mx-2
                  hover:no-underline opacity-100 hover:opacity-100 text-md transition-all duration-100 font-semibold
                  text-gray-800 text-md flex items-center
                  `}>
                <BsFillPlayFill className="text-gray-700 text-xl" />
                  <p className="ml-1">
                  Open demo app
                  </p>
                </a>
              </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="py-2 text-white my-2 justify-center flex items-center">
          <div className="bg-blue-600 max-w-5xl flex justify-center w-11/12 shadow-2xl rounded-lg">
            <div className="flex items-center justify-between w-full py-12 px-8">
              <h3 className="font-heading text-3xl font-semibold">
                Ready to get started?
              </h3>
              <Link href={`/docs/overview`} as={`/docs/overview`}>
                <a className={`inline-block font-semibold bg-white text-blue-600 p-2.5 px-7 rounded-md mx-2
                  hover:no-underline opacity-90 hover:opacity-100 text-md transition-all duration-100
                  `}>
                  Get Started
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
