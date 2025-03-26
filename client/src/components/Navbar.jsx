import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaFolder, FaUpload, FaSearch, FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa'; // Import icons

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Get current path

    // Helper to determine active link
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-xl font-bold hover:text-blue-200 transition duration-200 flex items-center">
                   <FaHome className="mr-2" /> ImageVault
                </Link>
                <div className="flex items-center space-x-4 md:space-x-6">
                    {user ? (
                        <>
                            <Link
                                to="/folders"
                                className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 ${isActive('/folders') ? 'text-blue-200 font-semibold' : ''}`}
                            >
                                <FaFolder /> <span>Folders</span>
                            </Link>
                            <Link
                                to="/upload"
                                className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 ${isActive('/upload') ? 'text-blue-200 font-semibold' : ''}`}
                            >
                                <FaUpload /> <span>Upload</span>
                            </Link>
                            <Link
                                to="/search"
                                className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 ${isActive('/search') ? 'text-blue-200 font-semibold' : ''}`}
                            >
                                <FaSearch /> <span>Search</span>
                            </Link>
                            <button
                                onClick={() => {
                                    logoutUser();
                                    // No need to navigate here, logoutUser handles it
                                }}
                                className="flex items-center bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition duration-200 text-sm font-medium"
                                title="Logout"
                            >
                                <FaSignOutAlt className="mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 ${isActive('/login') ? 'text-blue-200 font-semibold' : ''}`}
                            >
                                <FaSignInAlt /> <span>Login</span>
                            </Link>
                            <Link
                                to="/register"
                                className={`flex items-center space-x-1 hover:text-blue-200 transition duration-200 ${isActive('/register') ? 'text-blue-200 font-semibold' : ''}`}
                            >
                                <FaUserPlus /> <span>Register</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;