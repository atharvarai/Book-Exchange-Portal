export type UserRole = 'owner' | 'seeker';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    mobileNumber: string;
    role: UserRole;
}

export type BookOption = 'giveaway' | 'rent' | 'exchange';
export type BookStatus = 'available' | 'not_available' | 'rented' | 'exchanged';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface Book {
    id: string;
    title: string;
    author: string;
    genre?: string;
    location: string;
    contactInfo: string;
    ownerId: string;
    status: BookStatus;
    options: BookOption[];
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    mobileNumber: string;
    role: UserRole;
}

export interface ExchangeOffer {
    bookTitle: string;
    bookAuthor: string;
}

export interface BookRequest {
    id: string;
    bookId: string;
    seekerId: string;
    requestType: BookOption;
    status: RequestStatus;
    exchangeOffer?: ExchangeOffer;
    createdAt: Date;
    updatedAt: Date;
} 