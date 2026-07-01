export interface RepoRouteParams {
    owner: string;
    repo: string;
}

export interface RepoCommentRouteParams extends RepoRouteParams {
    sha: string;
}