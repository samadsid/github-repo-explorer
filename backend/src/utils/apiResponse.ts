import { Response } from "express";

export function sendSuccess<T>(
    res: Response,
    data: T,
    statusCode = 200
) {
    const response: {
        success: true;
        data: T;
        count?: number;
    } = {
        success: true,
        data,
    };

    if (Array.isArray(data)) {
        response.count = data.length;
    }

    return res.status(statusCode).json(response);
}