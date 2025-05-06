// import React from 'react'

// const DimensionsDisplay = ({ dimensions, currentView }) => {
//   if (!dimensions) return null;
  

//   const viewAxisMap = {
//     front: { x: dimensions.x, y: dimensions.y, z: dimensions.z },
//     back: { x: dimensions.x, y: dimensions.y, z: dimensions.z },
//     top: { x: dimensions.x, y: dimensions.z, z: dimensions.y },
//     bottom: { x: dimensions.x, y: dimensions.z, z: dimensions.y },
//     left: { x: dimensions.z, y: dimensions.y, z: dimensions.x },
//     right: { x: dimensions.z, y: dimensions.y, z: dimensions.x },
//   };


  
//   const axes = viewAxisMap[currentView.toLowerCase()] || dimensions;
//   const x_cm = axes.x / 10;
//   const y_cm = axes.y / 10;
//   const z_cm = axes.z / 10;
//   const volume = x_cm * y_cm * z_cm;
//   const weight = 1.05 * volume


//   return (
//     <div className="dimension  text-white">
//       <h3>
//         Model Dimensions from{" "}
//         <b>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</b> :
//       </h3>
//       <p className="ml-5">X axis length: {axes.x.toFixed(2)} mm</p>
//       <p className="ml-5">Y axis length: {axes.y.toFixed(2)} mm</p>
//       <p className="ml-5">Z axis length: {axes.z.toFixed(2)} mm</p>
//       <p className="ml-5">Weight: {weight.toFixed(2)} g</p>
//     </div>
//   );
// };

// export default DimensionsDisplay

import React from "react";

const DimensionsDisplay = ({ dimensions, currentView }) => {
  if (!dimensions) return null;

  const viewAxisMap = {
    front: { x: dimensions.x, y: dimensions.y, z: dimensions.z },
    back: { x: dimensions.x, y: dimensions.y, z: dimensions.z },
    top: { x: dimensions.x, y: dimensions.z, z: dimensions.y },
    bottom: { x: dimensions.x, y: dimensions.z, z: dimensions.y },
    left: { x: dimensions.z, y: dimensions.y, z: dimensions.x },
    right: { x: dimensions.z, y: dimensions.y, z: dimensions.x },
  };

  const axes = viewAxisMap[currentView.toLowerCase()] || dimensions;
  const x_cm = axes.x / 10;
  const y_cm = axes.y / 10;
  const z_cm = axes.z / 10;
  const volume = x_cm * y_cm * z_cm;
  const weight = 1.05 * volume;

  return (
    <div className="dimension text-white">
      <h3>
        Model Dimensions from{" "}
        <b>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</b> :
      </h3>
      <p className="ml-5">X axis length: {axes.x.toFixed(2)} mm</p>
      <p className="ml-5">Y axis length: {axes.y.toFixed(2)} mm</p>
      <p className="ml-5">Z axis length: {axes.z.toFixed(2)} mm</p>
      <p className="ml-5">Weight: {weight.toFixed(2)} g</p>
    </div>
  );
};

export default DimensionsDisplay;
