"use client"
import NavbarL from "../../../ui/loginNavbar";
import { useState } from "react";
import Link from "next/link"
ImportIcon
  import { ImportIcon, UserIcon, LockIcon} from "lucide-react";



export default function Home() {
  const [activeTab, setActiveTab] = useState("Generelt");
  

const renderDashboard = () => {
    switch (activeTab) {
      case "Login":
    }
  }

  return(
    <div>
    <NavbarL activeTab={activeTab} setActiveTab={setActiveTab} />
    <div>
      <div className="p-10 grid grid-cols-1 place-items-center gap-6">
        <div className="bg-[#1E3528] rounded-[30px] shadow-md p-6 h-[40rem] w-[35rem] flex flex-col items-center justify-center">
          <div className="text-8xl font-bold font-san text-white mb-10">
            Optinn
            
          </div>
          <div className="bg-white rounded-[30px] shadow-md p-10 w-[28rem] h-[26rem] flex flex-col items-center">
          {/* Brukernavn Input */}
          <div className="flex items-center bg-gray-300 rounded-full p-4 w-full mb-8">
            <span className="text-gray-600 text-xl ml-2"><UserIcon></UserIcon></span> {/* Ikon fra lucide-react */}
            <input 
              type="text" 
              placeholder="Skriv brukernavn" 
              className="bg-transparent outline-none text-gray-600 w-full ml-2"
            />
          </div>

          {/* Passord Input */}
          <div className="flex items-center bg-gray-300 rounded-full p-4 w-full mb-4">
            <span className="text-gray-600 text-xl ml-2"><LockIcon></LockIcon></span> {/* Ikon fra lucide-react */}
            <input 
              type="password" 
              placeholder="Skriv passord" 
              className="bg-transparent outline-none text-gray-600 w-full ml-2"
            />
          </div>

          {/* Glemt passord */}
          <p className="text-gray-600 text-sm mb-16 cursor-pointer">Glemt passord?</p>

          {/* Login Button */}
          <button className="bg-[#1E3528] text-white font-bold py-3 px-6 rounded-full text-lg w-full">
            Logg inn
          </button>

          {/* Registrer Link */}
          <p className="text-gray-600 text-sm mt-4">
            Har du ikke bruker? <span className="text-blue-500 cursor-pointer">Registrer deg.</span>
          </p>
        </div>
        </div>
      </div>
    </div>
  </div>
  
  )
  };
