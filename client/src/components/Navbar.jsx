import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Image Folder App</Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link to="/folders" className="hover:underline">Folders</Link>
                            <Link to="/upload" className="hover:underline">Upload</Link>
                            <Link to="/search" className="hover:underline">Search</Link>
                            <button 
                                onClick={() => {
                                    logoutUser();
                                    navigate('/login');
                                }} 
                                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;