# Enterprise Task Management System

A production-quality full-stack Task Management System engineered for a MERN / Full-Stack Technical Assessment. Built using **Express.js, Neon PostgreSQL, Drizzle ORM, Better Auth session authentication, Zod validation, Nodemailer SMTP notifications, React (Vite), and Tailwind CSS**.

---

## 🌟 Key Features

### Role-Based Access Control (RBAC)
- **Admin Portal**:
  - Secure role-guarded routes (`/admin/dashboard`, `/admin/employees`, `/admin/tasks`, `/admin/tasks/create`).
  - Database-driven aggregate metrics (Not Started, In Progress, Completed, Total Tasks).
  - Employee provisioning & management with search filtering.
  - Task assignment with dynamic employee selection, priority levels, and due dates.
  - Server-side searchable and paginated task table (`GET /api/tasks?search=...&page=1&limit=10`).
  - Automatic email notifications sent to employees upon task assignment.

- **Employee Portal**:
  - Secure role-guarded routes (`/employee/dashboard`, `/employee/tasks`).
  - Scoped task metrics calculating counts strictly for the logged-in employee.
  - Interactive status dropdown (`Not Started`, `In Progress`, `Completed`) with security verification ensuring employees can only update their assigned tasks.
  - Automatic email notifications sent to Admin whenever task status is updated.

### Backend Architecture & Security
- **Strict Role Verification**: Every protected API route enforces both session authentication (HTTP 401) and role authorization (HTTP 403).
- **Zod Input Validation**: Request payloads (login, employee creation, task assignment, status updates, query parameters) are strictly validated with clear error responses.
- **Nodemailer SMTP Integration**: Automated HTML/Text email notifications for task assignment and status updates with console fallback in local dev.
- **Neon PostgreSQL + Drizzle ORM**: Relational schema design with foreign keys (`users`, `sessions`, `accounts`, `tasks`) and Drizzle relation definitions.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Tailwind CSS, Lucide React Icons.
- **Backend**: Node.js, Express.js (ES Modules), REST APIs.
- **Database**: Neon PostgreSQL, Drizzle ORM, Drizzle Kit migrations.
- **Authentication**: Better Auth (Email/Password & Session Token authentication).
- **Email Service**: Nodemailer (SMTP configuration).
- **Validation**: Zod.

---

## 📂 Project Structure

```
task-management-system/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   └── auth.service.js       # Session token generation & validation
│   │   ├── controllers/
│   │   │   ├── admin.controller.js    # Admin stats & employee management
│   │   │   ├── auth.controller.js     # Login, logout, session check
│   │   │   ├── employee.controller.js # Scoped employee tasks & status updates
│   │   │   └── task.controller.js     # Admin task CRUD & paginated search
│   │   ├── db/
│   │   │   ├── schema/
│   │   │   │   ├── auth-schema.js     # User, Session, Account tables
│   │   │   │   ├── tasks-schema.js    # Task table with foreign keys
│   │   │   │   └── index.js           # Drizzle relations & export
│   │   │   ├── index.js               # Postgres connection & Drizzle instance
│   │   │   ├── migrate.js             # Drizzle auto-migration & table init
│   │   │   └── seed.js                # Database seeding script
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # HTTP 401 & 403 role guards
│   │   │   ├── error.middleware.js    # Centralized Express error handler
│   │   │   └── validate.middleware.js # Zod validation middleware
│   │   ├── routes/
│   │   │   ├── admin.routes.js        # Protected admin endpoints
│   │   │   ├── auth.routes.js         # Public/session auth routes
│   │   │   ├── employee.routes.js     # Protected employee endpoints
│   │   │   └── task.routes.js         # Protected task endpoints
│   │   ├── services/
│   │   │   └── email.service.js       # Nodemailer SMTP notifications
│   │   ├── validators/
│   │   │   ├── auth.validator.js      # Zod schemas for login
│   │   │   ├── employee.validator.js  # Zod schemas for employee creation
│   │   │   └── task.validator.js      # Zod schemas for tasks
│   │   └── server.js                  # Express application entry point
│   ├── drizzle.config.js              # Drizzle Kit configuration
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx          # Status and Priority pills
│   │   │   │   ├── Navbar.jsx         # Header navigation & user profile
│   │   │   │   ├── Pagination.jsx     # Server-side pagination control
│   │   │   │   ├── ProtectedRoute.jsx # Role-based route guard component
│   │   │   │   ├── Sidebar.jsx        # Responsive navigation drawer
│   │   │   │   └── StatCard.jsx       # Metric cards
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # React Auth Context
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx    # Dashboard layout wrapper
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx # Admin dashboard view
│   │   │   │   ├── AdminEmployees.jsx # Employee list & create modal
│   │   │   │   ├── AdminTasks.jsx     # Paginated task list & search
│   │   │   │   └── CreateTask.jsx     # Task assignment form
│   │   │   ├── employee/
│   │   │   │   ├── EmployeeDashboard.jsx # Scoped employee dashboard
│   │   │   │   └── EmployeeTasks.jsx     # Assigned tasks & status actions
│   │   │   └── Login.jsx              # Role selector login screen
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with interceptors
│   │   ├── App.jsx                    # React Router configuration
│   │   ├── index.css                  # Tailwind styles
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .env.example
└── README.md
```

---

## ⚡ Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Neon PostgreSQL Database**: A Neon PostgreSQL connection URI (`DATABASE_URL=postgresql://...`).

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory based on `.env.example`:

```env
# Neon PostgreSQL Connection String
DATABASE_URL=postgresql://neondb_owner:your_password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Better Auth Secret
BETTER_AUTH_SECRET=your_better_auth_secret_key_12345
BETTER_AUTH_URL=http://localhost:5000

# Backend Server Port
PORT=5000

# Nodemailer SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@example.com

# Frontend Application URL
FRONTEND_URL=http://localhost:5173
```

---

## 🗄 Database Migration & Seeding

### 1. Generate & Push Migrations with Drizzle Kit

```bash
cd backend
# Generate migration files
npm run db:generate

# Push schema directly to Neon PostgreSQL database
npm run db:push
```

### 2. Seed Database with Initial Credentials & Tasks

```bash
npm run db:seed
```

---

## 🔑 Development Login Credentials

After seeding, use the following credentials on the login screen (`http://localhost:5173/login`):

| Role | Role Toggle | Email | Password |
|------|-------------|-------|----------|
| **Admin** | `[ Admin ]` | `admin@example.com` | `Admin123!` |
| **Employee 1** | `[ Employee ]` | `john.doe@example.com` | `Employee123!` |
| **Employee 2** | `[ Employee ]` | `jane.smith@example.com` | `Employee123!` |
| **Employee 3** | `[ Employee ]` | `alex.jones@example.com` | `Employee123!` |

---

## 🏃 Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```
Backend API will start on: `http://localhost:5000`

### 2. Start the Frontend Application

```bash
cd frontend
npm run dev
```
Frontend Web App will start on: `http://localhost:5173`

---

## 📡 REST API Endpoint Documentation

### Authentication
- `POST /api/auth/login`: Authenticate as Admin or Employee.
- `POST /api/auth/logout`: Invalidate session token.
- `GET /api/auth/session`: Fetch current session user & role info.

### Admin Operations (`Admin` role required)
- `GET /api/admin/dashboard/stats`: Database-driven task count aggregates.
- `GET /api/employees`: List registered employees (supports `?search=`).
- `POST /api/employees`: Create new employee account.
- `GET /api/tasks`: Server-side paginated task search (`?search=...&page=1&limit=10`).
- `POST /api/tasks`: Assign task & send email notification to employee.
- `GET /api/tasks/:id`: Get task details.
- `PATCH /api/tasks/:id`: Update task.
- `DELETE /api/tasks/:id`: Delete task.

### Employee Operations (`Employee` role required)
- `GET /api/employee/dashboard/stats`: Task stats scoped to logged-in employee.
- `GET /api/employee/tasks`: List tasks assigned to logged-in employee.
- `PATCH /api/employee/tasks/:id/status`: Update status (`not_started`, `in_progress`, `completed`) & notify admin via email.

---

## 🔮 Future Improvements

- **WebSockets / Socket.io**: Real-time dashboard updates without page reloads.
- **Task File Attachments**: Upload attachments (PDFs, images) using S3 / Cloudinary.
- **Sub-task Checklists**: Break complex tasks into smaller checkable items.
- **Dark Mode**: Add toggle for full dark-mode palette.
