import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../utils/api';
import {
  ArrowsRightLeftIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  StarIcon,
  CodeBracketIcon,
  UsersIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  BookOpenIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const DevClash = () => {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [userData1, setUserData1] = useState(null);
  const [userData2, setUserData2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowInstructions(false);
      return;
    }

    const params = new URLSearchParams(location.search);
    const user1Param = params.get('user1');
    const user2Param = params.get('user2');
    
    if (user1Param && user2Param) {
      setUser1(user1Param);
      setUser2(user2Param);
      compareUsers(user1Param, user2Param);
    }
  }, [location.search, isAuthenticated]);

  const compareUsers = async (username1, username2) => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);
    setShowInstructions(false);

    try {
      const [response1, response2] = await Promise.all([
        axios.get(`/github/${username1}`),
        axios.get(`/github/${username2}`)
      ]);

      setUserData1(response1.data);
      setUserData2(response2.data);

      // Calculate scores and determine winner
      const score1 = calculateScore(response1.data);
      const score2 = calculateScore(response2.data);
      const winner = score1 >= score2 ? username1 : username2;

      // Save comparison to recent comparisons
      try {
        await axios.post('/user/comparisons', {
          dev1: username1,
          dev2: username2,
          winner: winner
        });
      } catch (err) {
        console.error('Error saving comparison:', err);
        setError('Comparison completed but could not be saved to your history.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching user data');
      setUserData1(null);
      setUserData2(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return;
    }
    if (user1.trim() && user2.trim()) {
      // Check if comparing the same user
      if (user1.trim().toLowerCase() === user2.trim().toLowerCase()) {
        setError('Please enter two different GitHub usernames to compare.');
        return;
      }
      // Only update the URL - the useEffect will handle the comparison
      navigate(`/dev-clash?user1=${encodeURIComponent(user1.trim())}&user2=${encodeURIComponent(user2.trim())}`);
    }
  };

  const calculateScore = (user) => {
    if (!user) return 0;
    return (
      user.followers * 2 +
      user.public_repos * 3 +
      user.public_gists +
      (user.hireable ? 10 : 0)
    );
  };

  const getWinner = () => {
    if (!userData1 || !userData2) return null;
    const score1 = calculateScore(userData1);
    const score2 = calculateScore(userData2);
    return score1 >= score2 ? userData1 : userData2;
  };

  const getComparisonData = () => {
    if (!userData1 || !userData2) return null;

    const metrics = {
      followers: { label: 'Followers', max: Math.max(userData1.followers, userData2.followers) },
      following: { label: 'Following', max: Math.max(userData1.following, userData2.following) },
      public_repos: { label: 'Repositories', max: Math.max(userData1.public_repos, userData2.public_repos) },
      public_gists: { label: 'Gists', max: Math.max(userData1.public_gists, userData2.public_gists) }
    };

    return {
      labels: Object.values(metrics).map(m => m.label),
      datasets: [
        {
          label: userData1.login,
          data: [
            userData1.followers,
            userData1.following,
            userData1.public_repos,
            userData1.public_gists
          ],
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
        },
        {
          label: userData2.login,
          data: [
            userData2.followers,
            userData2.following,
            userData2.public_repos,
            userData2.public_gists
          ],
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          borderColor: 'rgba(244, 63, 94, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(244, 63, 94, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(244, 63, 94, 1)'
        }
      ]
    };
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
            <LockClosedIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please log in to use the Dev Clash feature. Compare GitHub developers and save your comparisons.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="btn-primary"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="btn-secondary"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
          <ArrowsRightLeftIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          Dev Clash
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Compare GitHub developers and discover who comes out on top
        </p>
      </div>

      {/* Usage Instructions */}
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-full mb-4">
                <UserGroupIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                1. Enter Usernames
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Type the GitHub usernames of two developers you want to compare
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-full mb-4">
                <ChartBarIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2. View Stats
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Compare followers, repositories, activity, and more with interactive charts
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-full mb-4">
                <TrophyIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                3. See Results
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get an overall score and find out which developer ranks higher
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center gap-3">
            <CodeBracketIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Repository Analysis</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center gap-3">
            <UsersIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Community Impact</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center gap-3">
            <BookOpenIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Gist Comparison</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center gap-3">
            <BeakerIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Overall Score</span>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="user1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Developer
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="user1"
                  value={user1}
                  onChange={(e) => setUser1(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="input pl-10 w-full"
                  required
                />
                <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label htmlFor="user2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Second Developer
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="user2"
                  value={user2}
                  onChange={(e) => setUser2(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="input pl-10 w-full"
                  required
                />
                <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  <ArrowsRightLeftIcon className="w-5 h-5" />
                  Compare Developers
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {userData1 && userData2 && (
        <div className="space-y-8">
          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col items-center justify-center gap-4">
              <TrophyIcon className="w-16 h-16" />
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Winner</h2>
                <p className="text-2xl font-medium">{getWinner().login}</p>
                <p className="text-lg opacity-90 mt-2">
                  Score: {calculateScore(getWinner())}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Developer 1 Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={userData1.avatar_url}
                  alt={userData1.login}
                  className="w-16 h-16 rounded-full ring-2 ring-primary-500"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {userData1.name || userData1.login}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">@{userData1.login}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UsersIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Followers</span>
                  </div>
                  <span className="font-semibold">{userData1.followers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CodeBracketIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Repositories</span>
                  </div>
                  <span className="font-semibold">{userData1.public_repos}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpenIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Gists</span>
                  </div>
                  <span className="font-semibold">{userData1.public_gists}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BeakerIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Score</span>
                  </div>
                  <span className="font-semibold">{calculateScore(userData1)}</span>
                </div>
              </div>
            </div>

            {/* Developer 2 Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={userData2.avatar_url}
                  alt={userData2.login}
                  className="w-16 h-16 rounded-full ring-2 ring-primary-500"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {userData2.name || userData2.login}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">@{userData2.login}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UsersIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Followers</span>
                  </div>
                  <span className="font-semibold">{userData2.followers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CodeBracketIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Repositories</span>
                  </div>
                  <span className="font-semibold">{userData2.public_repos}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpenIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Gists</span>
                  </div>
                  <span className="font-semibold">{userData2.public_gists}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BeakerIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Score</span>
                  </div>
                  <span className="font-semibold">{calculateScore(userData2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Stats Comparison</h3>
            <div className="h-[400px]">
              <Radar
                data={getComparisonData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(156, 163, 175, 0.2)'
                      },
                      angleLines: {
                        color: 'rgba(156, 163, 175, 0.2)'
                      },
                      pointLabels: {
                        font: {
                          size: 12
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevClash; 