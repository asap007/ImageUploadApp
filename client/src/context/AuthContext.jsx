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
        // Decode only if tokens exist and are valid structurally
        try {
             return tokens ? jwtDecode(JSON.parse(tokens).token) : null;
        } catch (e) {
            console.error("Error decoding token on initial load:", e);
            localStorage.removeItem('authTokens'); // Clear invalid token
            return null;
        }
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        // Note: No try...catch here. Let the error propagate to the calling component.
        const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
            email,
            password
        });

        if (response.status === 200 && response.data.success) {
            const data = response.data;
            let decodedToken;
            try {
                 decodedToken = jwtDecode(data.token);
            } catch (e) {
                 console.error("Failed to decode received token:", e);
                 throw new Error("Received an invalid token from server."); // Throw specific error
            }

            setAuthTokens(data);
            setUser(decodedToken);
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/'); // Navigate on success
            // No explicit return needed for success with async/await if nothing depends on it
        } else {
            // This case might be less likely if axios throws on non-2xx,
            // but handle potential backend success:false responses
            throw new Error(response.data?.error || 'Login failed. Server responded unexpectedly.');
        }
        // Errors from axios (like 401, 400, 500, network errors) will automatically be thrown
        // and caught by the calling component's catch block.
    };


     const registerUser = async (name, email, password) => {
        // Note: No try...catch here. Let the error propagate.
        const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
            name,
            email,
            password
        });

        if (response.status === 200 && response.data.success) { // Or 201 if your backend uses that for creation
            const data = response.data;
            let decodedToken;
             try {
                 decodedToken = jwtDecode(data.token);
            } catch (e) {
                 console.error("Failed to decode received token:", e);
                 throw new Error("Received an invalid token from server."); // Throw specific error
            }

            setAuthTokens(data);
            setUser(decodedToken);
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/'); // Navigate on success
        } else {
             throw new Error(response.data?.error || 'Registration failed. Server responded unexpectedly.');
        }
        // Axios errors will propagate automatically.
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        // We navigate here because logout is usually not awaited or expected to throw UI errors
        navigate('/login');
    };

    // This effect runs once on mount to set initial loading state
     useEffect(() => {
        // Initial check based on localStorage
        const initialTokens = localStorage.getItem('authTokens');
        if (initialTokens) {
            try {
                 const parsedTokens = JSON.parse(initialTokens);
                 const decoded = jwtDecode(parsedTokens.token);
                 // Optional: Check token expiry here if needed
                 // if (decoded.exp * 1000 < Date.now()) { logoutUser(); } else { setUser(decoded); }
                 setUser(decoded);
            } catch (error) {
                 console.error('Initial token decode/parse error:', error);
                 logoutUser(); // Clear invalid stored token
            }
        }
         setLoading(false); // Initial loading is done after checking storage
     }, []); // Empty dependency array: runs only once on mount


    // Context data provided to children
    const contextData = {
        user,
        authTokens,
        loginUser,    // Provide the updated functions
        registerUser, // Provide the updated functions
        logoutUser
    };


    return (
        <AuthContext.Provider value={contextData}>
            {loading ? (
                 <div className="flex justify-center items-center min-h-screen">
                     {/* Optional: Add a nicer loading spinner here */}
                     Loading Application...
                 </div>
             ) : children}
        </AuthContext.Provider>
    );
};

// Maintain default export for backward compatibility (if needed)
export default AuthContext;

// Add named exports for new usage
export { AuthProvider };

// Export the hook for components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};