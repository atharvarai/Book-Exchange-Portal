'use client';

import React, { useState } from 'react';
import { Book, BookOption, User, ExchangeOffer, BookStatus, BookRequest } from '@/types';
import Button from './Button';

interface BookCardProps {
    book: Book;
    currentUser: User;
    onRequestBook: (bookId: string, requestType: BookOption, exchangeOffer?: ExchangeOffer) => void;
    onUpdateStatus: (bookId: string, newStatus: BookStatus) => void;
    onUpdateOptions: (bookId: string, options: BookOption[]) => void;
    requests?: BookRequest[];
}

const BookCard: React.FC<BookCardProps> = ({
    book,
    currentUser,
    onRequestBook,
    onUpdateStatus,
    onUpdateOptions,
    requests = [],
}) => {
    const [showExchangeForm, setShowExchangeForm] = useState(false);
    const [requestSent, setRequestSent] = useState<BookOption | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [exchangeOffer, setExchangeOffer] = useState<ExchangeOffer>({
        bookTitle: '',
        bookAuthor: '',
    });

    const isOwner = currentUser.id === book.ownerId;
    const isAvailable = book.status === 'available';

    // Check if the user has already been rejected for this book
    const hasBeenRejected = requests.some(
        request => request.bookId === book.id &&
            request.seekerId === currentUser.id &&
            request.status === 'rejected'
    );

    // Check if a specific option has been rejected
    const getRejectedStatus = (option: BookOption): boolean => {
        return requests.some(
            request => request.bookId === book.id &&
                request.seekerId === currentUser.id &&
                request.status === 'rejected' &&
                request.requestType === option
        );
    };

    // Check if a specific option has been accepted
    const getAcceptedStatus = (option: BookOption): boolean => {
        return requests.some(
            request => request.bookId === book.id &&
                request.seekerId === currentUser.id &&
                request.status === 'accepted' &&
                request.requestType === option
        );
    };

    // Check if the user has a pending request for this book
    const hasPendingRequest = requests.some(
        request => request.bookId === book.id &&
            request.seekerId === currentUser.id &&
            request.status === 'pending'
    );

    // Get the specific pending request type if any
    const pendingRequestType = hasPendingRequest ?
        requests.find(request =>
            request.bookId === book.id &&
            request.seekerId === currentUser.id &&
            request.status === 'pending'
        )?.requestType : null;

    const handleRequestClick = (requestType: BookOption) => {
        // Don't allow new request if this specific option has been rejected
        if (getRejectedStatus(requestType)) return;

        onRequestBook(book.id, requestType);
        setRequestSent(requestType);
        setTimeout(() => setRequestSent(null), 3000); // Reset after 3 seconds
    };

    const handleExchangeSubmit = () => {
        // Don't allow new request if this specific option has been rejected
        if (getRejectedStatus('exchange')) return;

        onRequestBook(book.id, 'exchange', exchangeOffer);
        setShowExchangeForm(false);
        setRequestSent('exchange');
        setTimeout(() => setRequestSent(null), 3000);
        setExchangeOffer({ bookTitle: '', bookAuthor: '' });
    };

    // Function to handle option toggles with mutual exclusivity
    const handleOptionToggle = (option: BookOption) => {
        // Don't allow changes if book is not available
        if (!isAvailable) return;

        let newOptions: BookOption[];

        // If giveaway is being selected, remove rent and exchange
        if (option === 'giveaway' && !book.options.includes('giveaway')) {
            newOptions = ['giveaway'];
        }
        // If rent or exchange is being selected, remove giveaway
        else if ((option === 'rent' || option === 'exchange') && !book.options.includes(option)) {
            newOptions = [...book.options.filter(o => o !== 'giveaway'), option];
        }
        // If the option is being deselected
        else {
            newOptions = book.options.filter(o => o !== option);
        }

        onUpdateOptions(book.id, newOptions);
    };

    // Render request buttons conditionally
    const renderRequestButton = (option: BookOption, buttonText: string) => {
        // Check if this specific option has a pending request
        const isThisOptionPending = pendingRequestType === option;
        // Check if this specific option has been rejected
        const isThisOptionRejected = getRejectedStatus(option);
        // Check if this specific option has been accepted
        const isThisOptionAccepted = getAcceptedStatus(option);

        // Button should be disabled if it has a pending request, is rejected, accepted, or was just requested
        const isDisabled = isThisOptionRejected || isThisOptionAccepted || hasPendingRequest || requestSent === option;

        let displayText = buttonText;
        let variant: 'primary' | 'success' | 'danger' | 'secondary' = requestSent === option ? 'success' : 'primary';

        if (isThisOptionRejected) {
            displayText = `${option.charAt(0).toUpperCase() + option.slice(1)} Request Rejected`;
            variant = 'danger';
        } else if (isThisOptionAccepted) {
            displayText = `${option.charAt(0).toUpperCase() + option.slice(1)} Request Accepted`;
            variant = 'success';
        } else if (isThisOptionPending) {
            displayText = `${option.charAt(0).toUpperCase() + option.slice(1)} Request Pending`;
            variant = 'secondary';
        } else if (requestSent === option) {
            displayText = `${option.charAt(0).toUpperCase() + option.slice(1)} Request Sent!`;
            variant = 'success';
        } else if (hasPendingRequest) {
            // If there's a pending request for another option, disable this button but keep its original text
            displayText = buttonText;
            variant = 'primary';
        }

        return (
            <Button
                size="sm"
                variant={variant}
                onClick={() => handleRequestClick(option)}
                className="w-full"
                disabled={isDisabled}
            >
                {displayText}
            </Button>
        );
    };

    const isGiveaway = book.options.includes('giveaway');
    const isRentOrExchange = book.options.includes('rent') || book.options.includes('exchange');

    // Check if this book has an accepted request from this user
    const hasAcceptedRequest = requests.some(
        request => request.bookId === book.id &&
            request.seekerId === currentUser.id &&
            request.status === 'accepted'
    );

    // Determine card appearance based on availability and request status
    let cardClasses = 'rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden';

    if (hasAcceptedRequest && !isOwner) {
        // Books with accepted requests get a success/green highlight for the seeker
        cardClasses += ' bg-green-50 border-2 border-green-200';
    } else if (isAvailable) {
        cardClasses += ' bg-white';
    } else {
        cardClasses += ' bg-gray-100';
    }

    // Get the accepted request type if any
    const acceptedRequestType = hasAcceptedRequest ?
        requests.find(request =>
            request.bookId === book.id &&
            request.seekerId === currentUser.id &&
            request.status === 'accepted'
        )?.requestType : null;

    return (
        <div className={cardClasses}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-gray-600 italic">by {book.author}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {book.options.map(option => (
                            <span
                                key={option}
                                className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                            >
                                {option}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    {book.genre && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Genre:</span> {book.genre}
                        </p>
                    )}
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {book.location}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span>{' '}
                        {hasAcceptedRequest && !isOwner ? (
                            <span className="text-green-600 font-semibold">
                                {acceptedRequestType === 'giveaway' ? 'Yours to keep!' :
                                    acceptedRequestType === 'rent' ? 'Ready for pickup (Rented)' :
                                        'Ready for exchange'}
                            </span>
                        ) : (
                            <span className={`capitalize ${isAvailable ? 'text-green-600' : 'text-gray-500 font-semibold'}`}>
                                {book.status.replace('_', ' ')}
                            </span>
                        )}
                    </p>
                </div>

                {isOwner ? (
                    <div className="space-y-3">
                        <div className="relative">
                            {showTooltip && (
                                <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg w-full z-10">
                                    {isAvailable ? (
                                        isGiveaway ?
                                            "A book set for 'Giveaway' cannot be rented or exchanged." :
                                            "A book set for 'Rent' or 'Exchange' cannot be given away at the same time."
                                    ) : (
                                        "Book is not available for new options. Mark it as available first."
                                    )}
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    key="giveaway"
                                    size="sm"
                                    variant={book.options.includes('giveaway') ? 'primary' : 'secondary'}
                                    onClick={() => handleOptionToggle('giveaway')}
                                    onMouseEnter={() => (isRentOrExchange || !isAvailable) && setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    disabled={!isAvailable}
                                    className={!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                    giveaway
                                </Button>
                                <Button
                                    key="rent"
                                    size="sm"
                                    variant={book.options.includes('rent') ? 'primary' : 'secondary'}
                                    onClick={() => handleOptionToggle('rent')}
                                    onMouseEnter={() => (isGiveaway || !isAvailable) && setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    disabled={!isAvailable}
                                    className={!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                    rent
                                </Button>
                                <Button
                                    key="exchange"
                                    size="sm"
                                    variant={book.options.includes('exchange') ? 'primary' : 'secondary'}
                                    onClick={() => handleOptionToggle('exchange')}
                                    onMouseEnter={() => (isGiveaway || !isAvailable) && setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    disabled={!isAvailable}
                                    className={!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                    exchange
                                </Button>
                            </div>
                        </div>
                        {isAvailable ? (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onUpdateStatus(book.id, 'not_available')}
                                className="w-full"
                            >
                                Mark as Not Available
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => onUpdateStatus(book.id, 'available')}
                                className="w-full"
                            >
                                Mark as Available
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {hasAcceptedRequest && !isOwner ? (
                            // Special actions for books with accepted requests
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-green-800">
                                <h4 className="font-medium mb-2">Contact Information:</h4>
                                <p className="text-sm">{book.contactInfo}</p>
                                <div className="mt-3">
                                    <Button
                                        size="sm"
                                        variant="success"
                                        className="w-full"
                                    >
                                        Contact Owner
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Standard request buttons for available books
                            <>
                                {book.options.includes('giveaway') && isAvailable &&
                                    renderRequestButton('giveaway', 'Get it')
                                }
                                {book.options.includes('rent') && isAvailable &&
                                    renderRequestButton('rent', 'Rent it')
                                }
                                {book.options.includes('exchange') && isAvailable && (
                                    <>
                                        {!showExchangeForm ? (
                                            <Button
                                                size="sm"
                                                variant={getRejectedStatus('exchange') ? 'danger' :
                                                    getAcceptedStatus('exchange') ? 'success' :
                                                        pendingRequestType === 'exchange' ? 'secondary' :
                                                            requestSent === 'exchange' ? 'success' : 'primary'}
                                                onClick={() => !getRejectedStatus('exchange') && !getAcceptedStatus('exchange') && !hasPendingRequest && setShowExchangeForm(true)}
                                                className="w-full"
                                                disabled={getRejectedStatus('exchange') || getAcceptedStatus('exchange') || hasPendingRequest || requestSent === 'exchange'}
                                            >
                                                {getRejectedStatus('exchange') ? 'Exchange Request Rejected' :
                                                    getAcceptedStatus('exchange') ? 'Exchange Request Accepted' :
                                                        pendingRequestType === 'exchange' ? 'Exchange Request Pending' :
                                                            requestSent === 'exchange' ? 'Exchange Request Sent!' : 'Exchange it'}
                                            </Button>
                                        ) : (
                                            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                                <input
                                                    type="text"
                                                    placeholder="Your book title"
                                                    value={exchangeOffer.bookTitle}
                                                    onChange={(e) => setExchangeOffer(prev => ({
                                                        ...prev,
                                                        bookTitle: e.target.value
                                                    }))}
                                                    className="w-full p-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Your book author"
                                                    value={exchangeOffer.bookAuthor}
                                                    onChange={(e) => setExchangeOffer(prev => ({
                                                        ...prev,
                                                        bookAuthor: e.target.value
                                                    }))}
                                                    className="w-full p-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={handleExchangeSubmit}
                                                        className="flex-1"
                                                    >
                                                        Submit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => setShowExchangeForm(false)}
                                                        className="flex-1"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard; 