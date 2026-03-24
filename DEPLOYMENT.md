# Deployment Guide

This guide covers how to deploy the Life Manager application to production.

## Overview

The application consists of:
- **Frontend**: React/Vite application (deployed to Vercel)
- **Backend**: Node.js/Express API (deployed to Render)
- **Database**: MongoDB (MongoDB Atlas)

## Prerequisites

1. Git repository with your code
2. Accounts on:
   - Vercel (for frontend)
   - Render (for backend)
   - MongoDB Atlas (for database)
   - GitHub (for CI/CD)

## Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new account or sign in
   - Create a new cluster (free tier is sufficient for development)
   - Choose a cloud provider and region closest to your users

2. **Configure Network Access**
   - Go to Network Access → Add IP Address
   - For development: Add your current IP
   - For production: Add `0.0.0.0/0` (allows all access) or specific server IPs

3. **Create Database User**
   - Go to Database Access → Add New Database User
   - Create a username and strong password
   - Grant read/write permissions to your database

4. **Get Connection String**
   - Go to Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password

## Backend Deployment (Render)

1. **Prepare Backend**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Install dependencies
   npm install
   
   # Update .env for production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-manager
   JWT_SECRET=your-production-jwt-secret
   JWT_REFRESH_SECRET=your-production-refresh-secret
   PORT=5000
   NODE_ENV=production
   ```

2. **Deploy to Render**
   - Go to [Render](https://render.com)
   - Sign up with your GitHub account
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the backend folder or configure root path
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all variables from your .env file
   - Click "Create Web Service"

3. **Verify Deployment**
   - Wait for deployment to complete
   - Test the API endpoint: `https://your-app.onrender.com/api/health`
   - Check logs if there are any issues

## Frontend Deployment (Vercel)

1. **Prepare Frontend**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Create production environment file
   echo "VITE_API_URL=https://your-backend.onrender.com" > .env.production
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - **Root Directory**: Set to `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: 
     - `VITE_API_URL`: `https://your-backend.onrender.com`
   - Click "Deploy"

3. **Configure Custom Domain (Optional)**
   - Go to project settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## CORS Configuration

Update your backend CORS settings in `server.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

## SSL/HTTPS

Both Vercel and Render automatically provide:
- Free SSL certificates
- Automatic HTTPS redirection
- No additional configuration needed

## Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-manager
JWT_SECRET=your-super-secure-jwt-secret-256-bits
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-256-bits
PORT=5000
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

## Testing the Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

2. **Frontend Access**
   - Visit your Vercel URL
   - Try signing up and logging in
   - Create and manage tasks

3. **API Testing**
   - Test authentication endpoints
   - Test task CRUD operations
   - Verify database connectivity

## Monitoring and Logs

### Render (Backend)
- Go to your service dashboard
- View real-time logs
- Monitor metrics and performance
- Set up alerting if needed

### Vercel (Frontend)
- Go to your project dashboard
- View deployment logs
- Monitor build times
- Check analytics

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure frontend URL is in CORS whitelist
   - Check that credentials are enabled

2. **Database Connection**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure database user has correct permissions

3. **Environment Variables**
   - Double-check variable names
   - Ensure no trailing spaces
   - Verify secrets are correctly set

4. **Build Failures**
   - Check build logs for errors
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

### Performance Optimization

1. **Backend**
   - Enable database indexing
   - Implement caching where appropriate
   - Use CDN for static assets

2. **Frontend**
   - Enable code splitting
   - Optimize images and assets
   - Implement lazy loading

## Security Considerations

1. **Change Default Secrets**
   - Use strong, unique JWT secrets
   - Rotate secrets periodically

2. **Database Security**
   - Use strong passwords
   - Enable authentication
   - Limit network access

3. **API Security**
   - Rate limiting
   - Input validation
   - HTTPS only

## Backup Strategy

1. **Database**
   - Enable MongoDB Atlas automated backups
   - Test restore procedures

2. **Code**
   - Git provides version control
   - Tag releases for easy rollback

## Scaling

When you need to scale:

1. **Backend**
   - Upgrade Render plan
   - Add load balancers
   - Implement database sharding

2. **Frontend**
   - Vercel automatically scales
   - Consider CDN optimization

## Future Improvements

1. **Monitoring**
   - Add application monitoring (Sentry, LogRocket)
   - Implement performance monitoring

2. **CI/CD**
   - Add automated testing
   - Implement staging environments

3. **Security**
   - Add rate limiting
   - Implement audit logs
   - Security scanning

## Support

If you encounter issues:
1. Check platform-specific documentation
2. Review deployment logs
3. Test locally with production variables
4. Check network connectivity between services
