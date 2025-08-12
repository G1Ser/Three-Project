<template>
  <canvas class="webgl" ref="canvasRef" />
</template>

<script setup lang="ts">
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { useRoute } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ThreeManager } from '@/utils/ThreeManager';
import { earthDayTexture, earthNightTexture, earthCloudTexture } from './src/utils/texture';
import { vertexShader, earthFragmentShader, atmosphereFragmentShader } from './src/shaders';
import { PatternEnum } from '@/constant/pattern';

// 引用和响应式变量
const canvasRef = ref<HTMLCanvasElement | null>(null);
let threeManager: ThreeManager;
let earth: THREE.Mesh;
let earthMaterial: THREE.ShaderMaterial;
let atmosphereMaterial: THREE.ShaderMaterial;
let sunSpherical: THREE.Spherical;
let sunDirection: THREE.Vector3;
let debugSun: THREE.Mesh;
let gui: dat.GUI;

const route = useRoute();
const pattern = route.query.pattern as PatternEnum;

// 更新sun
const updateSun = () => {
  sunDirection.setFromSpherical(sunSpherical);
  debugSun.position.copy(sunDirection).multiplyScalar(5);
  // Uniforms
  earthMaterial.uniforms.uSunDirection.value = sunDirection;
};

// 大气层参数
const atmosphereParameters = {
  atmosphereDayColor: '#00aaff',
  atmosphereDuskColor: '#ff6600',
};

// 地球自转动画
const animateEarth = () => {
  if (earth) {
    earth.rotation.y += 0.00417;
  }
};

// debug
const initGUI = () => {
  gui = new dat.GUI();
  const sunFolder = gui.addFolder('sun');
  sunFolder.add(sunSpherical, 'phi').min(0).max(Math.PI).onChange(updateSun);
  sunFolder.add(sunSpherical, 'theta').min(-Math.PI).max(Math.PI).onChange(updateSun);
  const atmosphereFolder = gui.addFolder('atmosphere');
  atmosphereFolder
    .addColor(atmosphereParameters, 'atmosphereDayColor')
    .name('day')
    .onChange(() => {
      atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
        atmosphereParameters.atmosphereDayColor,
      );
    });
  atmosphereFolder
    .addColor(atmosphereParameters, 'atmosphereDuskColor')
    .name('dusk')
    .onChange(() => {
      atmosphereMaterial.uniforms.uAtmosphereDuskColor.value.set(
        atmosphereParameters.atmosphereDuskColor,
      );
    });
};

// 初始化场景
const initThree = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  threeManager = new ThreeManager(canvas);
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  earthMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: earthFragmentShader,
    uniforms: {
      uDayTexture: new THREE.Uniform(earthDayTexture),
      uNightTexture: new THREE.Uniform(earthNightTexture),
      uCloudTexture: new THREE.Uniform(earthCloudTexture),
      uSunDirection: new THREE.Uniform(sunDirection),
    },
  });
  earth = new THREE.Mesh(geometry, earthMaterial);
  // sun
  sunSpherical = new THREE.Spherical(-1, 1.9, 1.9);
  sunDirection = new THREE.Vector3(-1.0, 0.0, 0.0);
  debugSun = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 2), new THREE.MeshBasicMaterial());
  // atmoshpere
  atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: atmosphereFragmentShader,
    side: THREE.BackSide,
    transparent: true,
    uniforms: {
      uSunDirection: new THREE.Uniform(sunDirection),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(atmosphereParameters.atmosphereDayColor),
      ),
      uAtmosphereDuskColor: new THREE.Uniform(
        new THREE.Color(atmosphereParameters.atmosphereDuskColor),
      ),
    },
  });
  const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial);
  atmosphere.scale.set(1.1, 1.1, 1.1);
  updateSun();
  threeManager.scene.add(earth, atmosphere);
  if (pattern === PatternEnum.debug) {
    threeManager.scene.add(debugSun);
  }
  threeManager.startAnimation(animateEarth);
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
