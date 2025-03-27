import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaFolder, FaPlus, FaSpinner, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'; // Icons

const Folders = () => {
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    // For parent selection, we might need folder names along with IDs
    const [parentFolder, setParentFolder] = useState(''); // Store ID
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [createError, setCreateError] = useState('');
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolders = async () => {
            if (!authTokens) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('https://imagevault-cey2.onrender.com/api/v1/folders', {
                    headers: {
                        Authorization: `Bearer ${authTokens?.token}`
                    }
                });
                setFolders(response.data.data);
            } catch (error) {
                console.error('Error fetching folders:', error);
                setError('Failed to load folders. Please try refreshing.');
            } finally {
                setLoading(false);
            }
        };
        fetchFolders();
    }, [authTokens]);

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) {
            setCreateError('Folder name cannot be empty.');
            return;
        }
        setCreating(true);
        setCreateError('');
        try {
            const response = await axios.post(
                'https://imagevault-cey2.onrender.com/api/v1/folders',
                {
                    name: newFolderName.trim(),
                    // Send null if parentFolder is empty string, otherwise send the ID
                    parent: parentFolder ? parentFolder : null
                },
                {
                    headers: {
                        Authorization: `Bearer ${authTokens?.token}`
                    }
                }
            );
            setFolders([...folders, response.data.data].sort((a, b) => a.name.localeCompare(b.name))); // Add and sort
            setNewFolderName('');
            setParentFolder(''); // Reset parent selection
            // Optionally add a success message state here
        } catch (error) {
            console.error('Error creating folder:', error);
            setCreateError(error.response?.data?.error || 'Failed to create folder.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto p-4 md:p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Folders</h1>
                     <Link to="/" className="text-blue-600 hover:underline flex items-center">
                        <FaArrowLeft className="mr-1" /> Back to Home
                     </Link>
                 </div>


                <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Folder</h2>
                    <form onSubmit={handleCreateFolder} className="space-y-4">
                         {createError && (
                            <p className="bg-red-100 text-red-700 p-3 rounded text-sm">{createError}</p>
                        )}
                        <div>
                            <label htmlFor="newFolderName" className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
                            <input
                                type="text"
                                id="newFolderName"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Vacation Pics"
                                required
                                disabled={creating}
                            />
                        </div>
                        <div>
                            <label htmlFor="parentFolder" className="block text-sm font-medium text-gray-700 mb-1">Parent Folder (Optional)</label>
                            <select
                                id="parentFolder"
                                value={parentFolder}
                                onChange={(e) => setParentFolder(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={creating || loading} // Disable while loading folders too
                            >
                                <option value="">-- No Parent (Root Folder) --</option>
                                {folders.map((folder) => (
                                    <option key={folder._id} value={folder._id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={creating || loading}
                        >
                            {creating ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" /> Creating...
                                </>
                            ) : (
                                <>
                                    <FaPlus className="mr-2" /> Create Folder
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Browse Folders</h2>
                     {loading && (
                        <div className="flex justify-center items-center py-10 text-gray-500">
                            <FaSpinner className="animate-spin mr-2 text-xl" /> Loading folders...
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
                            {folders.length === 0 ? (
                                <p className="text-center text-gray-500 py-6">No folders created yet. Use the form above to start organizing!</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    {folders.map((folder) => (
                                        <div
                                            key={folder._id}
                                            className="border border-gray-200 bg-gray-50 p-4 rounded-md hover:bg-blue-50 hover:shadow-md cursor-pointer transition duration-200 flex items-center space-x-3"
                                            onClick={() => navigate(`/folders/${folder._id}`)}
                                            title={`Open folder: ${folder.name}`}
                                        >
                                            <FaFolder className="text-blue-500 text-2xl flex-shrink-0" />
                                            <div className="overflow-hidden">
                                                <h3 className="font-medium text-gray-800 truncate">{folder.name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {folder.parent ? `Subfolder` : 'Root folder'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
             <footer className="text-center p-4 text-gray-500 text-sm mt-8">
                © {new Date().getFullYear()} ImageVault. All rights reserved.
            </footer>
        </div>
    );
};

export default Folders;