# Bug Hunting Platform

A comprehensive platform for managing and tracking bug hunting assignments, built with a MERN stack (MongoDB, Express, React, Node.js). This application facilitates collaboration between administrators, coaches, and bug hunters to test and report security vulnerabilities.

## 🚀 Project Overview

The Bug Hunting Platform is designed to streamline the process of organizing bug bounty programs, assigning tasks to bug hunters, reviewing their findings, and providing feedback. The application features role-based access control with three distinct user roles: Admin, Coach, and Hunter.

![Project Architecture](https://i.imgur.com/placeholder-image.png)

## 🔑 Key Features

### Authentication & Authorization
- Secure user registration with email verification
- Role-based access control (Admin, Coach, Hunter)
- JWT-based authentication
- Admin approval workflow for new user registrations

### Task Management
- Create and assign bug hunting tasks
- Track task status (Unclaimed, In Progress, Completed, Reviewed)
- Filter tasks by status, industry, date range, and more
- Detailed task history tracking

### Bug Testing & Reporting
- Interactive testing environment
- Script execution and result logging
- File upload for evidence and supporting materials
- Detailed vulnerability reporting

### Review & Feedback
- Comprehensive review system for coaches
- Final report generation
- Task difficulty classification
- Historical view of all reviews

### User Interface
- Responsive design using Tailwind CSS
- Dark/Light mode toggle
- Role-specific dashboards
- Real-time status updates

## 👥 User Roles & Permissions

### Admin
- Approve/reject new user registrations
- Create and manage bug hunting tasks
- Access to all system features
- View system-wide statistics

### Coach
- Review bug submissions
- Provide feedback to hunters
- Change task status
- Generate final reports
- Access to coaching dashboard

### Hunter
- View and claim available tasks
- Submit bug findings and reports
- Upload evidence files
- Track personal progress
- Access to hunting dashboard

## 🏗️ Project Structure

### Frontend (`bug_dashboard/`)
```
bug_dashboard/
├── public/               # Static assets
├── src/
│   ├── App/              # Main application components
│   │   ├── Common/       # Shared components (Navbar, Containers, etc.)
│   │   └── Auth/         # Authentication components
│   ├── assets/
│   │   └── Components/   # Role-specific components
│   │       ├── Admin Dashboard/
│   │       ├── Coach Dashboard/
│   │       ├── Hunter Dashboard/
│   │       ├── Login page/
│   │       └── Tool/     # Bug testing interface
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles (Tailwind CSS)
├── package.json          # Frontend dependencies
└── tailwind.config.js    # Tailwind CSS configuration
```

### Backend (`server/`)
```
server/
├── config/               # Configuration files
│   ├── db.js             # Database connection
│   ├── email.js          # Email service configuration
│   └── cloudStorage.js   # File storage configuration
├── controllers/          # Request handlers
├── middleware/           # Custom middleware (auth, validation)
├── models/               # MongoDB schemas
├── routes/               # API routes
├── services/             # Business logic
├── server.js             # Main server file
└── package.json          # Backend dependencies
```

## 🛠️ Technology Stack

### Frontend
- React (v19)
- React Router (v7)
- Axios for API requests
- Tailwind CSS for styling
- Lucide React for icons
- JWT for authentication

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer & GridFS for file uploads
- Nodemailer for email notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bug-hunting-platform.git
cd bug-hunting-platform
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_for_notifications
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin_notification_recipient
BASE_URL=http://localhost:3000
```

4. Install frontend dependencies
```bash
cd ../bug_dashboard
npm install
```

5. Run the development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd bug_dashboard
npm run dev
```

6. Access the application
Open your browser and navigate to `http://localhost:5173`

## 🔄 Workflow Overview

### User Registration Flow
1. User registers with email, password, and selects a role (Hunter or Coach)
2. Registration request is sent to Admin for approval
3. Admin reviews and approves/rejects the request
4. User receives notification of approval status
5. Approved users can log in with their credentials

### Task Assignment Flow
1. Admin creates a new task with project details
2. Task appears in the Hunter dashboard with "Unclaimed" status
3. Hunter claims the task, changing status to "In Progress"
4. Hunter performs testing and submits findings
5. Hunter marks task as "Completed" when finished
6. Coach reviews submission and provides feedback
7. Coach marks task as "Reviewed" when complete

## 📁 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (Hunter or Coach)
- `POST /api/auth/login` - User login
- `POST /api/auth/approve-user` - Admin approves pending user
- `POST /api/auth/reject-user` - Admin rejects pending user
- `GET /api/auth/pending-users` - Get all pending user registrations

### Task Management
- `POST /api/task/add` - Create a new task
- `GET /api/task` - Get all tasks
- `PATCH /api/task/update-status/:taskId` - Update task status

### Reviews & Feedback
- `POST /api/taskReview/create` - Create task review with file uploads
- `GET /api/taskReview/all-review/:taskId` - Get all reviews for a task
- `POST /api/finalReport/createOrUpdate` - Create or update final report
- `GET /api/finalReport/:taskId` - Get final report for a task

## 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication with token expiration
- Role-based access control
- Input validation and sanitization
- Protection against common web vulnerabilities
- CORS configuration for API security

## 🌐 Deployment

The application is configured for deployment on Vercel:
- Frontend: https://bug-hunt-platform-4mjb.vercel.app
- Backend: https://bug-hunt-platform.vercel.app

## 🧠 Future Enhancements

- Real-time notifications using WebSockets
- Enhanced analytics dashboard
- Team collaboration features
- Vulnerability classification system
- Integration with common security testing tools
- CI/CD pipeline for automated testing and deployment

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Contributors

- [Project Developer]
- [Team Members]

## 📞 Support

For support or inquiries, please contact [support@example.com](mailto:support@example.com).
