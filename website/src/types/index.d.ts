export type Post = Partial<{
  slug: string;
  title: string;
  content: string;
  description: string;
}>;

export interface Route {
  title: string;
  path?: string;
  open?: boolean;
  heading?: boolean;
  routes?: Route[];
}
