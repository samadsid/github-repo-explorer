import express from "express";
import cors from "cors";
import helmet from "helmet";

// Routes Import
import githubRoutes from "./routes/github.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();

app.use(helmet());

app.use(cors({ origin: env.CORS_ORIGIN }));

app.use(express.json());

app.get("/health", (_, res) => {
    res.json({
        success: true,
        message: "Server is running",
    });
});

app.use("/api/repos", githubRoutes);


app.use(errorMiddleware);

export default app;