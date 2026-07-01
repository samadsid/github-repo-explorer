import { Box, Button, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { Pagination } from "../../interfaces/PaginatedResponse";

interface PaginationControlsProps {
    pagination: Pagination;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    sx?: SxProps<Theme>;
}

export default function PaginationControls({
    pagination,
    onPageChange,
    disabled = false,
    sx,
}: PaginationControlsProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                ...sx,
            }}
        >
            <Button
                disabled={!pagination.hasPreviousPage || disabled}
                onClick={() => onPageChange(pagination.page - 1)}
            >
                Previous
            </Button>

            <Typography>
                Page {pagination.page} of{" "}
                {pagination.totalPages ? pagination.totalPages : pagination.page}
            </Typography>

            <Button
                disabled={!pagination.hasNextPage || disabled}
                onClick={() => onPageChange(pagination.page + 1)}
            >
                Next
            </Button>
        </Box>
    );
}
