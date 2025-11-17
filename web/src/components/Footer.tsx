import { useAuthStore } from '../stores/authStore';

const Footer = () => {
    
    const { isAuthenticated } = useAuthStore();

    return (
        <div className={`${isAuthenticated ? 'text-left px-6' : 'text-center'} py-4`}>
            <p className="text-xs text-gray-400">© Criclabs</p>
        </div>
    );
}

export default Footer;