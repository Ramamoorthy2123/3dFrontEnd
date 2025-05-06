import React, { useState } from "react";
import * as XLSX from "xlsx";

const SLVPanel = ({
  fileStates,
  setFileStates,
  excelData,
  setExcelData,
  globalCost,
  setGlobalCost,
}) => {
  const handleQuantityChange = (e, index) => {
    const quantity = Number(e.target.value);
    setFileStates((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, quantity: quantity || 1 } : file
      )
    );
  };

  const [slvClicked, setSlvClicked] = useState(false);
  const [paintingCost, setPaintingCost] = useState("");
  const [packingForwarding, setPackingForwarding] = useState("");

  const handleSLV = () => {
    if (!globalCost || isNaN(globalCost)) {
      alert("Please enter a valid cost.");
      return;
    }

    if (slvClicked) return;

    setSlvClicked(true);

    const costValue = Number(globalCost);
    let baseTotal = 0;

    const newEntries = fileStates.map((fileState, index) => {
      const volume = Number(fileState.volume_cc || 0);
      const unitCost = volume * costValue;
      const quantity = Number(fileState.quantity || 1);
      const totalCost = unitCost * quantity;
      const nameWithoutExt = fileState.fileName.replace(/\.[^/.]+$/, "");

      baseTotal += totalCost;

      return {
        SNo: excelData.length + index + 1,
        FileName: nameWithoutExt,
        VolumeCC: volume,
        UnitCost: unitCost.toFixed(2),
        Quantity: quantity,
        TotalCost: totalCost.toFixed(2),
      };
    });

    const totalQuantity = fileStates.reduce(
      (sum, file) => sum + Number(file.quantity || 1),
      0
    );

    const paintingAmount = Number(paintingCost || 0) * totalQuantity;
    const pfAmount = Number(packingForwarding || 0) * totalQuantity;

    const subtotal = baseTotal + paintingAmount + pfAmount;
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;

    const subtotalBase = baseTotal;

    const summaryRows = [
      {
        SNo: "",
        FileName: "",
        VolumeCC: "",
        UnitCost: "",
        Quantity: "Sub Total Cost",
        TotalCost: subtotalBase.toFixed(2),
      },
      {
        SNo: "",
        FileName: "" ,
        VolumeCC: "",
        UnitCost: "",
        Quantity: `Painting Cost (₹${paintingCost} × ${totalQuantity})`,
        TotalCost: paintingAmount.toFixed(2),
      },
      {
        SNo: "",
        FileName: "",
        VolumeCC: "",
        UnitCost: "",
        Quantity: `Packing & Forwarding (₹${packingForwarding} × ${totalQuantity})`,
        TotalCost: pfAmount.toFixed(2),
      },
      {
        SNo: "",
        FileName: "",
        VolumeCC: "",
        UnitCost: "",
        Quantity: "GST (18%)",
        TotalCost: gst.toFixed(2),
      },
      {
        SNo: "",
        FileName: "",
        VolumeCC: "",
        UnitCost: "",
        Quantity: "Grand Total",
        TotalCost: grandTotal.toFixed(2),
      },
    ];


    setExcelData((prev) => [...prev, ...newEntries, ...summaryRows]);
  };

  const handleDownloadExcel = () => {
    if (excelData.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SLV Data");

    XLSX.writeFile(workbook, `SLV_Export_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="mt-6 w-full max-w-3xl flex flex-col items-center gap-4">
      <label htmlFor="cc" className="text-white text-xl text-left">Cost per cc</label>
      <input
        type="number"
        id="cc"
        placeholder="Enter Cost per cc"
        value={globalCost}
        onChange={(e) => setGlobalCost(e.target.value)}
        className="p-2 border border-cyan-500 rounded-lg w-64 text-center focus:ring-2 focus:ring-cyan-400 text-white bg-gray-800"
      />
      <label htmlFor="painting" className="text-white text-xl text-left"> Painting Cost per Unit</label>
      <input
        type="number"
        id="painting"
        placeholder="Painting Cost per Unit"
        value={paintingCost}
        onChange={(e) => setPaintingCost(e.target.value)}
        className="p-2 border border-cyan-500 rounded-lg w-64 text-center focus:ring-2 focus:ring-cyan-400 text-white bg-gray-800"
      />
      <label htmlFor="packing" className="text-white text-xl text-left">Packing & Forwarding per Unit</label>
      <input
        type="number"
        placeholder="Packing & Forwarding per Unit"
        value={packingForwarding}
        onChange={(e) => setPackingForwarding(e.target.value)}
        className="p-2 border border-cyan-500 rounded-lg w-64 text-center focus:ring-2 focus:ring-cyan-400 text-white bg-gray-800"
      />

      <div className="w-full grid grid-cols-1 gap-4">
        {fileStates.map((file, index) => {
          const nameWithoutExt = file.fileName.replace(/\.[^/.]+$/, "");
          return (
            <div
              key={file.fileName}
              className="p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-center text-white"
            >
              <div className="mb-2 text-sm">
                <div><strong>File:</strong> {nameWithoutExt}</div>
                <div><strong>Volume:</strong> {file.volume_cc?.toFixed(2)} cc</div>
              </div>

              <div className="flex flex-col md:flex-row gap-2 mt-3 md:mt-0 items-center">
                <label>Qty:</label>
                <input
                  type="number"
                  min={1}
                  value={file.quantity || 1}
                  onChange={(e) => handleQuantityChange(e, index)}
                  className="p-1 w-20 border border-cyan-500 rounded-lg text-center focus:ring-2 focus:ring-cyan-400 text-white bg-gray-700"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSLV}
          disabled={slvClicked}
          className={`px-6 py-2 rounded-lg text-white ${
            slvClicked ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          SLA
        </button>

        <button
          onClick={handleDownloadExcel}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>
    </div>
  );
};

export default SLVPanel;
