import { useState } from "react";
import { githubApi } from "../api/github.api";
import type { GithubCommit } from "../interfaces/GithubCommit";
import type { Pagination } from "../interfaces/PaginatedResponse";
import type { GetCommitsRequest } from "../interfaces/GithubRequest";

export function useCommits() {
    const [commits, setCommits] = useState<GithubCommit[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState("");

    const fetchCommits = async (
        request: GetCommitsRequest
    ): Promise<void> => {
        setLoading(true);
        try {
            const response = await githubApi.getCommits(request);

            setCommits(response.items);
            setPagination(response.pagination);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setCommits([]);
        setPagination(null);
        setSelectedAuthor("");
    };

    return {
        commits,
        pagination,
        loading,
        selectedAuthor,
        setSelectedAuthor,
        fetchCommits,
        reset,
    };
}
