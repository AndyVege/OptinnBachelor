"use client";

import { Settings } from "lucide-react";
import NotificationsDropdown from "@/app/ui/NotificationsDropdown";

type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  return (
    <nav className="bg-[#1E3528] text-white flex items-center justify-between py-4 px-10 rounded-[20px] w-full">
      {/* Logo */}
      <div className="text-3xl font-bold font-sans">Optinn</div>

      {/* Tabs */}
      <div className="w-2/5 h-9 bg-[#366249] p-1 flex rounded-lg">
        {["Generelt", "Vær", "Helse"].map((tab) => (
          <div
            key={tab}
            className={`flex-1 font-bold text-center rounded-lg cursor-pointer ${
              activeTab === tab ? "bg-white text-green-900" : "bg-[#366249] opacity-50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Icons */}
      <div className="flex space-x-5 items-center">
        <Settings className="w-6 h-6 cursor-pointer" />
        
        {/* Varslingsikon med teller */}
        <div className="relative">
          <NotificationsDropdown />
        </div>

        <div className="ml-10 w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
    </nav>
  );
};

export default Navbar;

