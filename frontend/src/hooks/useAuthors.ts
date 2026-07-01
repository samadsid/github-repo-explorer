import { useState } from "react";
import { githubApi } from "../api/github.api";
import type { GithubAuthor } from "../interfaces/GithubAuthor";

export function useAuthors() {
    const [authors, setAuthors] = useState<GithubAuthor[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAuthors = async (
        owner: string,
        repo: string
    ): Promise<void> => {
        setLoading(true);
        try {
            const result = await githubApi.getAuthors(owner, repo);

            setAuthors(result);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setAuthors([]);
    };

    return {
        authors,
        loading,
        fetchAuthors,
        reset,
    };
}
