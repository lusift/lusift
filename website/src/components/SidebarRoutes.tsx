import { Route } from '../types/index';
import { useRouter } from 'next/router';
import { getSlug, getCategoryPath, removeFromLast } from '../lib/utils';
import { SidebarHeading } from './SidebarHeading';
import { SidebarSubTree } from './SidebarSubTree';
import { SidebarLink } from './SidebarLink';

export interface SidebarRoutesProps {
  isMobile?: boolean;
  routes: Route[];
  level?: number;
}

export const SidebarRoutes = ({
  isMobile = false,
  routes: currentRoutes,
  level = 1
}: SidebarRoutesProps) => {
  const { query } = useRouter();
  const slug = getSlug(query as any);

  return (currentRoutes as Route[]).map(
    ({ path, title, routes, heading, open }, idx) => {
      if (routes) {
        const pathname = getCategoryPath(routes);
        const selected = slug.startsWith(pathname as any);
        const opened = selected || isMobile ? false : open;

        if (heading) {
          return (
            <SidebarHeading key={`${pathname}-heading-${idx}`} title={title}>
              <SidebarRoutes
                isMobile={isMobile}
                routes={routes}
                level={level + 1}
              />
            </SidebarHeading>
          );
        }

        return (
          <SidebarSubTree
            key={`${pathname}-subtree-${idx}`}
            isMobile={isMobile}
            level={level}
            title={title}
            selected={selected}
            opened={opened}
          >
            <SidebarRoutes
              isMobile={isMobile}
              routes={routes}
              level={level + 1}
            />
          </SidebarSubTree>
        );
      }

      const href = '/docs/[...slug]';
      const pagePath = removeFromLast(path!, '.');
      const pathname = pagePath;
      const selected = slug.startsWith(pagePath);
      const route = { href, path, title, pathname, selected };
      return (
        <SidebarLink
          key={title}
          isMobile={isMobile}
          level={level}
          route={route}
        />
      );
    }
  ) as any;
}
