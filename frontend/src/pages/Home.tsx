import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Paper,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { githubApi } from "../api/github.api";
import type { GithubCommit } from "../interfaces/GithubCommit";
import type { GithubAuthor } from "../interfaces/GithubAuthor";
import type { GithubComment } from "../interfaces/GithubComment";
import RepoSearch from "../components/RepoSearch/RepoSearch";
import type { Repository } from "../interfaces/Repository";
import AuthorFilter from "../components/AuthorFilter/AuthorFilter";
import CommitsTable from "../components/CommitsTable/CommitsTable";
import CommentsModal from "../components/CommentsModal/CommentsModal";
import axios from "axios";
import type { Pagination } from "../interfaces/PaginatedResponse";
import type { GetCommentsRequest, GetCommitsRequest } from "../interfaces/GithubRequest";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../constants/constants";


const Home = () => {
    const [repository, setRepository] = useState<Repository>({
        owner: "",
        repo: "",
    });

    // Commits
    const [commits, setCommits] = useState<GithubCommit[]>([]);
    const [commitPagination, setCommitPagination] =
        useState<Pagination | null>(null);



    // Comments
    const [comments, setComments] = useState<GithubComment[]>([]);
    const [commentPagination, setCommentPagination] =
        useState<Pagination | null>(null);

    const [authors, setAuthors] = useState<GithubAuthor[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState("");


    const [loading, setLoading] = useState(false);
    const [commitsLoading, setCommitsLoading] = useState(false);

    const [commentsLoading, setCommentsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [hasSearched, setHasSearched] = useState(false);


    const [selectedCommitSha, setSelectedCommitSha] = useState<string | null>(null);

    const isCommentsModalOpen = selectedCommitSha !== null;

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

    const fetchCommits = async (
        request: GetCommitsRequest
    ): Promise<void> => {
        const response = await githubApi.getCommits(request);

        setCommits(response.items);
        setCommitPagination(response.pagination);
    };

    const fetchComments = async (
        request: GetCommentsRequest
    ): Promise<void> => {
        const response = await githubApi.getComments(request);

        setComments(response.items);
        setCommentPagination(response.pagination);
    };


    // Handlers

    const handleSearch = async () => {
        try {
            setHasSearched(true)
            setLoading(true);
            setError(null);

            setCommits([]);
            setCommitPagination(null);

            setComments([]);
            setCommentPagination(null);

            setSelectedCommitSha(null);

            setSelectedAuthor("");

            const [_, authors] = await Promise.all([
                fetchCommits({
                    owner: repository.owner,
                    repo: repository.repo,
                    page: DEFAULT_PAGE,
                    limit: DEFAULT_LIMIT,
                }),

                githubApi.getAuthors(
                    repository.owner,
                    repository.repo
                )

            ])


            setAuthors(authors);

        } catch (error) {
            handleApiError(error)
            setAuthors([]);

        } finally {
            setLoading(false);
        }
    };

    const handleAuthorChange = async (author: string) => {
        try {
            setCommitsLoading(true);
            setError(null);

            setSelectedAuthor(author);

            await fetchCommits({
                ...repositoryRequest,
                author: author || undefined,
                page: DEFAULT_PAGE,
                limit: DEFAULT_LIMIT,
            });
        } catch (error) {
            handleApiError(error)

        } finally {
            setLoading(false);
            setCommitsLoading(false);
        }
    };

    const handleCommitPageChange = async (page: number) => {
        try {
            setCommitsLoading(true);
            setError(null);

            await fetchCommits({
                ...repositoryRequest,
                author: selectedAuthor || undefined,
                page,
                limit: DEFAULT_LIMIT,
            });
        } catch (error) {
            handleApiError(error)
        } finally {
            setCommitsLoading(false);
        }
    };




    const handleCloseComments = () => {
        setSelectedCommitSha(null);
        setComments([])
        setCommentPagination(null);
    };

    const handleViewComments = async (sha: string) => {
        try {
            setCommentsLoading(true);
            setError(null);

            setSelectedCommitSha(sha);

            await fetchComments({
                ...repositoryRequest,
                sha,
                page: DEFAULT_PAGE,
                limit: DEFAULT_LIMIT,
            });
        } catch (error) {
            handleApiError(error)
        } finally {
            setCommentsLoading(false);
        }
    };


    const handleCommentPageChange = async (page: number) => {

        if (!selectedCommitSha) {
            return;
        }

        try {
            setCommentsLoading(true);
            setError(null);

            await fetchComments({
                ...repositoryRequest,
                sha: selectedCommitSha,
                page,
                limit: DEFAULT_LIMIT,
            });
        } catch (error) {
            handleApiError(error)
        } finally {
            setCommentsLoading(false);
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