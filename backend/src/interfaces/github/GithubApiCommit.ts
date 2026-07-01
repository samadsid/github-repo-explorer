export interface GithubApiCommit {
    sha: string;

    commit: {
        message: string;
        comment_count: number;
    };

    author: {
        login: string;
        avatar_url: string;
        html_url: string;
    } | null;

    committer: {
        login: string;
        avatar_url: string;
        html_url: string;
    } | null;
}