import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const postsDirectory = join(process.cwd(), '../docs');

export const getPostSlugs = (): string[] => {
  return fs.readdirSync(postsDirectory);
}

// TODO: What are all of the possible field here?
type PostItems = Partial<{
  slug: string;
  content: string;
}>;

type Field = keyof PostItems;

export const getPostBySlug = (slug: string, fields: Field[] = []): PostItems => {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items: PostItems = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field: Field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
}

export const getAllPosts = (fields: Field[] = []): PostItems[] => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields));
  console.log('posts')
  console.log(posts)
    // TODO: sort posts
  return posts;
}
