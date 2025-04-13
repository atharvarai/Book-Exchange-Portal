const {
    getAllRequests,
    getRequest,
    getRequestsByOwner,
    getRequestsBySeeker,
    addRequest,
    updateRequest
} = require('../data');
const { generateId } = require('../utils');

/**
 * Get all requests
 */
const getAllRequestsController = (req, res) => {
    try {
        const requests = getAllRequests();
        return res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error in getAllRequests:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get requests',
            error: error.message
        });
    }
};

/**
 * Get requests by owner
 */
const getRequestsByOwnerController = (req, res) => {
    try {
        const { ownerId } = req.params;
        const requests = getRequestsByOwner(ownerId);

        return res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error in getRequestsByOwner:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get requests by owner',
            error: error.message
        });
    }
};

/**
 * Get requests by seeker
 */
const getRequestsBySeekerController = (req, res) => {
    try {
        const { seekerId } = req.params;
        const requests = getRequestsBySeeker(seekerId);

        return res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error in getRequestsBySeeker:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get requests by seeker',
            error: error.message
        });
    }
};

/**
 * Create a new request
 */
const createRequestController = (req, res) => {
    try {
        const { bookId, seekerId, requestType, exchangeOffer } = req.body;

        const newRequest = {
            id: generateId(),
            bookId,
            seekerId,
            requestType,
            status: 'pending',
            exchangeOffer,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const request = addRequest(newRequest);

        return res.status(201).json({
            success: true,
            message: 'Request created successfully',
            data: request
        });
    } catch (error) {
        console.error('Error in createRequest:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create request',
            error: error.message
        });
    }
};

/**
 * Update a request
 */
const updateRequestController = (req, res) => {
    try {
        const { id } = req.params;
        const requestData = req.body;

        // Check if request exists
        const existingRequest = getRequest(id);
        if (!existingRequest) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Update request
        const updatedRequest = {
            ...existingRequest,
            ...requestData,
            updatedAt: new Date()
        };

        const request = updateRequest(id, updatedRequest);

        return res.status(200).json({
            success: true,
            message: 'Request updated successfully',
            data: request
        });
    } catch (error) {
        console.error('Error in updateRequest:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update request',
            error: error.message
        });
    }
};

module.exports = {
    getAllRequests: getAllRequestsController,
    getRequestsByOwner: getRequestsByOwnerController,
    getRequestsBySeeker: getRequestsBySeekerController,
    createRequest: createRequestController,
    updateRequest: updateRequestController
}; 