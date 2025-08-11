<template>
  <div class="home-container">
    <h1>Three.js 项目</h1>
    <div class="projects-grid">
      <ProjectCard
        v-for="route in projectRoutes"
        :key="route.name"
        :title="route.title"
        :route-name="route.name"
        :image="route.image"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '@/components/ProjectCard.vue';

const router = useRouter();
const projectRoutes = ref<Array<{ name: string; title: string; image?: string }>>([]);

onMounted(() => {
  // 获取所有非首页的路由
  projectRoutes.value = router
    .getRoutes()
    .filter((route) => route.name !== 'home')
    .map((route) => ({
      name: route.name as string,
      title: route.meta.title as string,
      image: (route.meta.png as string) || undefined,
    }));
});
</script>

<style lang="scss" scoped>
$brown: #333;
.home-container {
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;

  h1 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 32px;
    color: $brown;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 30px;
    justify-items: center;
  }
}
</style>
