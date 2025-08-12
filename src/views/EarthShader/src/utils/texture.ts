/**
 * 加载纹理
 */
import * as THREE from 'three';
import DayTexture from '../images/day.jpg';
import NightTexture from '../images/night.jpg';
import CloudTexture from '../images/specularClouds.jpg';

const textureLoader = new THREE.TextureLoader();

const loadTexture = (url: string) => {
  const texture = textureLoader.load(url);
  // 转换成显示器显示 不加会很亮
  texture.colorSpace = THREE.SRGBColorSpace;
  // 改善纹理在倾斜视角下的清晰度，减少模糊
  texture.anisotropy = 4;
  return texture;
};

const earthDayTexture = loadTexture(DayTexture);
const earthNightTexture = loadTexture(NightTexture);
const earthCloudTexture = loadTexture(CloudTexture);

export { earthDayTexture, earthNightTexture, earthCloudTexture };
