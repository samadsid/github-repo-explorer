export interface RepositoryRequest {
    owner: string;
    repo: string;
}

export interface CommitFilters {
    author?: string;
    page?: number;
    limit?: number;
}

export interface CommentFilters {
    page?: number;
    limit?: number;
}

export interface GetCommitsRequest extends RepositoryRequest {
    author?: string;
    page: number;
    limit: number;
}

export interface GetCommentsRequest extends RepositoryRequest {
    sha: string;
    page: number;
    limit: number;
}