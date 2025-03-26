import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser(name, email, password);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
                    <h1 className="text-2xl font-bold mb-6">Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Register
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-500 hover:underline"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;