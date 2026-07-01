import {
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
    CircularProgress,
    DialogActions
} from "@mui/material";

import type { GithubComment } from "../../interfaces/GithubComment";
import type { Pagination } from "../../interfaces/PaginatedResponse";
import UserAvatar from "../UserAvatar/UserAvatar";
import PaginationControls from "../Pagination/PaginationControls";

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
                                    <UserAvatar
                                        username={comment.username}
                                        avatarUrl={comment.avatarUrl}
                                        sx={{}}
                                    />
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
                <DialogActions sx={{ px: 3 }}>
                    <PaginationControls
                        pagination={pagination}
                        onPageChange={onPageChange}
                        disabled={commentsLoading}
                        sx={{ mt: 0, width: "100%" }}
                    />
                </DialogActions>
            )}
        </Dialog>
    );
}