import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import { lerp, mapRange } from 'canvas-sketch-util/math';

const radiusVariance = () => Random.range(0.2, 1);

function FatLine({ curve, width, color, speed }) {
  const material = useRef();



  useFrame(() => {
    material.current.uniforms.dashOffset.value -= speed;

    material.current.uniforms.lineWidth.value =
      width * mapRange(0.25, 0.2, 0.4, 0.1, 2, true);

  });

  return (
    <mesh>
      <meshLine attach="geometry" points={curve} />
      <meshLineMaterial
        attach="material"
        ref={material}
        transparent
        depthTest={true}
        depthWrite={false}
        lineWidth={width}
        color={color}
        dashArray={0.1}
        dashRatio={0.95}
      />
    </mesh>
  );
}

export function Sparks({ count, colors, radius = 1 }) {

  const lines = useMemo(
    () =>
      new Array(count).fill().map((_, index) => {
        const pos = new THREE.Vector3(
          Math.sin(0) * radius * radiusVariance(),
          Math.cos(0) * radius * radiusVariance(),
          0
        );
        const points = new Array(30).fill().map((_, index) => {
          const angle = (index / 20) * Math.PI * 2;
          return pos
            .add(
              new THREE.Vector3(
                Math.sin(angle) * radius * radiusVariance(),
                Math.cos(angle) * radius * radiusVariance(),
                0
              )
            )
            .clone();
        });
        const curve = new THREE.CatmullRomCurve3(points).getPoints(200);
        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(0.1, (0.2 * index) / 10),
          speed: Math.max(0.001, 0.004 * Math.random()),
          curve,
        };
      }),
    [count]
  );

  const ref = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = lerp(
        ref.current.rotation.x,
        0 + 0.25,
        0.1
      );
      ref.current.rotation.y = lerp(
        ref.current.rotation.y,
        0 + 0.5,
        0.1
      );
    }
  });
  //position={[-radius * 2, -radius, -10]}
  return (
    <group ref={ref} >
      <group position={[2, -4, -10]} scale={[2, 2, 2]}>
        {lines.map((props, index) => (
          <FatLine key={index} {...props} />
        ))}
      </group>
    </group>
  );
}
