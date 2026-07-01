import { Button, Stack, TextField } from "@mui/material";
import type { Repository } from "../../interfaces/Repository";
import type { ChangeEvent } from "react";


interface RepoSearchProps {
    repository: Repository;
    onRepositoryChange: (repository: Repository) => void;
    onSearch: () => void;
    loading: boolean;
}

export default function RepoSearch({
    repository,
    onRepositoryChange,
    onSearch,
    loading,
}: RepoSearchProps) {
    const isSearchDisabled =
        loading ||
        !repository.owner.trim() ||
        !repository.repo.trim();

    const handleOwnerChange = (event: ChangeEvent<HTMLInputElement>) => {
        onRepositoryChange({
            ...repository,
            owner: event.target.value,
        });
    };

    const handleRepoChange = (event: ChangeEvent<HTMLInputElement>) => {
        onRepositoryChange({
            ...repository,
            repo: event.target.value,
        });
    };

    return (

        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSearch();
            }}
        >
            <Stack
                direction="row"
                spacing={2}
            >
                <TextField
                    autoFocus
                    label="Repository Owner"
                    value={repository.owner}
                    onChange={handleOwnerChange}
                    fullWidth
                />

                <TextField
                    label="Repository Name"
                    value={repository.repo}
                    onChange={handleRepoChange}
                    fullWidth
                />

                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        px: 4,
                        whiteSpace: "nowrap",
                    }}
                    type="submit"
                    disabled={isSearchDisabled}
                >
                    Search
                </Button>
            </Stack >
        </form >
    );
}