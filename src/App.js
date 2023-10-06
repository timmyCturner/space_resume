import * as THREE from 'three';
import React, { Suspense, useState, useEffect,  useCallback, useRef, useMemo } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import * as meshline from './MeshLine';
import { EffectComposer, Bloom } from  '@react-three/postprocessing'
import { Scene } from './Scene';
import { Environment } from '@react-three/drei';
import Header from './Components/Header0';
import useStore from './store'
import './css/default.css'
import './css/fonts.css'
import './css/layout.css'


extend(meshline);


export default function App({ useStore }) {




  const cameraRef = useRef();
  const [jsonData, setJsonData] = useState(null);
  const init = useStore((state) => state.init);
  const setInit = useStore((state) => state.setInit);
  const actions = useStore((state) => state.actions)

  const mutation = useStore((state) => state.mutation)
  const fov = mutation.fov
  let needsUpdate = true;
  // const setCameraRef = useCallback((camera) => {
  //   cameraRef.current = camera;
  // }, []);
  //const setCameraRef = useSetCamera();
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  const [prevMutation, setPrevMutation] = useState(mutation);


  const updateCurrIndex = (newIndex) => {
    // You can perform any necessary actions here
    //console.log('Updating currIndex to', newIndex % 6);
    //actions.updateCurrIndex(0)
    setPrevMutation(newIndex % 6)

  };

  useEffect(() => {
    // /console.log((prevMutation !== mutation || !prevMutation),props.currIndex);
    // Check if the mutation object has changed
    //console.log(mutation.curr_index);
    needsUpdate = true;
    if (!prevMutation.curr_index) {
      //console.log("App mutation: "+mutation.curr_index,prevMutation);
      setPrevMutation(prevMutation)
      //actions.updateCurrIndex(prevMutation)
    }
    else if(!prevMutation.curr_index.currIndex){
      //console.log(prevMutation.curr_index);
      setPrevMutation(prevMutation.curr_index)
      //actions.updateCurrIndex(prevMutation.curr_index)
    }
    else{
      //console.log(prevMutation)
      setPrevMutation(prevMutation)
      //actions.updateCurrIndex(prevMutation)
    }
  }, [mutation.curr_index, prevMutation, setPrevMutation]);

  useEffect(() => {
    //console.log(mutation.curr_index);
    setPrevMutation(mutation.curr_index)
    window.addEventListener('wheel', handleScroll);
  }, []);
  function postTransition() {
     mutation.isPlaying = false;
     mutation.needsAnimation = true;
    // mutation.waitingForAnimation = false;
    //console.log(mutation.curr_index,mutation.needsAnimation,mutation.isPlaying,mutation.waitingForAnimation);

  }
  const handleScroll = (event) => {
    const { deltaY } = event;
    const scrollIncrement = deltaY;
    //console.log(mutation);
    if (deltaY > 0 && mutation.curr_index !== 0) {
    } else {
        //console.log(!mutation.isPlaying ,!mutation.waitingForAnimation , !mutation.needsAnimation);
        if(!mutation.isPlaying && !mutation.waitingForAnimation && !mutation.needsAnimation){

          //actions.updateCurrIndex(mutation.curr_index + 1);
          //console.log('hit');
          mutation.waitingForAnimation=  true;
          setTimeout((state) => {
            mutation.isPlaying  = true;
            setPrevMutation(mutation.curr_index)
            setTimeout(postTransition, 1000);
          }, 500)
        }
        mutation.curr_index=(mutation.curr_index+1)%6

    }
  };

  useState(() => {
    // Add a scroll event listener when the component mounts
    //console.log("useState");
    //window.addEventListener('wheel', handleScroll);

    fetch('/resumeData.json', {
      method: 'GET',
      mode: 'cors', // Enable CORS
      headers: {
        'Content-Type': 'application/json',
        // Additional headers if needed
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Process JSON data
        //console.log('JSON data:', data);
        setJsonData(data);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    // Remove the scroll event listener when the component unmounts
    // return () => {
    //   window.removeEventListener('wheel', actions.handleScroll);
    // };
  }, []);



 // The empty dependency array ensures this effect runs once when the component mounts

  return (

    <div style={{ width: '100vw', height: '100vh' }}>
      <Header prevMutation={prevMutation} setPrevMutation={setPrevMutation}/>
      <Canvas
        linear
        mode="concurrent"
        dpr={[1, 5]}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 100], fov }}
        onCreated={({ gl, camera }) => {
          actions.init(camera)
          gl.setClearColor(new THREE.Color('#175d65'))
        }}>
        <fog attach="fog" args={['#070710', 100, 700]} />
        <ambientLight intensity={1} />


        {/*  <Environment files="./pinkMountain.hdr" background blur={0}/>
        <group  rotation = {[0,Math.PI/2,0]}>
           <Scene init={init} mouse={mouse} />
        </group>
        {generateCloudRing([0, 0, 0], 50, 50, { speed: 0.2, opacity: 0.25, segments: 25, size:5, depthTest: true, color: "#643b81" })}*/}

        <group  rotation = {[0,0,0]}>

              <Scene mouse={mouse} cameraRef={cameraRef} jsonData = {jsonData}  prevMutation={prevMutation} setPrevMutation={setPrevMutation}/>

        </group>

        <EffectComposer>
        <Bloom
          luminanceThreshold={0.6} // Adjust this threshold to control what parts of the scene glow
          luminanceSmoothing={0.9}
          intensity={2} // Increase this value to make the bloom effect more intense
          radius={0.75} // Adjust the radius to control the size of the bloom
        />
      </EffectComposer>

      </Canvas>
      {!init && (
        <div className="overlay">
          <div>
            {jsonData ? (
              <button onClick={() => setInit(true)}>Play</button>
            ) : (
              <div className="loader">Loading…</div>
            )}
          </div>
        </div>
      )}




    </div>
  );
}
