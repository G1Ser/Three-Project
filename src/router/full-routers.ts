import type { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Three Projects',
    },
  },
];

export default routes;
