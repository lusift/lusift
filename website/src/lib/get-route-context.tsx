import { Route, Routes } from '../types';

export interface RouteContext {
  parent?: Route;
  prevRoute?: Route;
  nextRoute?: Route;
  route?: Route;
}
/**
 * Returns the siblings of a specific route (that is the previous and next routes).
 */
export function getRouteContext(
  _route: Route,
  routes: Route[],
  ctx: RouteContext = {}
) {
  if (!_route) {
    return ctx;
  }

  const { path } = _route;
  const { parent } = ctx;

  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];

    if (route.routes) {
      ctx.parent = route;
      ctx = getRouteContext(_route, route.routes, ctx);

      // If the active route and the next route was found in nested routes, return it
      if (ctx.nextRoute) return ctx;
    }
    if (!route) continue;
    if (!route.path) continue;

    if (ctx.route) {
      ctx.nextRoute =
        parent && i === 0
          ? {
              ...route,
              title: `${_route.title} | ${parent.title}`,
            }
          : route;

      return ctx;
    }

    if (route && route.path === path) {
      ctx.route = {
        ..._route,
        title:
          parent && !parent.heading
            ? `${_route.title} | ${parent.title}`
            : _route.title,
      };
      // Continue the loop until we know the next route
      continue;
    }

    ctx.prevRoute =
      parent && !parent.heading && !routes[i + 1]?.path
        ? {
            ...route,
            title: `${route.title} | ${parent.title}`,
          }
        : route;
  }

  // The loop ended and the previous route was found, or nothing
  return ctx;
}
