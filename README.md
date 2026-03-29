# Student Management System

A full-stack web application for managing student information, enrollment tracking, and academic marks. Built with **React + Vite** (frontend) and **Node.js + Express** (backend), backed by **PostgreSQL**.

---



## ✨ Features

### Student Management
- ✅ Add, read, update, and delete students (soft delete)
- ✅ View student details with enrollment information
- ✅ Filter students by department
- ✅ Full-text search (name, email, enrollment number)
- ✅ Pagination support (configurable page size)
- ✅ Active/Inactive status tracking

### Marks Management
- ✅ Add/edit student marks by subject
- ✅ Department and semester-specific subjects
- ✅ Automatic percentage calculation
- ✅ Exam date tracking
- ✅ Bulk mark updates
- ✅ View marks per student

### Data Integrity
- ✅ Email uniqueness (only for active students)
- ✅ Enrollment number uniqueness (soft delete compatible)
- ✅ Cascade deletion of marks when deleting students
- ✅ Referential integrity constraints

### User Experience
- ✅ Responsive Bootstrap UI
- ✅ Real-time form validation
- ✅ Sweet Alerts for actions
- ✅ Modal dialogs for editing
- ✅ Loading states and error handling
- ✅ Intuitive pagination controls

---

## 🔧 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **ESLint** - Code quality

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client
- **express-validator** - Request validation
- **CORS** - Cross-origin support

### Development
- **Git** - Version control
- **Postman** - API testing

---

## 🏗️ Project Architecture

```
student-management-system/
├── backend/                          # Express.js API server
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── server.js                # Server startup
│   │   ├── config/
│   │   │   └── db.js                # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   ├── studentController.js # Student CRUD logic
│   │   │   └── marksController.js   # Marks CRUD logic
│   │   ├── models/
│   │   │   ├── studentModel.js      # Student DB queries
│   │   │   └── marksModel.js        # Marks DB queries
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   └── validate.js          # Request validators
│   │   ├── routes/
│   │   │   ├── studentRoutes.js     # Student endpoints
│   │   │   └── marksRoutes.js       # Marks endpoints
│   │   └── utils/
│   │       ├── pagination.js        # Pagination helper
│   │       └── response.js          # Response formatter
│   └── package.json
│
├── frontend/                        # React + Vite SPA
│   ├── src/
│   │   ├── main.jsx                # Entry point
│   │   ├── App.jsx                 # Main component
│   │   ├── App.css                 # Global styles
│   │   ├── index.css               # Reset styles
│   │   ├── components/
│   │   │   ├── forms/
│   │   │   │   └── StudentForm.jsx # Add/edit student form
│   │   │   ├── modals/
│   │   │   │   └── MarksModal.jsx  # Mark management modal
│   │   │   └── ui/
│   │   │       └── Pagination.jsx  # Pagination controls
│   │   ├── pages/
│   │   │   └── StudentList.jsx     # Main student list page
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── studentService.js   # Student API calls
│   │   │   └── marksService.js     # Marks API calls
│   │   └── utils/
│   │       └── alerts.js           # Toast notifications
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── database/
│   └── schema.sql                  # Database schema & seed data
│
├── apiCollection.json              # Postman API collection
└── README.md                        # This file
```

---


## 📦 Installation & Setup

### Prerequisites
- **Node.js** 16+ with npm
- **PostgreSQL** 12+
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd student-management-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create PostgreSQL database
createdb student_db

# Load schema and seed data
psql -U postgres -d student_db -f ../database/schema.sql

# Create .env file (optional, configure as needed)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=student_db
# API_PORT=3000

# Start backend server
npm start
# Server runs on http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App opens on http://localhost:5173
```

---

## 🚀 Running the Application

### Development Mode (with hot reload)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```


### Database Reset
```bash
psql -U postgres -d student_db -f database/schema.sql
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```


#### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10, max: 100)
- `search` - Search in name/email/enrollment (optional)
- `department` - Filter by department (optional)

#### Example Request
```bash
curl "http://localhost:5000/api/students?page=1&limit=10&department=Computer%20Science"
```


---

## ⚛️ Frontend Components

### Pages
- **StudentList.jsx** - Main dashboard showing student list with pagination, search, and filters

### Components
- **StudentForm.jsx** - Modal form for adding/editing students with validation
- **MarksModal.jsx** - Modal for managing student marks with department-specific subject filtering
- **Pagination.jsx** - Reusable pagination component

### Services
- **studentService.js** - API calls: getStudents, getStudentById, addStudent, updateStudent, deleteStudent
- **marksService.js** - API calls: getMarks, addMark, deleteMark, getSubjects
- **api.js** - Axios instance with base URL and interceptors

---


**Benefits:**
- ✅ Deleted emails can be reused
- ✅ Active students still can't have duplicates
- ✅ Soft delete history preserved
- ✅ Database integrity maintained

### Phase 3: 3NF Normalization - 3 Departments, 8 Semesters (Mar 28, 2026)
- Simplified to 3 core departments
- Complete curriculum 8 semesters per department
- 72 total subjects (no redundancy)
- Removed separate subjects duplication

### Phase 2: Department & Semester-Specific Subjects
- Added `department` and `semester` columns to subjects
- Subjects now filtered by student's department/semester
- MarksModal auto-loads relevant subjects

### Phase 1: Remove Exam Type & Subject Code
- Removed `exam_type` from marks table
- One mark per subject per student
- Simpler UI and data model

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed
**Error:** `could not connect to server`
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If error, start PostgreSQL service:
# Windows: net start postgresql-x64-15
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### Issue: Email Already Exists (Fixed!)
**Before Fix:** Deleted student's email couldn't be reused
**Solution:** Apply schema.sql with partial unique indexes
```bash
psql -U postgres -d student_db -f database/schema.sql
```

### Issue: Port Already in Use
```bash
# Change backend port in server.js or .env
# Frontend: Backend should be accessible at configured API_URL
```

### Issue: CORS Errors
**Error:** `Access to XMLHttpRequest blocked by CORS policy`
```
Solution: CORS is configured in backend/src/app.js
If issues persist, check:
- Frontend API URL in frontend/src/services/api.js
- Backend is running on correct port
- CORS origin matches frontend URL
```

### Issue: Marks Not Showing
**Check:**
1. Student has marks in database: `SELECT * FROM marks;`
2. Student department/semester matches marks subjects
3. Refresh page to load latest data
4. Check browser console for API errors

---

## 📋 Validation Rules

### Student Form
- **First Name** - Required, max 100 chars
- **Last Name** - Required, max 100 chars
- **Email** - Valid email format, unique (active students only)
- **Phone** - Optional
- **Enrollment No** - Required, unique (active students only)
- **Department** - Optional
- **Semester** - 1-8, optional

### Marks Form
- **Subject** - Required, filtered by department
- **Marks** - Required, ≥ 0, ≤ max_marks
- **Exam Date** - Optional, valid date format

---

## 📝 Postman Collection

Import `apiCollection.json` into Postman to test all endpoints with ready-made requests.

---



