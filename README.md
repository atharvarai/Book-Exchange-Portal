# Book Exchange Portal

A peer-to-peer book exchange platform that connects book owners with book seekers. Built with Next.js, TypeScript, and Tailwind CSS for the frontend and Express.js for the backend.

## Features

- User registration and login system with role-based access
- Two types of users: Book Owners and Book Seekers
- Book listing management (add, edit, delete)
- Multiple book request options: Giveaway, Rent, or Exchange
- Request management system for book owners
- Status tracking for book requests (pending, accepted, rejected)
- Responsive, modern UI with visual feedback
- Persistent data storage using Express backend

## Tech Stack

- Frontend: React + Next.js
- Backend: Node.js + Express
- Styling: Tailwind CSS
- Language: TypeScript
- Storage: In-memory (server-side)

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed on your machine

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-exchange
```

2. Install dependencies for frontend:
```bash
npm install
```

3. Install dependencies for backend:
```bash
cd server
npm install
cd ..
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
cd ..
```

2. In a separate terminal, start the frontend development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to access the frontend.
4. The backend API will be running at [http://localhost:3001/api](http://localhost:3001/api).

## Project Structure

```
├── src/                  # Frontend (Next.js) code
│   ├── app/              # Next.js app directory
│   │   ├── auth/         # Authentication pages
│   │   └── dashboard/    # Dashboard page for book management
│   ├── components/       # Reusable React components
│   ├── lib/              # Frontend services
│   └── types/            # TypeScript type definitions
│
└── server/               # Backend (Express) code
    ├── src/              # Server source code
    │   ├── controllers/  # API controllers
    │   ├── data.js       # In-memory data store
    │   ├── index.js      # Server entry point
    │   ├── routes.js     # API routes
    │   └── utils.js      # Utility functions
    └── package.json      # Backend dependencies
```

## Features Implementation

### Backend API

- RESTful API built with Express.js
- In-memory data storage for quick setup and development
- Endpoints for authentication, book management, and request handling
- Controller-based architecture for clean code organization

### Authentication
- Email/password-based authentication
- User role selection during registration (Book Owner or Book Seeker)
- Persistent user sessions using localStorage
- Protected routes with redirects for unauthenticated users

### Book Management
- Create, update, and delete books (for owners)
- Toggle book availability status
- Set exchange options: Giveaway, Rent, Exchange
- Mutual exclusivity between Giveaway and other options
- Filter books by owner or availability

### Request System
- Seekers can request books with different options (Get, Rent, Exchange)
- Exchange requests include book title and author information
- Owners can accept or reject book requests
- Request status tracking (Pending, Accepted, Rejected)
- Visual feedback for request status on buttons

### User Interface
- Modern, responsive design using Tailwind CSS
- Smooth transitions and hover effects
- Status-based color coding for better UX
- Tooltips for explaining limitations and requirements
- Disabled buttons with visual feedback when actions aren't available
- Color-coded cards showing book availability status

## What's Working

- Complete authentication flow with persistent sessions
- Book management system with multiple exchange options
- Request creation and management workflow
- Role-based permissions and view controls
- Status tracking for all requests
- Visual differentiation for book availability
- Mutually exclusive option selection with helpful tooltips
- Responsive UI that works on all device sizes
- Backend API with Express.js
- Client-server communication via RESTful endpoints

## Future Improvements

- Database integration (MongoDB, PostgreSQL)
- Profile management for users
- Search and advanced filtering functionality
- Image upload for book covers
- Chat system between owners and seekers
- Rating and review system
- Email notifications for request updates
- JWT-based authentication

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/available` - Get all available books
- `GET /api/books/owner/:ownerId` - Get books by owner
- `GET /api/books/:id` - Get a single book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `PUT /api/books/:id/status` - Update book status
- `PUT /api/books/:id/options` - Update book options

### Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/owner/:ownerId` - Get requests by owner
- `GET /api/requests/seeker/:seekerId` - Get requests by seeker
- `POST /api/requests` - Create a new request
- `PUT /api/requests/:id` - Update a request

## AI Tools Used

This project was developed using:
- GitHub Copilot for code suggestions and autocompletion
- Claude AI for:
  - Implementing the request management system
  - Adding mutual exclusivity between book options
  - Creating visual feedback for request status
  - Fixing UI/UX issues and enhancing the design
  - Implementing the Express backend
  - Converting client-side services to use API endpoints
  - Debugging and fixing edge cases

Claude AI was particularly helpful for rapidly implementing features, resolving bugs, and enhancing the user interface with modern design elements. The AI-assisted workflow allowed for quick iterations and significant improvements to the application's functionality and user experience.

