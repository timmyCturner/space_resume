import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Billboard } from '../node_modules/@react-three/drei/core/Billboard.js';
import { Plane } from '../node_modules/@react-three/drei/core/shapes.js';
import { useTexture } from '../node_modules/@react-three/drei/core/useTexture.js';
import * as THREE from 'three';
const CLOUD_URL = 'pinkCloud.png';
// ... (previous imports and code)

function Cloud({
  opacity = 0.3,
  speed = 0.4,
  width = 20,
  depth = 1,
  segments = 15,
  scaleRatio = false,
  texture = CLOUD_URL,
  depthTest = true,
  color = "#3b8180",
  ...props
}) {
    let scaleWidth = 1;
    if(scaleRatio){
      scaleWidth = width/7.5
    }
    const cameraRef = React.useRef();
    const group = React.useRef();
    const cloudTexture = useTexture(texture);
    const clouds = React.useMemo(() => [...new Array(segments)].map((_, index) => ({
      x: width / 2 - Math.random() * width,
      y: width / 2 - Math.random() * width,
      scale: 1* (1 + Math.sin((index + 1) / segments * Math.PI) * ((1 + Math.random()) * 10)),
      density:  Math.max(0.2, Math.random()),
      rotation: Math.max(0.002, 0.005 * Math.random()) * speed
    })), [width, segments, speed]);
    useThree(({ camera }) => {
      //console.log(camera);
      cameraRef.current = camera

     //camera.rotation.set(THREE.MathUtils.degToRad(30), 0, 0);
   });
    useFrame(state => {
      var _group$current;
      if (cameraRef.current && group.current) {
          const targetPosition = new THREE.Vector3().setFromMatrixPosition(cameraRef.current.matrixWorld);
          group.current.lookAt(targetPosition);
        }

      return (_group$current = group.current) == null ? void 0 : _group$current.children.forEach((cloud, index) => {
        if (cameraRef.current) {
          const targetPosition = new THREE.Vector3().setFromMatrixPosition(cameraRef.current.matrixWorld);
          cloud.children[0].lookAt(targetPosition);
        }
        cloud.children[0].scale.setScalar(clouds[index].scale + (1 + Math.sin(state.clock.getElapsedTime() / 10)) / 2 * index / 10);

      });
    });

  // useFrame(state => {
  //   // ... (previous code)
  //v  color = "#643b81"
  //   cloud.children[0].scale.setScalar(clouds[index].scale + (1 + Math.sin(state.clock.getElapsedTime() / 10)) / 2 * index / 10);
  // });

  return (
    <group {...props}>
      <group position={[0, 0, segments / 2 * depth]} ref={group}>
        {clouds.map(({ x, y, scale, density }, index) => (
          <Billboard key={index} position={[x, y, -index * depth]}>
            <Plane scale={scale} rotation={[0, 0, 0]}>
            <meshBasicMaterial
              map={cloudTexture}
              transparent
              opacity={scale / 24 * density * opacity}
              depthTest={true}
              depthWrite = {false}
              color = {color}
            />
            </Plane>
          </Billboard>
        ))}
      </group>
    </group>
  );
}

export { Cloud };
