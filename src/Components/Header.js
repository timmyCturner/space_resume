import * as THREE from 'three';
import React, { Suspense, Component, useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber'
import {Html } from '@react-three/drei';
import useStore from '../store'


function HeaderWrapper(props) {
  const mutation = useStore((state) => state.mutation);
  const actions = useStore((state) => state.actions);
  const head = useRef()
  // Store the previous mutation object to compare changes
  const [prevMutation, setPrevMutation] = useState(mutation);

  // Define the updateCurrIndex function
  const updateCurrIndex = (newIndex) => {
    // You can perform any necessary actions here
    console.log('Updating currIndex to', newIndex % 6);

  };
  const { camera } = useThree()
  const desiredDistance = -10; // Set your desired distance here
  useFrame(() => {
  if (head.current) {
    // Calculate the desired position for head.current based on the camera's position
    const desiredPosition = camera.position.clone();
    const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
    desiredPosition.addScaledVector(cameraDirection, -desiredDistance);
    // Modify the desired position to move the element to the top-left corner
    const offsetVector = new THREE.Vector3(0, 0, 0);

    // Add the offset vector to the desired position
    desiredPosition.add(offsetVector);
    // Update the position of head.current to maintain the desired distance
    head.current.position.copy(desiredPosition);

    // Calculate the quaternion from the camera's matrix
    head.current.quaternion.setFromRotationMatrix(camera.matrix);
  }
  // Perform other actions on each frame update
  // You can access and use props.currIndex here
});
  // Update currIndex when the store's mutation object changes
  // useEffect(() => {
  //   // Check if the mutation object has changed
  //   if (prevMutation !== mutation) {
  //     // Perform your desired action here
  //     //console.log('mutation object has changed:', mutation);
  //     // Optionally, you can update prevMutation
  //     //setPrevMutation(mutation);
  //   }
  // }, [mutation, prevMutation]);

  // Pass currIndex and updateCurrIndex as props to the Header class component
  return <group ref = {head}><Header {...props} currIndex={mutation.curr_index} updateCurrIndex={(newIndex) => updateCurrIndex(newIndex)} /></group>;
}
class Header extends Component {

  handleNavClick(index) {
    //console.log(index);
    // Call the setCurrIndex function passed as a prop to update currIndex

    this.props.updateCurrIndex(index);

  }
  render(){
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'resume', label: 'Resume' },
        { id: 'featured', label: 'Featured' },
        { id: 'portfolio', label: 'Works' },
        { id: 'contact', label: 'Contact' },
      ];


      // Map over the navItems and conditionally apply the 'current' class
      //console.log(this.props.currIndex);
      const navLinks = navItems.map((item, index) => (
        <li
            key={item.id}
            className={this.props.currIndex === index % navItems.length ? 'current' : ''}
            onClick={() => this.handleNavClick(index)}>

          <a className="smoothscroll" href={`#${item.id}`}>
            {item.label}
          </a>
        </li>
      ));



    // Position the banner at the top of the scene
    const bannerPosition = new THREE.Vector3(0 , 0, 0);


    return (
      <>

        <header id="home">

        <nav id="nav-wrap" >

           <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
          <a className="mobile-btn" href="#home" title="Hide navigation">Hide navigation</a>

           <ul id="nav" className="nav">
               {navLinks}
           </ul>

        </nav>

     </header>


  </>
  )

  }

}

export default HeaderWrapper;
