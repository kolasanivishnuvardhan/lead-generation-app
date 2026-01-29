# Getting Started - Quick Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation OR MongoDB Atlas account)
- Git
- A code editor (VS Code recommended)

## Step 1: Clone or Download

If you received this as a zip file, extract it. If it's a Git repository:
```bash
git clone <repository-url>
cd <project-folder>
```

## Step 2: Automated Setup (Recommended)

### On Windows (PowerShell):
```powershell
.\setup.ps1
```

This script will:
- Check if Node.js is installed
- Install all backend dependencies
- Install all frontend dependencies
- Create .env file from template

### Manual Setup:

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
```

**Frontend:**
```bash
cd frontend
npm install
```

## Step 3: Configure Database

### Option A: Local MongoDB
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB:
   ```bash
   mongod
   ```
3. The default connection string in `.env` should work:
   ```
   MONGODB_URI=mongodb://localhost:27017/leadgeneration
   ```

### Option B: MongoDB Atlas (Recommended for beginners)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (FREE tier)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for testing)
6. Get your connection string
7. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadgeneration
   ```

## Step 4: Start the Application

You need TWO terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
You should see: `Server running on port 5000` and `MongoDB Connected`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Your browser should automatically open to `http://localhost:3000`

## Step 5: Access the Application

- **Landing Page**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## Step 6: Add Sample Data

1. Go to the admin panel: http://localhost:3000/admin
2. Click on "Projects" in the sidebar
3. Click "Add New Project"
4. Fill in the form and upload an image
5. Click "Create Project"
6. Repeat for Clients section

## Step 7: Test Everything

1. Go back to the landing page
2. You should see your projects and clients
3. Fill out the contact form
4. Subscribe to the newsletter
5. Go back to admin panel to see the submissions

## Troubleshooting

### "MongoDB connection error"
- Make sure MongoDB is running (if using local)
- Check your connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas

### "Cannot find module..."
- Run `npm install` in both backend and frontend directories

### Port 5000 or 3000 already in use
- Stop any other applications using these ports
- Or change the PORT in backend/.env

### Images not showing
- Check that the backend is running
- Check browser console for errors
- Verify the image was uploaded (check backend/uploads folder)

## Development vs Production

### Development (Current Setup)
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Uses proxy for API calls

### Production (After Deployment)
- Frontend: https://your-app.vercel.app
- Backend: https://your-api.render.com
- Update REACT_APP_API_URL in frontend

## Next Steps

After everything works locally:

1. **Read DEPLOYMENT.md** for deployment instructions
2. **Read API_DOCUMENTATION.md** to understand the API
3. **Read CHECKLIST.md** to verify all features
4. Deploy to your chosen platforms
5. Submit your project

## Common Commands

**Install all dependencies:**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

**Start development servers:**
```bash
# Backend (from backend folder)
npm start

# Frontend (from frontend folder)
npm start
```

**Build for production:**
```bash
# Frontend only
cd frontend
npm run build
```

## Support

If you encounter any issues:

1. Check the error message in the terminal
2. Check the browser console (F12)
3. Verify all dependencies are installed
4. Ensure MongoDB is connected
5. Check the troubleshooting section above

## Project Structure

```
Your Project/
├── backend/          # Express.js API server
├── frontend/         # React.js application
├── README.md         # Main documentation
├── DEPLOYMENT.md     # Deployment guide
├── CHECKLIST.md      # Feature checklist
└── setup.ps1         # Automated setup script
```

## Important Files to Configure

1. `backend/.env` - Database connection and port
2. `frontend/package.json` - Proxy setting (already configured)

That's it! You're ready to start developing. 🚀
