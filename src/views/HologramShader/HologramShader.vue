<template>
  <canvas class="webgl" ref="canvasRef" />
  <div class="loading-container" v-if="loading">
    <div class="pokeball-container" :style="{ transform: `rotate(${loadingProgress * 1.8}deg)` }">
      <img :src="PokeBall" />
    </div>
    <div class="loading-text">{{ Math.floor(loadingProgress) }}%</div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { useRoute } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeManager } from '@/utils/ThreeManager';
import { PatternEnum } from '@/constant/pattern';
import Model from './src/model/dream.glb';
import PokeBall from './src/svg/pokeball.svg';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let threeManager: ThreeManager;
let model: THREE.Group;
let gui: dat.GUI;

const route = useRoute();
const pattern = route.query.pattern as PatternEnum;

// 加载状态
const loading = ref(true);
const loadingProgress = ref(0);

// 模型参数
const modelParameters = {
  scale: 3,
  rotation: -2.21,
};

const initGUI = () => {
  gui = new dat.GUI();
  const modelFolder = gui.addFolder('model');
  modelFolder
    .add(modelParameters, 'scale')
    .min(0.1)
    .max(10)
    .step(0.1)
    .onChange(updateModel)
    .name('缩放大小');
  modelFolder
    .add(modelParameters, 'rotation')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.01)
    .onChange(updateModel)
    .name('旋转角度');
};

const loadModel = () => {
  const loader = new GLTFLoader();
  loader.load(
    Model,
    (gltf) => {
      model = gltf.scene;

      // 调整模型大小和角度
      updateModel();

      // 添加全息效果材质
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = new THREE.ShaderMaterial({});
          child.material = material;
        }
      });

      // 添加到场景
      threeManager.scene.add(model);

      // 加载完成
      setTimeout(() => {
        loading.value = false;
      }, 500); // 延迟关闭加载动画，让进度条完成到100%
    },
    (xhr) => {
      // 更新加载进度
      loadingProgress.value = (xhr.loaded / xhr.total) * 100;
    },
    (error) => {
      console.error('Model Load Failed', error);
    },
  );
};
const updateModel = () => {
  if (model) {
    model.rotation.set(0, modelParameters.rotation, 0);
    model.scale.set(modelParameters.scale, modelParameters.scale, modelParameters.scale);
  }
};

const initThree = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  threeManager = new ThreeManager(canvas);

  // 设置相机位置
  threeManager.camera.position.set(0, 1, 5);

  // 添加方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  threeManager.scene.add(directionalLight);

  // 加载模型
  loadModel();

  // 开始动画循环
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

<style scoped lang="scss">
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
}

.pokeball-container {
  width: 150px;
  height: 150px;
  transition: transform 0.3s ease;
}

.loading-text {
  margin-top: 20px;
  color: white;
  font-size: 18px;
  font-weight: bold;
}
</style>
