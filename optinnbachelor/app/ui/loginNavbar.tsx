
import { Settings ,Bell} from 'lucide-react/dist/lucide-react';

type NavbarProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  };
const NavbarL = ({ activeTab, setActiveTab }: NavbarProps) => {
  return (
    <nav className="bg-[#1E3528] text-white flex items-center justify-between py-4 px-10 rounded-[20px]">
      <div className="text-3xl font-bold font-sans">Optinn</div>

      <div className="flex space-x-5 items-center">
        <Settings />
      </div>
    </nav>
  );
};
export default NavbarL;


