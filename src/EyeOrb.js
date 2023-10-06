import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF,Html } from '@react-three/drei';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import useStore from './store'
import About from './Components/About';
import Random from 'canvas-sketch-util/random';
import eyeOrb from './models/eyeOrb.glb'
export function EyeOrb(props, width = 0.5, opacity = 0.25) {



  const group = useRef();
  const html = useRef();
  const lineRef = useRef();
  const mutation = useStore((state) => state.mutation)
  const { track } = mutation
  const { camera,size } = useThree()

  //const materialRed = useRef();
  //console.log(mutation);
  const { nodes, materials } = useGLTF(
    eyeOrb
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );

  function getRotationFromMatrix() {

      const quaternion = new THREE.Quaternion();
      //quaternion.setFromRotationMatrix(matrix);
      //console.log(quaternion);
      const euler = new THREE.Euler();
      //euler.setFromQuaternion(quaternion);


  return euler;
  }

  useFrame((state) => {

    if(mutation.needsAnimation){
      setTimeout(() => {
        mutation.needsAnimation = false;
        increaseTubeLength()
        //console.log(lineRef.children[0].geometry.parameters);
        // Perform your action here

      }, 500)
    }
    else if(mutation.waitingForAnimation){
      //console.log('hit');
      decreaseTubeLength()
      setTimeout(() => {
        mutation.waitingForAnimation = false;

        //console.log(lineRef.children[0].geometry.parameters);
        // Perform your action here

      }, 500)
    }
    else{
      if (group.current){
        const trueRotation = getRotationFromMatrix()
        const off = Random.noise1D(state.clock.elapsedTime, 0.25);
        const tOff = mapRange(off, -1, 1, 0, 1);
        // Use lerp for HTML element rotation

        const initialRotation = new THREE.Euler(trueRotation.x-Math.PI / 32, trueRotation.y-Math.PI / 32, trueRotation.z-Math.PI / 32);
        const targetRotation = new THREE.Euler(trueRotation.x+Math.PI / 32, trueRotation.y+Math.PI / 32, trueRotation.z+Math.PI / 32);

        //
        group.current.rotation.x = lerp(initialRotation.x, targetRotation.x, tOff);
        group.current.rotation.y = lerp(initialRotation.y, targetRotation.y, tOff);
        group.current.rotation.z = lerp(initialRotation.z, targetRotation.z, tOff);
      }

    }

  })
    const tubeLength = (scalar) => {
      //Create a new curve with updated control points

      const stl = (screenTopLeft.clone().add(new THREE.Vector3(-screenWidth / 2, (screenHeight / 2), 100))).multiplyScalar(scalar)
      const str = (screenTopLeft.clone().add(new THREE.Vector3(-screenWidth / 2, (screenHeight / 2), 100)).add(new THREE.Vector3(screenWidth, 0))).multiplyScalar(scalar)
      const sbl = (screenTopLeft.clone().add(new THREE.Vector3(-screenWidth / 2, (screenHeight / 2), 100)).add(new THREE.Vector3(0, -screenHeight, 0))).multiplyScalar(scalar)
      const sbr = (screenTopLeft.clone().add(new THREE.Vector3(-screenWidth / 2, (screenHeight / 2), 100)).add(new THREE.Vector3(screenWidth, -screenHeight, 0))).multiplyScalar(scalar)
      //console.log(stl,str,sbl,sbr);
      //console.log((screenTopLeft.clone().add(new THREE.Vector3(-screenWidth / 2, (screenHeight / 2), 100))));
      //console.log((screenTopLeft.clone().add(new THREE.Vector3(-screenWidth / 2, (screenHeight / 2), 100))));
      //console.log(screenTopLeft.clone().add(new THREE.Vector3(-screenWidth / 2-6, (screenHeight / 2)-75, 100)).add(new THREE.Vector3(screenWidth, -screenHeight, 0)).multiplyScalar(scalar));
      const newCurve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        stl,
      ]);
      const newCurve0 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        str
      ]);
      const newCurve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        sbl
      ]);
      const newCurve3 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        sbr
      ]);

      //console.log(stl,screenTopLeft.clone().add(new THREE.Vector3(-screenWidth / 2-6, (screenHeight / 2)-75, 100)).add(new THREE.Vector3(screenWidth, -screenHeight, 0)).multiplyScalar(scalar));
      // Update the tube's geometry with the new curve
      const tubeGeometry1 = new THREE.TubeGeometry(newCurve1, 2, 0.05, 5, true);
      const tubeGeometry0 = new THREE.TubeGeometry(newCurve0, 2, 0.05, 5, true);
      const tubeGeometry2 = new THREE.TubeGeometry(newCurve2, 2, 0.05, 5, true);
      const tubeGeometry3 = new THREE.TubeGeometry(newCurve3, 2, 0.05, 5, true);
      const boxGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([stl, str, sbr, sbl, stl]), // Make sure to close the loop
        4,
        0.05,
        4,
        true
      );
      lineRef.current.children[1].geometry = tubeGeometry1;
      lineRef.current.children[0].geometry = tubeGeometry0;
      lineRef.current.children[2].geometry = tubeGeometry2;
      lineRef.current.children[3].geometry = tubeGeometry3;
      //lineRef.current.children[4].geometry = boxGeometry;
    }
  const increaseTubeLength = () => {
    if (!lineRef.current) return;

    if (scalar<0.04){
      // Increment the scalar value to change the tube's length over time
      scalar += 0.0012; // You can adjust the speed of the animation
      tubeLength(scalar)


    }

  };

  const decreaseTubeLength = () => {
    if (!lineRef.current) return;

    if (scalar>0.00){
      // Increment the scalar value to change the tube's length over time
      scalar -= 0.0025; // You can adjust the speed of the animation
      tubeLength(scalar)


      //console.log(lineRef.current.children[1].geometry);
    }

  };

  // Get the camera's position
  const cameraPosition = camera.position.clone();


  const screenWidth = size.width/2;
  const screenHeight = size.height/2;

// Calculate the positions of the corners of the screen
const screenTopLeft = cameraPosition.clone()
  .add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(camera.position.z))
  .add(new THREE.Vector3(-screenWidth / 2, (screenHeight / 2), 100));


  let scalar = 0.00

  const tube1Geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, -0.25, 0),screenTopLeft.multiplyScalar(scalar)]),5,0.05, 5,true );



  const material1 = new THREE.MeshPhongMaterial({  color: 0xc70000, emissive:0xc70000, transparent: 1, name: "Emit" }) //new THREE.MeshStandardMaterial({ color: 0xdddddd, opacity:0})
  const material2 =  new THREE.MeshPhongMaterial({  color: 0xa7c700, emissive:0xa7c700, transparent: 1, name: "Emit" })
  const materialT = new THREE.MeshStandardMaterial({ color: 0xa7c700, side: THREE.DoubleSide, emissive:0xa7c700, emissiveIntensity:5, })
  const silverMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF, // Silver color
    metalness: 0.9,    // Fully metallic
    roughness: 0.5,  // Adjust this value for the desired level of roughness
    emissive: 0x000000, // No emissive color
    emissiveIntensity:0
  });


  return (
    <>

      <group ref={group}  {...props} dispose={null}  position={[0,0, 0]}>
        <mesh geometry={nodes.Cylinder.geometry} material={silverMaterial} position={[0.278, 0, 0.005]} rotation={[0, -Math.PI / 2, 0]} scale={[1.165, 0.047, 1.165]} />
        <group position={[0.278, 0, 0.005]} rotation={[0,0, 0]} scale={0.891}>
          <mesh geometry={nodes.Sphere_1.geometry} material={material2} />
          <mesh geometry={nodes.Sphere_2.geometry} material={materials.RedEmissive} />
          <mesh geometry={nodes.Sphere_3.geometry} material={silverMaterial} />

        </group>
        <group ref={lineRef}>
          <mesh geometry={tube1Geometry} material={materialT} />;
          <mesh geometry={tube1Geometry} material={materialT} />;
          <mesh geometry={tube1Geometry} material={materialT} />;
          <mesh geometry={tube1Geometry} material={materialT} />;


        </group>


        <group position={[0, 0,0]}>

      </group>
    </group>



    </>
  );
}


useGLTF.preload(
  eyeOrb
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
