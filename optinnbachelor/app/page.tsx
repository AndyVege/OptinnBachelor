"use client"

import Navbar from "./Components/navbar";
import { useEffect, useState } from "react";
import GenereltDashboard from "./Components/Category/generelt"; 
import HelseDashboard from "./Components/Category/helse/page"; 
import VærDashboard from "./Components/Category/vær/page"; 

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {

const {status} = useSession();
const router = useRouter();

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login");
  }})


  const [activeTab, setActiveTab] = useState("Generelt");
  
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);


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
    <div className="bg-[#E3F1F2] p-5">
     <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
     {renderDashboard()}
    </div>
  )
}
