import type { Router } from 'vue-router';

/**
 * 设置全局路由导航守卫
 * @param router Vue Router实例
 */
export function setupRouterGuards(router: Router): void {
  // 全局前置守卫，根据路由的meta.title设置页面标题
  router.beforeEach((to, from, next) => {
    // 如果路由有定义meta.title，则设置页面标题
    if (to.meta.title) {
      document.title = to.meta.title as string;
    }
    next();
  });
}
