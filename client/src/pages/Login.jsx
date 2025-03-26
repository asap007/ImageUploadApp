import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa'; // Icons

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true); // Start loading
        try {
            // loginUser in AuthContext already handles navigation on success
            await loginUser(email, password);
            // If loginUser throws an error, it will be caught below
        } catch (err) {
             // Assuming loginUser might throw or you handle errors differently
            console.error("Login context error:", err); // Keep console log for debugging
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false); // Stop loading regardless of outcome
        }
    };

    // This part relies on AuthContext updating its internal error handling
    // to NOT use alert() but maybe return/throw the error message.
    // If loginUser uses alert(), you might need to modify AuthContext first.
    // For now, this assumes loginUser might throw or we catch a generic failure.

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Login</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <p className="bg-red-100 text-red-700 p-3 rounded text-center text-sm">{error}</p>
                        )}
                        <div className="relative">
                             <span className="absolute left-3 top-3 text-gray-400">
                                <FaEnvelope />
                            </span>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Email Address"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="relative">
                             <span className="absolute left-3 top-3 text-gray-400">
                                <FaLock />
                            </span>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Password"
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" /> Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;