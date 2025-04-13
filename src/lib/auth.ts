import { User } from '../types';

// Use environment variables or fallback to localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Debug log to verify API URL
console.log('Auth Service API URL:', API_URL);

class AuthService {
    async register(userData: {
        name: string;
        email: string;
        password: string;
        mobileNumber: string;
        role: 'owner' | 'seeker';
    }): Promise<{ success: boolean; message: string; user?: User }> {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Registration failed',
                };
            }

            return {
                success: true,
                message: 'Registration successful',
                user: data.user,
            };
        } catch (error) {
            console.error('Error during registration:', error);
            return {
                success: false,
                message: 'An error occurred during registration',
            };
        }
    }

    async login(credentials: {
        email: string;
        password: string;
    }): Promise<{ success: boolean; message: string; user?: User }> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Login failed',
                };
            }

            return {
                success: true,
                message: 'Login successful',
                user: data.user,
            };
        } catch (error) {
            console.error('Error during login:', error);
            return {
                success: false,
                message: 'An error occurred during login',
            };
        }
    }

    async logout(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Logout failed',
                };
            }

            // Clear user data from localStorage
            localStorage.removeItem('user');

            return {
                success: true,
                message: 'Logout successful',
            };
        } catch (error) {
            console.error('Error during logout:', error);

            // Even if the API call fails, clear the local storage
            localStorage.removeItem('user');

            return {
                success: false,
                message: 'An error occurred during logout',
            };
        }
    }
}

export const authService = new AuthService(); 