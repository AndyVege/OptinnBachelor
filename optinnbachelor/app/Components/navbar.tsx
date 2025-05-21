"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGear, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Check, Clock, Trash } from "lucide-react";
import { useNotifications, Notification } from "@/lib/useNotifications";
import { useRouter } from "next/navigation";

type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { data: session } = useSession();
  const {
    notifications,
    setNotifications,
    removeAutoNotifications,
    markAllAsRead,
  } = useNotifications({ pollIntervalMs: 10000 });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} sek siden`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min siden`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} timer siden`;
    return `${Math.floor(diff / 86400)} dager siden`;
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#1E3528] text-white flex items-center justify-between py-4 px-10 rounded-[20px] w-full relative shadow-lg">
      {/* Logo */}
      <div className="text-2xl sm:text-3xl font-bold font-sans hover:text-green-300 transition-colors duration-200" onClick={()=> setActiveTab('')} >
        Optinn
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex w-2/5 h-9 bg-[#366249] p-1 gap-1 justify-between rounded-[8px]">
        {["Befolkning", "Vær", "Helse"].map((tab) => (
          <div
            key={tab}
            className={`flex-1 font-bold text-center rounded-[8px] cursor-pointer transition-all duration-200 ${
              activeTab === tab
                ? "bg-white text-green-900 transform scale-105"
                : "bg-[#366249] opacity-50 hover:opacity-75"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Right section */}
      <div className="flex space-x-4 items-center">
        {/* Settings */}
        <FontAwesomeIcon icon={faGear} className="w-5 h-5 cursor-pointer hover:text-green-300 transition-colors" />

        {/* Bell */}
        <div className="relative">
          <button
            className="relative p-2 rounded-lg"
            onClick={() => setShowNotifications((s) => !s)}
          >
            <FontAwesomeIcon icon={faBell} className="w-5 h-5 hover:text-green-300 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#1E3528] text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Varsler</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="flex items-center text-xs gap-1 hover:opacity-75">
                    <Check className="w-4 h-4" />
                    Marker alle som lest
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 border-b last:border-0 hover:bg-gray-100">
                      <div className="flex items-start gap-2">
                        <span
                          className={`w-2 h-2 rounded-full mt-1 ${
                            n.priority === "high"
                              ? "bg-red-500"
                              : n.priority === "medium"
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className={`text-sm ${!n.read ? "font-medium" : ""}`}>{n.title}</p>
                            <div className="flex items-center text-gray-500 text-xs">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTimeAgo(n.timestamp)}
                            </div>
                          </div>
                          {n.description && <p className="text-xs text-gray-600">{n.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-6">Ingen varsler å vise</p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-3 flex justify-between items-center">
                <button
                  className="text-sm text-green-700 hover:underline font-semibold"
                  onClick={() => {
                    setShowNotifications(false);
                    handleTabClick("UtvidetVarslingssystem")
                  }}
                >
                  Utvid varsler
                </button>
                <button onClick={removeAutoNotifications} className="flex items-center text-sm text-red-600 hover:text-red-800 gap-1">
                  <Trash className="w-4 h-4" />
                  Tøm varsler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <div onClick={() => setShowDropdown((s) => !s)} className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
            <Image src={session?.user?.image || "/images/default.profile_pic.jpg"} alt="User" width={40} height={40} />
          </div>
          {showDropdown && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-20">
              <div className="px-4 py-2 font-bold">{session?.user?.name || "User"}</div>
              <div className="text-sm px-4 pb-2">{session?.user?.email}</div>
              <button onClick={() => signOut()} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile */}
        <FontAwesomeIcon
          icon={isMobileMenuOpen ? faXmark : faBars}
          className="md:hidden w-6 h-6 cursor-pointer hover:text-green-300"
          onClick={() => setIsMobileMenuOpen((s) => !s)}
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="absolute top-full left-4 right-4 bg-[#1E3528] mt-2 rounded-xl shadow-lg z-50 p-3 md:hidden">
          <div className="flex flex-col space-y-2">
            {["Generelt", "Vær", "Helse"].map((tab) => (
              <div
                key={tab}
                className={`py-2 text-center rounded-lg cursor-pointer ${
                  activeTab === tab ? "bg-white text-green-900" : "bg-[#366249] text-white opacity-80 hover:opacity-100"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <button onClick={() => signOut()} className="w-full mt-2 text-white bg-red-600 rounded-lg py-2 hover:bg-red-700">
            Logg ut
          </button>
        </div>
      )}
    </nav>
  );
}
