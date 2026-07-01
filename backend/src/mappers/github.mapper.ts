import { GithubApiComment } from "../interfaces/github/GithubApiComment";
import { GithubApiCommit } from "../interfaces/github/GithubApiCommit";
import { GithubComment } from "../interfaces/domain/GithubComment";
import { GithubCommit } from "../interfaces/domain/GithubCommit";

export function mapCommit(
    commit: GithubApiCommit
): GithubCommit {
    return {
        sha: commit.sha,

        title: commit.commit.message.split("\n", 1)[0],
        commentCount: commit.commit.comment_count,

        author: {
            username: commit.author?.login ?? null,
            avatarUrl: commit.author?.avatar_url ?? null,
            profileUrl: commit.author?.html_url ?? null,
        },

        committer: {
            username: commit.committer?.login ?? null,
            avatarUrl: commit.committer?.avatar_url ?? null,
            profileUrl: commit.committer?.html_url ?? null,
        },
    };
}

export function mapComment(
    comment: GithubApiComment
): GithubComment {
    return {
        commitSha: comment.commit_id,
        username: comment.user?.login ?? null,
        avatarUrl: comment.user?.avatar_url ?? null,
        profileUrl: comment.user?.html_url ?? null,
        body: comment.body,
        htmlUrl: comment.html_url,
    };
}