import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { CommentQueryParams, CommitQueryParams } from "../interfaces/request/QueryParams";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from "../constants/constants";


function validatePaginationQuery(
    page: unknown,
    limit: unknown
): void {
    const pageNumber = Number(page ?? DEFAULT_PAGE);
    const limitNumber = Number(limit ?? DEFAULT_LIMIT);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
        throw new ApiError(400, ERROR_MESSAGES.INVALID_PAGE);
    }

    if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > MAX_LIMIT
    ) {
        throw new ApiError(400, ERROR_MESSAGES.INVALID_LIMIT);
    }
}

export const validateCommitQuery = (
    req: Request<unknown, unknown, unknown, CommitQueryParams>,
    res: Response,
    next: NextFunction
) => {
    const { page, limit, author } = req.query;

    validatePaginationQuery(page, limit);

    if (author && !author.trim()) {
        throw new ApiError(400, ERROR_MESSAGES.INVALID_AUTHOR);
    }

    next();
};

export const validateCommentQuery = (
    req: Request<unknown, unknown, unknown, CommentQueryParams>,
    res: Response,
    next: NextFunction
) => {
    const { page, limit } = req.query;

    validatePaginationQuery(page, limit);

    next();
};