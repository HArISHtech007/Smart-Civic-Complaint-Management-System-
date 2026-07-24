# 🏛️Smart Civic Complaint Management System
---
**An AI-powered Platform that enables citizens to report civic issues and automatically routes them to the right government department using Computer Vision and NLP.**
## 👥 Team Details

| Name | Role | Responsibility |
|------|------|----------------|
| Harish I | Team Lead & Full Stack Integrator | Architecture, integration, judge presentation |
| Hareesh k | Frontend Developer | HTML, CSS, JS — citizen portal & complaint form |
| Dharunram R | Backend Developer | Node.js, Express.js, REST API, JWT auth |
| Avinash R | AI Automation | YOLOv8, FastAPI, Gemini 2.5 Flash, NLP |
| Deepak B | Database & DevOps | MongoDB, Mongoose, deployment, API testing |
| Gokulakrishnan S | UI/UX & Presenter | Figma design, Antigravity animations, demo script |

---


> **Institution:** Satyabama Institute of Science and Technology
> 
> **Hackathon:** Rush Hour—2026
> 
> **Track:** Smart Governance / AI for Social Good

---

##  Problem Statement
Civic complaint systems in India suffer from three major failures:

1. **Manual sorting** — Citizens submit complaints to the wrong department, causing delays
2. **No transparency** — After submission, citizens have zero visibility on complaint status
3. **No prioritization** — A collapsed road and a broken park bench are treated equally

The result: complaints get lost, duplicate issues pile up, and citizens lose trust in the system.
# 🏙️ Smart Citizen Grievance & Issue Reporting System

An end-to-end AI-powered civic issue reporting and management platform. The system leverages computer vision and natural language processing to automatically categorize, prioritize, and route citizen complaints to the relevant municipal departments.

---

##  System Architecture & Flow Chart

```text
Citizen Report
      │
      ▼
 Capture Live Image
      │
      ▼
 Auto GPS Detection
      │
      ▼
 Complaint Description
      │
      ▼
Node.js Backend
      │
      ├─────────────────────┐
      ▼                     ▼
YOLOv8                 NLP Analysis
(Image)                (Description)
      │                     │
      └──────────┬──────────┘
                 ▼
         AI Decision Engine
                 │
      ┌──────────┼──────────┐
      │          │          │
      ▼          ▼          ▼
 Core Issue  Department  Priority
                 │
                 ▼
      Report Overview Preview
                 │
                 ▼
       Citizen Confirms Report
                 │
                 ▼
         Store in MongoDB
                 │
                 ▼
       Head Officer Dashboard
                 │
                 ▼
        Officer Assignment
                 │
                 ▼
       Complaint Resolution
                 │
                 ▼
   Upload Completion Evidence
                 │
                 ▼
     Citizen Status Notification
```
## Our Solution
A full-stack web platform where:

-  **Citizens** upload a photo + description of any civic issue
-  **AI (YOLOv8 + Gemini 2.5 Flash + NLP)** auto-detects the issue, classifies severity, and routes it to the correct department
-  **Officers** view complaints assigned to their department with map location and proof photos
-  **Head Officers** manage department officers and oversee complaint resolution
-  **Admin** has full control — manage users, departments, and the entire database

---

##  Features
---
### Citizen
-  Live photo capture or image upload
-  GPS-based automatic location detection
-  Issue description + AI-powered overview generation
-  Real-time complaint status tracking
-  View complaint on map with location pin
### Officer
-  View complaints assigned to their department
-  Map view with complaint location
-  Accept complaint and mark as In Progress
-  Upload proof photo to mark as Complete
-  Department-specific complaint feed

### Head Officer
-  View all officers in their department
-  Track department complaint stats (issued / completed)
-  Add new officers to department

### Admin
-  Full system access
-  Add Head Officers and Admins
-  Add or delete departments
-  Add or delete users (citizen / officer / head officer)
-  Total complaints issued and completed overview
-  Full database management

---
#  Tech Stack

## Frontend

- **HTML5** – Structure and layout
- **CSS3** – Responsive styling
- **JavaScript (ES6+)** – Client-side functionality
- **Leaflet.js** – Interactive maps
- **OpenStreetMap** – Open-source map tiles
- **Fetch API** – Backend communication

---
 ## Backend

- **Node.js** – JavaScript runtime
- **Express.js** – RESTful API framework
- **JWT (JSON Web Token)** – Authentication & authorization
- **bcrypt.js** – Password hashing
- **Multer** – Image upload handling
- **CORS** – Cross-origin resource sharing
- **dotenv** – Environment variable management

---
## AI Automation
| Technology | Purpose |
|-----------|---------|
| YOLOv8 (Ultralytics) | Civic issue detection from images |
| OpenCV | Image preprocessing |
| Pillow | Image manipulation |
| Gemini 2.5 Flash | Image recognition, workflow analysis, smart description |
| NLP (text classification) | Complaint text categorization and severity scoring |
| Python FastAPI | AI microservice exposing detection endpoints |
Landing Page
---
![Landing Page](.assets/landingpage.png)
