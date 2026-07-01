import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Paper,
    Typography,
} from "@mui/material";
import { useState } from "react";
import RepoSearch from "../components/RepoSearch/RepoSearch";
import type { Repository } from "../interfaces/Repository";
import AuthorFilter from "../components/AuthorFilter/AuthorFilter";
import CommitsTable from "../components/CommitsTable/CommitsTable";
import CommentsModal from "../components/CommentsModal/CommentsModal";
import axios from "axios";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../constants/constants";
import { useCommits } from "../hooks/useCommits";
import { useComments } from "../hooks/useComments";
import { useAuthors } from "../hooks/useAuthors";


const Home = () => {
    const [repository, setRepository] = useState<Repository>({
        owner: "",
        repo: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const {
        commits,
        pagination: commitPagination,
        loading: commitsLoading,
        selectedAuthor,
        setSelectedAuthor,
        fetchCommits,
        reset: resetCommits,
    } = useCommits();

    const {
        comments,
        pagination: commentPagination,
        loading: commentsLoading,
        selectedCommitSha,
        isOpen: isCommentsModalOpen,
        fetchComments,
        open: openComments,
        close: closeComments,
        reset: resetComments,
    } = useComments();

    const {
        authors,
        fetchAuthors,
        reset: resetAuthors,
    } = useAuthors();

    const repositoryRequest = {
        owner: repository.owner,
        repo: repository.repo,
    };

    // API Handlers

    const handleApiError = (error: unknown) => {
        console.error(error);

        if (axios.isAxiosError(error)) {
            setError(error.response?.data.message);
        } else {
            setError("Something went wrong.");
        }
    };

    // Handlers

    const handleSearch = async () => {
        try {
            setHasSearched(true);
            setLoading(true);
            setError(null);

            resetCommits();
            resetComments();

            await Promise.all([
                fetchCommits({
                    owner: repository.owner,
                    repo: repository.repo,
                    page: DEFAULT_PAGE,
                    limit: DEFAULT_LIMIT,
                }),

                fetchAuthors(repository.owner, repository.repo),
            ]);
        } catch (error) {
            handleApiError(error);
            resetAuthors();
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorChange = async (author: string) => {
        try {
            setError(null);

            setSelectedAuthor(author);

            await fetchCommits({
                ...repositoryRequest,
                author: author || undefined,
                page: DEFAULT_PAGE,
                limit: DEFAULT_LIMIT,
            });
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleCommitPageChange = async (page: number) => {
        try {
            setError(null);

            await fetchCommits({
                ...repositoryRequest,
                author: selectedAuthor || undefined,
                page,
                limit: DEFAULT_LIMIT,
            });
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleCloseComments = () => {
        closeComments();
    };

    const handleViewComments = async (sha: string) => {
        try {
            setError(null);

            openComments(sha);

            await fetchComments({
                ...repositoryRequest,
                sha,
                page: DEFAULT_PAGE,
                limit: DEFAULT_LIMIT,
            });
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleCommentPageChange = async (page: number) => {
        if (!selectedCommitSha) {
            return;
        }

        try {
            setError(null);

            await fetchComments({
                ...repositoryRequest,
                sha: selectedCommitSha,
                page,
                limit: DEFAULT_LIMIT,
            });
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Box sx={{ textAlign: "center", mb: 5 }}>
                    <Typography
                        variant="h3"
                        gutterBottom
                    >
                        GitHub Repository Explorer
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Search a repository, browse commits, filter by author, and inspect commit comments.
                    </Typography>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                    }}
                >
                    <RepoSearch
                        repository={repository}
                        onRepositoryChange={setRepository}
                        onSearch={handleSearch}
                        loading={loading}
                    />
                </Paper>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    !error &&
                    <>
                        {authors.length > 0 && (
                            <AuthorFilter
                                authors={authors}
                                selectedAuthor={selectedAuthor}
                                onAuthorChange={handleAuthorChange}
                            />
                        )}
                        <CommitsTable
                            commits={commits}
                            pagination={commitPagination}
                            onPageChange={handleCommitPageChange}
                            onViewComments={handleViewComments}
                            hasSearched={hasSearched}
                            commitsLoading={commitsLoading}
                        />
                    </>
                )}

                <CommentsModal
                    open={isCommentsModalOpen}
                    comments={comments}
                    pagination={commentPagination}
                    commentsLoading={commentsLoading}
                    onPageChange={handleCommentPageChange}
                    onClose={handleCloseComments}
                />
            </Box>
        </Container>
    );


}

export default Home;
