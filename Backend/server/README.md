# Smart Civic Complaint Management Backend API

Production-ready backend API service for the Smart Civic Complaint Management System. Built using Node.js, Express, and Mongoose with integrated YOLOv8 image processing and NLP text intent routing.

---

## Folder Structure

```
Backend/server/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── authController.js     # User registration, login & profile
│   ├── complaintController.js# Complaint CRUD, pagination & AI hooks
│   ├── dashboardController.js# Mongoose aggregation pipelines
│   └── notificationController.js # Alerts management
├── docs/
│   ├── swagger.json          # OpenAPI 3.0 specifications
│   └── postman_collection.json # Exported request collections
├── middleware/
│   ├── authMiddleware.js     # JWT validation & role controls
│   ├── errorMiddleware.js    # Global error handlers
│   └── uploadMiddleware.js   # Multer file size & type validation
├── models/
│   ├── complaintModel.js     # Indexed complaint schema
│   ├── notificationModel.js  # Notifications schema
│   └── userModel.js          # Encrypted credentials schema
├── routes/
│   ├── authRoutes.js         # Register/login endpoints
│   ├── complaintRoutes.js    # Grievance endpoints
│   ├── dashboardRoutes.js    # Aggregations stats endpoints
│   └── notificationRoutes.js # Alerts endpoints
├── services/
│   └── aiService.js          # Resilient YOLO & NLP Axios client
├── utils/
│   ├── logger.js             # Formatted system output logs
│   └── responseFormatter.js  # Unified success/error JSON utilities
├── Dockerfile                # Production multi-stage Docker build
├── docker-compose.yml        # Docker Multi-container (Node + Local DB)
├── render.yaml               # Infrastructure deploy setup
├── server.js                 # Master entry point
└── server-mock.js            # In-memory database simulation server
```

---

## Installation & Running

### Prerequisites
- Node.js (v18+)
- MongoDB Community Server (if running locally without Docker)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Environment Variables
Copy `.env.example` to `.env` and adjust the variables:
```bash
cp .env.example .env
```

### Step 3: Run the Server

- **Development (Real MongoDB)**:
  ```bash
  npm run dev
  ```
- **Local In-Memory Mock (Runs without MongoDB database service)**:
  ```bash
  node server-mock.js
  ```
- **Production**:
  ```bash
  npm start
  ```

---

## Running with Docker (Containerized Node + MongoDB)

To spin up the Express API and a local MongoDB instance with persistent storage mapping to `./database/mongodb/data`:
```bash
docker compose up --build
```

---

## API Documentation

Interactive API documents are hosted at **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)** when the backend is running.

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - Create user profile
- `POST /api/auth/login` - Authenticate user credentials
- `POST /api/auth/logout` - Clear cookies & session
- `GET /api/auth/profile` - Get logged-in user profile

#### Complaints Queue
- `POST /api/complaints` - File a complaint (requires multipart/form-data for image)
- `GET /api/complaints` - Query complaints (supports `page`, `limit`, `search`, `status`, `priority`, `sort` query params)
- `GET /api/complaints/:id` - Fetch case details
- `PUT /api/complaints/:id` - Dispatch/Update status
- `DELETE /api/complaints/:id` - Remove record (Admins only)

#### Dashboards & Stats
- `GET /api/dashboard/citizen` - Citizen counts
- `GET /api/dashboard/officer` - Officer workload metrics
- `GET /api/dashboard/headofficer` - Department cases and critical totals
- `GET /api/dashboard/admin` - Global aggregates & monthly trends

#### Notifications
- `GET /api/notifications` - Retrieve alerts
- `PUT /api/notifications/:id/read` - Mark specific notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
