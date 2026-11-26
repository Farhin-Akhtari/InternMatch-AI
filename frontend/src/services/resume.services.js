import api from "./axios";

// Upload or replace student's resume
export const uploadResume = async (formData) => {
    const response = await api.post("/resumes", formData);
    return response.data;
};

// Generate URL to view student's resume
export const viewMyResume = async () => {
    const response = await api.get("/resumes/me");
    return response.data;
};

// Generate URL to download student's resume
export const downloadMyResume = async () => {
    const response = await api.get("/resumes/me/download");
    return response.data;
};

// Delete student's resume
export const deleteStudentOwnResume = async () => {
    const response = await api.delete("/resumes");
    return response.data;
};
