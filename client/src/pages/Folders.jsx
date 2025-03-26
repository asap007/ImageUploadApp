import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Folders = () => {
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [parentFolder, setParentFolder] = useState(null);
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/folders', {
                    headers: {
                        Authorization: `Bearer ${authTokens?.token}`
                    }
                });
                setFolders(response.data.data);
            } catch (error) {
                console.error('Error fetching folders:', error);
            }
        };

        if (authTokens) {
            fetchFolders();
        }
    }, [authTokens]);

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/folders',
                {
                    name: newFolderName,
                    parent: parentFolder || undefined
                },
                {
                    headers: {
                        Authorization: `Bearer ${authTokens?.token}`
                    }
                }
            );
            setFolders([...folders, response.data.data]);
            setNewFolderName('');
            setParentFolder(null);
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Folders</h1>
                
                <div className="mb-8 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>
                    <form onSubmit={handleCreateFolder} className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Folder Name</label>
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Parent Folder (optional)</label>
                            <select
                                value={parentFolder || ''}
                                onChange={(e) => setParentFolder(e.target.value || null)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">None</option>
                                {folders.map((folder) => (
                                    <option key={folder._id} value={folder._id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Create Folder
                        </button>
                    </form>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Folders</h2>
                    {folders.length === 0 ? (
                        <p className="text-gray-500">No folders created yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {folders.map((folder) => (
                                <div
                                    key={folder._id}
                                    className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/folders/${folder._id}`)}
                                >
                                    <h3 className="font-medium">{folder.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {folder.parent ? `Subfolder` : 'Root folder'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Folders;