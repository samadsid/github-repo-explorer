import axios from "axios";
import { ApiError } from "../errors/ApiError";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export function translateGithubError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
            case 404:
                throw new ApiError(404, ERROR_MESSAGES.REPOSITORY_NOT_FOUND);

            case 403:
                throw new ApiError(403, ERROR_MESSAGES.GITHUB_RATE_LIMIT);

            case 401:
                throw new ApiError(401, ERROR_MESSAGES.GITHUB_AUTHENTICATION_FAILED);

            default:
                throw new ApiError(502, ERROR_MESSAGES.COMMUNICATION_FAILED);
        }
    }

    throw new ApiError(500, ERROR_MESSAGES.UNEXPECTED_ERROR);
}