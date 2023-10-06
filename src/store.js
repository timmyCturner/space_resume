import * as THREE from 'three'
import  GrannyKnot  from './3d/CustomKnot'
import { addEffect } from '@react-three/fiber'
import create from 'zustand'
import { useGLTF } from '@react-three/drei'
import { mapRange } from 'canvas-sketch-util/math';

// import * as audio from './audio'

let guid = 1


const useStore = create((set, get) => {

  let spline = new GrannyKnot()

  let isPlaying = false
  let needsAnimation = false
  let waitingForAnimation = false
  //const { nodes, materials } = useGLTF('/path.glb')

  //console.log(spline,traverse(nodes));
  let track = new THREE.TubeGeometry(spline, 1750, 0.05, 10, false)
  const box = new THREE.Box3();
  let initStart = false;
  let startTime =  0

  let length = 10;
  let curr_index = 0;
  return {

    camera: undefined,
    points: 0,
    init: false,


    setInit: () =>
      set(() => {
        initStart= true
        startTime = Date.now()

        //console.log(initStart=true);
        return { init: true };
      }),
      // Main function to handle both play and pause operations

    mutation: {
      t: 0,
      isPlaying: isPlaying,
      position: new THREE.Vector3(),
      startTime: startTime,
      originalStartTime: Date.now(),
      //rings: randomRings(10, track),
      curr_index: 0,
      particles: null,
      track: track,
      scale: 1,
      fov: 60,
      hits: false,
      looptime: 10 * 1000,
      binormal: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      clock: new THREE.Clock(false),
      mouse: new THREE.Vector2(-250, 50),
      speedFactor:1,
      needsAnimation:needsAnimation,
      waitingForAnimation:waitingForAnimation,
      // Re-usable objects
      dummy: new THREE.Object3D(),
    },

    actions: {
      init(camera) {
        //console.log(camera);
        const { mutation, actions } = get()

        set({ camera })
        mutation.clock.start()
        //actions.toggleSound(get().sound)
        addEffect(() => {

          // /console.log(mutation);
          let t = mutation.t
          //console.log(mutation.curr_index,mutation.needsAnimation,mutation.isPlaying,"=",isPlaying,mutation.waitingForAnimation);
          if (mutation.isPlaying){
            mutation.waitingForAnimation= waitingForAnimation= false;
            mutation.needsAnimation = needsAnimation=false;



              t = (mutation.t = (mutation.t+(20/mutation.looptime))%1)
              mutation.position = track.parameters.path.getPointAt(t)

              mutation.position.multiplyScalar(mutation.scale)



          }

          // else{



          //   //console.log('not isPlaying');
          //   if (mutation.waitingForAnimation) {
          //       //mutation.isPlaying = isPlaying = true;
          //       setTimeout(() => {
          //         //console.log('hit');
          //         // Change mutation.waitingForAnimation to false after 300 milliseconds
          //
          //         mutation.isPlaying = isPlaying = true;
          //
          //       }, 300);
          //     }
          // }
        })
      },
      // updateCurrIndex: (newIndex) => {
      //   set((state) => ({
      //     mutation: {
      //       ...state.mutation,
      //       curr_index: newIndex,
      //     },
      //   }))
      // },
      // updateWaitingForAnimation: (newBool) => {
      //   set((state) => ({
      //     mutation: {
      //       ...state.mutation,
      //       waitingForAnimation: newBool,
      //     },
      //   }))
      // },

    }
  }

})




function randomRings(count, track) {
  let temp = []
  let t = 0.2
  for (let i = 0; i < count; i++) {
    t += 0.08
    const pos = track.parameters.path.getPointAt(t)
    pos.multiplyScalar(1)
    const segments = track.tangents.length
    const pickt = t * segments
    const pick = Math.floor(pickt)
    const lookAt = track.parameters.path.getPointAt((t + 1 / track.parameters.path.getLength()) % 1).multiplyScalar(15)
    const matrix = new THREE.Matrix4().lookAt(pos, lookAt, track.binormals[pick])
    temp.push([pos.toArray(), matrix])
  }
  return temp
}

export default useStore
// export { audio, playAudio }
