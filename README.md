# Life Manager - Personal Productivity App

A modern, full-stack web application for managing daily tasks, assignments, workouts, and long-term goals.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt

## Features

- 🔐 User authentication (signup, login, logout)
- 📝 Task management with categories and priorities
- 🔄 Recurring daily tasks
- 📊 Dashboard with productivity stats
- ⚡ Quick add feature
- 🌙 Dark mode toggle
- 📱 Responsive design
- 🔍 Search, filter, and sort tasks

## Project Structure

```
Personal Manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── utils/
│   │   └── helpers.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── utils/
    │   ├── context/
    │   ├── assets/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Backend Setup
1. Navigate to backend directory
2. Install dependencies: `npm install`
3. Create .env file with MongoDB URI and JWT secrets
4. Start server: `npm start`

### Frontend Setup
1. Navigate to frontend directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=5000
```

### API Endpoints

#### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

#### Tasks
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- GET /api/tasks/stats

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy

### Backend (Render)
1. Connect GitHub repository to Render
2. Set environment variables
3. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Add to environment variables
