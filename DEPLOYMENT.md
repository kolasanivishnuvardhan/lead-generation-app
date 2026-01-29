# Deployment Guide

## Quick Deployment Instructions

### Prerequisites
- Git installed
- Node.js installed
- MongoDB Atlas account (free tier)

### Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for testing
5. Get your connection string

### Step 2: Deploy Backend

#### Using Render.com (Recommended - Free Tier Available)

1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub
3. Create a new "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: lead-gen-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty or set to `backend`
6. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=production
   ```
7. Click "Create Web Service"
8. Copy the deployed URL (e.g., https://lead-gen-backend.onrender.com)

#### Using Heroku

```bash
cd backend
heroku login
heroku create your-backend-app-name
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
git init
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Step 3: Deploy Frontend

#### Using Vercel (Recommended)

1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub
3. Import your repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   ```
   REACT_APP_API_URL=your_deployed_backend_url/api
   ```
6. Deploy

#### Using Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up with GitHub
3. New site from Git
4. Select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Add Environment Variable:
   ```
   REACT_APP_API_URL=your_deployed_backend_url/api
   ```
7. Deploy

### Step 4: Update CORS Settings

Update `backend/server.js` to allow your frontend domain:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'],
  credentials: true
}));
```

### Step 5: Test Your Deployment

1. Visit your deployed frontend URL
2. Test the landing page
3. Access `/admin` route
4. Add a project and client
5. Submit contact form
6. Subscribe to newsletter

## Alternative Deployment Options

### Railway.app

**Backend:**
```bash
cd backend
# Connect to Railway
railway login
railway init
railway add
railway up
```

**Frontend:**
Same as Vercel instructions

### AWS (EC2 + S3)

**Backend on EC2:**
1. Launch EC2 instance
2. Install Node.js and PM2
3. Clone repository
4. Set environment variables
5. Start with PM2

**Frontend on S3 + CloudFront:**
1. Build frontend: `npm run build`
2. Upload to S3 bucket
3. Configure static website hosting
4. Optional: Add CloudFront for CDN

### Google Cloud Platform

**Backend (Cloud Run):**
1. Create Dockerfile in backend
2. Build and push to Google Container Registry
3. Deploy to Cloud Run

**Frontend (Firebase Hosting):**
```bash
cd frontend
npm install -g firebase-tools
firebase login
firebase init
npm run build
firebase deploy
```

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadgeneration
NODE_ENV=production
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Troubleshooting

### Issue: CORS Error
- Solution: Update CORS settings in backend to include frontend domain

### Issue: MongoDB Connection Failed
- Solution: Check connection string, ensure IP whitelist is correct

### Issue: Images Not Loading
- Solution: Ensure backend URL is correct in frontend, check uploads folder

### Issue: 404 on Routes
- Solution: Add redirect rules for SPA:
  - Netlify: Add `_redirects` file with `/* /index.html 200`
  - Vercel: Add `vercel.json` with rewrites

## Post-Deployment Checklist

- [ ] Backend is accessible via HTTPS
- [ ] Frontend is accessible via HTTPS
- [ ] MongoDB connection is working
- [ ] Projects can be added via admin panel
- [ ] Clients can be added via admin panel
- [ ] Contact form submissions work
- [ ] Newsletter subscriptions work
- [ ] Images upload and display correctly
- [ ] All admin panel features work
- [ ] Landing page displays all data

## Monitoring & Maintenance

1. Set up error logging (e.g., Sentry)
2. Monitor MongoDB usage
3. Set up uptime monitoring
4. Regular backups of database
5. Keep dependencies updated

## Cost Estimate (Using Free Tiers)

- MongoDB Atlas: Free (512MB)
- Render.com Backend: Free (with limitations)
- Vercel Frontend: Free
- Total: $0/month

For production with better performance:
- MongoDB Atlas: $9/month (Shared)
- Render.com: $7/month
- Vercel: Free (sufficient for most use cases)
- Total: ~$16/month
