export function removeFromLast(path: any, key: any) {
  const i = path.lastIndexOf(key);
  return i === -1 ? path : path.substring(0, i);
}

export function getCategoryPath(routes: any[]) {
  const route = routes.find(r => r.path);
  return route && removeFromLast(route.path!, '/');
}

export function getSlug({ slug }: { slug: string[] }) {
  if (!slug) {
    return '/docs/overview';
  }
  return `/docs/${slug && slug.join('/')}`;
}

