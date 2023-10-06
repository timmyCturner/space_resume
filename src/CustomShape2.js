import * as THREE from 'three';
import React, { useRef, useMemo, } from 'react';
import { useFrame,useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'
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


export function Shapes2({ count,offset }) {
  const { nodes, materials } = useGLTF('/simpleGeom.glb')
  const mesh = useRef();
  const mat = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate particles with initial positions
  const particles = useMemo(() => {
    const temp = [];

    for (let i = 0; i < count; i++) {
      const factor =  generateRandomPointInSphericalShell(20, 50)

      const xFactor =  factor.x
      const yFactor =  factor.y
      const zFactor =  factor.z

      const emission =  Math.random() * 5 + 1;

      temp.push({ xFactor, yFactor, zFactor });
    }
    return temp;
  }, [count]);

  if(mesh.current){
    // Update the instanced mesh once
    particles.forEach((particle, i) => {
      const { xFactor, yFactor, zFactor } = particle;
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
    if (mesh.current) {
      particles.forEach((particle, i) => {
        const { xFactor, yFactor, zFactor } = particle;
        //console.log(particle);
        // You can modify the emission intensity here based on your animation logic

        const off = Random.noise1D(state.clock.elapsedTime+(i*100), 0.1);
        const tOff = mapRange(off, -1, 1, 0, 1);


        const minRotation = -Math.PI*2; // Minimum rotation angle
         const maxRotation = Math.PI*2; // Maximum rotation angle
         const range = maxRotation - minRotation;
         const halfRange = range / 2;

         // Calculate the interpolated rotation within the specified range
         const interpolatedRotation = new THREE.Euler(
           lerp(minRotation, maxRotation, tOff),
           lerp(minRotation, maxRotation, tOff),
           lerp(minRotation, maxRotation, tOff),
           'XYZ'
         );

         const interpolatedRotationX = lerp(minRotation, maxRotation, tOff);

       // Create a new identity matrix

       const matrix = new THREE.Matrix4().makeRotationX(interpolatedRotationX).makeRotationY(interpolatedRotationX).makeRotationZ(interpolatedRotationX);;
       matrix.setPosition(new THREE.Vector3(xFactor, yFactor, zFactor));
       // Apply the final transformation matrix to the instance at index i
       mesh.current.setMatrixAt(i, matrix);
      });
      mesh.current.instanceMatrix.needsUpdate = true; // Ensure the instanceMatrix is updated
    }
  });


  return (
    <instancedMesh ref={mesh} scale = {0.2} args={[null, null, count]}>
      <primitive object={nodes.Sphere.geometry} /> {/* Replace 'YourGeometryNodeName' with the actual name of your geometry node */}
      <meshPhysicalMaterial ref={mat}
        color={"red"}
        roughness={0.5}
        metalness={0.2}
        emissive={"red"}
        emissiveIntensity={3.25}
      />
    </instancedMesh>
  );
}
useGLTF.preload('/simpleGeom.glb')
