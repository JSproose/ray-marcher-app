import React, { useState } from "react";
import styles from "./Modal.module.css";
import { BsPlayFill, BsPauseFill, BsFillCameraFill, BsChevronRight, BsChevronUp } from "react-icons/bs";
import { SiWolframmathematica } from 'react-icons/si';
import { BiShuffle } from 'react-icons/bi';
import MATCAPS from "../assets/index.js";
import { useSpring, animated } from 'react-spring';

const MatCapTiles = ({show, setMatcap}) => {

  const props = useSpring({
    config: { duration: 100 },
    from: { 
      width: 0,
      opacity: 0
    },
    to: {
      width: 370,
      opacity: 1,
    },
  });


  

  return (
    <div className={styles.matcapsWrapper}>
    <animated.div style={props} className={styles.matcaps}>
      {Object.keys(MATCAPS).map((image, i) => {
        return (
          <img className={styles.matcap} src={MATCAPS[image]} key={image} onClick={()=>{
            setMatcap(MATCAPS[image]);
          }}/>
        )
      })}
    </animated.div>
    </div>
  )
}

const Modal = ({setMatcap, isPlaying, setIsPlaying, canvas, saveImage, randomizeScene, setShuffle, mandelbulb, setMandelbulb}) => {

  const [isDrawerOpen, setIsDrawerOpen] =  useState(false);

  return (
    <>
    <div className={styles.clearPadding}>
    <div className={styles.modal}>
    {isDrawerOpen && <MatCapTiles setMatcap={setMatcap} show={isDrawerOpen}/>}
      <button className={styles.shadersButton} onClick={()=>setIsDrawerOpen(!isDrawerOpen)}>
        <p className={styles.materialsTitle}>materials</p> 
        {isDrawerOpen && <BsChevronUp size={20}/>}
        {!isDrawerOpen && <BsChevronRight size={20}/>}
      </button>
      <button className={styles.modalButton} onClick={()=>{setMandelbulb(!mandelbulb)}}>
        <SiWolframmathematica  size={20}/>
      </button>
      <button className={styles.modalButton} onClick={()=>setShuffle(true)}>
        <BiShuffle size={20}/>
      </button>
      <button className={styles.modalButton}  onClick={()=>setIsPlaying(!isPlaying)}>
        {!isPlaying && <BsPlayFill size={20}/>}
        {isPlaying && <BsPauseFill size={20}/>}
      </button>
      <button className={styles.modalButton} onClick={()=>saveImage()}>
        <BsFillCameraFill size={20}/>
      </button>
    </div>
    </div>
    </>
  );
};

export default Modal;
