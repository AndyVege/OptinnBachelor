"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Check, Clock, Trash } from "lucide-react";

// IMPORT av custom hook fra lib/useNotifications
import { useNotifications, Notification } from "@/lib/useNotifications";

type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

// Hvis du ønsker å ha noen "start" notifikasjoner, kan du beholde dette
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Flomvarsel i ditt område",
    description:
      "Det er meldt om økt vannstand i elver og bekker i nærheten av din lokasjon.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    priority: "high",
    source: "manual",
  },
  {
    id: "2",
    title: "Kraftig vind de neste 24 timene",
    description: "Meteorologisk institutt har sendt ut gult farevarsel for vind.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    priority: "medium",
    source: "manual",
  },
  {
    id: "3",
    title: "Høyt polleninnhold i lufta",
    description:
      "Pollenvarselet for i dag viser høye nivåer av bjørk og gress.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    priority: "low",
    source: "manual",
  },
];

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { data: session } = useSession();

  const {
    notifications,
    setNotifications,
    removeAutoNotifications,
  } = useNotifications({
    initialNotifications: sampleNotifications,
    pollIntervalMs: 10000,
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} sek siden`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min siden`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} timer siden`;
    return `${Math.floor(diffInSeconds / 86400)} dager siden`;
  };

  return (
    <nav className="bg-[#1E3528] text-white flex items-center justify-between py-4 px-10 rounded-[20px] w-full">
      {/* Venstre side */}
      <div className="text-3xl font-bold font-sans">Optinn</div>

      {/* Knapper i midten (Generelt, Vær, Helse) */}
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

      {/* Høyre side */}
      <div className="flex space-x-5 items-center relative">
        <FontAwesomeIcon className="w-5 h-5 cursor-pointer" icon={faGear} />

        {/* VARSLINGSIKON & NOTIF-DROPDOWN */}
        <div className="relative">
          <button
            className="relative text-white hover:bg-[#366249] p-2 rounded-lg"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon className="w-5 h-5" icon={faBell} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Selve varslingsdropdown */}
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="bg-[#1E3528] text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Varsler</h3>
                <div className="flex gap-3">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs flex items-center gap-1 text-white hover:text-gray-300"
                    >
                      <Check className="h-3 w-3" />
                      Marker alle
                    </button>
                  )}
                  {notifications.some(n => n.source === "auto") && (
                    <button
                      onClick={removeAutoNotifications}
                      className="text-xs flex items-center gap-1 text-white hover:text-gray-300"
                    >
                      <Trash className="h-3 w-3" />
                      Fjern auto
                    </button>
                  )}
                </div>
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
            </div>
          )}
        </div>

        {/* PROFILBILDE + DROPDOWN (samme som før) */}
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
              <div className="text-sm px-4 pb-2">{session?.user?.email}</div>
              <button
                onClick={() => signOut()}
                className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
