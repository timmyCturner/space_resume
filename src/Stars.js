import * as THREE from 'three';
import React, { useRef, useMemo, } from 'react';
import { useFrame,useThree } from '@react-three/fiber';
import {mapRange, lerp } from 'canvas-sketch-util/math';
import Random from 'canvas-sketch-util/random';

function generateRandomPointInSphericalShell(minRadius, maxRadius) {
  while (true) {

    // Generate random coordinates within the bounding cube
    const x = (Math.random() - 0.5) * ( maxRadius);
    const y = (Math.random() - 0.5) * ( maxRadius);
    const z = (Math.random() - 0.5) * ( maxRadius);

    // Check if the point is inside the smaller sphere
    const distance = Math.sqrt(x * x + y * y + z * z);

    if (distance >= minRadius && distance <= maxRadius) {
      // Point is within the desired range, normalize it to the larger sphere's radius
      const scaleFactor = maxRadius / distance;
      const pointX = x * scaleFactor;
      const pointY = y * scaleFactor;
      const pointZ = z * scaleFactor;

      return { x: pointX, y: pointY, z: pointZ };
    }

  }
}


export function Stars({ count,offset }) {
  const mesh = useRef();
  const mat = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate particles with initial positions
  const particles = useMemo(() => {
    const temp = [];

    for (let i = 0; i < count; i++) {
      const factor =  generateRandomPointInSphericalShell(10, 45)

      const xFactor =  factor.x
      const yFactor =  factor.y
      const zFactor =  factor.z

      const emission =  Math.random() * 5 + 1;

      temp.push({ xFactor, yFactor, zFactor, emission });
    }
    return temp;
  }, [count]);

  if(mesh.current){
    // Update the instanced mesh once
    particles.forEach((particle, i) => {
      const { xFactor, yFactor, zFactor, emission } = particle;
      dummy.position.set(
        xFactor,
        yFactor,
        zFactor
      );
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
  }
  useFrame((state) => {
    if (mat.current) {
      particles.forEach((particle, i) => {
        const { xFactor, yFactor, zFactor, emission } = particle;

        // You can modify the emission intensity here based on your animation logic

        const off = Random.noise1D(state.clock.elapsedTime+(offset*500), 0.75);
        const tOff = mapRange(off, -1, 1, 0, 1);


        // Update the emissiveIntensity property for each star
        mat.current.emissiveIntensity =  lerp(1, emission, tOff);
      });

      // Notify Three.js that the instanced mesh has been updated
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshPhysicalMaterial ref={mat}
        color={"gold"}
        roughness={0.5}
        metalness={0.2}
        emissive={"white"}
        emissiveIntensity={2}
      />
    </instancedMesh>
  );
}
