import shallow from 'zustand/shallow';
import { OrbitControls, CameraShake, Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { BlackHole } from './BlackHole';
import { Sun} from './Sun';
import { SparkStormCustom } from './SparkStormCustom';
import { SparkStormTrueAtractor } from './SparkStormTrueAtractor';
import { SpaceDust } from './SpaceDust';
import { Stars } from './Stars';
import { Shapes } from './CustomShape';
import { Shapes2 } from './CustomShape2';
import { EyeOrb } from './EyeOrb';
import {  useFrame } from '@react-three/fiber'
import { Cloud} from "@react-three/drei";
import Track from './3d/Track'
import { Rig } from './Rig';
import useStore from './store'

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


export function Scene({ init = true, mouse, cameraRef, jsonData,prevMutation,setPrevMutation }) {

  //const [prevMutation, setPrevMutation] = useState(mutation);

  const mutation = useStore((state) => state.mutation)
  const actions = useStore((state) => state.actions)
  let needsUpdate = true;
  const updateCurrIndex = (newIndex) => {
    // You can perform any necessary actions here
    // For example, update the mutation.curr_index

    //console.log('updateSceneIndex');
    // Update the prevMutation state if needed
    setPrevMutation(newIndex % 6);
  };
  useEffect(() => {
    // /console.log((prevMutation !== mutation || !prevMutation),props.currIndex);
    // Check if the mutation object has changed
    //console.log(mutation.curr_index);
    //console.log(prevMutation);
    needsUpdate = true;
    if(prevMutation){
      if (!prevMutation.curr_index) {
        //console.log("App mutation: "+mutation.curr_index,prevMutation);
        ///updateCurrIndex(prevMutation)

        //actions.updateCurrIndex(prevMutation)
      }
      else if(!prevMutation.curr_index.currIndex){
        //console.log(prevMutation.curr_index);
        //updateCurrIndex(prevMutation.curr_index)
        //actions.updateCurrIndex(prevMutation.curr_index)
      }
      else{
        //console.log(prevMutation)
        updateCurrIndex(mutation.curr_index)

      }
    }

    else{
      //console.log(prevMutation);
    }

  }, [mutation.curr_index, prevMutation]);
  useFrame(() => {
    //console.log(html.current.position);
    //console.log(mutation.waitingForAnimation);
    if (needsUpdate){
      //console.log(prevMutation);
      mutation.curr_index = prevMutation
      //actions.updateCurrIndex(prevMutation)
    }
    needsUpdate= false;

  })
  // <Shapes count={10} offset={4}   />
  // <Shapes2 count={10} offset={4}   />

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={true}
        enableZoom={true}


      />



      <ambientLight distance={100} intensity={2} color="#e7f7b0" />
      <group >

        <SpaceDust count={250} mouse={mouse} />


        <BlackHole  />
        <Sun  />
        <Stars count={50} offset={1}  />
        <Stars count={50} offset={2}  />
        <Stars count={50} offset={3}  />
        <Stars count={50} offset={4}  />
        <Shapes count={10} offset={4}   />


        <Track />

        <Rig jsonData = {jsonData}>
          <EyeOrb/>
        </Rig>

      </group>
    </>
  );
}
