import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/layout';
import { SidebarRoutes } from '../../components/SidebarRoutes';
import { Sidebar } from '../../components/Sidebar';
import { Nav } from '../../components/Nav';
import { CustomHead } from '../../components/CustomHead';
import { Footer } from '../../components/Footer';
import { Sticky } from '../../components/Sticky';
import markdown from '../../styles/markdown.module.css';
import { getPostByRoute, getAllPosts, fetchDocsManifest, getDocPaths } from '../../lib/api';
import { getSlug } from '../../lib/utils';
import Head from 'next/head';
import markdownToHtml from '../../lib/markdownToHtml';
import { NextPageWithLayout } from '../../types/page';
import { Post as PostItem, Route } from '../../types';

import { useIsMobile } from '../../hooks/useIsMobile';

export interface DocBodyProps {
  content: string;
  title: string;
}

const DocBody: React.FC<DocBodyProps> = ({ content, title }) => {
  return (
    <div className={markdown['markdown'] + ' w-full docs'}>
      <h1>{title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

// TODO: Add MDX support
// TODO: Learn tailwindcss
// TODO: Set theme(tailwind.config.js) - colors, fonts, ...
// TODO: Make Sidebar fixed
// TODO: Fix layout
// -- Look up documentation pages for other projects
// TODO: Add `On this page` section


export interface DocsProps {
  post: PostItem & {
    title: PostItem['title'];
    content: PostItem['content'];
  };
  routes: Route[];
}

const Docs: NextPageWithLayout<DocsProps> = ({ post, routes }) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  const { title, description } = post;
  const isMobile = useIsMobile();

  return (
    <div className="p-0 m-0 mx-auto">
      <CustomHead
        title={title || ''}
        description={description || ''}
        pathname={router.pathname} />
      {isMobile ? (
        <Nav />
      ) : (
        <Sticky>
          <Nav />
        </Sticky>
      )}
      <div className="pb-12 px-12 pt-6 content">
        <div className="flex relative">
          <Sidebar fixed>
            <SidebarRoutes routes={routes} />
          </Sidebar>
          {router.isFallback ? (
            <div>Loading…</div>
          ) : (
            <>
              <article>
                <Head>
                  <title>
                    {post.title} | Lusift Docs
                  </title>
                </Head>
                <DocBody title={post.title as string} content={post.content as string} />
              </article>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

Docs.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {

  const slug = getSlug(params ?? { slug: [] });
  const manifest = await fetchDocsManifest();
  const routes = manifest.routes;
  const post = getPostByRoute(slug, [
    'title',
    'description',
    'slug',
    'content',
  ]);

  const posts = await getAllPosts(['slug', 'title']);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
      posts,
      routes
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const manifest = await fetchDocsManifest();
  const docPaths = getDocPaths(manifest.routes);

  return {
    paths: docPaths,
    fallback: false,
  }
}

export default Docs;
