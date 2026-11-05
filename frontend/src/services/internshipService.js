import api from "./axios";

export const getInternships = async () => {
    const response = await api.get("/internships");
    return response.data;
};

export const getInternshipById = async (id) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
};

export const getAllInternships = async () => {
    const response = await api.get("/internships/admin/all");
    return response.data;
};

export const createInternship = async (internshipData) => {
    const response = await api.post("/internships", internshipData);
    return response.data;
}

export const updateInternship = async (internshipId, internshipData) => {
    const response = await api.patch(`/internships/${internshipId}`, internshipData);
    return response.data;
}

export const deleteInternship = async (internshipId) => {
    const response = await api.delete(`/internships/${internshipId}`);
    return response.data;
};