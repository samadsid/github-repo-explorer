import {
    Alert,
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
import UserAvatar from "../UserAvatar/UserAvatar";
import PaginationControls from "../Pagination/PaginationControls";

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
                                    <UserAvatar
                                        username={commit.author.username}
                                        avatarUrl={commit.author.avatarUrl}
                                    />
                                    <Link
                                        href={commit.author.profileUrl ?? "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {commit.author.username ?? "Unknown User"}
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
            {pagination && (
                <PaginationControls
                    pagination={pagination}
                    onPageChange={onPageChange}
                />
            )}
        </TableContainer >

    );
}