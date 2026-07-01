import { PaginationMetadata } from "../interfaces/domain/PaginatedResponse";

export function parseGithubLinkHeader(
    linkHeader: string | undefined,
    page: number,
    limit: number
): PaginationMetadata {

    const pagination: PaginationMetadata = {
        page,
        limit,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    if (!linkHeader) {
        return pagination;
    }

    const links = linkHeader.split(",");

    for (const link of links) {

        const [urlPart, relPart] = link.split(";");

        const url = urlPart
            .trim()
            .replace("<", "")
            .replace(">", "");

        const rel = relPart
            .trim()
            .replace('rel="', "")
            .replace('"', "");

        if (rel === "next") {
            pagination.hasNextPage = true;
        }

        if (rel === "prev") {
            pagination.hasPreviousPage = true;
        }

        if (rel === "last") {
            const lastPage = new URL(url).searchParams.get("page");

            if (lastPage) {
                pagination.totalPages = Number(lastPage);
            }
        }
    }

    return pagination;
}