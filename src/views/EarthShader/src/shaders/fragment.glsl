uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 color = vec3(0.0);

    // texture color
    vec3 dayColor = texture(uDayTexture,vUv).rgb;
    color = dayColor;

    gl_FragColor = vec4(color, 1.0);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}