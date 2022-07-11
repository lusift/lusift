import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

export type Post = Partial<{
  slug: string;
  title: string;
  content: MDXRemoteSerializeResult;
  description: string;
}>;

export interface Route {
  title: string;
  path?: string;
  open?: boolean;
  heading?: boolean;
  routes?: Route[];
}
