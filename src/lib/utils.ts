export const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateMobileNumber = (number: string): boolean => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(number);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
}; 