import { CodeBracketIcon, MagnifyingGlassIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <CodeBracketIcon className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About DevScope</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your ultimate tool for analyzing and comparing GitHub developer profiles
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Dev Detective</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Analyze GitHub profiles in detail with comprehensive statistics and visualizations.
            </p>
            <div className="space-y-4">
              <h3 className="font-semibold">How to Use:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Enter a GitHub username in the search box</li>
                <li>Click the search button or press Enter</li>
                <li>View detailed profile information including:</li>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Profile overview and statistics</li>
                  <li>Language distribution charts</li>
                  <li>Activity timeline</li>
                  <li>Top repositories</li>
                </ul>
              </ol>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Dev Clash</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Compare two GitHub profiles and see who comes out on top based on various metrics.
            </p>
            <div className="space-y-4">
              <h3 className="font-semibold">How to Use:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Enter two GitHub usernames to compare</li>
                <li>Click the compare button</li>
                <li>View comparison results including:</li>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Profile statistics comparison</li>
                  <li>Repository metrics</li>
                  <li>Contribution analysis</li>
                  <li>Overall score comparison</li>
                </ul>
              </ol>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Profile Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Deep dive into GitHub profiles with comprehensive analytics
              </p>
            </div>
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Visual Statistics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Beautiful charts and visualizations of developer activity
              </p>
            </div>
            <div className="text-center">
              <CodeBracketIcon className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Profile Comparison</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Compare developers and see detailed scoring metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 