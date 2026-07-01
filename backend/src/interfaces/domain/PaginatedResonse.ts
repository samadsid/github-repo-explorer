export interface PaginationMetadata {
    page: number;
    limit: number;
    totalPages?: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMetadata;
}