export interface GithubComment {
    commitSha: string;

    username: string | null;

    avatarUrl: string | null;

    profileUrl: string | null;

    body: string;

    htmlUrl: string;
}