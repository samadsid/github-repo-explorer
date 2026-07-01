export interface GithubCommit {
    sha: string;
    title: string;
    commentCount: number;

    author: {
        username: string;
        avatarUrl: string;
        profileUrl: string;
    };

    committer: {
        username: string;
        avatarUrl: string;
        profileUrl: string;
    };
}