varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    /**
    modelMatrix包含了平移、旋转和缩放信息 
    viewMatrix代表着相机的位置和朝向 
    projectionMatrix代表着投影矩阵 
    顺序是modelMatrix→viewMatrix→projectionMatrix
    */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // 将法线转换到视图空间
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
}