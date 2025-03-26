import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Images = () => {
    const { folderId } = useParams();
    const [images, setImages] = useState([]);
    const [folder, setFolder] = useState(null);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch folder details
                if (folderId) {
                    const folderResponse = await axios.get(
                        `http://localhost:5000/api/v1/folders/${folderId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${authTokens?.token}`
                            }
                        }
                    );
                    setFolder(folderResponse.data.data);
                }

                // Fetch images
                const imagesResponse = await axios.get(
                    folderId 
                        ? `http://localhost:5000/api/v1/folders/${folderId}/images`
                        : 'http://localhost:5000/api/v1/images',
                    {
                        headers: {
                            Authorization: `Bearer ${authTokens?.token}`
                        }
                    }
                );
                setImages(imagesResponse.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (authTokens) {
            fetchData();
        }
    }, [folderId, authTokens]);

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">
                    {folder ? folder.name : 'All Images'}
                </h1>
                
                {images.length === 0 ? (
                    <p className="text-gray-500">No images in this folder.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <div key={image._id} className="border p-2 rounded">
                                <img
                                    src={`http://localhost:5000${image.url}`}
                                    alt={image.name}
                                    className="w-full h-48 object-cover rounded"
                                />
                                <div className="p-2">
                                    <h3 className="font-medium">{image.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Images;