export interface GithubApiComment {
    id: number;

    body: string;

    html_url: string;

    commit_id: string;

    user: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
}