

import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { GithubAuthor } from "../interfaces/GithubAuthor";
import type { GithubComment } from "../interfaces/GithubComment";
import type { GithubCommit } from "../interfaces/GithubCommit";
import apiClient from "./github.api.client";
import type { GetCommentsRequest, GetCommitsRequest } from "../interfaces/GithubRequest";
import type { PaginatedResponse } from "../interfaces/PaginatedResponse";

function unwrapResponse<T>(
    response: AxiosResponse<ApiResponse<T>>
): T {
    return response.data.data;
}

export const githubApi = {

    async getCommits(request: GetCommitsRequest): Promise<PaginatedResponse<GithubCommit>> {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<GithubCommit>>>(`/repos/${request.owner}/${request.repo}/commits`, {
            params: {
                author: request.author,
                page: request.page,
                limit: request.limit,
            },
        });

        return unwrapResponse(response);
    },

    async getAuthors(owner: string, repo: string): Promise<GithubAuthor[]> {
        const response = await apiClient.get<ApiResponse<GithubAuthor[]>>(`/repos/${owner}/${repo}/authors`);
        return unwrapResponse(response);
    },

    async getComments(request: GetCommentsRequest): Promise<PaginatedResponse<GithubComment>> {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<GithubComment>>>(`/repos/${request.owner}/${request.repo}/commits/${request.sha}/comments`, {
            params: {
                page: request.page,
                limit: request.limit,
            },
        });
        return unwrapResponse(response);
    },
};