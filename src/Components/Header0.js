import * as THREE from 'three';
import React, { Suspense, Component, useRef, useEffect, useState } from 'react';

import useStore from '../store'


function HeaderWrapper({prevMutation,setPrevMutation}) {

  const mutation = useStore((state) => state.mutation);
  const actions = useStore((state) => state.actions);

  function postTransition() {
     mutation.isPlaying = false;
     mutation.needsAnimation = true;
    // mutation.waitingForAnimation = false;
    //console.log(mutation.curr_index,mutation.needsAnimation,mutation.isPlaying,mutation.waitingForAnimation);

  }
  const updateCurrIndex = (newIndex) => {
    // Update the current index logic here
    // ...

    // Call setPrevMutation to update the previous mutation

    if(!mutation.isPlaying && !mutation.waitingForAnimation && !mutation.needsAnimation){

      //actions.updateCurrIndex(mutation.curr_index + 1);
      //console.log('hit');
      mutation.waitingForAnimation=  true;
      setTimeout((state) => {
        mutation.isPlaying  = true;
        setPrevMutation(mutation.curr_index)
        setTimeout(postTransition, 1000);
      }, 500)
      mutation.curr_index=(mutation.curr_index+1)%6
    }

    setPrevMutation(newIndex);

  };
  //console.log(prevMutation,setPrevMutation);
  useEffect(() => {
    // /console.log((prevMutation !== mutation || !prevMutation),props.currIndex);
    // Check if the mutation object has changed
    //console.log(mutation.curr_index);
    //needsUpdate = true;
    if(prevMutation){
      if (!prevMutation.curr_index) {
        //console.log("Header mutation: "+mutation.curr_index,prevMutation);
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

      }
    }
    else{
      setPrevMutation(mutation.curr_index)
      //console.log(prevMutation);
    }

  }, [mutation.curr_index, prevMutation, setPrevMutation]);


    //console.log(props.currIndex.curr_index);

    return (
             <Header  currIndex={prevMutation} updateCurrIndex={updateCurrIndex}  />
          )


      }


class Header extends Component {


  handleNavClick(index) {
    //console.log(index);
    // Call the setCurrIndex function passed as a prop to update currIndex
    //console.log('hit',index,this.props);

    this.props.updateCurrIndex(index);

  }
  render(){

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'resume', label: 'Resume' },
        { id: 'videos', label: 'Videos' },
        { id: 'portfolio', label: 'Works' },
        { id: 'featured', label: 'Featured' },
        { id: 'skill', label: 'Skills' },
      ];

        //console.log(this.props);
      // Map over the navItems and conditionally apply the 'current' class
      //console.log(this.props);
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
      <header id="home">

      <nav id="nav-wrap" >

         <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
	      <a className="mobile-btn" href="#home" title="Hide navigation">Hide navigation</a>

        <ul id="nav" className="nav">
            {navLinks}
        </ul>

      </nav>






   </header>
    );
  }
}

export default HeaderWrapper;
