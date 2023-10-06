import React, { useRef, useEffect, useState  } from 'react'
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber'
import useStore from './store'
import {Html } from '@react-three/drei';
import About from './Components/About';
import Resume from './Components/Resume';
import Testimonials from './Components/Testimonials';
import Portfolio from './Components/Portfolio';
import Skills from './Components/Skills';
import Videos from './Components/Videos';

import AnionCreative from './Components/anioncreative';
import {mapRange, lerp } from 'canvas-sketch-util/math';
import Random from 'canvas-sketch-util/random';

let offset = 0

export  function Rig( {jsonData, children }) {
  const group = useRef()
  const html = useRef()
  const border = useRef()
  const mutation = useStore((state) => state.mutation)
  const { fov, scale, binormal, normal, track, mouse,curr_index } = mutation



  const components = [
    <About data={jsonData.main} />,
    <Resume data={jsonData.resume}/>,
    <Videos data={jsonData.videos}/>,
    <AnionCreative data = {jsonData.anioncreative}/>,
    <Portfolio data={jsonData.portfolio}/>,
    <Skills data={jsonData.resume}/>

  ];

  const { camera } = useThree()
  const delayFactor = 0.3; // Adjust this to control the delay effect
  let newScalar = 0.2;


  // Define the 3D border component

  const tubeLength = (scalar) => {
    //Create a new curve with updated control points

    scalar += newScalar
    //lineRef.current.children[4].geometry = boxGeometry;
  }
  const increaseTubeLength = () => {


    if (newScalar<0.45){
      // Increment the scalar value to change the tube's length over time
      //console.log(html.current);
      html.current.children[0].scale.x=html.current.children[0].scale.y=html.current.children[0].scale.z = newScalar += 0.05; // You can adjust the speed of the animation
      //console.log(html.current.scale);


    }

  };

  const decreaseTubeLength = () => {


    if (newScalar>0.05){
      // Increment the scalar value to change the tube's length over time
      html.current.children[0].scale.x=html.current.children[0].scale.y=html.current.children[0].scale.z = newScalar -= 0.05; // You can adjust the speed of the animation


      //console.log(html.current.children[0].scale);
      //console.log(lineRef.current.children[1].geometry);
    }

  };

   const [currIndex, updateCurrIndex] = useState(0);







  useFrame((state) => {

    //console.log(m);
    //console.log(mutation.curr_index,mutation.curr_index%2,mutation.waitingForAnimation,mutation.needsAnimation,mutation.isPlaying);
    const t = mutation.t
    const pos = mutation.position.clone()
    const segments = track.tangents.length
    const pickt = t * segments
    const pick = Math.floor(pickt)
    const pickNext = (pick + 1) % segments
    binormal.subVectors(track.binormals[pickNext], track.binormals[pick])
    binormal.multiplyScalar(pickt - pick).add(track.binormals[pick])
    const dir = track.parameters.path.getTangentAt(t)
    offset += (Math.max(15, 15 + -mouse.y / 20) - offset) * 0.05
    normal.copy(binormal).cross(dir)


    if(mutation.needsAnimation){
      setTimeout(() => {
        mutation.needsAnimation = false;
        increaseTubeLength()
        //console.log(lineRef.children[0].geometry.parameters);
        // Perform your action here

      }, 500)

      updateCurrIndex(mutation.curr_index%2);
      //console.log(currIndex);

    }
    else if(mutation.waitingForAnimation){
      decreaseTubeLength()
      setTimeout(() => {
        mutation.waitingForAnimation = true;

        //console.log(lineRef.children[0].geometry.parameters);
        // Perform your action here

      }, 500)
    }
    else{
      const off = Random.noise1D(state.clock.elapsedTime, 0.25);
      const tOff = mapRange(off, -1, 1, 0, 1);
      // Use lerp for HTML element rotation

      const initialRotation = new THREE.Euler(camera.rotation.x-Math.PI / 32, camera.rotation.y-Math.PI / 32, camera.rotation.z-Math.PI / 32);
      const targetRotation = new THREE.Euler(camera.rotation.x+Math.PI / 32, camera.rotation.y+Math.PI / 32, camera.rotation.z+Math.PI / 32);


      html.current.rotation.x = lerp(initialRotation.x, targetRotation.x, tOff);
      html.current.rotation.y = lerp(initialRotation.y, targetRotation.y, tOff);
      html.current.rotation.z = lerp(initialRotation.z, targetRotation.z, tOff);


    }



    pos.add(normal.clone().multiplyScalar(offset))
    camera.position.copy(pos)
    const lookAt = track.parameters.path.getPointAt((t + 5 / track.parameters.path.getLength()) % 1).multiplyScalar(scale)
    camera.matrix.lookAt(camera.position, lookAt, normal)
    camera.quaternion.setFromRotationMatrix(camera.matrix)
    //camera.fov += ((t > 0.4 && t < 0.45 ? 120 : fov) - camera.fov) * 0.05
    //camera.updateProjectionMatrix()
    const lightPos = track.parameters.path.getPointAt((t+1 / track.parameters.path.getLength()) % 1).multiplyScalar(scale)
    group.current.position.copy(lightPos)
    group.current.quaternion.setFromRotationMatrix(camera.matrix)

  })



  return (
    <group>
      <group ref={group}>
        <pointLight distance={400} position={[0, 100, -420]} intensity={5} color="indianred" />
        <group  position={[0, 6, -5]}>
          {children}
        </group>

        </group>

          <group ref = {html} >
            <Html castShadow receiveShadow  position={[0, 2, 0]} center transform  scale = {0}  distanceFactor={5}>


             {components[currIndex]}

            </Html>



        </group>

    </group>
  )

}
