import { Book, BookRequest } from '../types';
import { BookStatus, BookOption } from '@/types';

const API_URL = 'http://localhost:3001/api';

class BookService {
    // Book methods
    async getAllBooks(): Promise<Book[]> {
        try {
            const response = await fetch(`${API_URL}/books`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    }

    async getBook(id: string): Promise<Book | undefined> {
        try {
            const response = await fetch(`${API_URL}/books/${id}`);
            const data = await response.json();
            return data.success ? data.data : undefined;
        } catch (error) {
            console.error(`Error fetching book ${id}:`, error);
            return undefined;
        }
    }

    async getBooksByOwner(ownerId: string): Promise<Book[]> {
        try {
            const response = await fetch(`${API_URL}/books/owner/${ownerId}`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error(`Error fetching books for owner ${ownerId}:`, error);
            return [];
        }
    }

    async getAvailableBooks(): Promise<Book[]> {
        try {
            const response = await fetch(`${API_URL}/books/available`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching available books:', error);
            return [];
        }
    }

    async getBooksForSeeker(seekerId: string): Promise<Book[]> {
        try {
            // Get all requests for this seeker
            const seekerRequests = await this.getRequestsBySeeker(seekerId);
            const acceptedRequestBookIds = seekerRequests
                .filter(req => req.status === 'accepted')
                .map(req => req.bookId);

            // Get all available books
            const availableBooks = await this.getAvailableBooks();

            // Get all books related to accepted requests
            const acceptedRequestsBooks: Book[] = [];
            for (const bookId of acceptedRequestBookIds) {
                const book = await this.getBook(bookId);
                if (book) {
                    acceptedRequestsBooks.push(book);
                }
            }

            // Combine the lists, avoiding duplicates
            const uniqueBooks = new Map<string, Book>();

            // Add available books
            availableBooks.forEach(book => {
                uniqueBooks.set(book.id, book);
            });

            // Add accepted request books (will overwrite if already in the map)
            acceptedRequestsBooks.forEach(book => {
                uniqueBooks.set(book.id, book);
            });

            return Array.from(uniqueBooks.values());
        } catch (error) {
            console.error(`Error fetching books for seeker ${seekerId}:`, error);
            return [];
        }
    }

    async createBook(bookData: {
        title: string;
        author: string;
        genre?: string;
        location: string;
        contactInfo: string;
        ownerId: string;
    }): Promise<Book | undefined> {
        try {
            const response = await fetch(`${API_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });

            const data = await response.json();
            return data.success ? data.data : undefined;
        } catch (error) {
            console.error('Error creating book:', error);
            return undefined;
        }
    }

    async updateBook(id: string, bookData: Partial<Book>): Promise<Book | undefined> {
        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });

            const data = await response.json();
            return data.success ? data.data : undefined;
        } catch (error) {
            console.error(`Error updating book ${id}:`, error);
            return undefined;
        }
    }

    async deleteBook(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error(`Error deleting book ${id}:`, error);
            return false;
        }
    }

    async updateBookStatus(id: string, status: BookStatus): Promise<Book | undefined> {
        try {
            const response = await fetch(`${API_URL}/books/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();
            return data.success ? data.data : undefined;
        } catch (error) {
            console.error(`Error updating book status ${id}:`, error);
            return undefined;
        }
    }

    async updateBookOptions(id: string, options: BookOption[]): Promise<Book | undefined> {
        try {
            const response = await fetch(`${API_URL}/books/${id}/options`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ options }),
            });

            const data = await response.json();
            return data.success ? data.data : undefined;
        } catch (error) {
            console.error(`Error updating book options ${id}:`, error);
            return undefined;
        }
    }

    async toggleAvailability(id: string): Promise<Book | undefined> {
        try {
            const book = await this.getBook(id);
            if (!book) return undefined;

            const newStatus = book.status === 'available' ? 'not_available' : 'available';
            return await this.updateBookStatus(id, newStatus);
        } catch (error) {
            console.error(`Error toggling availability for book ${id}:`, error);
            return undefined;
        }
    }

    // Request methods
    async getRequestsByOwner(ownerId: string): Promise<BookRequest[]> {
        try {
            const response = await fetch(`${API_URL}/requests/owner/${ownerId}`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error(`Error fetching requests for owner ${ownerId}:`, error);
            return [];
        }
    }

    async getRequestsBySeeker(seekerId: string): Promise<BookRequest[]> {
        try {
            const response = await fetch(`${API_URL}/requests/seeker/${seekerId}`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error(`Error fetching requests for seeker ${seekerId}:`, error);
            return [];
        }
    }

    async addRequest(request: BookRequest): Promise<BookRequest | undefined> {
        try {
            const response = await fetch(`${API_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            const data = await response.json();
            return data.success ? data.data : undefined;
        } catch (error) {
            console.error('Error creating request:', error);
            return undefined;
        }
    }

    async updateRequest(id: string, request: Partial<BookRequest>): Promise<BookRequest | undefined> {
        try {
            const response = await fetch(`${API_URL}/requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            const data = await response.json();
            return data.success ? data.data : undefined;
        } catch (error) {
            console.error(`Error updating request ${id}:`, error);
            return undefined;
        }
    }
}

export const bookService = new BookService(); 