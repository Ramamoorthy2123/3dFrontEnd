// import React, { useState, useRef, useEffect } from "react";
// import { OrbitControls } from "@react-three/drei";
// import {  useThree } from "@react-three/fiber";
// import "../App.css"

// const CameraController = ({ view, distance }) => {
//   const { camera, gl } = useThree();
//   const controlsRef = useRef();
  
  
//   useEffect(() => {
//     if (!view) return;

//     const d = distance || 50;

//     switch (view) {
//       case "front":
//         camera.position.set(0, 0, d);
//         break;
//       case "back":
//         camera.position.set(0, 0, -d);
//         break;
//       case "left":
//         camera.position.set(-d, 0, 0);
//         break;
//       case "right":
//         camera.position.set(d, 0, 0);
//         break;
//       case "top":
//         camera.position.set(0, d, 0);
//         break;
//       case "bottom":
//         camera.position.set(0, -d, 0);
//         break;
//       default:
//         camera.position.set(0, 0, d);
//     }
//     camera.lookAt(0, 0, 0);
//     camera.updateProjectionMatrix();

//     if (controlsRef.current) {
//       controlsRef.current.target.set(0, 0, 0);
//       controlsRef.current.update();
//     }
//   }, [view, camera, distance]);

//   return <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
// };

// export default CameraController

import React, { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";



const CameraController = ({ view, distance }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (!view) return;
    const d = distance || 50;
    const views = {
      front: [0, 0, d],
      back: [0, 0, -d],
      left: [-d, 0, 0],
      right: [d, 0, 0],
      top: [0, d, 0],
      bottom: [0, -d, 0],
    };
    camera.position.set(...(views[view] || [0, 0, d]));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [view, camera, distance]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      makeDefault
      enableDamping={true}
      dampingFactor={0.1}
      rotateSpeed={0.8}
      zoomSpeed={1.2}
      panSpeed={0.6}
      maxPolarAngle={Math.PI}
      minPolarAngle={0}
      enablePan={true}
      enableZoom={true}
    />
  );
};

export default CameraController;
