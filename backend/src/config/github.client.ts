import axios from "axios";
import { env } from "./env";

const githubClient = axios.create({
    baseURL: env.GITHUB_API,
    timeout: 10000,
    headers: {
        Accept: "application/vnd.github+json",
        ...(env.GITHUB_TOKEN && {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        }),
    },
});

export default githubClient;