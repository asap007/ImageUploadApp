import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Folders from './pages/Folders';
import Images from './pages/Images';
import UploadImage from './pages/UploadImage';
import SearchImages from './pages/SearchImages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Home />} />
              <Route path="folders" element={<Folders />} />
              <Route path="folders/:folderId" element={<Images />} />
              <Route path="upload" element={<UploadImage />} />
              <Route path="search" element={<SearchImages />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;