const express = require('express');
const {
    authController,
    bookController,
    requestController
} = require('./controllers');

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Book routes
router.get('/books', bookController.getAllBooks);
router.get('/books/available', bookController.getAvailableBooks);
router.get('/books/owner/:ownerId', bookController.getBooksByOwner);
router.get('/books/:id', bookController.getBook);
router.post('/books', bookController.createBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);
router.put('/books/:id/status', bookController.updateBookStatus);
router.put('/books/:id/options', bookController.updateBookOptions);

// Request routes
router.get('/requests', requestController.getAllRequests);
router.get('/requests/owner/:ownerId', requestController.getRequestsByOwner);
router.get('/requests/seeker/:seekerId', requestController.getRequestsBySeeker);
router.post('/requests', requestController.createRequest);
router.put('/requests/:id', requestController.updateRequest);

module.exports = router; 