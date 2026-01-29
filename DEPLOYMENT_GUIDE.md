# Deployment Guide - Flipr Lead Generation App

## Prerequisites Completed ✅
- MongoDB Atlas cluster created
- Connection string configured in backend/.env

## Deployment Options

### Option 1: Deploy on Render (Recommended - Free Tier Available)

#### Backend Deployment on Render

1. **Prepare Backend**:
   - Make sure backend/.env has your MongoDB Atlas connection string
   - Push code to GitHub repository

2. **Create Render Account**:
   - Go to https://render.com
   - Sign up with GitHub

3. **Deploy Backend**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `flipr-backend`
     - **Region**: Choose nearest
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Instance Type**: Free
   
4. **Add Environment Variables** on Render:
   - Go to "Environment" tab
   - Add these variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/leadgeneration
     NODE_ENV=production
     ```

5. **Deploy**: Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Note your backend URL: `https://flipr-backend.onrender.com`

#### Frontend Deployment on Vercel

1. **Update Frontend API URL**:
   - Edit `frontend/.env`:
     ```
     REACT_APP_API_URL=https://flipr-backend.onrender.com/api
     ```

2. **Create Vercel Account**:
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Deploy Frontend**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   
4. **Add Environment Variable**:
   - Go to Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://flipr-backend.onrender.com/api
     ```

5. **Deploy**: Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at: `https://flipr-app.vercel.app`

---

### Option 2: Deploy on Railway (Alternative)

#### Backend on Railway

1. **Create Railway Account**: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Configure**:
   - Select backend folder
   - Add environment variables (MongoDB URI, PORT)
4. **Get Railway URL**: Copy the generated URL

#### Frontend on Railway

1. **New Project** → **Deploy from GitHub**
2. **Configure**:
   - Select frontend folder
   - Add `REACT_APP_API_URL` pointing to backend Railway URL
3. **Deploy**

---

### Option 3: Deploy Backend on Heroku

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Login**: `heroku login`
3. **Create App**:
   ```bash
   cd backend
   heroku create flipr-backend
   ```
4. **Set Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI="your-atlas-connection-string"
   heroku config:set NODE_ENV=production
   ```
5. **Deploy**:
   ```bash
   git push heroku main
   ```

---

## Important Configuration Files

### Backend: package.json (add if missing)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### Frontend: package.json (add if missing)
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "engines": {
    "node": "18.x"
  }
}
```

---

## Post-Deployment Checklist

### Backend Testing
1. Visit: `https://your-backend-url.com/api/health`
2. Should return: `{"status":"OK","message":"Server is running"}`
3. Test: `https://your-backend-url.com/api/projects`

### Frontend Testing
1. Visit your frontend URL
2. Test navigation (Home, Services, Projects, Contact)
3. Submit contact form
4. Subscribe to newsletter
5. Check admin panel: `https://your-frontend-url.com/admin`

### Database Verification
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Should see: `leadgeneration` database
4. Collections: projects, clients, contacts, newsletters

---

## Environment Variables Summary

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadgeneration
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## CORS Configuration

Make sure backend allows your frontend domain. Update `backend/server.js` if needed:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.com', 'http://localhost:3000'],
  credentials: true
}));
```

---

## File Upload Configuration for Production

### For Render/Heroku (Ephemeral Storage)
- Consider using **Cloudinary** or **AWS S3** for image uploads
- Render's filesystem is temporary and resets on redeploy

### Quick Cloudinary Setup
1. Sign up at https://cloudinary.com (free tier)
2. Install: `npm install cloudinary multer-storage-cloudinary`
3. Update upload middleware to use Cloudinary

---

## Troubleshooting

### Backend Issues
- **MongoDB Connection Failed**: Check Atlas connection string and IP whitelist
- **500 Errors**: Check Render/Railway logs for detailed errors
- **CORS Errors**: Update CORS origin in backend

### Frontend Issues
- **API Calls Failing**: Verify `REACT_APP_API_URL` is correct
- **Environment Variables Not Working**: Rebuild the app after adding .env
- **Images Not Loading**: Check if image URLs include backend domain

### Database Issues
- **Can't Connect**: Check MongoDB Atlas → Network Access (IP whitelist)
- **Authentication Failed**: Verify username/password in connection string
- **No Data**: Run test API calls to populate database

---

## Monitoring & Maintenance

1. **Check Logs**:
   - Render: Dashboard → Logs tab
   - Vercel: Deployments → Function Logs
   - Railway: Project → Logs

2. **MongoDB Atlas Monitoring**:
   - Go to "Metrics" to see database usage
   - Set up alerts for high usage

3. **Set Up Alerts**:
   - Render can email you on deployment failures
   - MongoDB Atlas can alert on connection issues

---

## Cost Considerations

### Free Tiers Available
- **Render**: 750 hours/month free (backend can sleep after 15 min inactivity)
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **Railway**: $5 free credit per month
- **MongoDB Atlas**: 512MB free storage

### Paid Options (if needed)
- Render: $7/month for always-on backend
- Vercel: $20/month for team features
- Railway: Pay as you go
- MongoDB Atlas: $9/month for 2GB

---

## Next Steps After Deployment

1. ✅ Test all functionality on live site
2. ✅ Add custom domain (optional)
3. ✅ Set up SSL certificate (automatic on most platforms)
4. ✅ Configure SEO meta tags
5. ✅ Add Google Analytics (optional)
6. ✅ Set up error tracking (Sentry)
7. ✅ Create backup strategy for database

---

## Quick Deploy Commands

### Test Backend Locally with Atlas
```bash
cd backend
# Update .env with Atlas connection string
npm start
# Should see "MongoDB Connected"
```

### Test Frontend Build
```bash
cd frontend
npm run build
# Should create optimized production build
```

### Push to GitHub (for deployment)
```bash
git add .
git commit -m "Ready for deployment with MongoDB Atlas"
git push origin main
```

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Railway Docs**: https://docs.railway.app

---

## Production Optimization Tips

1. **Enable Compression**: Add `compression` middleware in backend
2. **Rate Limiting**: Protect APIs from abuse
3. **Image Optimization**: Use Sharp for resizing before upload
4. **CDN**: Use Cloudflare for faster static asset delivery
5. **Monitoring**: Set up Uptime monitoring (UptimeRobot - free)
