const errorHandler = (err, req, res, next) => {
   
    let statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV !== "production") {
    console.error("ERROR DETAILS:", err.stack);
   } else if (statusCode >= 500) {
    console.error("Internal server error");
   }
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    // Duplicate unique field, such as email
    if (err.code === 11000) {
        statusCode = 409;
        message = "A record with this value already exists.";
    }

    // Mongoose schema validation errors
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON in request body.";
    errors = [];
   }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed.";
        errors = Object.values(err.errors).map(
            (error) => error.message
        );
    }

    // Invalid MongoDB document ID
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid value provided.";
    }

    // Avoid exposing internal details in production
    if (statusCode >= 500 && process.env.NODE_ENV === "production") {
        message = "Internal Server Error";
        errors = [];
    }

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
    });
};

export { errorHandler };
