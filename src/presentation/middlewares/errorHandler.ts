import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domains/shared/utils/AppError';
import logger from '../../infrastructure/logger/logger';
import axios from 'axios';

const sendErrorWebhook = async (error: AppError | Error) => {
    try {
        await axios.post(process.env.ERROR_WEBHOOK_URL as string, {
            message: error.message,
            stack: error.stack,
            statusCode: error instanceof AppError ? error.statusCode : 500,
        });
    } catch (webhookError) {
        logger.error('Failed to send error webhook', webhookError);
    }
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
    let errorDetails: any = {};

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        errorMessage = err.message;
        errorDetails = {
            code: err.name,
            details: err.message
        };
    } else {
        errorDetails = {
            code: 'INTERNAL_ERROR',
            details: 'An unexpected error occurred'
        };
    }

    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode: statusCode,
    });

    if (statusCode >= 500) {
        sendErrorWebhook(err);
    }

    if (process.env.NODE_ENV === 'development') {
        errorDetails.stack = err.stack;
    }

    const responseBody = {
        status: 'error',
        message: errorMessage,
        error: errorDetails
    };

    res.status(statusCode).json(responseBody);
};