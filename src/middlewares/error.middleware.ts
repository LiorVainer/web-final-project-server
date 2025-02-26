import {NextFunction, Request, Response} from "express";

export const handleErrorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log the error for debugging purposes
    console.error(err.stack);

    console.log("Got here")

    // Check if the headers have already been sent
    if (res.headersSent) {
        return next(err);
    }

    // Customize error response based on environment
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        // Optionally include the stack trace only in development mode
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};