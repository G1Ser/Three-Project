import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface ThreeSize {
  width: number;
  height: number;
}

export class ThreeManager {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls!: OrbitControls; // 使用 ! 断言操作符，表示该属性会在使用前被初始化
  canvas: HTMLCanvasElement;
  sizes: ThreeSize;
  animationFrameId: number | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    options?: {
      cameraPosition?: THREE.Vector3;
      cameraFov?: number;
      cameraNear?: number;
      cameraFar?: number;
      enableControls?: boolean;
    },
  ) {
    this.canvas = canvas;
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // 创建场景
    this.scene = new THREE.Scene();

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      options?.cameraFov || 75,
      this.sizes.width / this.sizes.height,
      options?.cameraNear || 0.1,
      options?.cameraFar || 100,
    );

    if (options?.cameraPosition) {
      this.camera.position.copy(options.cameraPosition);
    } else {
      this.camera.position.z = 5;
    }
    this.scene.add(this.camera);

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 创建轨道控制器
    if (options?.enableControls !== false) {
      this.controls = new OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;
    }

    // 添加窗口大小调整事件监听
    window.addEventListener('resize', this.onResize.bind(this));
  }

  // 处理窗口大小调整
  onResize() {
    // 更新尺寸
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // 更新相机
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // 更新渲染器
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // 开始动画循环
  startAnimation(animateCallback?: () => void) {
    const animate = () => {
      // 如果有控制器，更新控制器
      if (this.controls) {
        this.controls.update();
      }

      // 执行自定义动画回调
      if (animateCallback) {
        animateCallback();
      }

      // 渲染场景
      this.renderer.render(this.scene, this.camera);

      // 请求下一帧动画
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  // 停止动画循环
  stopAnimation() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // 释放资源
  dispose() {
    window.removeEventListener('resize', this.onResize.bind(this));
    this.stopAnimation();

    // 释放场景中的所有对象
    this.disposeScene();

    // 其他资源的释放需要在具体组件中进行
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  // 销毁场景中的所有对象
  disposeScene() {
    // 递归遍历场景中的所有对象
    this.scene.traverse((object) => {
      // 销毁几何体
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }

        // 销毁材质
        if (object.material) {
          // 处理材质数组
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => {
              this.disposeMaterial(material);
            });
          } else {
            this.disposeMaterial(object.material);
          }
        }
      }
    });

    // 清空场景
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  // 销毁材质及其纹理
  private disposeMaterial(material: THREE.Material) {
    // 处理材质中的纹理
    for (const key in material) {
      const value = (material as any)[key];
      if (value && typeof value === 'object' && 'isTexture' in value) {
        value.dispose();
      }
    }

    // 销毁材质
    material.dispose();
  }
}
