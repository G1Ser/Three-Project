<template>
  <div class="project-card" @click="navigateToRoute">
    <div class="card-image">
      <img :src="getImageUrl()" />
    </div>
    <div class="card-footer">
      <h3>{{ title }}</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useDebugStore from '@/store/useDebugStore';

const props = defineProps<{
  title: string;
  routeName: string;
  image?: string;
}>();

const router = useRouter();
const useDebug = useDebugStore();
const { isDebug } = storeToRefs(useDebug);

const navigateToRoute = () => {
  const pattern = isDebug.value ? 'debug' : 'release';
  router.push({ name: props.routeName, query: { pattern } });
};

const getImageUrl = () => {
  if (props.image) {
    return new URL(`../assets/images/${props.image}`, import.meta.url).href;
  }
  return '';
};
</script>

<style lang="scss" scoped>
$white: #fff;
$brown: #333;
.project-card {
  width: 180px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba($white, 0.3);
  box-shadow: 0 0 10px 0 rgba($white, 0.3);
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba($white, 0.5);
  }

  .card-image {
    width: 180px;
    height: 180px;
    border-radius: inherit;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .card-footer {
    padding: 12px 16px;
    background-color: $white;
    text-align: center;

    h3 {
      margin: 0;
      font-size: 12px;
      font-weight: 500;
      color: $brown;
    }
  }
}
</style>
