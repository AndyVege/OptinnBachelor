import React from "react";

const hazardData = [
    {
      name: "SNØSKRED",
      riskLevel: "Moderat",
      icon: "❄️",
      color: "bg-yellow-400",
      shape: "rounded-full w-6 h-6"
    },
    {
      name: "FLOM",
      riskLevel: "Betydelig",
      icon: "🌊",
      color: "bg-orange-500",
      shape: "w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-orange-500"
    },
    {
      name: "JORDSKRED",
      riskLevel: "Høy",
      icon: "⛰️",
      color: "bg-red-600",
      shape: "rounded-full w-6 h-6"
    }
  ];
  
  export default function FareIndikatorModul() {
    return (
      <div className="bg-white rounded-[30px] shadow-md p-5 w-2/3 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hazardData.map((hazard, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between bg-white p-6 rounded-2xl shadow-md w-64"
            >
              <div className="text-5xl mb-4">{hazard.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{hazard.name}</h2>
              <p className="text-gray-700 mb-4">Risikonivå: <span className="font-semibold">{hazard.riskLevel}</span></p>
              <div className={`mt-auto ${hazard.shape} ${hazard.color}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
