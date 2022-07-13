import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { removeFromLast } from './utils';
import { Post } from '../types';

const postsDirectory = join(process.cwd(), '../docs');

export const getPostSlugs = (): string[] => {
  return fs.readdirSync(postsDirectory).filter(slug => slug.endsWith('.mdx'))
}

export type Field = keyof Post;

export const fetchDocsManifest = async () => {
  const path = join(process.cwd(), '../website/src/manifest.json');
  const res = fs.readFileSync(path, 'utf8');
  return JSON.parse(res);
}

export const findRouteByPath = (path: string, routes: any[]): any => {
  // eslint-disable-next-line
  for (const route of routes) {
    if (route.path && removeFromLast(route.path, '.') === path) {
      return route;
    }
    const childPath = route.routes && findRouteByPath(path, route.routes);
    if (childPath) return childPath;
  }
}


export const getDocPaths = (nextRoutes: any[], carry: any[] = []): string[] => {
  nextRoutes.forEach(({ path, routes }: { path: any; routes: any }) => {
    if (path) {
      carry.push(removeFromLast(path, '.'));
    } else if (routes) {
      getDocPaths(routes, carry);
    }
  });
  return carry;
}

export const getPostByRoute = (slug: string, fields: Field[] = []): Post => {

  const docPath = join(process.cwd(), '../');
  const path = join(docPath, slug+'.mdx');
  const fileContents = fs.readFileSync(path, 'utf8');
  const { data, content } = matter(fileContents);

  const items: Post = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field: Field) => {
    if (field === 'slug') {
      items[field] = slug;
    }
    if (field === 'content') {
      items[field] = content as any;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
}

export const getAllPosts = async (fields: Field[] = []): Promise<Post[]> => {
  const manifest = await fetchDocsManifest()
  const slugs = getDocPaths(manifest.routes);
  const posts = slugs
    .map((slug) => getPostByRoute(slug, fields));
  return JSON.parse(JSON.stringify(posts));
}
