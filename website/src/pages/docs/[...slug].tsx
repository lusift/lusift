import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../layouts/layout';
import { SidebarRoutes } from '../../components/SidebarRoutes';
import { Sidebar } from '../../components/Sidebar';
import { SidebarMobile } from '../../components/SidebarMobile';
import { Sticky } from '../../components/Sticky';
import { ExternalLink } from '../../components/ExternalLink';
import { CustomHead } from '../../components/CustomHead';
import markdown from '../../styles/markdown.module.css';
import { getPostByRoute, getAllPosts, fetchDocsManifest, getDocPaths } from '../../lib/api';
import { getSlug } from '../../lib/utils';
import { NextPageWithLayout } from '../../types/page';
import { Post as PostItem, Route } from '../../types';

import MDXComponents from '../../components/MDXComponents';
import { DocsNavButtons } from '../../components/DocsNavButtons';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkPlugins from '../../lib/remarkPlugins';
import { getRouteContext } from '../../lib/get-route-context';
import { findRouteByPath } from '../../lib/findRouteByPath';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";

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
// TODO: Fix layout
// -- Look up documentation pages for other projects
// TODO: Add `On this page` section

export interface DocsProps {
  post: PostItem & {
    title: PostItem['title'];
    content: MDXRemoteSerializeResult;
  };
  routes: Route[];
  route: Route;
}

const Docs: NextPageWithLayout<DocsProps> = ({ post, routes, route: _route }) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  const { title, description } = post;
  const pageTitle = `${title} | Lusift Docs`;

  const editUrl = `${REPO_URL}/edit/main${post.slug}.mdx`;
  const { route, prevRoute, nextRoute } = getRouteContext(_route, routes);
  if (prevRoute && prevRoute.path?.endsWith('.md')) {
    prevRoute.path = prevRoute.path?.substring(0, prevRoute.path.length - 3);
  }
  if (nextRoute && nextRoute.path?.endsWith('.md')) {
    nextRoute.path = nextRoute.path?.substring(0, nextRoute.path.length - 3);
  }

  return (
    <div className="mx-auto">
      <CustomHead
        title={title || ''}
        pageTitle={pageTitle}
        description={description || ''}
        pathname={router.pathname} />
        <>
          <Sticky shadow>
            <SidebarMobile>
              <SidebarRoutes isMobile={true} routes={routes} />
            </SidebarMobile>
          </Sticky>
        </>
      <div className="pb-12 px-4 sm:px-12 pt-6 content">
        <div className="flex relative">
          <Sidebar fixed>
            <SidebarRoutes routes={routes} />
          </Sidebar>
          <DocBody
            title={post.title as string}
            content={post.content}>
            <DocsNavButtons next={nextRoute} prev={prevRoute} />
            <div className="mt-4 flex justify-end text-gray-200 p-3">
              <a href={editUrl} className="text-gray-600" rel="noopener" target={'_blank'}>
                Edit this page on github
              </a>
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

  const route = manifest && findRouteByPath(slug, manifest.routes);

  const posts = await getAllPosts(['slug', 'title']);

  const mdxSource = await serialize(post.content as any, {
    scope: {
    },
    mdxOptions: {
      remarkPlugins,
      rehypePlugins: [
        rehypeSlug,
        rehypePrism,
        // [
        //   rehypeAutolinkHeadings,
        //   {
        //     properties: {
        //       className: ["anchor"],
        //     },
        //   },
        // ],
      ],
    },
  });

  return {
    props: {
      post: {
        ...post,
        content: mdxSource,
      },
      posts,
      routes,
      route
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
