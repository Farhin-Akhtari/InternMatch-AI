import api from "./axios";

// Save an internship
export const saveInternship = async (internshipId) => {
    const response = await api.post(`/saved-internships/${internshipId}`);
    return response.data;
};

// Get all saved internships of the logged-in student
export const getSavedInternships = async () => {
    const response = await api.get("/saved-internships/retrieve-internships");
    return response.data;
};

// Remove a saved internship
export const removeSavedInternship = async (internshipId) => {
    const response = await api.delete(`/saved-internships/${internshipId}`);
    return response.data;
};
