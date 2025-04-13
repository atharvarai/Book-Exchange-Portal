'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import BookCard from '@/components/BookCard';
import { Book, User, BookOption, BookStatus, BookRequest, ExchangeOffer, RequestStatus } from '@/types';
import { bookService } from '@/lib/books';
import { authService } from '@/lib/auth';
import { generateId } from '@/lib/utils';

interface AddBookFormData {
    title: string;
    author: string;
    genre?: string;
    location: string;
    contactInfo: string;
}

const DashboardPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [requests, setRequests] = useState<BookRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [showRequests, setShowRequests] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<AddBookFormData>({
        title: '',
        author: '',
        genre: '',
        location: '',
        contactInfo: '',
    });

    useEffect(() => {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/auth/login');
            return;
        }

        const fetchData = async () => {
            try {
                const user = JSON.parse(storedUser);
                setUser(user);
                if (user.role === 'owner') {
                    const [ownerBooks, ownerRequests] = await Promise.all([
                        bookService.getBooksByOwner(user.id),
                        bookService.getRequestsByOwner(user.id)
                    ]);
                    setBooks(ownerBooks);
                    setRequests(ownerRequests);
                } else {
                    const [userBooks, seekerRequests] = await Promise.all([
                        bookService.getBooksForSeeker(user.id),
                        bookService.getRequestsBySeeker(user.id)
                    ]);
                    setBooks(userBooks);
                    setRequests(seekerRequests);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                router.push('/auth/login');
            }
        };

        fetchData();
    }, [router]);

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const newBook = await bookService.createBook({
            ...formData,
            ownerId: user.id,
        });

        if (newBook) {
            setBooks(prev => [...prev, newBook]);
            setShowAddForm(false);
            setFormData({
                title: '',
                author: '',
                genre: '',
                location: '',
                contactInfo: '',
            });
        }
    };

    // These functions are used in child components or in future implementations
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleToggleAvailability = async (bookId: string) => {
        const updatedBook = await bookService.toggleAvailability(bookId);
        if (updatedBook) {
            setBooks(prev =>
                prev.map(book => (book.id === bookId ? updatedBook : book))
            );
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDeleteBook = async (bookId: string) => {
        const success = await bookService.deleteBook(bookId);
        if (success) {
            setBooks(prev => prev.filter(book => book.id !== bookId));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !filterLocation ||
            book.location.toLowerCase().includes(filterLocation.toLowerCase());
        return matchesSearch && matchesLocation;
    });

    const handleRequestBook = async (bookId: string, requestType: BookOption, exchangeOffer?: ExchangeOffer) => {
        if (!user) return;

        const newRequest: BookRequest = {
            id: generateId(),
            bookId,
            seekerId: user.id,
            requestType,
            status: 'pending',
            exchangeOffer,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Add to requests store
        const savedRequest = await bookService.addRequest(newRequest);
        if (savedRequest) {
            setRequests(prev => [...prev, savedRequest]);
        }
    };

    const handleUpdateBookStatus = async (bookId: string, newStatus: BookStatus) => {
        const updatedBook = await bookService.updateBookStatus(bookId, newStatus);
        if (updatedBook) {
            setBooks(prev => prev.map(book =>
                book.id === bookId ? updatedBook : book
            ));
        }
    };

    const handleUpdateBookOptions = async (bookId: string, options: BookOption[]) => {
        const updatedBook = await bookService.updateBookOptions(bookId, options);
        if (updatedBook) {
            setBooks(prev => prev.map(book =>
                book.id === bookId ? updatedBook : book
            ));
        }
    };

    const handleRequestResponse = async (requestId: string, accept: boolean) => {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        const updatedRequest = {
            ...request,
            status: accept ? 'accepted' : 'rejected' as RequestStatus,
            updatedAt: new Date(),
        };

        // Store the updated request
        const savedRequest = await bookService.updateRequest(requestId, updatedRequest);

        if (!savedRequest) return;

        if (accept) {
            // If accepted, update the book status
            const newStatus = request.requestType === 'giveaway' ? 'not_available' :
                request.requestType === 'rent' ? 'rented' : 'exchanged';
            await handleUpdateBookStatus(request.bookId, newStatus);

            // Remove the accepted request from the UI
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } else {
            // If rejected, still update the store but remove from UI
            // This ensures it won't appear after refresh
            setRequests(prev => prev.filter(r => r.id !== requestId));
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                {user.role === 'owner' ? 'My Books' : 'Available Books'}
                            </h1>
                            {user.role === 'owner' && (
                                <Button onClick={() => setShowAddForm(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Book
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600 font-medium">
                                Welcome, {user.name}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>

                {showAddForm && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Book</h2>
                        <form onSubmit={handleAddBook} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Genre (optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Information
                                    </label>
                                    <input
                                        type="text"
                                        name="contactInfo"
                                        value={formData.contactInfo}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit">Add Book</Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Filter by location..."
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {user?.role === 'owner' && (
                        <div className="mb-8">
                            <Button
                                onClick={() => setShowRequests(!showRequests)}
                                className="mb-4"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                {showRequests ? 'Hide Requests' : 'Show Requests'}
                            </Button>

                            {showRequests && (
                                <div className="space-y-4">
                                    {requests
                                        .filter(request => {
                                            const book = books.find(b => b.id === request.bookId);
                                            return book && book.ownerId === user.id && request.status !== 'rejected';
                                        })
                                        .map(request => {
                                            const book = books.find(b => b.id === request.bookId);
                                            return (
                                                <div key={request.id} className="bg-gray-50 p-6 rounded-xl shadow-sm">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                Book: {book?.title}
                                                            </h3>
                                                            <p className="text-gray-600 mt-1">Request Type: {request.requestType}</p>
                                                            {request.exchangeOffer && (
                                                                <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                                                                    <p className="font-medium text-blue-900">Exchange Offer:</p>
                                                                    <p className="text-blue-800">Title: {request.exchangeOffer.bookTitle}</p>
                                                                    <p className="text-blue-800">Author: {request.exchangeOffer.bookAuthor}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {request.status === 'pending' && (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="success"
                                                                    onClick={() => handleRequestResponse(request.id, true)}
                                                                >
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="danger"
                                                                    onClick={() => handleRequestResponse(request.id, false)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBooks.map(book => (
                            <BookCard
                                key={book.id}
                                book={book}
                                currentUser={user!}
                                onRequestBook={handleRequestBook}
                                onUpdateStatus={handleUpdateBookStatus}
                                onUpdateOptions={handleUpdateBookOptions}
                                requests={requests}
                            />
                        ))}
                    </div>

                    {books.length === 0 && (
                        <div className="text-center py-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p className="text-xl text-gray-600">
                                {user.role === 'owner'
                                    ? 'You haven\'t added any books yet.'
                                    : 'No books are available at the moment.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 