import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
    FaFolder, FaUpload, FaSearch, FaHome, 
    FaSignInAlt, FaUserPlus, FaSignOutAlt, 
    FaBars, FaTimes 
} from 'react-icons/fa';

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Helper to determine active link
    const isActive = (path) => location.pathname === path;

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu when a link is clicked
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Render navigation links
    const NavLinks = ({ isMobile }) => {
        if (user) {
            return (
                <>
                    <Link
                        to="/folders"
                        className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 
                            ${isActive('/folders') ? 'text-blue-200 font-semibold' : ''}
                            ${isMobile ? 'py-2 px-4 w-full text-left' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        <FaFolder /> <span>Folders</span>
                    </Link>
                    <Link
                        to="/upload"
                        className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 
                            ${isActive('/upload') ? 'text-blue-200 font-semibold' : ''}
                            ${isMobile ? 'py-2 px-4 w-full text-left' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        <FaUpload /> <span>Upload</span>
                    </Link>
                    <Link
                        to="/search"
                        className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 
                            ${isActive('/search') ? 'text-blue-200 font-semibold' : ''}
                            ${isMobile ? 'py-2 px-4 w-full text-left' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        <FaSearch /> <span>Search</span>
                    </Link>
                    <button
                        onClick={() => {
                            logoutUser();
                            closeMobileMenu();
                        }}
                        className={`flex items-center bg-red-500 hover:bg-red-600 transition duration-200 text-sm font-medium
                            ${isMobile ? 'py-2 px-4 w-full text-left' : 'px-3 py-2 rounded'}`}
                        title="Logout"
                    >
                        <FaSignOutAlt className="mr-1" /> Logout
                    </button>
                </>
            );
        }
        return (
            <>
                <Link
                    to="/login"
                    className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 
                        ${isActive('/login') ? 'text-blue-200 font-semibold' : ''}
                        ${isMobile ? 'py-2 px-4 w-full text-left' : ''}`}
                    onClick={closeMobileMenu}
                >
                    <FaSignInAlt /> <span>Login</span>
                </Link>
                <Link
                    to="/register"
                    className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 
                        ${isActive('/register') ? 'text-blue-200 font-semibold' : ''}
                        ${isMobile ? 'py-2 px-4 w-full text-left' : ''}`}
                    onClick={closeMobileMenu}
                >
                    <FaUserPlus /> <span>Register</span>
                </Link>
            </>
        );
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <Link 
                    to="/" 
                    className="text-xl font-bold hover:text-blue-200 transition duration-200 flex items-center"
                    onClick={closeMobileMenu}
                >
                    <FaHome className="mr-2" /> ImageVault
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4 md:space-x-6">
                    <NavLinks isMobile={false} />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button 
                        onClick={toggleMobileMenu} 
                        className="focus:outline-none"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
                        <div className="flex flex-col items-start">
                            <NavLinks isMobile={true} />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;