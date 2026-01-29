# System Architecture

## Overview

This document describes the architecture of the Lead Generation Full Stack Application.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     (http://localhost:3000)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    REACT FRONTEND                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Landing Page                                             │  │
│  │  - Hero Section                                           │  │
│  │  - Our Projects Section (fetch from API)                 │  │
│  │  - Happy Clients Section (fetch from API)                │  │
│  │  - Contact Form (submit to API)                          │  │
│  │  - Newsletter Section (submit to API)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Admin Panel                                              │  │
│  │  - Project Management (CRUD)                             │  │
│  │  - Client Management (CRUD)                              │  │
│  │  - Contact Form View                                     │  │
│  │  - Newsletter Subscribers View                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Services: Axios API Client                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API Calls
                         │ (http://localhost:5000/api)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   EXPRESS.JS BACKEND                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Routes                                               │  │
│  │  - /api/projects     (GET, POST, PUT, DELETE)            │  │
│  │  - /api/clients      (GET, POST, PUT, DELETE)            │  │
│  │  - /api/contacts     (GET, POST, DELETE)                 │  │
│  │  - /api/newsletter   (GET, POST, DELETE)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware                                               │  │
│  │  - CORS                                                   │  │
│  │  - Body Parser                                            │  │
│  │  - Multer (File Upload)                                  │  │
│  │  - Sharp (Image Processing)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Models (Mongoose)                                        │  │
│  │  - Project Model                                          │  │
│  │  - Client Model                                           │  │
│  │  - Contact Model                                          │  │
│  │  - Newsletter Model                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ MongoDB Driver
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    MONGODB DATABASE                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Collections:                                             │  │
│  │  - projects                                               │  │
│  │  - clients                                                │  │
│  │  - contacts                                               │  │
│  │  - newsletters                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     FILE SYSTEM                                  │
│  backend/uploads/                                                │
│  - temp/          (temporary upload location)                    │
│  - projects/      (processed project images)                     │
│  - clients/       (processed client images)                      │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Landing Page Data Flow

```
User visits Landing Page
         │
         ├─► Frontend fetches projects (GET /api/projects)
         │   Backend queries MongoDB → Returns projects list
         │   Frontend displays projects
         │
         ├─► Frontend fetches clients (GET /api/clients)
         │   Backend queries MongoDB → Returns clients list
         │   Frontend displays clients
         │
         ├─► User submits Contact Form
         │   Frontend sends POST /api/contacts
         │   Backend validates → Saves to MongoDB
         │   Returns success message
         │
         └─► User subscribes to Newsletter
             Frontend sends POST /api/newsletter/subscribe
             Backend validates → Checks duplicates → Saves to MongoDB
             Returns success message
```

### Admin Panel Data Flow

```
Admin accesses Admin Panel
         │
         ├─► Project Management
         │   │
         │   ├─► View Projects (GET /api/projects)
         │   ├─► Add Project (POST /api/projects)
         │   │   → Upload image → Multer saves temp
         │   │   → Sharp crops to 450x350
         │   │   → Save to /uploads/projects/
         │   │   → Save metadata to MongoDB
         │   │
         │   ├─► Edit Project (PUT /api/projects/:id)
         │   │   → Same as Add (optional new image)
         │   │
         │   └─► Delete Project (DELETE /api/projects/:id)
         │       → Delete from MongoDB
         │       → Delete image file
         │
         ├─► Client Management (Similar to Projects)
         │
         ├─► View Contacts (GET /api/contacts)
         │   → Fetch all contact submissions
         │
         └─► View Newsletter (GET /api/newsletter)
             → Fetch all subscribers
             → Export to CSV (frontend)
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│                                                                  │
│  React.js 18.2                                                  │
│  - React Router 6.16    (Navigation)                            │
│  - CSS3                 (Styling)                               │
│  - Responsive Design    (Mobile + Desktop)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│                                                                  │
│  Express.js 4.18                                                │
│  - REST API             (16 endpoints)                          │
│  - CORS                 (Cross-origin)                          │
│  - Multer 1.4          (File uploads)                          │
│  - Sharp 0.32          (Image processing)                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│                                                                  │
│  MongoDB with Mongoose 7.6                                      │
│  - 4 Collections        (Projects, Clients, Contacts, Newsletter)│
│  - Schema Validation    (Mongoose)                              │
│  - Indexes              (Auto-generated)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       STORAGE LAYER                              │
│                                                                  │
│  File System                                                    │
│  - Uploaded Images      (backend/uploads/)                      │
│  - Processed Images     (cropped to 450x350)                    │
└─────────────────────────────────────────────────────────────────┘
```

## API Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                              │
│                    (http://localhost:5000)                       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │Projects │    │Clients  │    │Contacts │
    │  Router │    │ Router  │    │ Router  │
    └────┬────┘    └────┬────┘    └────┬────┘
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │Projects │    │Clients  │    │Contacts │
    │  Model  │    │  Model  │    │  Model  │
    └────┬────┘    └────┬────┘    └────┬────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                    ┌────▼────┐
                    │MongoDB  │
                    │Database │
                    └─────────┘
```

## Component Architecture (Frontend)

```
App.js (Router)
    │
    ├─► LandingPage.js
    │   ├─► Hero Section
    │   ├─► Projects Section
    │   │   └─► ProjectCard × N
    │   ├─► Clients Section
    │   │   └─► ClientCard × N
    │   ├─► Contact Form
    │   ├─► Newsletter Section
    │   └─► Footer
    │
    └─► AdminPanel.js
        ├─► Sidebar Navigation
        └─► Routes
            ├─► ProjectManagement
            │   ├─► Project List Table
            │   └─► Project Form
            ├─► ClientManagement
            │   ├─► Client List Table
            │   └─► Client Form
            ├─► ContactsList
            │   └─► Contact Table
            └─► NewsletterList
                └─► Subscriber Table

Services Layer
    └─► api.js
        ├─► projectAPI
        ├─► clientAPI
        ├─► contactAPI
        └─► newsletterAPI
```

## Database Schema

```
┌─────────────────────┐
│   Projects          │
├─────────────────────┤
│ _id: ObjectId       │
│ name: String        │
│ description: String │
│ image: String       │
│ createdAt: Date     │
└─────────────────────┘

┌─────────────────────┐
│   Clients           │
├─────────────────────┤
│ _id: ObjectId       │
│ name: String        │
│ description: String │
│ designation: String │
│ image: String       │
│ createdAt: Date     │
└─────────────────────┘

┌─────────────────────┐
│   Contacts          │
├─────────────────────┤
│ _id: ObjectId       │
│ fullName: String    │
│ email: String       │
│ mobile: String      │
│ city: String        │
│ createdAt: Date     │
└─────────────────────┘

┌─────────────────────┐
│   Newsletters       │
├─────────────────────┤
│ _id: ObjectId       │
│ email: String       │
│ subscribedAt: Date  │
└─────────────────────┘
```

## Image Processing Pipeline

```
User uploads image
       │
       ▼
┌──────────────────┐
│  Multer Receives │
│  Saves to temp/  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Sharp Processes │
│  Crops to 450x350│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Save to final   │
│  location        │
│  (projects/ or   │
│   clients/)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Delete temp file│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Save path to    │
│  MongoDB         │
└──────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          PRODUCTION                              │
└──────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Vercel    │         │  Render.com │         │   MongoDB   │
│  (Frontend) │◄────────┤  (Backend)  │◄────────┤   Atlas     │
│             │  HTTPS  │             │  HTTPS  │  (Database) │
│  React App  │         │  Express.js │         │   Cloud DB  │
└─────────────┘         └─────────────┘         └─────────────┘
       │                        │
       │                        │
       │                        └──► File Storage
       │                             (Render Disk or
       │                              AWS S3)
       │
       └──► CDN for static assets
```

## Security Considerations

```
┌──────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                          │
├──────────────────────────────────────────────────────────────────┤
│  1. CORS        → Restrict origins in production                 │
│  2. HTTPS       → SSL/TLS encryption (production)                │
│  3. Validation  → Input validation on backend                    │
│  4. File Types  → Restrict to images only                        │
│  5. File Size   → Limit to 5MB                                   │
│  6. Sanitization→ Prevent XSS and injection                      │
│  7. Rate Limit  → Prevent abuse (to be added)                    │
│  8. Auth        → Add JWT for admin routes (future)              │
└──────────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
┌──────────────────────────────────────────────────────────────────┐
│                      OPTIMIZATIONS                               │
├──────────────────────────────────────────────────────────────────┤
│  Frontend:                                                       │
│  - React.lazy() for code splitting (future)                     │
│  - Image optimization (done via Sharp)                          │
│  - Caching API responses (future)                               │
│                                                                  │
│  Backend:                                                        │
│  - Image resizing reduces file size                             │
│  - MongoDB indexes on frequently queried fields                 │
│  - Compression middleware (future)                              │
│                                                                  │
│  Database:                                                       │
│  - Indexes on _id (automatic)                                   │
│  - Pagination for large datasets (future)                       │
└──────────────────────────────────────────────────────────────────┘
```

## Scalability Path

```
Current (MVP)           Future Enhancements
─────────────           ───────────────────
Single Server    →      Load Balancer + Multiple Servers
Local Storage    →      AWS S3 / Cloudinary
No Caching      →      Redis Cache
No CDN          →      CloudFront / Cloudflare
No Auth         →      JWT Authentication
No Analytics    →      Google Analytics / Mixpanel
Manual Backup   →      Automated DB Backups
```

---

This architecture provides a solid foundation for a production-ready application and can be scaled as needed.
