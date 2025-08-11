import { createRouter, createWebHistory } from 'vue-router';
import { setupRouterGuards } from './router-guard';
import routes from './full-routers';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

setupRouterGuards(router);

export default router;
