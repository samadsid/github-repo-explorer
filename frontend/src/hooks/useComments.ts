import { useState } from "react";
import { githubApi } from "../api/github.api";
import type { GithubComment } from "../interfaces/GithubComment";
import type { Pagination } from "../interfaces/PaginatedResponse";
import type { GetCommentsRequest } from "../interfaces/GithubRequest";

export function useComments() {
    const [comments, setComments] = useState<GithubComment[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedCommitSha, setSelectedCommitSha] =
        useState<string | null>(null);

    const isOpen = selectedCommitSha !== null;

    const fetchComments = async (
        request: GetCommentsRequest
    ): Promise<void> => {
        setLoading(true);
        try {
            const response = await githubApi.getComments(request);

            setComments(response.items);
            setPagination(response.pagination);
        } finally {
            setLoading(false);
        }
    };

    const open = (sha: string) => {
        setSelectedCommitSha(sha);
    };

    const close = () => {
        setSelectedCommitSha(null);
        setComments([]);
        setPagination(null);
    };

    return {
        comments,
        pagination,
        loading,
        selectedCommitSha,
        isOpen,
        fetchComments,
        open,
        close,
        reset: close,
    };
}
