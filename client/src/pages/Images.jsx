import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaImage, FaFolder, FaSpinner, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'; // Icons

const Images = () => {
    const { folderId } = useParams(); // Get folderId from URL
    const [images, setImages] = useState([]);
    const [folder, setFolder] = useState(null); // Store folder details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!authTokens) {
                setLoading(false);
                setError("Authentication required.");
                return;
            }
            setLoading(true);
            setError(null);
            setFolder(null); // Reset folder details on change
            setImages([]);   // Reset images

            try {
                // Fetch folder details IF a folderId is present
                if (folderId) {
                    const folderResponse = await axios.get(
                        `http://localhost:5000/api/v1/folders/${folderId}`,
                        { headers: { Authorization: `Bearer ${authTokens.token}` } }
                    );
                    setFolder(folderResponse.data.data);
                }

                // Fetch images for the specific folder OR all images if no folderId
                // Use the correct endpoints based on your routing setup
                const imagesUrl = folderId
                    ? `http://localhost:5000/api/v1/folders/${folderId}/images` // Endpoint for images within a folder
                    : `http://localhost:5000/api/v1/images`; // Endpoint for recent/all images (if you want to show all here)

                 // If you ONLY want this page for specific folders, redirect if no folderId
                 if (!folderId) {
                    // navigate('/folders'); // Or show an "All Images" view if that's intended
                    // For now, let's assume it should show specific folder images
                    setError("No folder specified.");
                    setLoading(false);
                    return;
                 }


                const imagesResponse = await axios.get(imagesUrl, {
                    headers: { Authorization: `Bearer ${authTokens.token}` }
                });
                setImages(imagesResponse.data.data);

            } catch (err) {
                console.error('Error fetching data:', err);
                 if (err.response?.status === 404) {
                    setError(folderId ? "Folder or images not found." : "Images not found.");
                } else {
                    setError("Failed to load images. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Dependency array includes folderId and authTokens
    }, [folderId, authTokens, navigate]); // Added navigate to dependencies


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                       {folder && <FaFolder className="mr-3 text-blue-500" />}
                       {loading ? 'Loading...' : (folder ? folder.name : 'Images')}
                    </h1>
                     <Link to="/folders" className="text-blue-600 hover:underline flex items-center">
                        <FaArrowLeft className="mr-1" /> Back to Folders
                     </Link>
                 </div>

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
                        {images.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
                                <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">This folder is empty.</p>
                                <Link
                                    to="/upload" // Consider pre-filling folderId in upload page state if desired
                                    className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                   Add Images
                                </Link>
                             </div>
                        ) : (
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {images.map((image) => (
                                    <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden group transition duration-300 hover:shadow-xl">
                                         <div className="relative w-full h-48">
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                            <div style={{ display: 'none' }} className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                 <FaImage className="text-3xl" />
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium text-gray-800 truncate text-sm" title={image.name}>
                                                {image.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                                            </p>
                                             {/* Add delete/edit buttons here later if needed */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
             <footer className="text-center p-4 text-gray-500 text-sm mt-8">
                © {new Date().getFullYear()} ImageVault. All rights reserved.
            </footer>
        </div>
    );
};

export default Images;