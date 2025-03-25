import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const { data: session } = useSession();

  // Dropdown state and ref
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown on profile click
  const handleProfileClick = () => {
    setShowDropdown((prev) => !prev);
  };

  // Sign out and close the dropdown
  const handleSignOut = () => {
    signOut();
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#1E3528] text-white flex items-center justify-between py-4 px-10 rounded-[20px]">
      <div className="text-3xl font-bold font-sans">Optinn</div>

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

      <div className="flex space-x-5 items-center">
        <FontAwesomeIcon className="w-5 h-5" icon={faGear} />
        <FontAwesomeIcon className="w-5 h-5" icon={faBell} />
        <div className="ml-10 relative">
          <div onClick={handleProfileClick} className="w-10 h-10 overflow-hidden rounded-full cursor-pointer">
            <Image
              src={session?.user?.image || "/images/default.profile_pic.jpg"}
              alt="User Profile"
              width={50}
              height={50}
            />
          </div>
          {showDropdown && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-20">
              <div className="px-4 py-2 text-gray-800">
                <div className="font-bold">{session?.user?.name || "User"}</div>
                <div className="text-sm">{session?.user?.email}</div>
              </div>
              <button
                onClick={handleSignOut}
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
};

export default Navbar;
