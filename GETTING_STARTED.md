# Getting Started Guide

This guide will help you set up and run the Life Manager application locally.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Personal Manager
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
```

**Environment Variables (.env):**
```
MONGODB_URI=mongodb://localhost:27017/life-manager
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file (optional for local development)
cp .env.example .env
```

**Environment Variables (.env):**
```
VITE_API_URL=http://localhost:5000
```

### 4. Database Setup

**Option A: Local MongoDB**
1. Install MongoDB on your system
2. Start MongoDB service
3. The connection string `mongodb://localhost:27017/life-manager` should work

**Option B: MongoDB Atlas**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your backend `.env` file

### 5. Run the Application

**Start Backend:**
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### 6. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Features Overview

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing
- Automatic token refresh

### Task Management
- Create, read, update, delete tasks
- Task categories (Assignments, Projects, Workout, Daily Routine, Learning)
- Priority levels (High, Medium, Low)
- Due dates with overdue tracking
- Search, filter, and sort functionality
- Pagination for large task lists

### Recurring Tasks
- Daily recurring tasks
- Automatic reset each day
- Streak tracking
- Visual indicators for recurring tasks

### Dashboard
- Today's tasks overview
- Task statistics and completion rates
- Category distribution charts
- Upcoming tasks preview
- Quick add functionality

### User Interface
- Responsive design (mobile-first)
- Dark mode toggle
- Modern, clean interface
- Smooth animations and transitions
- Keyboard shortcuts

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/tasks` - Get user tasks (with filtering/pagination)
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

## Development Workflow

### Adding New Features

1. **Backend Changes**
   - Update models in `backend/models/`
   - Add/modify controllers in `backend/controllers/`
   - Update routes in `backend/routes/`
   - Add middleware if needed in `backend/middleware/`

2. **Frontend Changes**
   - Create/update components in `frontend/src/components/`
   - Add new pages in `frontend/src/pages/`
   - Update context providers if needed
   - Add new routes in `App.jsx`

### Code Structure

```
Personal Manager/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── config/         # Database configuration
│   ├── utils/          # Helper functions
│   └── server.js       # Server entry point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Page components
    │   ├── context/    # React context providers
    │   ├── utils/      # Helper functions
    │   ├── hooks/      # Custom hooks
    │   └── assets/     # Static assets
    └── public/         # Public files
```

### Testing

**Backend Testing:**
```bash
cd backend
npm test  # Add your test framework
```

**Frontend Testing:**
```bash
cd frontend
npm test  # Uses Vitest by default
```

### Linting

**Backend:**
```bash
cd backend
npm run lint
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## Common Issues and Solutions

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for MongoDB Atlas)

**JWT Token Issues:**
- Clear browser localStorage
- Check JWT secrets in `.env`
- Verify token expiration settings

**CORS Issues:**
- Check CORS configuration in `server.js`
- Ensure frontend URL is whitelisted

### Frontend Issues

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify environment variables

**API Connection Issues:**
- Check if backend is running
- Verify `VITE_API_URL` in `.env`
- Check browser console for errors

**State Management Issues:**
- Check React context providers
- Verify component re-renders
- Check for infinite loops

## Performance Tips

### Backend
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Add caching for expensive operations
- Use compression middleware

### Frontend
- Implement lazy loading for components
- Use React.memo for expensive components
- Optimize bundle size with code splitting
- Use appropriate image formats and sizes

## Security Best Practices

### Backend
- Validate all input data
- Use parameterized queries
- Implement rate limiting
- Keep dependencies updated
- Use environment variables for secrets

### Frontend
- Sanitize user input
- Use HTTPS in production
- Implement proper error handling
- Avoid storing sensitive data in localStorage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

If you encounter issues:
1. Check this guide for common solutions
2. Review the code comments
3. Check browser console and server logs
4. Search existing GitHub issues
5. Create a new issue with detailed information

## Next Steps

- Explore the codebase
- Try adding your own features
- Customize the UI/UX
- Add additional integrations
- Deploy to production (see DEPLOYMENT.md)
