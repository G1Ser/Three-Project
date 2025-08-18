import type { RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';
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
  {
    path: '/earth-shader',
    name: 'earth-shader',
    component: defineAsyncComponent(() => import('@/views/EarthShader/EarthShader.vue')),
    meta: {
      title: 'Earth Shader',
      png: 'earth-shader.png',
    },
  },
  {
    path: '/terrain-shader',
    name: 'terrain-shader',
    component: defineAsyncComponent(() => import('@/views/TerrainShader/TerrainShader.vue')),
    meta: {
      title: 'Terrain Shader',
      png: 'terrain-shader.png',
    },
  },
];

export default routes;
