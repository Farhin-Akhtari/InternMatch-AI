import api from "./axios";

export const applyForInternship = async (internshipId) => {
    const response = await api.post(`/applications/${internshipId}`);
    return response.data;
};

export const applyToInternship = async (id) => {
    const response = await api.post(`/applications/${id}/apply`);
    return response.data;
};

export const getMyApplications = async () => {
    const response = await api.get("/applications/my-applications");
    return response.data;
};

export const getAllApplications = async () => {
    const response = await api.get("/applications/");
    return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
}