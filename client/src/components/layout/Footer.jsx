import { Link } from 'react-router-dom';
import { CodeBracketIcon, HeartIcon } from '@heroicons/react/24/solid';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <CodeBracketIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">DevScope</span>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              About
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              GitHub
            </a>
            <Link to="/privacy" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <HeartIcon className="h-5 w-5 text-red-500 mx-1" />
            <span>by DevScope Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 