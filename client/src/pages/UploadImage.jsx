import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const UploadImage = () => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState('');
    const [folders, setFolders] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { authTokens } = useContext(AuthContext);

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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            alert('Please select an image file');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('name', name || file.name);
        formData.append('file', file);
        if (folder) {
            formData.append('folder', folder);
        }

        try {
            await axios.post('http://localhost:5000/api/v1/images', formData, {
                headers: {
                    Authorization: `Bearer ${authTokens?.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Image uploaded successfully!');
            setName('');
            setFile(null);
            setFolder('');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
                    <h1 className="text-2xl font-bold mb-6">Upload Image</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Image Name (optional)</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Leave blank to use file name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Folder (optional)</label>
                            <select
                                value={folder}
                                onChange={(e) => setFolder(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">None</option>
                                {folders.map((f) => (
                                    <option key={f._id} value={f._id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Image File</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded"
                                accept="image/*"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`w-full p-2 rounded text-white ${
                                isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UploadImage;