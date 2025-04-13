// In-memory data storage
const data = {
    users: new Map(),
    books: new Map(),
    requests: new Map()
};

// Initialize with some sample data
function initializeData() {
    // Sample users
    const users = [
        {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'owner',
            mobileNumber: '1234567890',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            role: 'seeker',
            mobileNumber: '9876543210',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    users.forEach(user => {
        data.users.set(user.id, user);
    });

    // Sample books
    const books = [
        {
            id: 'book1',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic',
            location: 'New York',
            contactInfo: 'john@example.com',
            ownerId: 'user1',
            status: 'available',
            options: ['giveaway'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 'book2',
            title: 'Ramayana',
            author: 'Valmiki',
            genre: 'Indian History',
            location: 'India',
            contactInfo: 'john@example.com',
            ownerId: 'user1',
            status: 'available',
            options: ['rent', 'exchange'],
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    books.forEach(book => {
        data.books.set(book.id, book);
    });

    console.log('Data initialized with sample users and books');
}

// User methods
function addUser(user) {
    data.users.set(user.id, user);
    return user;
}

function getUser(id) {
    return data.users.get(id);
}

function getUserByEmail(email) {
    return Array.from(data.users.values()).find(user => user.email === email);
}

// Book methods
function getAllBooks() {
    return Array.from(data.books.values());
}

function getBook(id) {
    return data.books.get(id);
}

function getBooksByOwner(ownerId) {
    return Array.from(data.books.values()).filter(book => book.ownerId === ownerId);
}

function getAvailableBooks() {
    return Array.from(data.books.values()).filter(book => book.status === 'available');
}

function addBook(book) {
    data.books.set(book.id, book);
    return book;
}

function updateBook(id, book) {
    data.books.set(id, book);
    return book;
}

function deleteBook(id) {
    const result = data.books.delete(id);
    return result;
}

// Request methods
function getAllRequests() {
    return Array.from(data.requests.values());
}

function getRequest(id) {
    return data.requests.get(id);
}

function getRequestsByOwner(ownerId) {
    return Array.from(data.requests.values()).filter(request => {
        const book = data.books.get(request.bookId);
        return book && book.ownerId === ownerId && request.status === 'pending';
    });
}

function getRequestsBySeeker(seekerId) {
    return Array.from(data.requests.values()).filter(request =>
        request.seekerId === seekerId
    );
}

function addRequest(request) {
    data.requests.set(request.id, request);
    return request;
}

function updateRequest(id, request) {
    data.requests.set(id, request);
    return request;
}

module.exports = {
    initializeData,
    addUser,
    getUser,
    getUserByEmail,
    getAllBooks,
    getBook,
    getBooksByOwner,
    getAvailableBooks,
    addBook,
    updateBook,
    deleteBook,
    getAllRequests,
    getRequest,
    getRequestsByOwner,
    getRequestsBySeeker,
    addRequest,
    updateRequest
}; 