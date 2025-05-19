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
  const { notifications, setNotifications, removeAutoNotifications } = useNotifications({
    initialNotifications: [],
    pollIntervalMs: 10000,
  });

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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTimeAgo = (date: Date) => {
    const now = Date.now();
    const diff = Math.floor((now - date.getTime()) / 1000);
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
      <div className="text-2xl sm:text-3xl font-bold hover:text-green-300 transition-colors duration-200">
        Optinn
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex w-2/5 h-9 bg-[#366249] p-1 gap-1 justify-between rounded-[8px]">
        {["Generelt", "Vær", "Helse"].map((tab) => (
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

      {/* Desktop Right Section */}
      <div className="flex space-x-4 items-center">
        {/* Settings Icon */}
        <FontAwesomeIcon
          className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-green-300 transition-colors duration-200"
          icon={faGear}
        />

        {/* Notification bell */}
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

          {/* Notification dropdown */}
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
                            <p
                              className={`text-sm ${
                                !notification.read ? "font-medium" : ""
                              }`}
                            >
                              {notification.title}
                            </p>
                            <div className="flex items-center text-gray-500 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimeAgo(notification.timestamp)}
                            </div>
                          </div>
                          {notification.description && (
                            <p className="text-xs text-gray-600">
                              {notification.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    Ingen varsler å vise
                  </div>
                )}
              </div>

              {/* Utvid varsler knapp */}
              <div className="p-3 border-t text-center">
                <button
                  className="text-sm text-green-700 hover:underline font-semibold"
                  onClick={() => {
                    setShowNotifications(false);
                    router.push("/varsler/utvidet");
                  }}
                >
                  Utvid varsler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 overflow-hidden rounded-full cursor-pointer"
          >
            <Image
              src={session?.user?.image || "/images/default.profile_pic.jpg"}
              alt="User Profile"
              width={50}
              height={50}
            />
          </div>
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-20"
            >
              <div className="px-4 py-2 font-bold">
                {session?.user?.name || "User"}
              </div>
              <div className="text-sm px-4 pb-2">
                {session?.user?.email}
              </div>
              <button
                onClick={() => signOut()}
                className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Sign Out
              </button>
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
              <div className="flex flex-col space-y-2">
                {["Generelt", "Vær", "Helse"].map((tab) => (
                  <div
                    key={tab}
                    className={`font-semibold text-center py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-green-900 scale-[1.02]"
                        : "bg-[#366249] text-white opacity-80 hover:opacity-100"
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>
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
