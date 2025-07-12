import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ArrowsRightLeftIcon, BookmarkIcon } from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Discover & Compare GitHub Developers
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore GitHub profiles, analyze statistics, and compare developers using our powerful tools.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {/* Dev Detective */}
        <div className="card">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
            <MagnifyingGlassIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Dev Detective
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Search and analyze GitHub profiles with detailed statistics and repository information.
          </p>
          <Link to="/dev-detective" className="btn-primary inline-block">
            Try Dev Detective
          </Link>
        </div>

        {/* Dev Clash */}
        <div className="card">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
            <ArrowsRightLeftIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Dev Clash
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Compare two GitHub developers head-to-head and see who comes out on top.
          </p>
          <Link to="/dev-clash" className="btn-primary inline-block">
            Start Comparing
          </Link>
        </div>

        {/* Bookmarks */}
        <div className="card">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
            <BookmarkIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Save Favorites
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bookmark interesting developers and keep track of your comparisons.
          </p>
          <Link to="/register" className="btn-primary inline-block">
            Create Account
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to explore?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Join our community and start discovering amazing developers.
        </p>
        <div className="space-x-4">
          <Link to="/register" className="btn-primary">
            Sign Up Now
          </Link>
          <Link to="/dev-detective" className="btn-secondary">
            Try it First
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 