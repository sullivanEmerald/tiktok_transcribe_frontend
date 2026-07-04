import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaTelegram, FaWhatsapp, FaLinkedin, FaTwitter } from 'react-icons/fa';

const PlatformIcons = {
    instagram: <FaInstagram className="w-8 h-8 text-pink-500" />,
    tiktok: <FaTiktok className="w-8 h-8 text-black dark:text-white" />,
    youtube: <FaYoutube className="w-8 h-8 text-red-500" />,
    facebook: <FaFacebook className="w-8 h-8 text-blue-600" />,
    telegram: <FaTelegram className="w-8 h-8 text-blue-400" />,
    whatsapp: <FaWhatsapp className="w-8 h-8 text-green-500" />,
    linkedin: <FaLinkedin className="w-8 h-8 text-blue-700" />,
    twitter: <FaTwitter className="w-8 h-8 text-blue-500" />,
};

export default PlatformIcons;