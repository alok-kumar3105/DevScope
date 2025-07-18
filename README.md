# DevScope 🔍

A full-stack MERN application for exploring and comparing GitHub developer profiles.

## Features 🌟

- **Dev Detective Mode**: Search and analyze GitHub user profiles
- **Dev Clash Mode**: Compare two developers head-to-head
- **User Authentication**: Save favorites and track search history
- **Interactive Charts**: Visualize developer statistics and activity
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack 💻

### Frontend
- React.js
- React Router
- Tailwind CSS
- Chart.js
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- GitHub API v3

## Prerequisites 📋

- Node.js (v14 or higher)
- MongoDB
- GitHub API Token (for extended rate limits)

## Setup Instructions 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/devscope.git
cd devscope
```

2. Setup environment variables:

Create `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_token
PORT=5000
```

Create `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

4. Start the development servers:

```bash
# Start backend server (from /server directory)
npm run dev

# Start frontend development server (from /client directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints 📡

### GitHub Data
- `GET /api/github/:username` - Fetch user profile
- `GET /api/github/:username/repos` - Fetch user repositories

### User Management
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/user/bookmark` - Save GitHub user to favorites
- `GET /api/user/bookmarks` - Get user's bookmarked developers
- `GET /api/user/comparisons` - Get comparison history

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. #   D e v S c o p e  
 