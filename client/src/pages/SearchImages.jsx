import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const SearchImages = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const { authTokens } = useContext(AuthContext);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                `http://localhost:5000/api/v1/images/search?q=${query}`,
                {
                    headers: {
                        Authorization: `Bearer ${authTokens?.token}`
                    }
                }
            );
            setResults(response.data.data);
        } catch (error) {
            console.error('Error searching images:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Search Images</h1>
                
                <form onSubmit={handleSearch} className="mb-6 flex">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by image name..."
                        className="flex-grow p-2 border rounded-l"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
                    >
                        Search
                    </button>
                </form>

                {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.map((image) => (
                            <div key={image._id} className="border p-2 rounded">
                                <img
                                    src={`http://localhost:5000${image.url}`}
                                    alt={image.name}
                                    className="w-full h-48 object-cover rounded"
                                />
                                <div className="p-2">
                                    <h3 className="font-medium">{image.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {image.folder ? `In folder: ${image.folder.name}` : 'No folder'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        {query ? 'No images found matching your search.' : 'Enter a search term to find images.'}
                    </p>
                )}
            </div>
        </>
    );
};

export default SearchImages;