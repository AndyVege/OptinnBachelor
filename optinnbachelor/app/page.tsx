"use client"

import NavbarL from "./ui/loginNavbar";
import Navbar from "./ui/navbar";
import { useState } from "react";
import GenereltDashboard from "./Components/Category/generelt"; 
import HelseDashboard from "./Components/Category/helse/page"; 
import VærDashboard from "./Components/Category/vær/page"; 

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
