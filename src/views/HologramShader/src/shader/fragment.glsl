uniform sampler2D uColorTexture;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// 科技蓝色 #70c1ff (转换为RGB: 112/255, 193/255, 255/255)
const vec3 TECH_BLUE = vec3(0.439, 0.757, 1.0);

void main()
{
    // 基础纹理颜色
    vec3 textureColor = texture2D(uColorTexture, vUv).rgb;
    float stripes = mod((vPosition.y - uTime * 0.05) * 100.0, 1.0);
    stripes = pow(stripes, 3.0);
    vec3 normal = normalize(vNormal);
    // 视线方向
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = 1.0 - abs(dot(normal, viewDirection));
    fresnel = pow(fresnel, 2.0); // 增强边缘效果
    
    // 结合条纹和菲涅尔
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    // 减少边缘的亮度
    float fallof = smoothstep(0.8, 0.0, fresnel);
    holographic *= fallof;
    
    // 应用科技蓝色
    vec3 color = mix(textureColor, TECH_BLUE, 0.8);
    
    // 添加闪烁效果
    float flicker = sin(uTime * 5.0) * 0.05 + 0.95;
    
    // 最终颜色和透明度
    gl_FragColor = vec4(color * flicker, holographic);

    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}