"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGear, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Check, Clock, Trash } from "lucide-react";
import { useNotifications, Notification } from "@/lib/useNotifications";

type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Navbarwithout() {
  const { data: session } = useSession();

  const {
    notifications,
    setNotifications,
    removeAutoNotifications,
  } = useNotifications({
    initialNotifications: [],
    pollIntervalMs: 10000,
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) &&
        (notificationRef.current && !notificationRef.current.contains(event.target as Node))
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev: Notification[]) =>
      prev.map((n: Notification) => ({ ...n, read: true }))
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} sek siden`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min siden`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} timer siden`;
    return `${Math.floor(diffInSeconds / 86400)} dager siden`;
  };

  const handleTabClick = (tab: string) => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#1E3528] text-white flex items-center justify-between py-4 px-10 rounded-[20px] w-full relative shadow-lg">
      {/* Logo */}
      <div className="text-2xl sm:text-3xl font-bold font-sans hover:text-green-300 transition-colors duration-200">
        Optinn
      </div>

      {/* Desktop Right Section */}
      <div className="flex space-x-4 items-center ">
      {/* Settings Icon */}
      <FontAwesomeIcon 
        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-green-300 transition-colors duration-200" 
        icon={faGear} 
      />

        {/* Varslingsikon med indikator */}
        <div className="relative">
          <button
            className="relative text-white p-1 md:p-2 rounded-lg transition-colors duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon 
              className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-green-300 transition-colors duration-200" 
              icon={faBell} 
            />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Varslingsdropdown */}
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 border border-white mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="bg-[#1E3528] text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Varsler</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs flex items-center gap-1 text-white hover:text-gray-300"
                  >
                    <Check className="h-3 w-3" />
                    Marker alle som lest
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b last:border-0 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.priority === "high"
                              ? "bg-red-500"
                              : notification.priority === "medium"
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center text-gray-500 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimeAgo(notification.timestamp)}
                            </div>
                          </div>
                          {notification.description && (
                            <p className="text-xs text-gray-600">{notification.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">Ingen varsler å vise</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profilbilde med dropdown */}
        <div className="relative">
          <div onClick={() => setShowDropdown(!showDropdown)} className="w-10 h-10 overflow-hidden rounded-full cursor-pointer">
            <Image src={session?.user?.image || "/images/default.profile_pic.jpg"} alt="User Profile" width={50} height={50} />
          </div>
          {showDropdown && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-20">
              <div className="px-4 py-2 font-bold">{session?.user?.name || "User"}</div>
              <div className="text-sm px-4 pb-2">{session?.user?.email}</div>
              <button onClick={() => signOut()} className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-100">Sign Out</button>
            </div>
          )}
        </div>
      


      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-4">
        <FontAwesomeIcon 
          className="w-5 h-5 cursor-pointer hover:text-green-300 transition-colors duration-200" 
          icon={isMobileMenuOpen ? faXmark : faBars} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
      <div 
        ref={mobileMenuRef}
        className="absolute top-full left-4 right-4 bg-[#1E3528] mt-2 rounded-xl shadow-xl z-50 md:hidden transform transition-all duration-200 ease-in-out"
      >
        <div className="p-3 space-y-4">
          
         

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-[#2B4C3A]">
            <button
              onClick={() => signOut()} 
              className="w-full text-white hover:text-red-700 transition-all duration-200 py-2 rounded-lg font-semibold"
            >
              Logg ut
            </button>
          </div>
        </div>
      </div>
    )}
    </div>

    </nav>
  );
}
