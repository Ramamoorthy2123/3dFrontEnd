import React from 'react';
import "../App.css"


const ViewControls = ({ currentView, onViewChange }) => {
  const views = [
    { name: "front", label: "Front" },
    { name: "back", label: "Back" },
    { name: "left", label: "Left" },
    { name: "right", label: "Right" },
    { name: "top", label: "Top" },
    { name: "bottom", label: "Bottom" },
  ];

  return (
    <div style={{ marginTop: 10 }} id="button" className='flex flex-wrap justify-center'>
      {views.map(({ name, label }) => (
        <button
          className="mr-3 w-30 mb-5 h-10 border-0 rounded-2xl cursor-pointer text-center"
          key={name}
          onClick={() => onViewChange(name)}
          style={{
            backgroundColor: currentView === name ? "#007bff" : "#eee",
            color: currentView === name ? "white" : "black",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};


export default ViewControls;
