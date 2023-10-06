import * as THREE from 'three'
import React from 'react'
import useStore from './store'


const geometry = new THREE.RingGeometry(1, 1.01, 64)
const fireRings= [

  '#FFB600',
  '#FFD200',
  '#FFE74C',
  '#FFED7D',
  '#FF5733',
  '#FF6347',
  '#FF4500'
]

export default function Rings() {
  const { rings } = useStore(state => state.mutation)
  return rings.map(([pos, matrix], i) => {
    const f = 2*(Math.sin(i / 10) * Math.PI) / 2
    const color = fireRings[parseInt(fireRings.length * Math.random())]
    const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide, emissive:color, emissiveIntensity:5, })
    return (
      <mesh
        key={i}
        position={pos}
        scale={[16 + i  * f/20, 16 + i  * f/20, 16 + i * f/20]}
        onUpdate={self => self.quaternion.setFromRotationMatrix(matrix)}
        geometry={geometry}
        material={material}
      />
    )
  })
}
