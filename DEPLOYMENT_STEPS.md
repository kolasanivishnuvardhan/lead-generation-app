# Simple Deployment Guide - Step by Step

## Prerequisites
✅ MongoDB Atlas connected (Done!)
✅ Code working locally (Done!)

---

## Option 1: Deploy to Vercel (Easiest - Recommended)

### Step 1: Prepare Your Code

1. **Create `.gitignore` files** (if not exists):

Backend `.gitignore`:
```
node_modules/
.env
uploads/temp/*
!uploads/temp/.gitkeep
```

Frontend `.gitignore`:
```
node_modules/
build/
.env
.env.local
```

2. **Create production environment file for frontend**:

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```
(We'll update this URL after deploying backend)

### Step 2: Push Code to GitHub

```bash
# In your project root (E:\Flipr)
git init
git add .
git commit -m "Initial commit - Lead Generation App"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/flipr-lead-generation.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend to Vercel

1. **Go to [vercel.com](https://vercel.com/)**
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. **Configure Backend:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`
   
5. **Add Environment Variables** (click "Environment Variables"):
   ```
   MONGODB_URI = your_mongodb_connection_string_here
   NODE_ENV = production
   PORT = 5000
   ```
   Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas connection string

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. **Copy your backend URL**: `https://your-backend-name.vercel.app`

### Step 4: Deploy Frontend to Vercel

1. In Vercel dashboard, click **"Add New"** → **"Project"**
2. Select same repository
3. **Configure Frontend:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
   
4. **Add Environment Variable**:
   ```
   REACT_APP_API_URL = https://your-backend-name.vercel.app/api
   ```
   (Use the backend URL from Step 3)

5. Click **"Deploy"**
6. Wait 2-3 minutes
7. **Your app is live!** 🎉

### Step 5: Update Backend CORS (Important!)

Edit `backend/server.js` and update CORS:
```javascript
app.use(cors({
  origin: ['https://your-frontend-name.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

Push to GitHub:
```bash
git add .
git commit -m "Update CORS for production"
git push
```
Vercel will auto-redeploy!

---

## Option 2: Deploy to Render (Alternative)

### Backend Deployment:

1. **Go to [render.com](https://render.com/)** and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. **Settings:**
   - Name: `flipr-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   
5. **Environment Variables:**
   - `MONGODB_URI`: (your Atlas connection string)
   - `NODE_ENV`: `production`
   
6. Click **"Create Web Service"**
7. Copy backend URL: `https://flipr-backend.onrender.com`

### Frontend Deployment:

1. Click **"New +"** → **"Static Site"**
2. Connect same repo
3. **Settings:**
   - Name: `flipr-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   
4. **Environment Variable:**
   - `REACT_APP_API_URL`: `https://flipr-backend.onrender.com/api`
   
5. Click **"Create Static Site"**
6. Done! 🎉

---

## Option 3: Netlify (Frontend Only - Use with Render Backend)

1. Deploy backend to Render (see above)
2. **Go to [netlify.com](https://netlify.com/)**
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect GitHub
5. **Settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   
6. **Environment variables:**
   - `REACT_APP_API_URL`: (your backend URL)
   
7. Click **"Deploy site"**

---

## Quick Commands Cheat Sheet

### Push to GitHub:
```bash
cd E:\Flipr
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Update and Redeploy:
```bash
git add .
git commit -m "Update features"
git push
# Vercel auto-deploys!
```

### Test Production Build Locally:
```bash
# Frontend
cd frontend
npm run build
npx serve -s build

# Backend
cd backend
set NODE_ENV=production
node server.js
```

---

## Important Notes

⚠️ **Image Uploads**: Current file upload saves to local disk. For production, you need:
1. Use cloud storage (Cloudinary recommended)
2. Or keep images in database as base64 (not recommended for large files)

**Quick Cloudinary Setup** (if needed):
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Install: `npm install cloudinary multer-storage-cloudinary`
3. Update upload middleware

⚠️ **Environment Variables**: Never commit `.env` files to GitHub!

---

## Troubleshooting

### "Module not found" error in Vercel
→ Check `package.json` has all dependencies
→ Run `npm install` locally first

### CORS errors in production
→ Add frontend URL to backend CORS whitelist

### "Cannot connect to backend"
→ Check `REACT_APP_API_URL` in frontend environment variables
→ Make sure backend URL ends with `/api`

### Images not uploading in production
→ Vercel/Netlify don't support persistent file storage
→ Use Cloudinary or AWS S3

---

## Your URLs After Deployment

📱 **Frontend**: `https://your-frontend.vercel.app`  
🔧 **Backend API**: `https://your-backend.vercel.app/api`  
📊 **Admin Panel**: `https://your-frontend.vercel.app/admin`  

---

## Next Steps After Deployment

1. Test all features on live site
2. Add custom domain (optional)
3. Set up monitoring (Vercel Analytics)
4. Enable HTTPS (automatic on Vercel)
5. Add Google Analytics (optional)

🚀 **That's it! Your app is deployed!**
