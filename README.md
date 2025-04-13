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

## Tech Stack

- **Frontend**: React + Next.js (App Router)
- **Backend**: Node.js + Express
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Storage**: In-memory data structures (JavaScript Maps)

## Data Storage

This application uses a simple in-memory storage approach:

- **Server-side storage**: All data (users, books, requests) is stored in JavaScript Map objects in the Express server's memory
- **Transient storage**: Data persists only while the server is running. When the server restarts, it reinitializes with sample data
- **Client-side storage**: Only user authentication information is stored in localStorage for session persistence
- **Sample data**: The server initializes with sample users and books for demonstration purposes

This storage approach is suitable for development and demonstration but would need to be replaced with a proper database for production use.

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
```

2. In a separate terminal, start the frontend development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to access the frontend.
4. The backend API will be running at [http://localhost:3001/api](http://localhost:3001/api).

## Sample Accounts

The application comes with pre-configured sample accounts:

- **Book Owner**:
  - Email: john@example.com
  - Password: password123

- **Book Seeker**:
  - Email: jane@example.com
  - Password: password123

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

### Backend Architecture

- **RESTful API**: Built with Express.js following REST principles
- **In-memory Data Store**: Uses JavaScript Maps for transient data storage
- **API Controllers**: Separate controller files for authentication, books, and requests
- **Sample Data Initialization**: Pre-populates the application with sample users and books on server start

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

## Future Improvements

- **Database Integration**: Replace in-memory storage with a persistent database (MongoDB, PostgreSQL)
- **User Profiles**: Add detailed user profiles with avatars and personal information
- **Advanced Search**: Implement full-text search and filtering by multiple criteria
- **Image Upload**: Allow users to upload book cover images
- **Chat System**: Implement real-time chat between owners and seekers
- **Ratings & Reviews**: Add user rating and book review systems
- **Email Notifications**: Send email alerts for request updates
- **Authentication**: Implement JWT-based authentication with refresh tokens

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