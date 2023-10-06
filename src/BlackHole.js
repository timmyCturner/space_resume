import React from 'react';
import { PortalBody } from './PortalBody';
import { SparkStormCustom } from './SparkStormCustom';
//http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/

export function BlackHole() {


  //console.log(planet);
  const props={
    scale:5.8,
    count:30,
    radius:1,
    ior:1
  }
  const colors = {

    malevolentIllusion: [
      '#9ac069',
      '#a8de77',
      '#b4df86',
      '#c0d998',
      '#c6eead',
      '#c9f9c6',
  ],
    sunnyRainbow: [
      '#431C0D',
      '#6E3907',
      '#A85604',
      '#FFB600',
      '#FFD200',
      '#FFE74C',
      '#FFED7D'
    ],
    blackRainbow: [
      '#05070A',
      '#1E2A3A',
      '#3D4D5C',
      '#6E879C',
      '#AAB9C9',
      '#CED8E4',
      '#E4EBF1'
    ],
  };
  return (
    <group position={[-22,0,0]}>
    <mesh position={[0,0,0]} scale = {1}>
      <sphereGeometry args={[5, 36]} />
      <meshPhysicalMaterial
        color={"#000"}
        roughness={1}
        metalness={0}
        emissive={"#000"}
        emissiveIntensity={0}
      />
    </mesh>
    <PortalBody  props = {props}/>
    <SparkStormCustom  count={100}  colors={colors.sunnyRainbow} radius = {3} />
    </group>
  );
}
