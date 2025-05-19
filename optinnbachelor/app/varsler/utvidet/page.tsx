"use client";

import Navbar from "@/app/Components/navbar";
import UtvidetVarslingSystem from "@/app/Components/UtvidetVarslingsystem";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UtvidetVarslerSide() {
  const [activeTab, setActiveTab] = useState("Vær");
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "Generelt":
        return router.push("/");
      case "Vær":
        return router.push("/Components/Category/vær");
      case "Helse":
        return router.push("/Components/Category/helse");
    }
  };

  return (
    <div className="min-h-screen bg-[#E3F1F2]"> {/* Samme bakgrunn som globals.css */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabClick} />
      <div className="p-6">
        <UtvidetVarslingSystem onClose={() => {}} showCloseButton={false} />
      </div>
    </div>
  );
}
