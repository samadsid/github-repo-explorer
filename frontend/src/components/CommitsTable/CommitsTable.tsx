import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Link,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import type { GithubCommit } from "../../interfaces/GithubCommit";
import type { Pagination } from "../../interfaces/PaginatedResponse";

interface CommitsTableProps {
    commits: GithubCommit[];
    pagination: Pagination | null;
    onPageChange: (page: number) => void;
    onViewComments: (sha: string) => void;
    hasSearched: boolean;
    commitsLoading: boolean;
}

export default function CommitsTable({
    commits,
    pagination,
    onPageChange,
    onViewComments,
    hasSearched,
    commitsLoading
}: CommitsTableProps) {

    if (!hasSearched) {
        return (
            <Alert severity="info">
                Enter a repository owner and name, then click <strong>Search</strong> to view commits.
            </Alert>
        );
    }

    if (commitsLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 6,
                }}
            >
                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Loading commits...
                </Typography>
            </Box>
        );
    }

    if (commits.length === 0) {
        return (
            <Alert severity="info">
                📂

                No commits found

                Try another repository or author.
            </Alert>
        );
    }

    return (


        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                borderRadius: 3,
            }}>
            <Table>
                <TableHead
                    sx={{
                        bgcolor: "primary"
                    }}
                >
                    <TableRow>
                        <TableCell>Author</TableCell>
                        <TableCell>Commit Title</TableCell>
                        <TableCell align="center">
                            Comments
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {commits.map((commit) => (
                        <TableRow
                            key={commit.sha}
                            sx={{
                                "&:nth-of-type(odd)": {
                                    backgroundColor: "action.hover",
                                },
                            }}
                        >
                            <TableCell>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                >
                                    <Avatar
                                        src={commit.author.avatarUrl}
                                        alt={commit.author.username}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            display: "inline-flex",
                                            mr: 1,
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {commit.author.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Link
                                        href={commit.author.profileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {commit.author.username}
                                    </Link>
                                </Stack>
                            </TableCell>

                            <TableCell>
                                {commit.title}
                            </TableCell>

                            <TableCell align="center">
                                {commit.commentCount > 0 ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => onViewComments(commit.sha)}
                                    >
                                        {commit.commentCount}
                                    </Button>
                                ) : (
                                    commit.commentCount
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {
                pagination && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                        }}
                    >
                        <Button
                            disabled={!pagination.hasPreviousPage}
                            onClick={() => onPageChange(pagination.page - 1)}
                        >
                            Previous
                        </Button>

                        <Typography>
                            Page {pagination.page} of {pagination.totalPages ? pagination.totalPages : pagination.page}
                        </Typography>

                        <Button
                            disabled={!pagination.hasNextPage}
                            onClick={() => onPageChange(pagination.page + 1)}
                        >
                            Next
                        </Button>
                    </Box>
                )
            }
        </TableContainer >

    );
}