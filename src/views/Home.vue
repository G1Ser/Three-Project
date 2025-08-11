<template>
  <div class="home-container">
    <h1>Three.js 项目</h1>
    <div class="debug-switch">
      <input type="checkbox" id="debug-toggle" class="toggle-input" v-model="isDebug" />
      <label for="debug-toggle" class="toggle-label">
        <span class="toggle-button" />
        <span class="toggle-text">Debug</span>
      </label>
    </div>
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
import { storeToRefs } from 'pinia';
import ProjectCard from '@/components/ProjectCard.vue';
import useDebugStore from '@/store/useDebugStore';

const router = useRouter();
const useDebug = useDebugStore();
const { isDebug } = storeToRefs(useDebug);
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
$primary-color: #4caf50;
$toggle-width: 50px;
$toggle-height: 24px;
$toggle-border-radius: 12px;

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

  .debug-switch {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    padding-right: 100px;

    .toggle-input {
      height: 0;
      width: 0;
      visibility: hidden;
      position: absolute;

      &:checked + .toggle-label {
        .toggle-button {
          transform: translateX($toggle-width - $toggle-height);
          background-color: #fff;
        }

        background-color: $primary-color;
      }
    }

    .toggle-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      width: $toggle-width;
      height: $toggle-height;
      background: #ccc;
      border-radius: $toggle-border-radius;
      position: relative;
      transition: background-color 0.3s;

      .toggle-button {
        position: absolute;
        top: 2px;
        left: 2px;
        width: $toggle-height - 4px;
        height: $toggle-height - 4px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.3s;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
      }

      .toggle-text {
        position: absolute;
        left: $toggle-width + 10px;
        font-size: 14px;
      }
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 30px;
    justify-items: center;
  }
}
</style>
