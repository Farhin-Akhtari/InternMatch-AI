import api from "./axios";

export const checkBackendHealth = async () => {
    return api.get("/api/v1/health");
};