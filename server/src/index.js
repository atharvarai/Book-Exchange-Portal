const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { initializeData } = require('./data');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Initialize data store
initializeData();

// Root route for API info
app.get('/', (req, res) => {
    res.json({
        message: 'Book Exchange API',
        version: '1.0',
        endpoints: {
            auth: '/api/auth',
            books: '/api/books',
            requests: '/api/requests'
        }
    });
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 