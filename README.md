# Lead Generation Full Stack Application

A comprehensive full-stack application for lead generation with a landing page and admin panel.

## Features

### Landing Page
- **Our Projects Section** - Displays all projects fetched from the backend with images, names, descriptions, and "Read More" buttons
- **Happy Clients Section** - Shows client testimonials with images, descriptions, names, and designations
- **Contact Form** - Users can submit inquiries with Full Name, Email, Mobile Number, and City
- **Newsletter Subscription** - Users can subscribe with their email address

### Admin Panel
- **Project Management** - Add, edit, and delete projects with image upload and automatic cropping (450x350)
- **Client Management** - Manage client testimonials with images and details
- **Contact Form Details** - View all contact form submissions
- **Newsletter Subscribers** - View all subscribed emails with export to CSV functionality

### Additional Features
- Image cropping to 450x350 ratio using Sharp
- Responsive design for mobile and desktop
- RESTful API architecture
- MongoDB database integration

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file uploads
- Sharp for image processing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- CSS3 for styling

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leadgeneration
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/leadgeneration
```

4. Start the backend server:
```bash
npm start
# For development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware (upload, etc.)
│   ├── uploads/         # Uploaded images directory
│   ├── server.js        # Main server file
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── admin/   # Admin panel components
│   │   ├── pages/       # Landing page and admin panel pages
│   │   ├── services/    # API service layer
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (with image upload)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client (with image upload)
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Contacts
- `GET /api/contacts` - Get all contact submissions
- `POST /api/contacts` - Submit contact form
- `DELETE /api/contacts/:id` - Delete contact

### Newsletter
- `GET /api/newsletter` - Get all subscribers
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `DELETE /api/newsletter/:id` - Delete subscriber

## Deployment

### MongoDB Atlas (Database)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

### Backend Deployment Options

#### Option 1: Heroku
```bash
cd backend
heroku create your-app-name
git init
git add .
git commit -m "Initial commit"
git push heroku main
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
```

#### Option 2: Railway.app
1. Connect your GitHub repository
2. Select the backend directory
3. Add environment variables
4. Deploy

#### Option 3: Render.com
1. Create a new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

### Frontend Deployment Options

#### Option 1: Vercel
```bash
cd frontend
npm install -g vercel
vercel
```

#### Option 2: Netlify
```bash
cd frontend
npm run build
# Upload the build folder to Netlify
```

#### Option 3: GitHub Pages (with slight modifications)
```bash
cd frontend
npm run build
# Deploy the build folder
```

### Environment Variables for Production

Backend `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=production
```

Frontend (create `.env.production`):
```env
REACT_APP_API_URL=your_deployed_backend_url/api
```

## Usage

### Accessing the Application
- **Landing Page**: `http://localhost:3000/`
- **Admin Panel**: `http://localhost:3000/admin`

### Admin Panel Navigation
- `/admin/projects` - Manage projects
- `/admin/clients` - Manage clients
- `/admin/contacts` - View contact submissions
- `/admin/newsletter` - View newsletter subscribers

## Features Implementation

✅ Landing page with all required sections  
✅ Projects section fetching from backend  
✅ Happy Clients section fetching from backend  
✅ Contact form with backend integration  
✅ Newsletter subscription functionality  
✅ Admin panel for project management  
✅ Admin panel for client management  
✅ View contact form submissions  
✅ View newsletter subscriptions  
✅ Image upload and cropping (450x350)  
✅ Responsive design  
✅ RESTful API  
✅ MongoDB integration  
✅ Error handling  
✅ Form validations  

## Screenshots

(Add screenshots of your application here after running it)

## Contributing

This is a placement drive task. Please do not fork or copy this repository as per the task requirements.

## License

This project is created for the FLIPR Placement Drive Full Stack Development Task.

## Notes

- Make sure MongoDB is running before starting the backend
- The API URL in the frontend is configured via proxy in development
- For production, update the API URL in the frontend to point to your deployed backend
- Images are automatically cropped to 450x350 as per the bonus feature requirement
- All uploaded images are stored in the `backend/uploads` directory

## Support

For any issues or questions, please refer to the documentation or contact the development team.
