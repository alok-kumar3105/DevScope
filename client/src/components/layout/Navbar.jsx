import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { MoonIcon, SunIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <CodeBracketIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              DevScope
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/dev-detective" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              Dev Detective
            </Link>
            <Link to="/dev-clash" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              Dev Clash
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              About
            </Link>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 