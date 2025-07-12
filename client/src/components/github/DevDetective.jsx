import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchUserProfile, fetchUserRepos, fetchUserActivity } from '../../features/github/githubSlice';
import { 
  MagnifyingGlassIcon, 
  StarIcon, 
  CodeBracketIcon,
  ChartPieIcon,
  UserIcon,
  DocumentChartBarIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  BookmarkSlashIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from '../../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DevDetective = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentProfile, userRepos, userActivity, loading, error } = useSelector((state) => state.github);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const usernameParam = params.get('username');
    
    if (usernameParam) {
      setUsername(usernameParam);
      dispatch(fetchUserProfile(usernameParam));
      dispatch(fetchUserRepos(usernameParam));
      dispatch(fetchUserActivity(usernameParam));

      // Check if user is bookmarked
      if (isAuthenticated) {
        const checkBookmarkStatus = async () => {
          try {
            const response = await axios.get('/user/bookmarks');
            setIsBookmarked(response.data.some(bookmark => bookmark.username === usernameParam));
          } catch (err) {
            console.error('Error checking bookmark status:', err);
          }
        };
        checkBookmarkStatus();
      }
    }
  }, [location.search, dispatch, isAuthenticated]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    dispatch(fetchUserProfile(username));
    dispatch(fetchUserRepos(username));
    dispatch(fetchUserActivity(username));

    // Check if user is bookmarked
    if (isAuthenticated) {
      try {
        const response = await axios.get('/user/bookmarks');
        setIsBookmarked(response.data.some(bookmark => bookmark.username === username.trim()));
      } catch (err) {
        console.error('Error checking bookmark status:', err);
      }
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated || !currentProfile) return;

    setBookmarkLoading(true);
    setBookmarkError(null);

    try {
      if (isBookmarked) {
        await axios.delete(`/user/bookmark/${currentProfile.login}`);
        setIsBookmarked(false);
      } else {
        await axios.post('/user/bookmark', {
          username: currentProfile.login,
          tag: 'Interesting Developer'
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      setBookmarkError(err.response?.data?.message || 'Error updating bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const getLanguagesData = () => {
    const languages = {};
    userRepos.forEach(repo => {
      Object.entries(repo.languages).forEach(([lang, bytes]) => {
        languages[lang] = (languages[lang] || 0) + bytes;
      });
    });

    const sortedLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedLanguages.map(([lang]) => lang),
      datasets: [{
        data: sortedLanguages.map(([,bytes]) => bytes),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    };
  };

  const getActivityData = () => {
    const monthlyActivity = {};
    userActivity.forEach(activity => {
      const date = new Date(activity.created_at);
      const month = date.toLocaleString('default', { month: 'short' });
      monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
    });

    return {
      labels: Object.keys(monthlyActivity),
      datasets: [{
        label: 'Activity',
        data: Object.values(monthlyActivity),
        backgroundColor: '#4F46E5'
      }]
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dev Detective</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Search and analyze GitHub developer profiles with detailed insights and statistics.
          </p>

          {/* Usage Instructions */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <MagnifyingGlassIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
              <h3 className="font-semibold mb-2">Search Profiles</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enter any GitHub username to start exploring their profile</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <ChartPieIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
              <h3 className="font-semibold mb-2">View Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Explore language distribution and activity patterns</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <DocumentChartBarIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
              <h3 className="font-semibold mb-2">Top Repositories</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Discover their most impactful projects and contributions</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
              <MagnifyingGlassIcon className="w-5 h-5" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {bookmarkError && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {bookmarkError}
            </div>
          )}
        </div>

        {currentProfile && (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="card md:col-span-1">
              <div className="flex justify-between items-start mb-4">
                <img
                  src={currentProfile.avatar_url}
                  alt={currentProfile.login}
                  className="w-32 h-32 rounded-full"
                />
                {isAuthenticated && (
                  <button
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                  >
                    {bookmarkLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    ) : isBookmarked ? (
                      <BookmarkSolidIcon className="w-5 h-5 text-primary-600" />
                    ) : (
                      <BookmarkOutlineIcon className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">{currentProfile.name || currentProfile.login}</h2>
              {currentProfile.bio && (
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">{currentProfile.bio}</p>
              )}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{currentProfile.followers}</div>
                  <div className="text-gray-600 dark:text-gray-400">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{currentProfile.following}</div>
                  <div className="text-gray-600 dark:text-gray-400">Following</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="md:col-span-2 space-y-8">
              {userRepos.length > 0 && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Languages</h3>
                  <div className="h-64">
                    <Pie data={getLanguagesData()} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
              )}

              {userActivity.length > 0 && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Activity</h3>
                  <div className="h-64">
                    <Bar
                      data={getActivityData()}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Top Repositories */}
            {userRepos.length > 0 && (
              <div className="md:col-span-3">
                <h3 className="text-xl font-semibold mb-4">Top Repositories</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {userRepos.slice(0, 4).map(repo => (
                    <div key={repo.id} className="card">
                      <h4 className="font-semibold mb-2">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          {repo.name}
                        </a>
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {repo.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4" />
                          {repo.stargazers_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <CodeBracketIcon className="w-4 h-4" />
                          {Object.keys(repo.languages).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevDetective; 