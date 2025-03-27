import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { FaImage, FaFolder, FaUpload, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'; // Icons

const Home = () => {
    const { user, authTokens } = useAuth();
    const [recentImages, setRecentImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentImages = async () => {
            if (!authTokens) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('https://imagevault-cey2.onrender.com/api/v1/images', {
                    headers: {
                        Authorization: `Bearer ${authTokens.token}`
                    }
                });
                setRecentImages(response.data.data);
            } catch (err) {
                console.error("Error fetching recent images:", err);
                setError("Failed to load recent images. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentImages();
    }, [authTokens]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                    Welcome back, {user ? user.name : 'Guest'}!
                </h1>

                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Recent Uploads</h2>

                {loading && (
                    <div className="flex justify-center items-center py-10 text-gray-500">
                         <FaSpinner className="animate-spin mr-2 text-xl" /> Loading images...
                    </div>
                )}

                {error && (
                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                        <FaExclamationTriangle className="inline mr-2" />
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {recentImages.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
                                <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">Your gallery is empty.</p>
                                <Link
                                    to="/upload"
                                    className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    <FaUpload className="mr-2" /> Upload Your First Image
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {recentImages.map((image) => (
                                    <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden group transition duration-300 hover:shadow-xl">
                                        <div className="relative w-full h-48">
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                loading="lazy" // Lazy loading for images
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                            {/* Placeholder for broken images */}
                                            <div style={{ display: 'none' }} className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <FaImage className="text-3xl" />
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium text-gray-800 truncate text-sm" title={image.name}>
                                                {image.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {new Date(image.createdAt).toLocaleDateString()}
                                            </p>
                                            {/* Optional: Link to the folder */}
                                             {image.folder && (
                                                <Link to={`/folders/${image.folder}`} className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                                                    View Folder
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-8 flex justify-center space-x-4">
                             <Link to="/folders" className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300">
                                <FaFolder className="mr-2" /> View Folders
                             </Link>
                             <Link to="/upload" className="inline-flex items-center text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300">
                                <FaUpload className="mr-2" /> Upload More
                             </Link>
                        </div>
                    </>
                )}
            </main>
             {/* Optional Footer */}
            <footer className="text-center p-4 text-gray-500 text-sm mt-8">
                © {new Date().getFullYear()} ImageVault. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;