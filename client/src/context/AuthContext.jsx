import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

// Main Provider component
const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem('authTokens');
        return tokens ? JSON.parse(tokens) : null;
    });
    
    const [user, setUser] = useState(() => {
        const tokens = localStorage.getItem('authTokens');
        return tokens ? jwtDecode(tokens) : null;
    });
    
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
                email,
                password
            });
            
            if (response.status === 200) {
                const data = response.data;
                const decodedToken = jwtDecode(data.token);
                
                setAuthTokens(data);
                setUser(decodedToken);
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigate('/');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.error || 'Invalid credentials!');
        }
    };

    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
                name,
                email,
                password
            });
            
            if (response.status === 200) {
                const data = response.data;
                const decodedToken = jwtDecode(data.token);
                
                setAuthTokens(data);
                setUser(decodedToken);
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigate('/');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.response?.data?.error || 'Registration failed!');
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        registerUser,
        logoutUser
    };

    useEffect(() => {
        if (authTokens) {
            try {
                const decoded = jwtDecode(authTokens.token);
                setUser(decoded);
            } catch (error) {
                console.error('Token decode error:', error);
                logoutUser();
            }
        }
        setLoading(false);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

// Maintain default export for backward compatibility
export default AuthContext;

// Add named exports for new usage
export { AuthProvider };

// Optional: Export the hook for components that want to use it
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};