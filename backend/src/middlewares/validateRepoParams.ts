import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import {
    RepoCommentRouteParams,
    RepoRouteParams,
} from "../interfaces/request/RouteParams";

function validateRepository(owner: string, repo: string): void {
    if (!owner?.trim()) {
        throw new ApiError(
            400,
            ERROR_MESSAGES.REPOSITORY_OWNER_REQUIRED
        );
    }

    if (!repo?.trim()) {
        throw new ApiError(
            400,
            ERROR_MESSAGES.REPOSITORY_NAME_REQUIRED
        );
    }
}

export const validateRepoParams = (
    req: Request<RepoRouteParams>,
    res: Response,
    next: NextFunction
) => {
    const { owner, repo } = req.params;

    validateRepository(owner, repo);

    next();
};

export const validateRepoCommentParams = (
    req: Request<RepoCommentRouteParams>,
    res: Response,
    next: NextFunction
) => {
    const { owner, repo, sha } = req.params;

    validateRepository(owner, repo);

    if (!sha?.trim()) {
        throw new ApiError(
            400,
            ERROR_MESSAGES.COMMIT_ID_REQUIRED
        );
    }

    next();
};