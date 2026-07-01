import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
}

const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;