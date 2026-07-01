import { Router } from "express";
import { githubController } from "../controllers/github.controller";
import {
    validateRepoCommentParams,
    validateRepoParams,
} from "../middlewares/validateRepoParams";
import {
    validateCommentQuery,
    validateCommitQuery,
} from "../middlewares/validateRepoQuery";

const router = Router();

router.get(
    "/:owner/:repo/commits",
    validateRepoParams,
    validateCommitQuery,
    githubController.getCommits
);

router.get(
    "/:owner/:repo/authors",
    validateRepoParams,
    githubController.getAuthors
);

router.get(
    "/:owner/:repo/commits/:sha/comments",
    validateRepoCommentParams,
    validateCommentQuery,
    githubController.getComments
);

export default router;