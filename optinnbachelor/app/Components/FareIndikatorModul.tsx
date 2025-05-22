"use client";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const hazardData = [
    {
      name: "SNØSKRED",
      riskLevel: "Moderat",
      icon: (
        <svg
          viewBox="-2.4 -2.4 28.80 28.80"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-black"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <path d="M19.335 15.268l2.485 1.405-.492.871-2.467-1.395-.267 2.492-.994-.108.313-2.92L13 12.836v6.04l2.602 1.033-.369.93L13 19.952V22h-1v-2.048l-2.233.887-.369-.93L12 18.876v-6.04l-4.913 2.777.313 2.92-.994.108-.267-2.492-2.467 1.395-.492-.871 2.485-1.405-1.962-1.581.628-.78 2.271 1.832 4.882-2.76-4.881-2.758-2.272 1.832-.628-.78 1.963-1.582L3.18 7.286l.492-.871L6.139 7.81l.267-2.491.994.108-.312 2.919L12 11.123V5.124L9.398 4.091l.369-.93L12 4.048V2h1v2.048l2.233-.887.369.93L13 5.124v5.999l5.195-2.937-.296-2.759.995-.108.249 2.331 2.185-1.235.492.871-2.185 1.235 1.869 1.417-.605.796-2.212-1.677-5.171 2.922 4.882 2.76 2.271-1.832.628.78-1.962 1.581z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
      ),
      color: "bg-yellow-400",
      shape: "rounded-full w-6 h-6"
    },
    {
      name: "FLOM",
      riskLevel: "Betydelig",
      icon: (
        <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
          <path
            fill="black"
            transform="scale(0.186, -0.186) translate(0, -800)"
            d="M800 0h-800v800h800v-800zM780 25v760h-760v-760h760zM747 629v-163q-41 -82 -114 -89q-38 0 -88 57l-42 58q2 0 -18 -30q-23 -33 -47 -55q-34 -30 -64 -30t-63 30q-24 21 -47 55l-16 30q-64 -106 -135 -115q-11 1 -21 6q-24 11 -41 39v0v163q25 -42 62 -45q21 3 42 18 q50 36 93 125q8 -19 17 -37q22 -42 46 -69q33 -38 63 -37q30 0 64 37q24 26 47 68q20 36 18 37q21 -36 42 -71q50 -72 88 -71q21 2 40 11q46 23 74 78zM749 349v-163q-41 -82 -114 -89q-38 0 -89 58q-20 28 -41 57q2 0 -18 -30q-23 -33 -47 -55q-34 -30 -64 -30t-63 30 q-24 21 -47 55l-16 30q-64 -106 -135 -115q-11 1 -21 6q-24 11 -41 39v0v163q25 -42 62 -45q21 3 42 18q50 36 93 125q8 -19 16 -37q23 -42 47 -69q33 -38 63 -37q30 0 64 37q24 26 47 68q20 36 18 37q21 -36 42 -71q50 -72 88 -71q21 2 40 11q46 23 74 78z"
          />
        </svg>
      ),
      color: "bg-orange-500",
      shape: "w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-orange-500"
    },
    {
      name: "JORDSKRED",
      riskLevel: "Høy",
      icon: (
        <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
          <path 
          fill="black" 
          transform="scale(0.186, -0.186) translate(0, -800)" 
          d="M800 0h-800v800h800v-800zM780 20v760h-760v-760h760zM548 537l-8 -40l-38 -6l-23 49l30 22zM744 55l-450 -1q115 103 183 195q58 84 93 176q33 87 31 140q-46 34 -93 69l161 105l75 2v-686zM536 406l-22 -28l-44 -7l-30 57l34 26l17 -2l26 -9zM428 352l-25 -32l-49 -8 l-34 65l38 29l23 -5l25 -7zM396 222l-18 -41l-60 -10l-42 79l47 35l21 -23l38 9zM260 133l-42 -55l-85 -13l-79 83l86 77l30 -33l52 13z"/>
        </svg>
      ),
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
