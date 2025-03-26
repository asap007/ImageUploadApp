import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaSearch, FaImage, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'; // Icons
import { Link } from 'react-router-dom';

const SearchImages = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed
    const { authTokens } = useContext(AuthContext);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return; // Don't search if query is empty

        setLoading(true);
        setError('');
        setHasSearched(true); // Mark that a search was attempted
        setResults([]); // Clear previous results

        try {
            const response = await axios.get(
                `http://localhost:5000/api/v1/images/search?q=${encodeURIComponent(query)}`, // Ensure query is URL encoded
                {
                    headers: { Authorization: `Bearer ${authTokens?.token}` }
                }
            );
            setResults(response.data.data);
        } catch (error) {
            console.error('Error searching images:', error);
            setError(error.response?.data?.error || 'Failed to perform search.');
        } finally {
            setLoading(false);
        }
    };

    return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Search Images</h1>

                <form onSubmit={handleSearch} className="mb-8 flex max-w-xl mx-auto">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by image name..."
                        className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-3 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !query.trim()}
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                    </button>
                </form>

                 {/* Status Messages */}
                 {loading && (
                     <div className="text-center py-6 text-gray-500">
                         <FaSpinner className="animate-spin inline mr-2 text-xl" /> Searching...
                     </div>
                 )}
                 {error && (
                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center max-w-xl mx-auto" role="alert">
                         <FaExclamationTriangle className="inline mr-2" />
                        <span className="block sm:inline">{error}</span>
                    </div>
                 )}

                 {/* Results Area */}
                 {!loading && !error && hasSearched && (
                     <>
                         <h2 className="text-xl font-semibold mb-4 text-gray-700">
                             Search Results ({results.length})
                         </h2>
                         {results.length === 0 ? (
                             <p className="text-center text-gray-500 py-6 bg-white rounded-lg shadow border">
                                 No images found matching "{query}".
                             </p>
                         ) : (
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {results.map((image) => (
                                    <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden group transition duration-300 hover:shadow-xl">
                                        <div className="relative w-full h-48">
                                            <img
                                                src={`http://localhost:5000${image.url}`}
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
                                            {image.folder && ( // Check if folder info exists before trying to display it
                                                <p className="text-xs text-gray-500 mt-1">
                                                    In folder: {' '}
                                                    <Link to={`/folders/${image.folder._id || image.folder}`} className="text-blue-500 hover:underline">
                                                        {image.folder.name || 'View Folder'}
                                                    </Link>
                                                </p>
                                            )}
                                            {!image.folder && (
                                                 <p className="text-xs text-gray-500 mt-1">
                                                    (No folder)
                                                 </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                         )}
                     </>
                 )}

                 {!loading && !error && !hasSearched && (
                     <p className="text-center text-gray-500 py-10">
                         Enter a search term above to find images by name.
                     </p>
                 )}
            </main>
            <footer className="text-center p-4 text-gray-500 text-sm mt-8">
                © {new Date().getFullYear()} ImageVault. All rights reserved.
            </footer>
        </div>
    );
};

export default SearchImages;