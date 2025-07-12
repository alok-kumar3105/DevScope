const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth.middleware');

// GitHub API configuration
const githubConfig = {
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
};

// Get user profile
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`,
      githubConfig
    );

    res.json(userResponse.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' });
    }
    res.status(500).json({ message: 'Error fetching GitHub data' });
  }
});

// Get user repositories
router.get('/:username/repos', async (req, res) => {
  try {
    const { username } = req.params;
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=10`,
      githubConfig
    );

    // Get languages for each repo
    const reposWithLanguages = await Promise.all(
      reposResponse.data.map(async (repo) => {
        const languagesResponse = await axios.get(
          repo.languages_url,
          githubConfig
        );
        return {
          ...repo,
          languages: languagesResponse.data
        };
      })
    );

    res.json(reposWithLanguages);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' });
    }
    res.status(500).json({ message: 'Error fetching repository data' });
  }
});

// Get user activity (commits, PRs)
router.get('/:username/activity', async (req, res) => {
  try {
    const { username } = req.params;
    const eventsResponse = await axios.get(
      `https://api.github.com/users/${username}/events/public`,
      githubConfig
    );

    const activity = eventsResponse.data
      .filter(event => ['PushEvent', 'PullRequestEvent'].includes(event.type))
      .slice(0, 30); // Last 30 activities

    res.json(activity);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' });
    }
    res.status(500).json({ message: 'Error fetching activity data' });
  }
});

// Compare two users
router.get('/compare/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const [user1Data, user2Data] = await Promise.all([
      axios.get(`https://api.github.com/users/${user1}`, githubConfig),
      axios.get(`https://api.github.com/users/${user2}`, githubConfig)
    ]);

    const [user1Repos, user2Repos] = await Promise.all([
      axios.get(`https://api.github.com/users/${user1}/repos`, githubConfig),
      axios.get(`https://api.github.com/users/${user2}/repos`, githubConfig)
    ]);

    // Calculate scores
    const calculateScore = (userData, reposData) => {
      const followers = userData.data.followers;
      const publicRepos = userData.data.public_repos;
      const totalStars = reposData.data.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = reposData.data.reduce((sum, repo) => sum + repo.forks_count, 0);

      return followers * 0.4 + publicRepos * 0.2 + totalStars * 0.3 + totalForks * 0.1;
    };

    const user1Score = calculateScore(user1Data, user1Repos);
    const user2Score = calculateScore(user2Data, user2Repos);

    res.json({
      user1: {
        profile: user1Data.data,
        score: user1Score
      },
      user2: {
        profile: user2Data.data,
        score: user2Score
      },
      winner: user1Score > user2Score ? user1 : user2
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'One or both GitHub users not found' });
    }
    res.status(500).json({ message: 'Error comparing users' });
  }
});

module.exports = router; 