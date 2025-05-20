"use client";

import Navbar from "@/app/Components/navbar";
import UtvidetVarslingsystem from "@/app/Components/UtvidetVarslingsystem";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UtvidetVarslerSide() {
  const [activeTab, setActiveTab] = useState("Vær");
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "Generelt":
        router.push("/mainPage");
        break;
      case "Vær":
        router.push("/varsler/utvidet");
        break;
      case "Helse":
        router.push("/Components/Category/helse");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#E3F1F2]">
      <Navbar activeTab={activeTab} setActiveTab={handleTabClick} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <UtvidetVarslingsystem />
      </main>
    </div>
  );
}
