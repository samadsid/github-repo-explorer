import { AxiosInstance, AxiosResponse } from 'axios';
import githubClient from '../config/github.client';
import { GithubApiCommit } from "../interfaces/github/GithubApiCommit";
import { mapComment, mapCommit } from "../mappers/github.mapper";
import { GithubCommit } from '../interfaces/domain/GithubCommit';
import { GithubAuthor } from '../interfaces/domain/GithubAuthor';
import { GithubApiComment } from '../interfaces/github/GithubApiComment';
import { GithubComment } from '../interfaces/domain/GithubComment';
import { translateGithubError } from '../translators/githubErrorTranslator';
import { PaginatedResponse } from '../interfaces/domain/PaginatedResonse';
import { parseGithubLinkHeader } from '../utils/parseGithubLinkHeader';
import { RepoRouteParams } from '../interfaces/request/RouteParams';
import { CommentFilters, CommitFilters, GetCommentsRequest, GetCommitsRequest, RepositoryRequest } from '../interfaces/request/ServiceRequests';
import { DEFAULT_PAGE, GITHUB_PER_PAGE_LIMIT } from '../constants/constants';


class GithubService {
    constructor(private readonly githubClient: AxiosInstance) { }

    private async fetchCommits(
        request: RepositoryRequest,
        filters?: CommitFilters
    ): Promise<AxiosResponse<GithubApiCommit[]>> {

        try {
            const endpoint = `/repos/${request.owner}/${request.repo}/commits`;
            const response = await this.githubClient.get<GithubApiCommit[]>(endpoint, {
                params: {
                    author: filters?.author,
                    page: filters?.page,
                    per_page: filters?.limit,
                }
            });

            return response;
        } catch (error) {
            translateGithubError(error)
        }


    }

    private async fetchComments(
        request: GetCommentsRequest,
        filters?: CommentFilters
    ): Promise<AxiosResponse<GithubApiComment[]>> {

        try {
            const endpoint = `/repos/${request.owner}/${request.repo}/commits/${request.sha}/comments`;

            const response = await this.githubClient.get<GithubApiComment[]>(endpoint, {
                params: {
                    page: filters?.page,
                    per_page: filters?.limit,
                }
            });

            return response;
        } catch (error) {
            translateGithubError(error)
        }


    }

    async getCommits(query: GetCommitsRequest): Promise<PaginatedResponse<GithubCommit>> {
        const response = await this.fetchCommits(query, {
            author: query.author,
            page: query.page,
            limit: query.limit,
        });

        return {
            items: response.data.map(mapCommit),
            pagination: parseGithubLinkHeader(
                response.headers.link,
                query.page,
                query.limit
            ),
        };
    }

    public async getAuthors(
        query: RepoRouteParams
    ): Promise<GithubAuthor[]> {

        const authors = new Map<string, GithubAuthor>();

        const commits = (await this.fetchCommits(query, {
            page: DEFAULT_PAGE,
            limit: GITHUB_PER_PAGE_LIMIT
        })).data;

        for (const commit of commits) {
            // Skip commits not associated with a GitHub user
            if (!commit.author) {
                continue;
            }

            const existingAuthor = authors.get(commit.author.login);
            if (existingAuthor) {
                existingAuthor.commitCount++;
                continue;
            }

            authors.set(commit.author.login, {
                username: commit.author.login,
                avatarUrl: commit.author.avatar_url,
                profileUrl: commit.author.html_url,
                commitCount: 1,
            });
        }

        return Array.from(authors.values()).sort(
            (a, b) => b.commitCount - a.commitCount
        );

    }

    public async getComments(
        query: GetCommentsRequest
    ): Promise<PaginatedResponse<GithubComment>> {

        const response = await this.fetchComments(query, {
            page: query.page,
            limit: query.limit,
        });

        return {
            items: response.data.map(mapComment),
            pagination: parseGithubLinkHeader(
                response.headers.link,
                query.page,
                query.limit
            ),
        };
    }
}


export const githubService = new GithubService(githubClient);