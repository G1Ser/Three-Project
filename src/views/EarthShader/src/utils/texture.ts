/**
 * 加载纹理
 */
import * as THREE from 'three';
import DayTexture from '../images/day.jpg';
import NightTexture from '../images/night.jpg';

const textureLoader = new THREE.TextureLoader();

const loadTexture = (url: string) => {
  const texture = textureLoader.load(url);
  // 转换成显示器显示 不加会很亮
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const earthDayTexture = loadTexture(DayTexture);
const earthNightTexture = loadTexture(NightTexture);

export { earthDayTexture, earthNightTexture };
