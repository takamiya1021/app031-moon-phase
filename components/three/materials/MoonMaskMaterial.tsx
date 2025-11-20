'use client';

import { shaderMaterial } from '@react-three/drei';
import { Vector3 } from 'three';
import { extend } from '@react-three/fiber';
import type { ReactThreeFiber } from '@react-three/fiber';

const vertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D map;
  uniform sampler2D normalMap;
  uniform vec3 lightDir;
  uniform float illumination;
  uniform float maskSoftness;

  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 baseColor = texture(map, vUv).rgb;
    vec3 normalTex = texture(normalMap, vUv).rgb * 2.0 - 1.0;
    vec3 perturbedNormal = normalize(vNormal + normalTex * 0.8);
    vec3 lightVector = normalize(lightDir);
    float ndl = dot(perturbedNormal, lightVector);

    vec3 shadowColor = vec3(0.0, 0.0, 0.0);
    vec3 litColor = baseColor;
    
    // 参考画像のようなシャープなターミネーターとなだらかな地球照
    float terminator = smoothstep(-maskSoftness * 0.5, maskSoftness * 0.5, ndl);
    
    // 2枚目の参考画像のように、地球照を強化（影の部分もはっきり見える）
    vec3 earthShine = baseColor * vec3(0.75, 0.78, 0.95) * 0.25;
    
    vec3 color = mix(shadowColor + earthShine, litColor, terminator);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const MoonMaskMaterial = shaderMaterial(
  {
    map: undefined,
    normalMap: undefined,
    lightDir: new Vector3(0, 0, 1),
    illumination: 1,
    maskSoftness: 0.17,
  },
  vertexShader,
  fragmentShader
);

extend({ MoonMaskMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      moonMaskMaterial: ReactThreeFiber.Object3DNode<typeof MoonMaskMaterial, typeof MoonMaskMaterial>;
    }
  }
}

export { MoonMaskMaterial };
