import { NextFunction, Request, Response } from "express";
import { githubService } from "../services/github.service";
import { sendSuccess } from "../utils/apiResponse";
import { CommentQueryParams, CommitQueryParams } from "../interfaces/request/QueryParams";
import { RepoCommentRouteParams, RepoRouteParams } from "../interfaces/request/RouteParams";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../constants/constants";


export const githubController = {
    async getCommits(req: Request<
        RepoRouteParams,
        unknown,
        unknown,
        CommitQueryParams
    >, res: Response, next: NextFunction) {
        try {
            const { owner, repo } = req.params;

            const { author } = req.query;
            const page = Number(req.query.page ?? DEFAULT_PAGE);
            const limit = Number(req.query.limit ?? DEFAULT_LIMIT);


            const commits = await githubService.getCommits({
                owner,
                repo,
                author,
                page,
                limit
            });

            sendSuccess(res, commits);

        } catch (error) {
            next(error);
        }
    },

    async getAuthors(req: Request<RepoRouteParams>, res: Response, next: NextFunction) {
        try {
            const { owner, repo } = req.params;

            const authors = await githubService.getAuthors({ owner, repo });

            sendSuccess(res, authors);

        } catch (error) {
            next(error);
        }
    },

    async getComments(req: Request<
        RepoCommentRouteParams,
        unknown,
        unknown,
        CommentQueryParams
    >, res: Response, next: NextFunction) {
        try {
            const { owner, repo, sha } = req.params;

            const page = Number(req.query.page ?? DEFAULT_PAGE);
            const limit = Number(req.query.limit ?? DEFAULT_LIMIT);

            const comments = await githubService.getComments({
                owner,
                repo,
                sha,
                page,
                limit
            });

            sendSuccess(res, comments);

        } catch (error) {
            next(error);
        }
    }
}