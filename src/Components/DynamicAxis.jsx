import React from "react";
import * as THREE from "three";

const DynamicAxis = ({ axis, length }) => {
  const colorMap = {
    x: 0xff0000, // Red for X axis
    y: 0x00ff00, // Green for Y axis
    z: 0x0000ff, // Blue for Z axis
  };

  // Create a line representing each axis
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    axis === 'x' ? new THREE.Vector3(length, 0, 0) :
    axis === 'y' ? new THREE.Vector3(0, length, 0) :
    new THREE.Vector3(0, 0, length),
  ]);

  const material = new THREE.LineBasicMaterial({ color: colorMap[axis] });
  return <line geometry={geometry} material={material} />;
};

export default DynamicAxis;
