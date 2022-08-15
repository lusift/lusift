import Link from 'next/link';
import Layout from '../layouts/layout';
import { CustomHead } from '../components/CustomHead';
import { NextPageWithLayout } from '../types/page';
import { useRouter } from 'next/router';
import { BsFillPlayFill } from 'react-icons/bs';

const LinkAsButton: React.FC<{ bg: string; url: string; name: string; }> = ({ bg, url, name }) => {
  return (
    <Link href={url} as={url}>
      <a className={`text-white ${bg} p-2.5 px-4 rounded-md m-1.5 mx-2 text-center
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

      <div className="flex flex-col gap-5">
        <section className="flex justify-center">
          <div className="max-w-4xl w-11/12 border-2 border-solid border-white flex flex-col items-center justify-center p-2 py-10 sm:py-24">
            <h1 className="text-6xl sm:text-7xl text-center font-heading leading-none font-black capitalize text-gray-900">
              Javascript product
              <span className="text-center block text-primary mt-3">
                &nbsp;tour library
              </span>
            </h1>
            <p className="my-5 font-body text-xl text-gray-700 text-center">
              Javascript library to create product walkthroughs for your web app. Drive users through different features in your
              product.
            </p>
            <div className="flex flex-col w-full sm:w-auto sm:flex-row my-1">
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
          <div className="py-4 text-white my-1 sm:mt-0 justify-center flex">
            <div className="max-w-5xl w-11/12 border-2 border-solid border-white relative flex flex-col items-center justify-center p-0 sm:p-[1.5] py-5">
              <div>
                <video className="w-full" controls={false} loop muted playsInline autoPlay>
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
          <div className="flex justify-center">
            <div className="max-w-5xl gap-5 w-11/12 flex sm:flex-row-reverse flex-col items-center p-2 py-8 sm:py-16">
              <div className="flex-1 shadow-2xl">
                <img src="code.svg" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-4xl font-bold mb-3">
                  Frameworks
                </h2>
                <div className="text-lg leading-6">
                  <div className="flex flex-row mb-3 h-12 gap-2">
                    <img src="icons/javascript.svg" alt="javascript" />
                    <img src="icons/reactjs.svg" className="justify-self-end" alt="reactjs" />
                    <img src="icons/vuejs.svg" alt="vuejs" />
                  </div>
                  <p>
                    Supports ReactJS and VueJS in addition to vanilla javascript.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="max-w-5xl gap-5 w-11/12 flex sm:flex-row flex-col items-center p-2 py-8 sm:py-16">
              <div className="flex-1">
                <img src="guides.svg" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-4xl font-bold mb-3">
                  Multi-page Guides
                </h2>
                <p className="text-lg leading-6">
                  Create guides with steps spanning multiple pages of your app.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="max-w-5xl gap-5 w-11/12 flex sm:flex-row-reverse flex-col items-center p-2 py-8 sm:py-16">
              <div className="flex-1 text-center sm:text-left">
                <img src="hotspot.png" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-4xl font-bold mb-3">
                  Hotspots
                </h2>
                <p className="text-lg leading-6">
                  Announce new features and offer helpful contextual clues using hotspots.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="py-2 text-white my-2 justify-center flex items-center">
            <div className="bg-blue-600 max-w-5xl flex justify-center w-11/12 shadow-2xl rounded-lg">
              <div className="flex flex-col justify-center sm:justify-between sm:flex-row items-center w-full sm:py-12 px-5 sm:px-8 py-8">
                <h3 className="font-heading text-2xl mb-2 sm:mb-0 sm:text-3xl font-semibold">
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
