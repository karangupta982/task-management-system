# Task Management System

A collaborative full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create tasks, invite collaborators, and manage responsibilities in a creator-controlled collaboration model.

## Overview

The Task Management System enables seamless collaboration on tasks while maintaining clear ownership and access control. Every authenticated user can create tasks, but only the task creator can manage collaborators and assign responsibilities for their tasks. This design ensures accountability and controlled access without complex role-based permissions.

## Features

### User Authentication
- Secure JWT-based authentication
- User registration with email verification
- Password reset functionality via email
- Password hashing with bcrypt
- Profile management

### Task Management
- Create tasks with title, description, due date, and priority
- Update task status (Pending, In Progress, Completed)
- Priority-based organization (High/Medium/Low) with color coding
- Task filtering and sorting
- Paginated task lists for performance

### Collaboration System
- Add collaborators to tasks by username
- Creator-controlled collaboration model
- Assign specific responsibilities to each collaborator
- View all collaborators and their assignments
- Remove collaborators (creator only)

### Email Notifications
- Email notifications when added to a task
- Task deadline reminders (24 hours before due date)
- Task completion notifications
- Responsibility assignment updates
- Task removal notifications
- Customizable email templates

### User Interface
- Modern, responsive design with Tailwind CSS
- Intuitive dashboard for task overview
- Task detail pages with full information
- Real-time status updates
- Toast notifications for user feedback
- Private routes for authenticated access

### Additional Features
- Drag-and-drop priority reordering
- AJAX-based data fetching for smooth UX
- Input validation and error handling
- Comprehensive logging with Morgan
- CORS support for cross-origin requests

## Tech Stack

### Frontend
- **React.js** - Component-based UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Express Validator** - Input validation
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory (if needed for API base URL):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Register**: Create a new account with email verification
2. **Login**: Authenticate with your credentials
3. **Create Tasks**: Add new tasks with details and priority
4. **Manage Collaborators**: Add users to your tasks and assign responsibilities
5. **Track Progress**: Update task status and monitor deadlines
6. **Receive Notifications**: Get email updates on task changes

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Task Endpoints
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/collaborators` - Add collaborator
- `DELETE /api/tasks/:id/collaborators/:userId` - Remove collaborator

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users by username

## Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  isEmailVerified: Boolean,
  profileImage: String,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  dueDate: Date,
  priority: Enum ['High', 'Medium', 'Low'],
  status: Enum ['Pending', 'In Progress', 'Completed'],
  createdBy: ObjectId (User),
  collaborators: [{
    userId: ObjectId (User),
    assignedResponsibility: String,
    addedAt: Date,
    emailSent: Boolean
  }],
  tags: [String],
  attachments: Array,
  createdAt: Date,
  updatedAt: Date
}
```
