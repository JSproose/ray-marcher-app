import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { Vector2, Color } from "three";
import './App.css';
// import './scene.css';

// React Three Fiber Article
// https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/

// React Three Fiber Git
// https://github.com/pmndrs/react-three-fiber

// Example App
// https://github.com/gsimone/r3f-raymarching

// https://www.youtube.com/watch?v=q2WcGi3Cr9w

import TestVertexShader from './shaders/TestVertexShader';
import TestFragmentShader from './shaders/TestFragmentShader';

const Gradient = () => {
    // This reference will give us direct access to the mesh
  const mesh = useRef();
  const { viewport } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });

  // Does not compute updated states
  //  i.e., function will uses the original states passed to it
  const updateMousePosition = useCallback((e) => {
    mousePosition.current = { x: e.pageX, y: e.pageY };
  }, []);


  // Only reruns, the function when dependency changes
  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_mouse: { value: new Vector2(0, 0) },
      u_bg: {
        value: new Color("#A1A3F7"),
      },
      u_colorA: { value: new Color("#9FBAF9") },
      u_colorB: { value: new Color("#FEB3D9") },
    }),
    []
  );

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition, false);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false);
    };
  }, [updateMousePosition]);

  // Called just before each rendered frame of 'Canvas'
  useFrame((state) => {
    const { clock } = state;

    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    mesh.current.material.uniforms.u_mouse.value = new Vector2(
      mousePosition.current.x,
      mousePosition.current.y
    );
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1.5}>
      <planeBufferGeometry attach="geometry" args={[viewport.width, viewport.height]} />
      <shaderMaterial
        fragmentShader={TestFragmentShader}
        vertexShader={TestVertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0.0, 0.0, 1] }}>
      <Gradient />
    </Canvas>
  );
};

export default Scene;

