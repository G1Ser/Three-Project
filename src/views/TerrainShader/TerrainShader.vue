<template>
  <canvas class="webgl" ref="canvasRef" />
</template>

<script setup lang="ts">
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { useRoute } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ThreeManager } from '@/utils/ThreeManager';
import { PatternEnum } from '@/constant/pattern';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let threeManager: ThreeManager;
let gui: dat.GUI;

const route = useRoute();
const pattern = route.query.pattern as PatternEnum;

const initGUI = () => {
  gui = new dat.GUI();
};
const initThree = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  threeManager = new ThreeManager(canvas);
  threeManager.startAnimation();
};

onMounted(() => {
  initThree();
  if (pattern === PatternEnum.debug) {
    initGUI();
  }
});
onBeforeUnmount(() => {
  if (threeManager) {
    threeManager.dispose();
  }
  if (gui) {
    gui.destroy();
  }
});
</script>

<style scoped lang="scss"></style>
