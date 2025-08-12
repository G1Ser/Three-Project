uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereDuskColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 color = vec3(0.0);
    vec3 normal = normalize(vNormal);

    // sun orientation
    float sunOrientation = dot(uSunDirection, normal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // atmosphere
    float atmosphereMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereDuskColor, uAtmosphereDayColor, atmosphereMix);
    color = mix(color, atmosphereColor, atmosphereMix);
    color += atmosphereColor;

    // fresnel
    float fresnel = dot(viewDirection, normal);
    fresnel = pow(fresnel, 2.0);

    // alpha
    float edgeAlpha = smoothstep(0.0, 0.5, fresnel);
    float dayAlpha = smoothstep(-0.5, 0.0, sunOrientation);
    float alpha = edgeAlpha * dayAlpha;

    gl_FragColor = vec4(color, alpha);
    
    // 用于将线性颜色空间转换为显示所需的颜色空间 如果不加，会导致颜色显示不正确（过暗或者失真）
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}