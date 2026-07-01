export interface Pagination {
    page: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalPages?: number
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: Pagination;
}