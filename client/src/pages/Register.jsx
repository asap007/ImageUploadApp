import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa'; // Icons

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

     const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // registerUser in AuthContext handles navigation on success
            await registerUser(name, email, password);
             // If registerUser throws an error, it will be caught below
        } catch (err) {
            console.error("Register context error:", err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Similar note as Login: Assumes registerUser doesn't use alert()

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Create Account</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <p className="bg-red-100 text-red-700 p-3 rounded text-center text-sm">{error}</p>
                        )}
                         <div className="relative">
                             <span className="absolute left-3 top-3 text-gray-400">
                                <FaUser />
                            </span>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Full Name"
                                required
                                disabled={loading}
                            />
                        </div>
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
                                placeholder="Password (min. 6 characters)"
                                required
                                minLength="6"
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
                                    <FaSpinner className="animate-spin mr-2" /> Creating Account...
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </form>
                     <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;