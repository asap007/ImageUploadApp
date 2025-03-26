import { useAuth } from '../context/AuthContext';  // Using named export
import Navbar from '../components/Navbar';

const Home = () => {
    const { user } = useAuth();  // Cleaner usage with the hook
    
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">
                    Welcome {user ? user.name : 'Guest'}
                </h1>
                {/* ... */}
            </div>
        </>
    );
};

export default Home;