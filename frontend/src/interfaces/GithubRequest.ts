export interface GetCommitsRequest {
    owner: string;
    repo: string;
    author?: string;
    page: number;
    limit: number;
}

export interface GetCommentsRequest {
    owner: string;
    repo: string;
    sha: string;
    page: number;
    limit: number;
}