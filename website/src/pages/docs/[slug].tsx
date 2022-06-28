import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { GetStaticPaths, GetStaticProps } from 'next';
/* import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header' */
import Layout from '../../components/layout';
import { getPostBySlug, getAllPosts } from '../../lib/api';
// import PostTitle from '../../components/post-title'
import Head from 'next/head';
import Link from 'next/link';
import markdownToHtml from '../../lib/markdownToHtml';
import { NextPageWithLayout } from '../../types/page';

const PostBody = ({ content }: { content: string }) => {
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

// TODO: Add Head and SEO stuff

const Sidebar = ({ posts }: { posts: { slug: string; title: string; }[] }) => {
  return (
    <div>
      <div>
        <h3>
          Docs
        </h3>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href="/docs/[slug]" as={`/docs/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface IPost {
  post: any;
  posts: {
    slug: string;
    title: string;
  }[];
  preview: any;
}

const Post: NextPageWithLayout<IPost> = ({ post, posts, preview }) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <div className="container">
      <Sidebar posts={posts} />
      {router.isFallback ? (
        <div>Loading…</div>
      ) : (
        <>
          <article>
            <Head>
              <title>
                {post.title} | Lusift Docs
              </title>
              {/* <meta property="og:image" content={post.ogImage.url} /> */}
            </Head>
            <PostBody content={post.content} />
          </article>
        </>
      )}
    </div>
  );
}

Post.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const post = getPostBySlug(params.slug, [
    'title',
    'slug',
    'content',
  ]);
  const posts = getAllPosts(['slug', 'title']);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
      posts
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

export default Post;
