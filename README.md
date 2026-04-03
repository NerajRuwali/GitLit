# GitLit — GitHub Contribution Analytics Platform

GitLit is a full-stack web application that provides detailed insights into GitHub repositories and developer activity. It enables users to analyze contribution patterns, repository metrics, and code activity through an interactive and visually structured interface.

--------------------------------------------------

## Live Demo

Frontend: https://git-lit.vercel.app  
Backend: https://gitlit.onrender.com  

--------------------------------------------------

## Features

- Analyze GitHub repositories using username/repository input  
- Visualize contribution data and activity patterns  
- Display top repositories with key metrics (stars, forks, language)  
- Real-time data fetching using GitHub API  
- Scalable backend with modular route structure  
- Responsive and modern UI  
- Error handling with fallback for server cold starts  

--------------------------------------------------

## Tech Stack

Frontend:
- React (Vite)
- JavaScript
- CSS

Backend:
- Node.js
- Express.js

Deployment:
- Vercel (Frontend)
- Render (Backend)

APIs:
- GitHub REST API

--------------------------------------------------

## Project Structure

GitLit/
│
├── client/          # Frontend (React + Vite)
│   ├── src/
│   └── package.json
│
├── server/          # Backend (Node + Express)
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
└── README.md

--------------------------------------------------

## Installation and Setup

### Clone the Repository

git clone https://github.com/your-username/gitlit.git
cd gitlit

--------------------------------------------------

### Backend Setup

cd server
npm install

Create a .env file:

PORT=5001
GITHUB_TOKEN=your_github_token
FRONTEND_URL=http://localhost:5173

Run backend:

npm start

--------------------------------------------------

### Frontend Setup

cd client
npm install

Create a .env file:

VITE_API_URL=http://localhost:5001

Run frontend:

npm run dev

--------------------------------------------------

## Deployment

Frontend:
- Deployed on Vercel
- Environment variable:
  VITE_API_URL=https://gitlit.onrender.com

Backend:
- Deployed on Render
- Uses dynamic port (process.env.PORT)
- CORS configured for Vercel domain

--------------------------------------------------

## API Endpoints

Base URL:
https://gitlit.onrender.com/api

- GET /api/test  
  Check server status  

- GET /api/github/user?username={username}  
  Fetch GitHub user data  

--------------------------------------------------

## Key Learnings

- Full-stack deployment using Vercel and Render  
- Handling CORS and environment variables in production  
- API integration and error handling  
- Debugging network and deployment issues  
- Designing scalable backend architecture  

--------------------------------------------------

## Future Enhancements

- AI-based repository insights  
- Advanced data visualization  
- User authentication and saved dashboards  
- Performance optimization and caching  
- Custom domain integration  

--------------------------------------------------

## Author

Neeraj Ruwali
