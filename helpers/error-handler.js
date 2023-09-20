function errorHandler(err, req, res, next) {
    if (err && err.name === 'UnauthorizedError') {
        // JWT authentication error
        return res.status(401).json({ message: "The user is not authorized" });
    }

    if (err && err.name === 'ValidationError') {
        // Validation error
        return res.status(401).json({ message: err.message }); 
    }
    
    // Default to 500 server error if 'err' is undefined or has no 'name' property
    return res.status(500).json({ message:err.message});
}

module.exports = errorHandler;
