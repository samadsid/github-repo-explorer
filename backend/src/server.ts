import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { env } from "./config/env";


const PORT = Number(env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});