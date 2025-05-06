// import React, {
//   forwardRef,
//   useRef,
//   useState,
//   useEffect,
//   useImperativeHandle,
// } from "react";
// import * as THREE from "three";
// import { useFrame, useThree } from "@react-three/fiber";
// import DynamicAxis from "./DynamicAxis";
// import ViewControls from "./ViewControls";
// // import rotate from "../assets/rotate_right.png";

// const ModelViewer = forwardRef(({ geometry, setDimensions, onDimensionsUpdate, autoRotate,}, ref) => {
//   const meshRef = useRef();
//   const rotateIconRef = useRef();
//   const [originalVertices, setOriginalVertices] = useState([]);
//   const [boundingBox, setBoundingBox] = useState(null);
//   const animationRef = useRef(null);
//   const isDragging = useRef(false);
//   const previousMousePosition = useRef({ x: 0, y: 0 });
//   const alignmentPoints = useRef({ base: null, top: null });
//   const originalQuaternion = useRef(new THREE.Quaternion());
//   const [rotateIconVisible, setRotateIconVisible] = useState(true); // Show icon
//   const [isIconHovered, setIsIconHovered] = useState(false);
//   const [isIconRotating, setIsIconRotating] = useState(false);

//   const { camera } = useThree();

//   const calculateAlignment = () => {
//     if (!alignmentPoints.current.base || !alignmentPoints.current.top) {
//       console.error("Alignment points not set");
//       return;
//     }
//     const base = alignmentPoints.current.base;
//     const top = alignmentPoints.current.top;
//     const v = new THREE.Vector3().subVectors(top, base).normalize();
//     const zAxis = new THREE.Vector3(0, 0, 1);

//     if (v.dot(zAxis) > 0.9999) {
//       animationRef.current = new THREE.Quaternion();
//       return;
//     }

//     if (v.dot(zAxis) < -0.9999) {
//       animationRef.current = new THREE.Quaternion().setFromAxisAngle(
//         new THREE.Vector3(1, 0, 0),
//         Math.PI
//       );
//       return;
//     }
    
//     const axis = new THREE.Vector3().crossVectors(v, zAxis).normalize();
//     const angle = Math.acos(v.dot(zAxis));
//     animationRef.current = new THREE.Quaternion().setFromAxisAngle(axis, angle);
//   };
//   // Initialize geometry and vertices
//   useEffect(() => {
//     if (!geometry) return;

//     geometry.computeBoundingBox();
//     const pos = geometry.attributes.position;
//     const verts = [];
//     for (let i = 0; i < pos.count; i++) {
//       verts.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
//     }
//     setOriginalVertices(verts);
//   }, [geometry]);

//   useFrame(() => {
//     if (!meshRef.current || !originalVertices.length) return;

//     const worldMatrix = meshRef.current.matrixWorld;
//     const transformed = originalVertices.map(v => v.clone().applyMatrix4(worldMatrix));
//     const bbox = new THREE.Box3().setFromPoints(transformed);
    
//     const size = new THREE.Vector3();
//     bbox.getSize(size);
    
//     const dimensions = {
//       x: size.x,
//       y: size.y,
//       z: size.z,
//       maxDimension: Math.max(size.x, size.y, size.z)
//     };

//     // Update dimensions in real-time
//     onDimensionsUpdate?.(dimensions);
    
//     // Also update the main dimensions when not auto-rotating
//     if (!autoRotate) {
//       setDimensions?.(dimensions);
//     }
//   });


//   useImperativeHandle(ref, () => ({
//     resetModelOrientation: () => {
//       if (meshRef.current) {
//         meshRef.current.quaternion.copy(originalQuaternion.current);
//         animationRef.current = null;
//       }
//     },
//     setAlignmentPoints: (base, top) => {
//       alignmentPoints.current = { base, top };
//     },
//     rotateModel: (axis, amount) => {
//       if (meshRef.current) {
//         meshRef.current.rotation[axis] += amount;
//       }
//     },

//     getCurrentDimensions: () => {
//       if (!meshRef.current || !originalVertices.length) return null;
      
//       const worldMatrix = meshRef.current.matrixWorld;
//       const transformed = originalVertices.map(v => v.clone().applyMatrix4(worldMatrix));
//       const bbox = new THREE.Box3().setFromPoints(transformed);
      
//       const size = new THREE.Vector3();
//       bbox.getSize(size);
      
//       return {
//         x: size.x,
//         y: size.y,
//         z: size.z,
//         maxDimension: Math.max(size.x, size.y, size.z)
//       };
//     },

//   }));

//   useEffect(() => {
//     if (!geometry) return;

//     geometry.center();
//     geometry.computeBoundingBox();
//     geometry.computeVertexNormals();

//     const bbox = geometry.boundingBox;
//     setBoundingBox(bbox);

//     const sizeVec = new THREE.Vector3();
//     bbox.getSize(sizeVec);

//     const pos = geometry.attributes.position;
//     const verts = [];
//     for (let i = 0; i < pos.count; i++) {
//       verts.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
//     }
//     setOriginalVertices(verts);

//     const center = new THREE.Vector3();
//     bbox.getCenter(center);
//     alignmentPoints.current = {
//       base: new THREE.Vector3(center.x, bbox.min.y, center.z),
//       top: new THREE.Vector3(center.x, bbox.max.y, center.z),
//     };

//     setDimensions({
//       x: sizeVec.x,
//       y: sizeVec.y,
//       z: sizeVec.z,
//       maxDimension: Math.max(sizeVec.x, sizeVec.y, sizeVec.z),
//     });

//     if (meshRef.current) {
//       originalQuaternion.current.copy(meshRef.current.quaternion);
//     }
//   }, [geometry, setDimensions]);

//   useFrame(() => {
//     if (meshRef.current && animationRef.current) {
//       meshRef.current.quaternion.slerp(animationRef.current, 0.1);
//       if (meshRef.current.quaternion.angleTo(animationRef.current) < 0.001) {
//         meshRef.current.quaternion.copy(animationRef.current);
//         animationRef.current = null;
//       }
//     }

//     if (meshRef.current && originalVertices.length) {
//       const worldMatrix = meshRef.current.matrixWorld;
//       const transformed = originalVertices.map((v) =>
//         v.clone().applyMatrix4(worldMatrix)
//       );
//       const bbox = new THREE.Box3().setFromPoints(transformed);
//       setBoundingBox(bbox);

//       const sizeVec = new THREE.Vector3();
//       bbox.getSize(sizeVec);
//       setDimensions({
//         x: sizeVec.x,
//         y: sizeVec.y,
//         z: sizeVec.z,
//         maxDimension: Math.max(sizeVec.x, sizeVec.y, sizeVec.z),
//       });
//     }

//     // Continuous rotation if icon is clicked
//     if (isIconRotating && meshRef.current) {
//       meshRef.current.rotation.y += 0.01;
//     }

//     // Position rotate icon above the model
//     if (rotateIconRef.current && boundingBox) {
//       rotateIconRef.current.position.set(
//         0,
//         boundingBox.max.y + 10,
//         0
//       );
//     }
//   });

//   const onPointerDown = (e) => {
//     isDragging.current = true;
//     previousMousePosition.current = { x: e.clientX, y: e.clientY };
//   };
//   const onPointerUp = () => {
//     isDragging.current = false;
//   };
//   const onPointerMove = (e) => {
//     if (!isDragging.current || !meshRef.current) return;
//     const deltaMove = {
//       x: e.clientX - previousMousePosition.current.x,
//       y: e.clientY - previousMousePosition.current.y,
//     };
//     const rotationSpeed = 0.005;
//     meshRef.current.rotation.y += deltaMove.x * rotationSpeed;
//     meshRef.current.rotation.x += deltaMove.y * rotationSpeed;
//     meshRef.current.rotation.x = Math.max(
//       -Math.PI / 2,
//       Math.min(Math.PI / 2, meshRef.current.rotation.x)
//     );
//     previousMousePosition.current = { x: e.clientX, y: e.clientY };
//   };

//   const rotateModelWithIcon = () => {
//     setIsIconRotating((prev) => !prev); // Toggle rotation
//   };

//   if (!geometry) return null;

//   return (
//     <>
//       {/* Model */}
//       <mesh
//         ref={meshRef}
//         geometry={geometry}
//         position={[0, 0, 0]}
//         onPointerDown={onPointerDown}
//         onPointerUp={onPointerUp}
//         onPointerMove={onPointerMove}
//         onPointerLeave={onPointerUp}
//       >
//         <meshStandardMaterial color="#F1E7E7" />
//       </mesh>

//       {/* Rotate Icon */}
//       {rotateIconVisible && (
//         <sprite
//           ref={rotateIconRef}
//           scale={isIconHovered ? [8, 8, 1] : [6, 6, 1]}
//           onPointerOver={() => setIsIconHovered(true)}
//           onPointerOut={() => setIsIconHovered(false)}
//           onClick={rotateModelWithIcon}
//         >
//           <spriteMaterial
//             attach="material"
//             map={new THREE.TextureLoader().load('')}
//             transparent={true}
//           />
//         </sprite>
//       )}

  
      
//       {/* Bounding box and dimensions */}
//       {boundingBox && (
//         <>
//           <DynamicAxis axis="x" length={boundingBox.max.x} />
//           <DynamicAxis axis="y" length={boundingBox.max.y} />
//           <DynamicAxis axis="z" length={boundingBox.max.z} />
//         </>
//       )}
     
//       <ViewControls />
//     </>
//   );
// });

// export default ModelViewer;

import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import DynamicAxis from "./DynamicAxis";
// import rotate from "../assets/rotate_right.png";

const ModelViewer = forwardRef(({ geometry, setDimensions, onDimensionsUpdate, autoRotate,}, ref) => {
  const meshRef = useRef();
  const rotateIconRef = useRef();
  const [originalVertices, setOriginalVertices] = useState([]);
  const [boundingBox, setBoundingBox] = useState(null);
  const animationRef = useRef(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const alignmentPoints = useRef({ base: null, top: null });
  const originalQuaternion = useRef(new THREE.Quaternion());
  const [rotateIconVisible, setRotateIconVisible] = useState(true); // Show icon
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isIconRotating, setIsIconRotating] = useState(false);

  const { camera } = useThree();

  const calculateAlignment = () => {
    if (!alignmentPoints.current.base || !alignmentPoints.current.top) {
      console.error("Alignment points not set");
      return;
    }
    const base = alignmentPoints.current.base;
    const top = alignmentPoints.current.top;
    const v = new THREE.Vector3().subVectors(top, base).normalize();
    const zAxis = new THREE.Vector3(0, 0, 1);

    if (v.dot(zAxis) > 0.9999) {
      animationRef.current = new THREE.Quaternion();
      return;
    }

    if (v.dot(zAxis) < -0.9999) {
      animationRef.current = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        Math.PI
      );
      return;
    }
    
    const axis = new THREE.Vector3().crossVectors(v, zAxis).normalize();
    const angle = Math.acos(v.dot(zAxis));
    animationRef.current = new THREE.Quaternion().setFromAxisAngle(axis, angle);
  };
  // Initialize geometry and vertices
  useEffect(() => {
    if (!geometry) return;

    geometry.computeBoundingBox();
    const pos = geometry.attributes.position;
    const verts = [];
    for (let i = 0; i < pos.count; i++) {
      verts.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }
    setOriginalVertices(verts);
  }, [geometry]);

  useFrame(() => {
    if (!meshRef.current || !originalVertices.length) return;

    const worldMatrix = meshRef.current.matrixWorld;
    const transformed = originalVertices.map(v => v.clone().applyMatrix4(worldMatrix));
    const bbox = new THREE.Box3().setFromPoints(transformed);
    
    const size = new THREE.Vector3();
    bbox.getSize(size);
    
    const dimensions = {
      x: size.x,
      y: size.y,
      z: size.z,
      maxDimension: Math.max(size.x, size.y, size.z)
    };

    // Update dimensions in real-time
    onDimensionsUpdate?.(dimensions);
    
    // Also update the main dimensions when not auto-rotating
    if (!autoRotate) {
      setDimensions?.(dimensions);
    }
  });


  useImperativeHandle(ref, () => ({
    resetModelOrientation: () => {
      if (meshRef.current) {
        meshRef.current.quaternion.copy(originalQuaternion.current);
        animationRef.current = null;
      }
    },
    setAlignmentPoints: (base, top) => {
      alignmentPoints.current = { base, top };
    },
    rotateModel: (axis, amount) => {
      if (meshRef.current) {
        meshRef.current.rotation[axis] += amount;
      }
    },

    getCurrentDimensions: () => {
      if (!meshRef.current || !originalVertices.length) return null;
      
      const worldMatrix = meshRef.current.matrixWorld;
      const transformed = originalVertices.map(v => v.clone().applyMatrix4(worldMatrix));
      const bbox = new THREE.Box3().setFromPoints(transformed);
      
      const size = new THREE.Vector3();
      bbox.getSize(size);
      
      return {
        x: size.x,
        y: size.y,
        z: size.z,
        maxDimension: Math.max(size.x, size.y, size.z)
      };
    },

  }));

  useEffect(() => {
    if (!geometry) return;

    geometry.center();
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    const bbox = geometry.boundingBox;
    setBoundingBox(bbox);

    const sizeVec = new THREE.Vector3();
    bbox.getSize(sizeVec);

    const pos = geometry.attributes.position;
    const verts = [];
    for (let i = 0; i < pos.count; i++) {
      verts.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }
    setOriginalVertices(verts);

    const center = new THREE.Vector3();
    bbox.getCenter(center);
    alignmentPoints.current = {
      base: new THREE.Vector3(center.x, bbox.min.y, center.z),
      top: new THREE.Vector3(center.x, bbox.max.y, center.z),
    };

    setDimensions({
      x: sizeVec.x,
      y: sizeVec.y,
      z: sizeVec.z,
      maxDimension: Math.max(sizeVec.x, sizeVec.y, sizeVec.z),
    });

    if (meshRef.current) {
      originalQuaternion.current.copy(meshRef.current.quaternion);
    }
  }, [geometry, setDimensions]);

  useFrame(() => {
    if (meshRef.current && animationRef.current) {
      meshRef.current.quaternion.slerp(animationRef.current, 0.1);
      if (meshRef.current.quaternion.angleTo(animationRef.current) < 0.001) {
        meshRef.current.quaternion.copy(animationRef.current);
        animationRef.current = null;
      }
    }

    if (meshRef.current && originalVertices.length) {
      const worldMatrix = meshRef.current.matrixWorld;
      const transformed = originalVertices.map((v) =>
        v.clone().applyMatrix4(worldMatrix)
      );
      const bbox = new THREE.Box3().setFromPoints(transformed);
      setBoundingBox(bbox);

      const sizeVec = new THREE.Vector3();
      bbox.getSize(sizeVec);
      setDimensions({
        x: sizeVec.x,
        y: sizeVec.y,
        z: sizeVec.z,
        maxDimension: Math.max(sizeVec.x, sizeVec.y, sizeVec.z),
      });
    }

    // Continuous rotation if icon is clicked
    if (isIconRotating && meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }

    // Position rotate icon above the model
    if (rotateIconRef.current && boundingBox) {
      rotateIconRef.current.position.set(
        0,
        boundingBox.max.y + 10,
        0
      );
    }
  });

  const onPointerDown = (e) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = () => {
    isDragging.current = false;
  };
  const onPointerMove = (e) => {
    if (!isDragging.current || !meshRef.current) return;
    const deltaMove = {
      x: e.clientX - previousMousePosition.current.x,
      y: e.clientY - previousMousePosition.current.y,
    };
    const rotationSpeed = 0.005;
    meshRef.current.rotation.y += deltaMove.x * rotationSpeed;
    meshRef.current.rotation.x += deltaMove.y * rotationSpeed;
    meshRef.current.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, meshRef.current.rotation.x)
    );
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const rotateModelWithIcon = () => {
    setIsIconRotating((prev) => !prev); // Toggle rotation
  };

  if (!geometry) return null;

  return (
    <>
      {/* Model */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        position={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerUp}
      >
        <meshStandardMaterial color="#C9C8C9" />
      </mesh>

      {/* Rotate Icon */}
      {rotateIconVisible && (
        <sprite
          ref={rotateIconRef}
          scale={isIconHovered ? [8, 8, 1] : [6, 6, 1]}
          onPointerOver={() => setIsIconHovered(true)}
          onPointerOut={() => setIsIconHovered(false)}
          onClick={rotateModelWithIcon}
        >
          <spriteMaterial
            attach="material"
            map={new THREE.TextureLoader().load('')}
            transparent={true}
          />
        </sprite>
      )}

  
      
      {/* Bounding box and dimensions */}
      {boundingBox && (
        <>
          <DynamicAxis axis="x" length={boundingBox.max.x} />
          <DynamicAxis axis="y" length={boundingBox.max.y} />
          <DynamicAxis axis="z" length={boundingBox.max.z} />
        </>
      )}
    </>
  );
});

export default ModelViewer;
