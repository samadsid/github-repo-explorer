import {
    Avatar,
    Dialog,
    DialogContent,
    DialogTitle,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Box,
    Button,
    CircularProgress,
    DialogActions
} from "@mui/material";

import type { GithubComment } from "../../interfaces/GithubComment";
import type { Pagination } from "../../interfaces/PaginatedResponse";

interface CommentsModalProps {
    open: boolean;
    comments: GithubComment[];
    pagination: Pagination | null;
    onPageChange: (page: number) => void;
    onClose: () => void;
    commentsLoading: boolean
}

export default function CommentsModal({
    open,
    comments,
    pagination,
    onPageChange,
    onClose,
    commentsLoading
}: CommentsModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Commit Comments
            </DialogTitle>

            <DialogContent>
                {commentsLoading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 200,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : comments.length === 0 ? (
                    <Typography>No comments available.</Typography>
                ) : (
                    <List>
                        {comments.map((comment) => (
                            <ListItem key={comment.htmlUrl} divider>
                                <ListItemAvatar>
                                    <Avatar src={comment.avatarUrl ?? undefined}>
                                        {comment.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={
                                        <Link
                                            href={comment.profileUrl ?? "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"

                                        >
                                            {comment.username ?? "Unknown User"}
                                        </Link>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                            >
                                                {comment.body}
                                            </Typography>

                                            <br />

                                            <Link
                                                href={comment.htmlUrl ?? "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View on GitHub
                                            </Link>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            {pagination && (
                <DialogActions
                    sx={{
                        justifyContent: "space-between",
                        px: 3,
                    }}
                >
                    <Button
                        disabled={!pagination.hasPreviousPage || commentsLoading}
                        onClick={() => onPageChange(pagination.page - 1)}
                    >
                        Previous
                    </Button>

                    <Typography>
                        Page {pagination.page} of {pagination.totalPages ? pagination.totalPages : pagination.page}
                    </Typography>

                    <Button
                        disabled={!pagination.hasNextPage || commentsLoading}
                        onClick={() => onPageChange(pagination.page + 1)}
                    >
                        Next
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}