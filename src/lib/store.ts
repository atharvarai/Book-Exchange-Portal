import { User, Book, BookRequest } from '../types';

const isClient = typeof window !== 'undefined';

class Store {
    private users: Map<string, User>;
    private books: Map<string, Book>;
    private requests: Map<string, BookRequest>;
    private static instance: Store;

    private constructor() {
        this.users = new Map();
        this.books = new Map();
        this.requests = new Map();

        if (isClient) {
            // Only try to load from localStorage in the browser
            try {
                const storedUsers = localStorage.getItem('users');
                const storedBooks = localStorage.getItem('books');
                const storedRequests = localStorage.getItem('requests');

                if (storedUsers) {
                    this.users = new Map(JSON.parse(storedUsers));
                }
                if (storedBooks) {
                    this.books = new Map(JSON.parse(storedBooks));
                }
                if (storedRequests) {
                    this.requests = new Map(JSON.parse(storedRequests));
                }
            } catch (error) {
                console.error('Error loading data from localStorage:', error);
            }
        }
    }

    static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    // User methods
    addUser(user: User): void {
        this.users.set(user.id, user);
        this.persistUsers();
    }

    getUser(id: string): User | undefined {
        return this.users.get(id);
    }

    getUserByEmail(email: string): User | undefined {
        return Array.from(this.users.values()).find(user => user.email === email);
    }

    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    // Book methods
    addBook(book: Book): void {
        this.books.set(book.id, book);
        this.persistBooks();
    }

    getBook(id: string): Book | undefined {
        return this.books.get(id);
    }

    updateBook(id: string, book: Book): void {
        this.books.set(id, book);
        this.persistBooks();
    }

    deleteBook(id: string): boolean {
        const result = this.books.delete(id);
        if (result) {
            this.persistBooks();
        }
        return result;
    }

    getAllBooks(): Book[] {
        return Array.from(this.books.values());
    }

    getBooksByOwner(ownerId: string): Book[] {
        const books = Array.from(this.books.values()).filter((book: Book) => book.ownerId === ownerId);
        return books;
    }

    getAvailableBooks(): Book[] {
        return Array.from(this.books.values()).filter((book: Book) => book.status === 'available');
    }

    private persistUsers(): void {
        if (isClient) {
            try {
                localStorage.setItem('users', JSON.stringify(Array.from(this.users.entries())));
            } catch (error) {
                console.error('Error saving users to localStorage:', error);
            }
        }
    }

    private persistBooks(): void {
        if (isClient) {
            try {
                localStorage.setItem('books', JSON.stringify(Array.from(this.books.entries())));
            } catch (error) {
                console.error('Error saving books to localStorage:', error);
            }
        }
    }

    private persistRequests(): void {
        if (isClient) {
            localStorage.setItem('requests', JSON.stringify(Array.from(this.requests.entries())));
        }
    }

    // Request methods
    addRequest(request: BookRequest): void {
        this.requests.set(request.id, request);
        this.persistRequests();
    }

    getRequest(id: string): BookRequest | undefined {
        return this.requests.get(id);
    }

    updateRequest(id: string, request: BookRequest): void {
        this.requests.set(id, request);
        this.persistRequests();
    }

    getRequestsByOwner(ownerId: string): BookRequest[] {
        return Array.from(this.requests.values()).filter(request => {
            const book = this.books.get(request.bookId);
            // Only include pending requests (exclude rejected and accepted)
            return book && book.ownerId === ownerId && request.status === 'pending';
        });
    }

    getRequestsBySeeker(seekerId: string): BookRequest[] {
        // For seekers, show all of their requests (including accepted ones)
        return Array.from(this.requests.values()).filter(request => request.seekerId === seekerId);
    }
}

export const store = Store.getInstance(); 