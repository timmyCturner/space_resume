import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
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
        depthWrite ={false}
        lineWidth={width}
        color={color}
        dashArray={0.1}
        dashRatio={0.95}
      />
    </mesh>
  );
}

export function SparkStormTrueAtractor({ mouse, count, colors, radius = 1 }) {

  const lines = useMemo(
    () =>
      new Array(count).fill().map((_, index) => {
        const angle = (index / 20) * Math.PI * 2;
        const pos = new THREE.Vector3(
          0+20,
          Math.sin(angle) * radius * radiusVariance()-5,
          Math.cos(angle) * radius * radiusVariance()
        );
        const points = new Array(30).fill().map((_, index) => {
          const angle = (index / 20) * Math.PI * 2;
          return pos
            .add(
              new THREE.Vector3(
                -index/8+0.5,
                Math.sin(angle) * radius * radiusVariance()-0.05,
                Math.cos(angle) * radius * radiusVariance()+0.25
              )
            )
            .clone();
        });
        const curve = new THREE.CatmullRomCurve3(points).getPoints(500);
        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(0.1, (0.2 * index) / 10)/2,
          speed: Math.max(0.001, 0.004 * Math.random())*1.25,
          curve,
        };
      }),
    [count,colors,radius]
  );

  const ref = useRef();


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
    <group ref={ref}>
      <group position={[2, -4, -10]} scale={[1, 1, 1]}>
        {lines.map((props, index) => (
          <FatLine key={index} {...props} />
        ))}
      </group>
    </group>
  );
}
