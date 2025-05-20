import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const hazardData = [
    {
      name: "SNØSKRED",
      riskLevel: "Moderat",
      icon: "🗻",
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
      icon: "🏔️",
      color: "bg-red-600",
      shape: "rounded-full w-6 h-6"
    }
  ];
  
  export default function FareIndikatorModul() {
    const [openInfo, setOpenInfo] = useState<string | null>(null);
    return (
      <div className="bg-white rounded-[30px] shadow-md p-5 w-2/3 max-w-2xl">
        <div className="relative mb-4">
          <FontAwesomeIcon 
            icon={faCircleInfo} 
            className="absolute right-0 top-0 w-5 h-5 cursor-pointer" 
            onClick={() => setOpenInfo(openInfo === "hazard" ? null : "hazard")}
          />
          {openInfo === "hazard" && (
            <div className="absolute top-5 right-3 z-50 bg-[#1E3528] text-white p-4 rounded-[8px] shadow-lg w-150 text-sm">
              <a href="https://www.varsom.no" target="_blank" rel="noopener noreferrer">Data hentet fra Varsom (NVE)</a>
            </div>
          )}
          <h2 className="text-2xl font-bold text-center">Fareindikator</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hazardData.map((hazard, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md h-[232px] w-full"
            >
              <div className="text-5xl mb-4">
                {hazard.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{hazard.name}</h2>
              <p className="text-gray-700 mb-1">Risikonivå:</p>
              <span
                title={`${hazard.riskLevel} risiko: Klikk linken øverst til høyre for mer info.`}
                className={`text-sm font-bold px-3 py-2 rounded-full text-white shadow-md ${hazard.color}`}
              >
                {hazard.riskLevel}
              </span>
              
              <p className="text-xs text-gray-500 mt-2">Sist oppdatert: –</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
