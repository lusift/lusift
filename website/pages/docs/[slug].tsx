import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { GetStaticPaths, GetStaticProps } from 'next';
/* import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header' */
import Layout from '../../components/layout';
import { getPostBySlug, getPostSlugs, getAllPosts } from '../../lib/api';
// import PostTitle from '../../components/post-title'
import Head from 'next/head';
import Link from 'next/link';
import markdownToHtml from '../../lib/markdownToHtml';

const PostBody = ({ content }: { content: string }) => {
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

// TODO: Sorting and section-ing of pages
// TODO: Add Head and SEO stuff
// TODO: Should we use const to declare functions or `function`

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
// TODO: Read popular blog articles on nextjs

const Post = ({ post, posts, preview }: { post: any; posts: { slug: string; title: string; }[]; preview: any }) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout>
      <Sidebar posts={posts} />
      <div className="container">
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
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
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
