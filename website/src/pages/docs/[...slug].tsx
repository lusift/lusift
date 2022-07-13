import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../layouts/layout';
import { SidebarRoutes } from '../../components/SidebarRoutes';
import { Sidebar } from '../../components/Sidebar';
import { CustomHead } from '../../components/CustomHead';
import markdown from '../../styles/markdown.module.css';
import { getPostByRoute, getAllPosts, fetchDocsManifest, getDocPaths } from '../../lib/api';
import { getSlug } from '../../lib/utils';
import { NextPageWithLayout } from '../../types/page';
import { Post as PostItem, Route } from '../../types';

import MDXComponents from '../../components/MDXComponents';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkPlugins from '../../lib/remarkPlugins';

import { REPO_URL } from '../../lib/constants';

export interface DocBodyProps {
  content: MDXRemoteSerializeResult;
  title: string;
  children: React.ReactNode
}

const DocBody: React.FC<DocBodyProps> = ({ content, title, children }) => {
  const components = MDXComponents;
  return (
    <div className={markdown['markdown'] + ' w-full docs prose'}>
      <h1>{title}</h1>
      <article>
        <MDXRemote {...content} components={components} />
      </article>
      {children}
    </div>
  );
}

// TODO: Set theme(tailwind.config.js) - colors, fonts, ...
// TODO: Make Sidebar fixed
// TODO: Fix layout
// -- Look up documentation pages for other projects
// TODO: Add `On this page` section


export interface DocsProps {
  post: PostItem & {
    title: PostItem['title'];
    content: MDXRemoteSerializeResult;
  };
  routes: Route[];
}

const Docs: NextPageWithLayout<DocsProps> = ({ post, routes }) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  const { title, description } = post;
  window.alert(post.slug)
  const pageTitle = `${title} | Lusift Docs`;

  const editUrl = `${REPO_URL}/edit/main${post.slug}.mdx`;

  return (
    <div className="mx-auto">
      <CustomHead
        title={title || ''}
        pageTitle={pageTitle}
        description={description || ''}
        pathname={router.pathname} />
      <div className="pb-12 px-12 pt-6 content">
        <div className="flex relative">
          <Sidebar fixed>
            <SidebarRoutes routes={routes} />
          </Sidebar>
          <DocBody
            title={post.title as string}
            content={post.content}>
            <div className="p-3 border-2 border-gray-700 border-solid">
              TODO: page nav buttons
            </div>
            <div className="flex justify-end border-2 border-gray-700 border-solid p-3">
              <Link href={editUrl} as={editUrl}>
                <a>
                  Edit this page on github
                </a>
              </Link>
            </div>
          </DocBody>
        </div>
      </div>
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

  const mdxSource = await serialize(post.content as any, {
    scope: {
    },
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  });

  return {
    props: {
      post: {
        ...post,
        content: mdxSource,
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
