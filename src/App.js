// import './scene.css';

// React Three Fiber Article
// https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/

// React Three Fiber Git
// https://github.com/pmndrs/react-three-fiber

// Example App
// https://github.com/gsimone/r3f-raymarching

// https://www.youtube.com/watch?v=q2WcGi3Cr9w

// mandelbulb sdf
// https://www.shadertoy.com/view/wdjGWR

//https://www.youtube.com/watch?v=q2WcGi3Cr9w
//matcap: 33 min


// https://bobbyhadz.com/blog/react-get-width-of-element


// https://stackoverflow.com/questions/34828285/standard-full-screen-quad-setup-not-working-in-three-js

// SDF Paper
// https://jcgt.org/published/0011/02/01/paper-lowres.pdf


// Richard Matka - Website
// https://richardmattka.com/
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useCallback, useEffect, useState, createRef, Children } from "react";
import { Vector2, TextureLoader } from "three";
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three'



import vertexShader from './shaders/TestVertexShader';
import fragmentShader from './shaders/TestFragmentShader';
import styles from './App.module.css';
import matcapImg from './assets/matcaps/test_gold.jpg';
import MATCAPS from "./assets/index.js";
import Modal from './components/Modal';

const Plane = ({canvas, matcap, isPlaying, shuffle, setShuffle, mandelbulb}) => {

  const randomizeObjects = () => {
    const randomLength = 10;
    const shapeArray = Array(randomLength).fill(0).map((_,i) => {
      const position = new Vector2(Math.random()*5 - 2.5, Math.random()*5-2);
      const rotation = new Vector2(Math.random(), Math.random());
      const shape = Math.floor(Math.random() * 5);
      const entry = {
        position: position,
        rotation: rotation,
        shape: shape
      };
      return entry;
    });

    mesh.current.material.uniforms.u_data.value = shapeArray;
    mesh.current.material.uniforms.u_data_size.value = randomLength;
  }

  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });
  const screenResolution = useRef({x: 0, y: 0});
  const {gl, scene, camera} = useThree();

  const updateMousePosition = useCallback((e) => {
    mousePosition.current = { x: e.pageX / window.innerWidth -0.5, y: -e.pageY / window.innerHeight + 0.5 };
  }, []);

  const uniforms = useMemo(
    () => ({
      u_mouse: {
        value: new Vector2(),
      }, 
      u_resolution: {
        value: new Vector2(), 
      },
      u_time: {
        value: 0.0,
      },
      u_data: {
        value: [],
      },
      u_data_size: {
        value: 0
      },
      u_matcap: {
        value: new TextureLoader().load(matcap)
      },
      u_mandelbulb: {
        value: false
      }
    }),
    []
  );


  const updateWindowSize = useCallback((e) => {
    screenResolution.current = { x: gl.domElement.width, y: gl.domElement.height};
  }, [gl]);


  useEffect(() => {
    mesh.current.material.uniforms.u_matcap.value = new TextureLoader().load(matcap);

  }, [matcap])

  // Run once when window is opened
  useEffect(() => {

    window.addEventListener("mousemove", updateMousePosition, false);
    window.addEventListener("resize", updateWindowSize, false);
    randomizeObjects();

    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false);
    };
  }, [updateMousePosition, updateWindowSize]);

  const [pausedTime, setPausedTime] = useState(0);

  useFrame((state) => {

    let currentTime = state.clock.getElapsedTime();
    if (isPlaying) {
      mesh.current.material.uniforms.u_time.value = currentTime;
      setPausedTime(currentTime);
    } else {
      state.clock.elapsedTime = pausedTime;
    }

    if (shuffle) {
      setShuffle(false);
      randomizeObjects();
      console.log("shuffled")
    }

    mesh.current.material.uniforms.u_mandelbulb.value = mandelbulb;

    
    mesh.current.material.uniforms.u_mouse.value = new Vector2(
      mousePosition.current.x,
      mousePosition.current.y
    );

    mesh.current.material.uniforms.u_resolution.value = new Vector2 (
      screenResolution.current.x,
      screenResolution.current.y
    );

  });


  return (
    <mesh position={[0,0,0]} ref={mesh}>
      <planeGeometry args={[2,2]}/>
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

const ScreenShotter = ({setGl, setScene, setCamera}) => {
  const {gl, scene, camera} = useThree();
  setGl(gl);
  setScene(scene);
  setCamera(camera);
}

const Scene = () => {
  // https://codesandbox.io/s/r3f-basic-demo-3pbpo?file=/src/index.js:420-433
  const canvas = useRef();
  const [matcap, setMatcap] = useState(MATCAPS.gold);
  const [isPlaying, setIsPlaying] =  useState(true);
  const [shuffle, setShuffle] = useState(true);
  const [mandelbulb, setMandelbulb] = useState(false);

  const [gl, setGl] = useState();
  const [scene, setScene] = useState();
  const [camera, setCamera] = useState();
  


  const saveImage = () => {
    gl.render(scene, camera)
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 0.6
    gl.outputEncoding = THREE.sRGBEncoding
    gl.preserveDrawingBuffer = true
    gl.domElement.toBlob(
      function(blob) {
        var a = document.createElement('a')
        var url = URL.createObjectURL(blob)
        a.href = url
        a.download = 'canvas.jpg'
        a.click()
        console.log('function is actually being used')
      },
      'image/jpg',
      1.0
    )
  }



  return (
    <>
    <Modal mandelbulb={mandelbulb} setMandelbulb={setMandelbulb} setShuffle={setShuffle} saveImage={saveImage} setMatcap={setMatcap} isPlaying={isPlaying} setIsPlaying={setIsPlaying} canvas={canvas}/>
    <Canvas ref={canvas}>
      <ScreenShotter setGl={setGl} setScene={setScene} setCamera={setCamera}/>
      <OrthographicCamera position={[0,0,4.5]} left={-1/2} right={1/2} top={1/2} bottom={-1/2} near={1} far={1000}>
        <Plane mandelbulb={mandelbulb} shuffle={shuffle} setShuffle={setShuffle} canvas={canvas} matcap={matcap} isPlaying={isPlaying}/>
      </OrthographicCamera>
    </Canvas>
    </>
  );
};


export default Scene;