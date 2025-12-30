import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            Task Manager
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-200">
                  Dashboard
                </Link>
                <Link to="/profile" className="hover:text-indigo-200">
                  Profile
                </Link>
                <span className="text-indigo-200">Hi, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;