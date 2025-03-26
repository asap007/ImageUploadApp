import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Using named export
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom'; // Import Link

const Home = () => {
    const { user, authTokens } = useAuth(); // Get user and tokens
    const [recentImages, setRecentImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentImages = async () => {
            if (!authTokens) {
                setLoading(false);
                return; // Don't fetch if not logged in
            }
            setLoading(true);
            setError(null);
            try {
                // Fetch images using the general endpoint, which now returns recent ones
                const response = await axios.get('http://localhost:5000/api/v1/images', {
                    headers: {
                        Authorization: `Bearer ${authTokens.token}`
                    }
                });
                setRecentImages(response.data.data);
            } catch (err) {
                console.error("Error fetching recent images:", err);
                setError("Failed to load recent images.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentImages();
    }, [authTokens]); // Re-fetch if authTokens change

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Welcome, {user ? user.name : 'Guest'}!
                </h1>

                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recent Uploads</h2>

                {loading && <p className="text-gray-500">Loading recent images...</p>}

                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <>
                        {recentImages.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded shadow">
                                <p className="text-gray-500 mb-4">You haven't uploaded any images yet.</p>
                                <Link
                                    to="/upload"
                                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
                                >
                                    Upload Your First Image
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {recentImages.map((image) => (
                                    <div key={image._id} className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden transition transform hover:scale-105 duration-300">
                                        <img
                                            src={`http://localhost:5000${image.url}`}
                                            alt={image.name}
                                            className="w-full h-48 object-cover" // Added object-cover
                                            onError={(e) => { e.target.style.display = 'none'; /* Hide broken image icon */ e.target.nextSibling.style.display = 'block'; /* Show placeholder */ }}
                                        />
                                        {/* Optional: Placeholder for broken images */}
                                        <div style={{ display: 'none' }} className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                                            Image not found
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium text-gray-800 truncate" title={image.name}>
                                                {image.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(image.createdAt).toLocaleDateString()}
                                            </p>
                                            {/* Optional: Link to the folder */}
                                            {/* {image.folder && (
                                                <Link to={`/folders/${image.folder}`} className="text-xs text-blue-500 hover:underline">
                                                    View Folder
                                                </Link>
                                            )} */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Optional: Link to view all images or folders */}
                        <div className="mt-8 text-center">
                             <Link to="/folders" className="text-blue-600 hover:underline mr-4">
                                View All Folders
                             </Link>
                             {/* If you create an 'All Images' page later */}
                             {/* <Link to="/images" className="text-blue-600 hover:underline">
                                View All Images
                             </Link> */}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Home;