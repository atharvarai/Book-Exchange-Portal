const { addUser, getUserByEmail } = require('../data');
const { generateId } = require('../utils');

/**
 * Register a new user
 */
const register = (req, res) => {
    try {
        const { name, email, password, role, mobileNumber } = req.body;

        // Check if user already exists
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const newUser = {
            id: generateId(),
            name,
            email,
            password, // In a real app, you would hash this password
            role,
            mobileNumber,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save user
        const user = addUser(newUser);

        // Remove password before sending response
        const { password: _, ...userWithoutPassword } = user;

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error in register:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: error.message
        });
    }
};

/**
 * Login a user
 */
const login = (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        if (user.password !== password) {  // In a real app, you would compare hashed passwords
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Remove password before sending response
        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error.message
        });
    }
};

/**
 * Logout a user
 */
const logout = (req, res) => {
    // In a simple implementation without sessions or tokens, 
    // there's nothing to do server-side for logout
    return res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

module.exports = {
    register,
    login,
    logout
}; 