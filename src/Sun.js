import React, { useRef} from 'react';


import { PortalBody } from './PortalBody';

import { SparkStormTrueAtractor } from './SparkStormTrueAtractor';
//http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/

export function Sun() {
  const planet = useRef();

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
  //console.log(planet);
  const props={
    scale:3.25,
    count:15,
    radius:0.75,
    ior:3
  }

  return (
    <group rotation = {[0,-Math.PI/4,0]}  position={[-5,0,0]}>

      <group position={[16,-1,-17]}>
      <directionalLight
        color={0xffffff} // Light color (white)
        intensity={1}    // Light intensity
        position={[0, 0, 0]} // Light position
        castShadow={true} // Enable shadows
        shadow-mapSize-width={1024} // Shadow map width
        shadow-mapSize-height={1024} // Shadow map height
      />
        <mesh ref={planet}  scale = {1}>
          <sphereGeometry args={[3, 36]} />
          <meshPhysicalMaterial
            color={"#eec34a"}
            roughness={0.5}
            metalness={0}
            emissive={"#ffff00"}
            emissiveIntensity={2}
          />
        </mesh>
        <PortalBody props = {props}/>
      </group>
      <SparkStormTrueAtractor  count={40} speed={0.4} colors={colors.sunnyRainbow} radius = {3}/>
      </group>
  );
}
