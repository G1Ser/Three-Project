/**
 * 加载纹理
 */
import * as THREE from 'three';
import ColorTexture from '../texture/dream.jpg';

const textureLoader = new THREE.TextureLoader();

const loadTexture = (url: string) => {
  const texture = textureLoader.load(url);
  // 转换成显示器显示 不加会很亮
  texture.colorSpace = THREE.SRGBColorSpace;
  // 改善纹理在倾斜视角下的清晰度，减少模糊
  texture.anisotropy = 4;
  // 解决纹理翻转问题，软件和threejs uv坐标系 Y轴是相反的
  texture.flipY = false;
  return texture;
};

const colorTexture = loadTexture(ColorTexture);

export { colorTexture };
