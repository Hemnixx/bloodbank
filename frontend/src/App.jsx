import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './authSlice';
import PublicBoard from './PublicBoard';
import Login from './login';
import Register from './Register.jsx'; // Add this line!
import Dashboard from './Dashboard';
import PostRequest from './PostRequest';
// Change your import to include FaHome:
import { FaHeartbeat, FaGlobe, FaTachometerAlt, FaSignOutAlt, FaSignInAlt, FaHome } from 'react-icons/fa';

// --- NEW UI IMPORTS ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => { dispatch(logout()); };

  return (
    <Router>
      <div>
        <header className="app-header">
          <h1 className="logo-text"><FaHeartbeat style={{ marginBottom: '-3px' }}/> BloodUnite</h1>
          <nav className="nav-links">
            <Link to="/"><FaGlobe /> Live Board</Link>
            {isAuthenticated ? (
              <>
               <Link to="/dashboard"><FaHome /> Homepage</Link>
                <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
              </>
            ) : (
              <Link to="/login"><FaSignInAlt /> Donor Login</Link>
            )}
          </nav>
        </header>

        {/* The Notification Engine */}
        <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />

        <main className="main-container">
     <Routes>
    <Route path="/" element={<PublicBoard />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} /> {/* */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/post-request" element={<PostRequest />} />
</Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;