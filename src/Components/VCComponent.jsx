import React, { useState } from "react";
import * as XLSX from "xlsx"; // Import the xlsx library

const VCComponent = ({ fileStates }) => {
  const [orientationData, setOrientationData] = useState([]); // Holds accumulated data

  const getOrientationData = () => {
    // Collecting data from fileStates
    const newData = fileStates.map((state, idx) => {
      const dimensions =
        state.viewOrientation === "before"
          ? state.dimensions.dimensions_before
          : state.dimensions.dimensions_after;

      return {
        sno: idx + 1, // Serial number based on the index
        fileName: state.fileName.split(".")[0], // File name without extension
        x: dimensions.x.toFixed(2),
        y: dimensions.y.toFixed(2),
        z: dimensions.z.toFixed(2),
        volume: state.volume_cc ? state.volume_cc.toFixed(2) : "N/A",
      };
    });

    // Append new data to the existing orientationData
    setOrientationData((prevData) => [...prevData, ...newData]);
  };

  const generateExcel = () => {
    // Create Excel sheet from orientationData
    const ws = XLSX.utils.json_to_sheet(orientationData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orientation Data");

    // Generate and download the Excel file
    XLSX.writeFile(wb, "orientation_data.xlsx");
  };

  return (
    <div className="flex flex-col items-center mt-6">
      {/* VC Button */}
      <button
        onClick={getOrientationData}
        className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-700 transition"
      >
        VC
      </button>

      {/* Display the "Download Excel" button only if there is any data */}
      {orientationData.length > 0 && (
        <div className="mt-4 w-full max-w-md text-center">
          <button
            onClick={generateExcel}
            className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Download Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default VCComponent;
