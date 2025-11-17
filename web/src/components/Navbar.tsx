import Logo from '../assets/logo.png';
import { User } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="h-16 bg-white border-b border-gray-200 px-6 flex justify-between items-center">
            <div className="flex items-center gap-6">
                <img src={Logo} alt="Logo" className="w-8 h-9" />
                <span className="text-md font-semibold text-gray-900">PDPA / International School</span>
            </div>

                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer">
                    <User className="w-5 h-5 text-gray-600" />
                </div>
        </nav>
    );
};

export default Navbar;
