const {
    getAllBooks,
    getBook,
    getBooksByOwner,
    getAvailableBooks,
    addBook,
    updateBook,
    deleteBook
} = require('../data');
const { generateId } = require('../utils');

/**
 * Get all books
 */
const getAllBooksController = (req, res) => {
    try {
        const books = getAllBooks();
        return res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error('Error in getAllBooks:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get books',
            error: error.message
        });
    }
};

/**
 * Get a single book
 */
const getBookController = (req, res) => {
    try {
        const { id } = req.params;
        const book = getBook(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Error in getBook:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get book',
            error: error.message
        });
    }
};

/**
 * Get books by owner
 */
const getBooksByOwnerController = (req, res) => {
    try {
        const { ownerId } = req.params;
        const books = getBooksByOwner(ownerId);

        return res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error('Error in getBooksByOwner:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get books by owner',
            error: error.message
        });
    }
};

/**
 * Get available books
 */
const getAvailableBooksController = (req, res) => {
    try {
        const books = getAvailableBooks();

        return res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error('Error in getAvailableBooks:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get available books',
            error: error.message
        });
    }
};

/**
 * Create a new book
 */
const createBookController = (req, res) => {
    try {
        const { title, author, genre, location, contactInfo, ownerId } = req.body;

        const newBook = {
            id: generateId(),
            title,
            author,
            genre,
            location,
            contactInfo,
            ownerId,
            status: 'available',
            options: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const book = addBook(newBook);

        return res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });
    } catch (error) {
        console.error('Error in createBook:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create book',
            error: error.message
        });
    }
};

/**
 * Update a book
 */
const updateBookController = (req, res) => {
    try {
        const { id } = req.params;
        const bookData = req.body;

        // Check if book exists
        const existingBook = getBook(id);
        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Update book
        const updatedBook = {
            ...existingBook,
            ...bookData,
            updatedAt: new Date()
        };

        const book = updateBook(id, updatedBook);

        return res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: book
        });
    } catch (error) {
        console.error('Error in updateBook:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update book',
            error: error.message
        });
    }
};

/**
 * Delete a book
 */
const deleteBookController = (req, res) => {
    try {
        const { id } = req.params;

        // Check if book exists
        const existingBook = getBook(id);
        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Delete book
        const result = deleteBook(id);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete book'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteBook:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete book',
            error: error.message
        });
    }
};

/**
 * Update book status
 */
const updateBookStatusController = (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if book exists
        const existingBook = getBook(id);
        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Update book status
        const updatedBook = {
            ...existingBook,
            status,
            updatedAt: new Date()
        };

        const book = updateBook(id, updatedBook);

        return res.status(200).json({
            success: true,
            message: 'Book status updated successfully',
            data: book
        });
    } catch (error) {
        console.error('Error in updateBookStatus:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update book status',
            error: error.message
        });
    }
};

/**
 * Update book options
 */
const updateBookOptionsController = (req, res) => {
    try {
        const { id } = req.params;
        const { options } = req.body;

        // Check if book exists
        const existingBook = getBook(id);
        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Update book options
        const updatedBook = {
            ...existingBook,
            options,
            updatedAt: new Date()
        };

        const book = updateBook(id, updatedBook);

        return res.status(200).json({
            success: true,
            message: 'Book options updated successfully',
            data: book
        });
    } catch (error) {
        console.error('Error in updateBookOptions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update book options',
            error: error.message
        });
    }
};

module.exports = {
    getAllBooks: getAllBooksController,
    getBook: getBookController,
    getBooksByOwner: getBooksByOwnerController,
    getAvailableBooks: getAvailableBooksController,
    createBook: createBookController,
    updateBook: updateBookController,
    deleteBook: deleteBookController,
    updateBookStatus: updateBookStatusController,
    updateBookOptions: updateBookOptionsController
}; 