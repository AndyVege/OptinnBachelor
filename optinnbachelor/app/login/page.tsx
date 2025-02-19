"use client"
import Navbar from "../Components/loginNavbar";
import { useState } from "react";


export default function Home() {
  const [activeTab, setActiveTab] = useState("Generelt");
  

const renderDashboard = () => {
    switch (activeTab) {
      case "Login":
    }
  }

  return(
    <div>
     <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
     <div>hello</div>
    </div>
  )
};


