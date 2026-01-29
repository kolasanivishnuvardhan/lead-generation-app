# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-deployed-backend.com/api`

## Projects API

### Get All Projects
```http
GET /api/projects
```

**Response:**
```json
[
  {
    "_id": "655abc123def456",
    "name": "E-commerce Platform",
    "description": "A modern e-commerce platform built with React and Node.js",
    "image": "/uploads/projects/project-1234567890.jpg",
    "createdAt": "2026-01-29T10:30:00.000Z"
  }
]
```

### Get Single Project
```http
GET /api/projects/:id
```

### Create Project
```http
POST /api/projects
Content-Type: multipart/form-data

Body:
- name: string (required)
- description: string (required)
- image: file (required, image file)
```

**Response:**
```json
{
  "_id": "655abc123def456",
  "name": "E-commerce Platform",
  "description": "A modern e-commerce platform",
  "image": "/uploads/projects/project-1234567890.jpg",
  "createdAt": "2026-01-29T10:30:00.000Z"
}
```

### Update Project
```http
PUT /api/projects/:id
Content-Type: multipart/form-data

Body:
- name: string (optional)
- description: string (optional)
- image: file (optional)
```

### Delete Project
```http
DELETE /api/projects/:id
```

---

## Clients API

### Get All Clients
```http
GET /api/clients
```

**Response:**
```json
[
  {
    "_id": "655abc123def789",
    "name": "John Doe",
    "description": "Great service! Highly recommended.",
    "designation": "CEO, TechCorp",
    "image": "/uploads/clients/client-1234567890.jpg",
    "createdAt": "2026-01-29T10:30:00.000Z"
  }
]
```

### Get Single Client
```http
GET /api/clients/:id
```

### Create Client
```http
POST /api/clients
Content-Type: multipart/form-data

Body:
- name: string (required)
- description: string (required)
- designation: string (required)
- image: file (required)
```

### Update Client
```http
PUT /api/clients/:id
Content-Type: multipart/form-data

Body:
- name: string (optional)
- description: string (optional)
- designation: string (optional)
- image: file (optional)
```

### Delete Client
```http
DELETE /api/clients/:id
```

---

## Contacts API

### Get All Contacts
```http
GET /api/contacts
```

**Response:**
```json
[
  {
    "_id": "655abc123def012",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "mobile": "1234567890",
    "city": "New York",
    "createdAt": "2026-01-29T10:30:00.000Z"
  }
]
```

### Create Contact (Submit Form)
```http
POST /api/contacts
Content-Type: application/json

Body:
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "mobile": "1234567890",
  "city": "New York"
}
```

**Response:**
```json
{
  "message": "Contact form submitted successfully",
  "data": {
    "_id": "655abc123def012",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "mobile": "1234567890",
    "city": "New York",
    "createdAt": "2026-01-29T10:30:00.000Z"
  }
}
```

### Delete Contact
```http
DELETE /api/contacts/:id
```

---

## Newsletter API

### Get All Subscribers
```http
GET /api/newsletter
```

**Response:**
```json
[
  {
    "_id": "655abc123def345",
    "email": "subscriber@example.com",
    "subscribedAt": "2026-01-29T10:30:00.000Z"
  }
]
```

### Subscribe to Newsletter
```http
POST /api/newsletter/subscribe
Content-Type: application/json

Body:
{
  "email": "subscriber@example.com"
}
```

**Response:**
```json
{
  "message": "Successfully subscribed to newsletter",
  "data": {
    "_id": "655abc123def345",
    "email": "subscriber@example.com",
    "subscribedAt": "2026-01-29T10:30:00.000Z"
  }
}
```

**Error Response (Already Subscribed):**
```json
{
  "message": "Email already subscribed"
}
```

### Delete Subscriber
```http
DELETE /api/newsletter/:id
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error message"
}
```

---

## Image Upload Notes

- Accepted formats: JPEG, JPG, PNG, GIF
- Maximum file size: 5MB
- Images are automatically cropped to 450x350 pixels
- Images are stored in `/uploads/projects/` or `/uploads/clients/`

## Authentication

Currently, this API does not implement authentication. For production use, consider adding:
- JWT-based authentication for admin routes
- API key authentication
- OAuth integration

## Rate Limiting

Not currently implemented. Consider adding rate limiting for production:
- Contact form: 5 submissions per hour per IP
- Newsletter: 3 subscriptions per hour per IP
- Admin operations: 100 requests per hour

## CORS

CORS is enabled for all origins in development. Update `server.js` for production to restrict origins:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```
