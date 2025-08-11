<template>
  <canvas class="webgl" ref="canvasRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { ThreeManager } from '@/utils/ThreeManager';
import { earthDayTexture, earthNightTexture } from './src/utils/texture';
import { vertexShader, fragmentShader } from './src/shaders';

// 引用和响应式变量
const canvasRef = ref<HTMLCanvasElement | null>(null);
let threeManager: ThreeManager;
let earth: THREE.Mesh;

// 初始化场景
const initThree = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  threeManager = new ThreeManager(canvas);
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uDayTexture: new THREE.Uniform(earthDayTexture),
      uNightTexture: new THREE.Uniform(earthNightTexture),
    },
  });
  earth = new THREE.Mesh(geometry, material);
  threeManager.scene.add(earth);
  threeManager.startAnimation();
};

onMounted(() => {
  initThree();
});

onBeforeUnmount(() => {
  if (threeManager) {
    threeManager.dispose();
  }

  if (earth) {
    earth.geometry.dispose();
    if (earth.material instanceof THREE.Material) {
      earth.material.dispose();
    }
  }
});
</script>
