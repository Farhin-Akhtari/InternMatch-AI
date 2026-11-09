import api from "./axios";

export const registerUser = async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post("/users/login", userData);
    return response.data;
};

export const refreshAccessToken = async () => {
    const response = await api.post("/users/refresh-token");
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/users/current-user");
    return response.data;
};


export const updateUserProfile = async (profileData) => {
    const response = await api.patch("/users/update-profile", profileData);
    return response.data;
};


export const logoutUser = async () => {
    const response = await api.post("/users/logout");
    return response.data;
};


export const registerCompanyAdmin = async (userData) => {
    const response = await api.post("/users/register/company-admin", userData);
    return response.data;
};


export const resendCompanyVerificationEmail = async (email) => {
    const response = await api.post(
        "/users/resend-company-verification",
        { email }
    );

    return response.data;
};


export const verifyCompanyEmail = async (token) => {
    const response = await api.post(
        "/users/verify-company-email",
        { token }
    );

    return response.data;
};
