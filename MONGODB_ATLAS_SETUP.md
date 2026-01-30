# MongoDB Atlas Setup & Deployment Guide

## Current Issue: Authentication Failed

The error "bad auth : authentication failed" means there's an issue with your MongoDB Atlas credentials.

## Steps to Fix MongoDB Atlas Connection

### Step 1: Verify Your MongoDB Atlas Credentials

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Click on **Database Access** in the left sidebar
4. Check your database user:
   - Username: `your_database_username`
   - Make sure the password is correct

### Step 2: Create/Update Database User

If the user doesn't exist or you forgot the password:

1. Click **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Set username: `your_database_username`
4. Set a NEW password (write it down!)
   - **IMPORTANT**: Avoid special characters like: `@ : / ? # [ ] % & =`
   - Use only: letters, numbers, and `-` or `_`
   - Example good password: `MySecurePassword123`
5. Under **Database User Privileges**, select: **Read and write to any database**
6. Click **Add User**

### Step 3: Whitelist Your IP Address

1. Click **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Either:
   - Click **Allow Access from Anywhere** (0.0.0.0/0) - for development/testing
   - Or add your specific IP address
4. Click **Confirm**

### Step 4: Get Your Connection String

1. Go to **Database** (Cluster view)
2. Click **Connect** button on your cluster
3. Choose **Connect your application**
4. Select **Driver**: Node.js
5. Copy the connection string
6. It should look like:
   ```
   mongodb+srv://your_username:<password>@your_cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Update .env File

Replace `<password>` with your actual password and add database name:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/leadgeneration?retryWrites=true&w=majority
```

**If your password has special characters**, URL encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`
- `%` → `%25`
- `&` → `%26`

Example:
- Password: `Pass@123#`
- Encoded: `Pass%40123%23`

### Step 6: Test Connection

After updating .env:
1. Stop the backend server
2. Restart it: `cd backend && node server.js`
3. Look for: **"MongoDB Connected"** ✅
4. If you see this, Atlas is working!

---

## Deployment Guide

Once MongoDB Atlas is working locally, follow these steps to deploy:

### Option 1: Deploy to Vercel (Recommended for Frontend + Backend)

#### Backend Deployment:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   vercel
   ```

4. **Add Environment Variables** (in Vercel Dashboard):
   - Go to your project settings
   - Add these variables:
     - `MONGODB_URI`: Your Atlas connection string
     - `NODE_ENV`: production
     - `PORT`: 5000

5. **Get your backend URL**: `https://your-backend.vercel.app`

#### Frontend Deployment:

1. **Update Frontend .env**
   ```bash
   cd ../frontend
   ```
   
   Create `.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Deploy Frontend**
   ```bash
   vercel
   ```

### Option 2: Deploy to Render

#### Backend:

1. Go to [Render.com](https://render.com/)
2. Create account and click **New +** → **Web Service**
3. Connect your GitHub repo (push your code to GitHub first)
4. Settings:
   - **Name**: flipr-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `MONGODB_URI`: Your Atlas connection string
     - `NODE_ENV`: production

5. Click **Create Web Service**
6. Copy your backend URL: `https://flipr-backend.onrender.com`

#### Frontend:

1. Update `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://flipr-backend.onrender.com/api
   ```

2. Push to GitHub
3. Create new **Static Site** on Render
4. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Option 3: Deploy to Railway

#### Backend:

1. Go to [Railway.app](https://railway.app/)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repo and `backend` folder
4. Add environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
5. Railway will auto-deploy
6. Get your URL: `https://your-app.railway.app`

#### Frontend:

Similar process, but select `frontend` folder and add:
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

### Option 4: Deploy to Netlify (Frontend) + Render/Railway (Backend)

1. Deploy backend to Render/Railway (see above)
2. For frontend:
   - Push to GitHub
   - Go to [Netlify.com](https://netlify.com/)
   - Click **Add new site** → **Import from Git**
   - Select repo and `frontend` folder
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `build`
   - Environment variables:
     - `REACT_APP_API_URL`: Your backend URL

---

## Pre-Deployment Checklist

### Backend:
- ✅ MongoDB Atlas connection working
- ✅ All environment variables in .env
- ✅ CORS configured for your frontend domain
- ✅ All routes tested locally
- ✅ File uploads working (for image hosting, consider Cloudinary)

### Frontend:
- ✅ API URL points to deployed backend
- ✅ Build completes without errors (`npm run build`)
- ✅ All features tested locally
- ✅ No console errors

### General:
- ✅ Code pushed to GitHub/GitLab
- ✅ .env files NOT committed (in .gitignore)
- ✅ README updated with deployment instructions

---

## Quick Fix Commands

### Reset MongoDB User:
1. Delete old user in Database Access
2. Create new user with simple password
3. Update .env

### Test connection locally:
```bash
cd backend
node server.js
# Should see: "MongoDB Connected"
```

### Check if ports are free:
```powershell
Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -in @(3000,5000)}
```

### Restart servers:
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## Troubleshooting

### "Authentication Failed"
→ Wrong password or username. Reset database user in Atlas.

### "Network Error"
→ IP not whitelisted. Add 0.0.0.0/0 in Network Access.

### "Cannot connect to database"
→ Check connection string format, ensure database name is included.

### File Uploads Not Working in Production
→ Use cloud storage like Cloudinary or AWS S3 instead of local uploads.

---

## Next Steps

1. Fix MongoDB Atlas authentication (follow Steps 1-6 above)
2. Test everything locally
3. Choose a deployment platform
4. Deploy backend first
5. Update frontend API URL
6. Deploy frontend
7. Test production deployment

Good luck! 🚀
