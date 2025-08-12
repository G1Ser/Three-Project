uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uCloudTexture;
uniform vec3 uSunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 color = vec3(0.0);
    vec3 normal = normalize(vNormal);

    // texture color
    vec3 dayColor = texture(uDayTexture,vUv).rgb;
    vec3 nightColor = texture(uNightTexture,vUv).rgb;
    vec3 cloudColor = texture(uCloudTexture,vUv).rgb;

    // sun orientation
    float sunOrientation = dot(uSunDirection, normal);
    float dayMix = smoothstep(-0.25, 0.75, sunOrientation);
    float cloudMix = smoothstep(0.25, 1.0, cloudColor.g);
    cloudMix *= dayMix;
    color = mix(nightColor, dayColor, dayMix);
    color = mix(color, vec3(1.0), cloudMix);

    gl_FragColor = vec4(color, 1.0);
    
    // 用于将线性颜色空间转换为显示所需的颜色空间 如果不加，会导致颜色显示不正确（过暗或者失真）
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}