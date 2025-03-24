
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell,faGear } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import Image from "next/image";

type NavbarProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  };
const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const { data: session } = useSession()
  return (
    <nav className="bg-[#1E3528] text-white flex items-center justify-between py-4 px-10 rounded-[20px]">
      <div className="text-3xl font-bold font-sans">Optinn</div>

      <div className="w-2/5 h-9 bg-[#366249] p-1  flex rounded-lg">
        {['Generelt', 'Vær', 'Helse'].map((tab) => (
          <div
            key={tab}
            className={`flex-1 font-bold text-center  rounded-lg cursor-pointer ${ activeTab === tab ? 'bg-white text-green-900' : 'bg-[#366249] opacity-50'}`}
            onClick={() => setActiveTab(tab)}>
            {tab}
          </div>
        ))}
      </div>

      <div className="flex space-x-5 items-center">
        <FontAwesomeIcon className="w-5 h-5" icon={faGear} />
        <FontAwesomeIcon  className="w-5 h-5" icon={faBell} />
        <div className="ml-10 w-10 h-10 overflow-hidden rounded-full">
          <Image src={session?.user?.image || "/images/default.profile_pic.jpg"} alt="User Profile" width={50} height={50} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
