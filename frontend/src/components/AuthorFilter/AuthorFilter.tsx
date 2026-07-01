import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import type { GithubAuthor } from "../../interfaces/GithubAuthor";
import UserAvatar from "../UserAvatar/UserAvatar";

interface AuthorFilterProps {
    authors: GithubAuthor[];
    selectedAuthor: string;
    onAuthorChange: (author: string) => void;
}

export default function AuthorFilter({
    authors,
    selectedAuthor,
    onAuthorChange,
}: AuthorFilterProps) {
    const handleChange = (event: SelectChangeEvent) => {
        onAuthorChange(event.target.value);
    };

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
            }}
        >
            <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
            >
                Filter Commits
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="author-filter-label">
                    Author
                </InputLabel>

                <Select
                    labelId="author-filter-label"
                    value={selectedAuthor}
                    label="Author"
                    onChange={handleChange}
                    disabled={authors.length === 0}
                >
                    <MenuItem value="">
                        All Authors
                    </MenuItem>

                    {authors.map((author) => (
                        <MenuItem
                            key={author.username}
                            value={author.username}
                        >
                            <UserAvatar
                                username={author.username}
                                avatarUrl={author.avatarUrl}
                                sx={{}}
                            />
                            {author.username} • {author.commitCount} commits
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Paper>
    );
}