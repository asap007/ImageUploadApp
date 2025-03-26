import { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaImage, FaFolder, FaUpload, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons

const UploadImage = () => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState(''); // Store selected folder ID
    const [folders, setFolders] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' }); // 'success', 'error', or ''
    const [previewUrl, setPreviewUrl] = useState(null); // For image preview
    const { authTokens } = useContext(AuthContext);
    const fileInputRef = useRef(null); // Ref to clear file input

    // Fetch folders for the dropdown
    useEffect(() => {
        const fetchFolders = async () => {
            if (!authTokens) {
                 setLoadingFolders(false);
                 return;
             }
            setLoadingFolders(true);
            try {
                const response = await axios.get('http://localhost:5000/api/v1/folders', {
                    headers: { Authorization: `Bearer ${authTokens?.token}` }
                });
                setFolders(response.data.data.sort((a,b) => a.name.localeCompare(b.name)));
            } catch (error) {
                console.error('Error fetching folders:', error);
                // Handle folder loading error (optional: show message)
            } finally {
                setLoadingFolders(false);
            }
        };
        fetchFolders();
    }, [authTokens]);

    // Handle file selection and create preview
    const handleFileChange = (e) => {
        const selectedFile = e.target.files && e.target.files[0];
        setUploadStatus({ message: '', type: '' }); // Clear status on new file select

        if (selectedFile) {
            setFile(selectedFile);
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setPreviewUrl(null); // Clear preview if no file selected
        }
    };

    // Reset form handler
    const resetForm = () => {
        setName('');
        setFile(null);
        setFolder('');
        setPreviewUrl(null);
        setUploadStatus({ message: 'Upload successful!', type: 'success' });
         if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input visually
        }
        // Optional: Clear success message after a delay
        setTimeout(() => setUploadStatus({ message: '', type: '' }), 4000);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadStatus({ message: '', type: '' }); // Clear previous status

        if (!file) {
             setUploadStatus({ message: 'Please select an image file.', type: 'error' });
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('name', name.trim() || file.name); // Use file name if name field is empty
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
            resetForm(); // Reset form on success
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadStatus({ message: error.response?.data?.error || 'Failed to upload image. Please try again.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-700">Upload New Image</h1>
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Upload Status Message */}
                        {uploadStatus.message && (
                            <div className={`p-3 rounded text-center text-sm ${
                                uploadStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {uploadStatus.type === 'success' ? <FaCheckCircle className="inline mr-2"/> : <FaTimesCircle className="inline mr-2"/>}
                                {uploadStatus.message}
                            </div>
                        )}

                        <div>
                            <label htmlFor="imageName" className="block text-sm font-medium text-gray-700 mb-1">Image Name (Optional)</label>
                            <input
                                type="text"
                                id="imageName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Leave blank to use file name"
                                disabled={isUploading}
                            />
                        </div>

                        <div>
                            <label htmlFor="folderSelect" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FaFolder className="mr-2 text-gray-500"/> Folder (Optional)
                                {loadingFolders && <FaSpinner className="animate-spin ml-2 text-xs"/>}
                            </label>
                            <select
                                id="folderSelect"
                                value={folder}
                                onChange={(e) => setFolder(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                disabled={isUploading || loadingFolders}
                            >
                                <option value="">-- Add to Root --</option>
                                {folders.map((f) => (
                                    <option key={f._id} value={f._id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-1">
                                Image File*
                            </label>
                             <input
                                type="file"
                                id="fileInput"
                                ref={fileInputRef} // Assign ref
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                                accept="image/*"
                                required
                                disabled={isUploading}
                            />
                        </div>

                         {/* Image Preview */}
                         {previewUrl && !isUploading && (
                             <div className="mt-4 border rounded-md p-2 inline-block">
                                 <img src={previewUrl} alt="Preview" className="max-h-40 max-w-full rounded" />
                             </div>
                         )}

                        <button
                            type="submit"
                            disabled={isUploading || !file} // Disable if uploading or no file selected
                            className="w-full inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                            {isUploading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" /> Uploading...
                                </>
                            ) : (
                                <>
                                    <FaUpload className="mr-2" /> Upload Image
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
             <footer className="text-center p-4 text-gray-500 text-sm mt-8">
                © {new Date().getFullYear()} ImageVault. All rights reserved.
            </footer>
        </div>
    );
};

export default UploadImage;