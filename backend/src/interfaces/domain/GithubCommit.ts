export interface GithubCommit {
    sha: string;

    title: string;

    commentCount: number;

    author: {
        username: string | null;
        avatarUrl: string | null;
        profileUrl: string | null;
    };

    committer: {
        username: string | null;
        avatarUrl: string | null;
        profileUrl: string | null;
    };
}



