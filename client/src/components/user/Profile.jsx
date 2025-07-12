import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../../utils/api';
import { 
  BookmarkIcon, 
  TrashIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  ArrowsRightLeftIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [bookmarks, setBookmarks] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [bookmarksRes, comparisonsRes] = await Promise.all([
          axios.get('/user/bookmarks'),
          axios.get('/user/comparisons')
        ]);
        setBookmarks(bookmarksRes.data);
        setComparisons(comparisonsRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const removeBookmark = async (username) => {
    try {
      await axios.delete(`/user/bookmark/${username}`);
      setBookmarks(bookmarks.filter(b => b.username !== username));
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing bookmark');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="bg-primary-100 dark:bg-primary-900 rounded-full p-4">
            <UserCircleIcon className="w-16 h-16 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {user.username}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <EnvelopeIcon className="w-5 h-5" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md">
          <div className="flex items-center gap-2">
            <span className="font-medium">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Bookmarked Developers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <BookmarkIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bookmarked Developers
            </h3>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-8">
              <BookmarkIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No bookmarked developers yet.
              </p>
              <Link 
                to="/dev-detective" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
              >
                Start exploring
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div 
                  key={bookmark.username} 
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <Link
                      to={`/dev-detective?username=${bookmark.username}`}
                      className="text-lg font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
                    >
                      {bookmark.username}
                    </Link>
                    {bookmark.tag && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">
                        {bookmark.tag}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeBookmark(bookmark.username)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Remove bookmark"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Comparisons */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <ArrowsRightLeftIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Comparisons
            </h3>
          </div>

          {comparisons.length === 0 ? (
            <div className="text-center py-8">
              <ArrowsRightLeftIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No comparisons yet.
              </p>
              <Link 
                to="/dev-clash" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
              >
                Compare developers
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {comparisons.map((comparison, index) => (
                <Link 
                  key={index}
                  to={`/dev-clash?user1=${comparison.dev1}&user2=${comparison.dev2}`}
                  className="block"
                >
                  <div 
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-primary-600 group-hover:text-primary-700 dark:text-primary-400">
                          {comparison.dev1}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">vs</span>
                        <span className="text-primary-600 group-hover:text-primary-700 dark:text-primary-400">
                          {comparison.dev2}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Winner: </span>
                        <span className="font-medium text-primary-600 group-hover:text-primary-700 dark:text-primary-400">
                          {comparison.winner}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(comparison.comparedAt).toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 