"use client"


import Navbar from "./Components/navbar";
import { useState } from "react";
import GenereltDashboard from "./Components/Category/generelt"; 
import HelseDashboard from "./Components/Category/helse"; 
import VærDashboard from "./Components/Category/vær"; 


export default function Home() {
  const [activeTab, setActiveTab] = useState("Generelt");

  const renderDashboard = () => {
    switch (activeTab) {
      case "Generelt":
        return <GenereltDashboard />;
      case "Helse":
        return <HelseDashboard />;
      case "Vær":
        return <VærDashboard />;
    }
  };

  return(
    <div>
     <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
     {renderDashboard()}
    </div>
  )
}
