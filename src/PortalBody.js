import * as THREE from 'three';
import React, { useRef, useMemo, useEffect  } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {useGLTF, MeshTransmissionMaterial, } from '@react-three/drei';

import { Sparks } from './Sparks';
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

  export function PortalBody({props}) {
     if (!props){
        props={
         scale:5.95,
         count:50,
         radius:1,
         ior: 1
       }
     }

    const cameraRef = useRef();
    const mesh = useRef();
  //const config = useContr
    const config = {
      meshPhysicalMaterial: false,
      transmissionSampler: true,
      backside: false,
      samples: 32,//{ value: 32, min: 1, max: 32, step: 1 },
      resolution: 2048,//{ value: 2048, min: 256, max: 2048, step: 256 },
      transmission:1,//{ value: 1, min: 0, max: 5 },
      roughness: 0.25,//{ value: 0.0, min: 0, max: 1, step: 0.01 },
      thickness: 0.25,//{ value: 3.5, min: 0, max: 10, step: 0.01 },
      ior: props.ior,//{ value: 1, min: 1, max: 5, step: 0.01 },
      chromaticAberration: 0,//{ value: 0.04, min: 0, max: 1 },
      anisotropy: 0,//{ value: 0.0, min: 0, max: 1, step: 0.01 },
      distortion: 1,//{ value: 0.0, min: 0, max: 1, step: 0.01 },
      distortionScale: 1,//{ value: 0.3, min: 0.01, max: 1, step: 0.01 },
      temporalDistortion:1,//{ value: 0.5, min: 0, max: 1, step: 0.01 },
      clearcoat:0,//{ value: 0, min: 0, max: 1 },
      attenuationDistance: 7.07,//{ value: 0.5, min: 0, max: 10, step: 0.01 },
      attenuationColor: '#e07b16',
      color: '#908d51',
      bg: '#FFFFFF'
    }

    useFrame(() => {
    // Update the circle's rotation to face the camera

      if (cameraRef.current && mesh.current) {
        const targetPosition = new THREE.Vector3().setFromMatrixPosition(cameraRef.current.matrixWorld);
        mesh.current.lookAt(targetPosition);
      }
    });

    useThree(({ camera }) => {
      //console.log(camera);
      cameraRef.current = camera
     //camera.rotation.set(THREE.MathUtils.degToRad(30), 0, 0);
   });

    return (
      <group dispose={null} ref={mesh} scale = {props.scale} >

        <mesh >
          <circleGeometry />
          {config.meshPhysicalMaterial ? <meshPhysicalMaterial {...config} /> : <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />}
        </mesh>
        <Sparks count={props.count}  colors={colors.blackRainbow} speed= {50} radius = {props.radius}/>


      </group>
    )
  }
