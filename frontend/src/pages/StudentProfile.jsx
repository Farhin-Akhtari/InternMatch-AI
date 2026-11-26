import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { updateUserProfile } from "../services/authServices";
import { uploadResume, viewMyResume, downloadMyResume, deleteStudentOwnResume } from "../services/resume.services";

function StudentProfile() {
    const {user, setUser, authLoading} = useAuth();
    const editSectionRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    skills: "",
    preferredLocations: "",
    preferredWorkModes: [],
    education: [],
    projects: [],
    professionalLinks: {
        linkedin: "",
        github: "",
        portfolio: "",
    },
    });

    const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    currentlyStudying: false,
    });
    const [editingEducationIndex, setEditingEducationIndex] = useState(null);

    const [projectForm, setProjectForm] = useState({
        title: "",
        description: "",
        technologies: "",
        githubUrl: "",
        liveDemoUrl: "",
    });
    const [editingProjectindex, setEditingProjectIndex] = useState(null);

    const [resume, setResume] = useState(user?.resume || null);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeUploading, setResumeUploading] = useState(false);
    const [resumeDeleting, setResumeDeleting] = useState(false);
    const [resumeMessage, setResumeMessage] = useState("");
    const [resumeError, setResumeError] = useState("");
    const resumeInputRef = useRef(null);

    const professionalLinks = Object.entries(
    user.professionalLinks || {}
    ).filter(([, url]) => url);

   useEffect(() => {
     if (!user) return;

     setResume(user.resume || null);

     setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        skills: user.skills?.join(", ") || "",
        preferredLocations: user.preferredLocations?.join(", ") || "",
        preferredWorkModes: user.preferredWorkModes || [],
        education: user.education || [],
        projects: user.projects || [],
        professionalLinks: {
            linkedin: user.professionalLinks?.linkedin || "",
            github: user.professionalLinks?.github || "",
            portfolio: user.professionalLinks?.portfolio || "",
        },
     });
    }, [user]);

    useEffect(() => {
    if (isEditing) {
        editSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
    }, [isEditing]);

    const handleChange = (e) => {
     const { name, value } = e.target;

     setFormData((prev) => ({
        ...prev,
        [name]: value,
     }));
    };

    const handleEducationChange = (e) => {
        const { name, value, type, checked } = e.target;

        setEducationForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleProjectChange = (e) => {
        const { name, value } = e.target;

        setProjectForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleProfessionalLinksChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            professionalLinks: {
                ...prev.professionalLinks,
                [name]: value,
            },
        }));
    };

    const handleAddEducation = () => {
        const currentYear = new Date().getFullYear();

const startYear = Number(educationForm.startYear);
const endYear = Number(educationForm.endYear);

if (
    !educationForm.institution.trim() ||
    !educationForm.degree.trim() ||
    !educationForm.startYear ||
    (!educationForm.currentlyStudying && !educationForm.endYear)
) {
    setMessage("Please fill in all required education fields.");
    return;
}

if (
    !Number.isInteger(startYear) ||
    startYear < 1950 ||
    startYear > currentYear
) {
    setMessage("Please enter a valid starting year.");
    return;
}

if (
    !educationForm.currentlyStudying &&
    (
        !Number.isInteger(endYear) ||
        endYear < startYear ||
        endYear > currentYear + 10
    )
) {
    setMessage("Please enter a valid ending year.");
    return;
}

setMessage("");
    const newEducation = {
        institution: educationForm.institution.trim(),
        degree: educationForm.degree.trim(),
        fieldOfStudy: educationForm.fieldOfStudy.trim(),
        startYear: Number(educationForm.startYear),
        endYear: educationForm.currentlyStudying
            ? null
            : Number(educationForm.endYear),
        currentlyStudying: educationForm.currentlyStudying,
    };
    setFormData((prev) => {
    const updatedEducation = [...prev.education];

    if (editingEducationIndex !== null) {
        updatedEducation[editingEducationIndex] = {
            ...updatedEducation[editingEducationIndex],
            ...newEducation,
        };
    } else {
        updatedEducation.push(newEducation);
    }

    return {
        ...prev,
        education: updatedEducation,
    };
    });

    setEducationForm({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        currentlyStudying: false,
    });
    setEditingEducationIndex(null);
    };

    const handleAddProject = () => {
        if(!projectForm.title.trim()){
            setMessage("Please enter a project title.");
            return;
        }

        if(projectForm.description.trim().length > 1000){
            setMessage("Project description must be 1000 characters or fewer.");
            return;
        }

        const newpPoject = {
            title: projectForm.title.trim(),
            description: projectForm.description.trim(),
            technologies: projectForm.technologies
             .split(",")
             .map((tech) => tech.trim())
             .filter(Boolean),
            githubUrl: projectForm.githubUrl.trim(),
            liveDemoUrl: projectForm.liveDemoUrl.trim(),
        };

        setFormData((prev) => {
            const updatedprojects = [...prev.projects];

            if(editingProjectindex !== null){
                updatedprojects[editingProjectindex] = {
                    ...updatedprojects[editingProjectindex],
                    ...newpPoject,
                };
            }else{
                updatedprojects.push(newpPoject);
            }
            return{
                ...prev,
                projects: updatedprojects,
            };
        });
        setProjectForm({
            title: "", 
            description: "",
            technologies: "",
            githubUrl: "",
            liveDemoUrl: "",
        });

        setEditingProjectIndex(null);
        setMessage("");
    }

    const handleEditEducation = (index) => {
    const education = formData.education[index];

    setEducationForm({
        institution: education.institution || "",
        degree: education.degree || "",
        fieldOfStudy: education.fieldOfStudy || "",
        startYear: education.startYear?.toString() || "",
        endYear: education.endYear?.toString() || "",
        currentlyStudying: education.currentlyStudying || false,
    });

    setEditingEducationIndex(index);

    editSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
    };

    const handleDeleteEducation = (index) => {
    const isConfirmed = window.confirm(
        "Are you sure you want to delete this education entry?"
    );

    if (!isConfirmed) return;

    setFormData((prev) => ({
        ...prev,
        education: prev.education.filter(
            (_, i) => i !== index
        ),
    }));

    // If the deleted entry was being edited, reset the form.
    if (editingEducationIndex === index) {
        setEducationForm({
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startYear: "",
            endYear: "",
            currentlyStudying: false,
        });

        setEditingEducationIndex(null);
    } else if (
        editingEducationIndex !== null &&
        editingEducationIndex > index
    ) {
        setEditingEducationIndex((prev) => prev - 1);
    }

    setMessage("Education entry removed. Click Save Changes to apply it.");
    };

    const handleEditProject = (index) => {
     const project = formData.projects[index];

     setProjectForm({
        title: project.title || "",
        description: project.description || "",
        technologies: project.technologies?.join(", ") || "",
        githubUrl: project.githubUrl || "",
        liveDemoUrl: project.liveDemoUrl || "",
     });

     setEditingProjectIndex(index);

     editSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
     });
    };

    const handleDeleteProject = (index) => {
     const isConfirmed = window.confirm(
        "Are you sure you want to delete this project?"
     );

     if (!isConfirmed) return;

     setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter(
            (_, i) => i !== index
        ),
     }));

     // If the deleted project was being edited, reset the form.
     if (editingProjectindex === index) {
        setProjectForm({
            title: "",
            description: "",
            technologies: "",
            githubUrl: "",
            liveDemoUrl: "",
        });

        setEditingProjectIndex(null);
    } else if (
        editingProjectindex !== null &&
        editingProjectindex > index
    ) {
        setEditingProjectIndex((prev) => prev - 1);
    }

    setMessage("Project removed. Click Save Changes to apply it.");
    };

    const handleResumeUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setResumeMessage("");
    setResumeError("");

    // Validate file type
    if (file.type !== "application/pdf") {
        setResumeError("Only PDF files are allowed.");
        event.target.value = "";
        return;
    }

    // Validate file size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
        setResumeError("Resume must not exceed 5 MB.");
        event.target.value = "";
        return;
    }

    try {
        setResumeUploading(true);

        const formData = new FormData();
        formData.append("resume", file);

        const response = await uploadResume(formData);

        // Update resume state
        setResume(response.data);

        // Keep AuthContext user data synchronized
        setUser((prevUser) => ({
            ...prevUser,
            resume: response.data,
        }));

        setResumeMessage("Resume uploaded successfully.");
    } catch (error) {
        setResumeError(
            error.response?.data?.message || "Failed to upload resume."
        );
    } finally {
        setResumeUploading(false);
        event.target.value = "";
    }
    };

    const handleViewResume = async () => {
    setResumeError("");

    try {
        setResumeLoading(true);

        const response = await viewMyResume();

        window.open(
            response.data.resumeUrl,
            "_blank",
            "noopener,noreferrer"
        );
    } catch (error) {
        setResumeError(
            error.response?.data?.message || "Failed to view resume."
        );
    } finally {
        setResumeLoading(false);
    }
    };

    const handleDownloadResume = async () => {
    setResumeError("");

    try {
        setResumeLoading(true);

        const response = await downloadMyResume();

        window.location.href = response.data.resumeUrl;
    } catch (error) {
        setResumeError(
            error.response?.data?.message || "Failed to download resume."
        );
    } finally {
        setResumeLoading(false);
    }
    };

    const handleDeleteResume = async () => {
    const confirmed = window.confirm(
        "Are you sure you want to delete your resume?"
    );

    if (!confirmed) return;

    setResumeError("");
    setResumeMessage("");

    try {
        setResumeDeleting(true);

        await deleteStudentOwnResume();

        // Clear resume from local state
        setResume(null);

        // Synchronize AuthContext
        setUser((prevUser) => ({
            ...prevUser,
            resume: null,
        }));

        setResumeMessage("Resume deleted successfully.");
    } catch (error) {
        setResumeError(
            error.response?.data?.message || "Failed to delete resume."
        );
    } finally {
        setResumeDeleting(false);
    }
    };

    const handleWorkModeChange = (mode) => {
    setFormData((prev) => ({
        ...prev,
        preferredWorkModes: prev.preferredWorkModes.includes(mode)
            ? prev.preferredWorkModes.filter((item) => item !== mode)
            : [...prev.preferredWorkModes, mode],
    }));
    };

   
    const handleSaveProfile = async () => {
    setMessage("");

    const currentYear = new Date().getFullYear();

    const hasPendingEducation =
        educationForm.institution.trim() ||
        educationForm.degree.trim() ||
        educationForm.fieldOfStudy.trim() ||
        educationForm.startYear ||
        educationForm.endYear ||
        educationForm.currentlyStudying;

    // Prepare education entries
    const educationToSave = [...formData.education];

    if (hasPendingEducation) {
        const startYear = Number(educationForm.startYear);
        const endYear = Number(educationForm.endYear);

        if (
            !educationForm.institution.trim() ||
            !educationForm.degree.trim() ||
            !educationForm.startYear ||
            (!educationForm.currentlyStudying && !educationForm.endYear)
        ) {
            setMessage("Please complete your education details before saving.");
            return;
        }

        if (
            !Number.isInteger(startYear) ||
            startYear < 1950 ||
            startYear > currentYear
        ) {
            setMessage("Please enter a valid starting year.");
            return;
        }

        if (
            !educationForm.currentlyStudying &&
            (
                !Number.isInteger(endYear) ||
                endYear < startYear ||
                endYear > currentYear + 10
            )
        ) {
            setMessage("Please enter a valid ending year.");
            return;
        }

        const newEducation = {
            institution: educationForm.institution.trim(),
            degree: educationForm.degree.trim(),
            fieldOfStudy: educationForm.fieldOfStudy.trim(),
            startYear,
            endYear: educationForm.currentlyStudying ? null : endYear,
            currentlyStudying: educationForm.currentlyStudying,
        };

        if (editingEducationIndex !== null) {
            educationToSave[editingEducationIndex] = {
                ...educationToSave[editingEducationIndex],
                ...newEducation,
            };
        } else {
            educationToSave.push(newEducation);
        }
    }
    const hasPendingProject = Boolean(
    projectForm.title.trim() ||
    projectForm.description.trim() ||
    projectForm.technologies.trim() ||
    projectForm.githubUrl.trim() ||
    projectForm.liveDemoUrl.trim()
);

const projectsToSave = [...formData.projects];

if (hasPendingProject) {
    if (!projectForm.title.trim()) {
        setMessage("Please enter a project title.");
        return;
    }

    if (projectForm.description.trim().length > 1000) {
        setMessage("Project description must be 1000 characters or fewer.");
        return;
    }

    const technologies = projectForm.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);

    if (technologies.length > 20 || technologies.some((tech) => tech.length > 50)) {
        setMessage("You can add up to 20 technologies, each with 50 characters or fewer.");
        return;
    }

    const newProject = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        technologies,
        githubUrl: projectForm.githubUrl.trim(),
        liveDemoUrl: projectForm.liveDemoUrl.trim(),
    };

    if (editingProjectindex !== null) {
        projectsToSave[editingProjectindex] = {
            ...projectsToSave[editingProjectindex],
            ...newProject,
        };
    } else {
        projectsToSave.push(newProject);
    }
   }

    setSaving(true);

    try {
        const profileData = {
            fullName: formData.fullName.trim(),
            bio: formData.bio.trim(),
            skills: formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
            preferredLocations: formData.preferredLocations
                .split(",")
                .map((location) => location.trim())
                .filter(Boolean),
            preferredWorkModes: formData.preferredWorkModes,
            education: educationToSave,
            projects: projectsToSave,
            professionalLinks: {
              linkedin: formData.professionalLinks.linkedin.trim(),
              github: formData.professionalLinks.github.trim(),
              portfolio: formData.professionalLinks.portfolio.trim(),
            },
        };

        const response = await updateUserProfile(profileData);

        setUser(response.data.user);
        setIsEditing(false);
        setMessage("Profile updated successfully!");

        setEducationForm({
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startYear: "",
            endYear: "",
            currentlyStudying: false,
        });

        setEditingEducationIndex(null);

    } catch (error) {
        setMessage(
            error.response?.data?.message || "Failed to update profile."
        );
    } finally {
        setSaving(false);
    }
    };


    if(authLoading){
        return(
            <p className="p-8 text-center text-slate-500 dark:text-slate-400">Loading Profile...</p>
        );
    }

    if(!user){
        return(
            <p className="p-8 text-center text-slate-500 dark:text-slate-400">
                Please log in to view your profile.
            </p>
        );
    }

    const initials = user.fullName
        ?.split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="min-h-screen bg-[#FCFAFF] px-4 py-8 text-slate-800 dark:bg-[#0B1020] dark:text-slate-100 sm:px-6 lg:px-10">
          {/* Hidden Resume Input */}
        <input
            type="file"
            accept="application/pdf"
            ref={resumeInputRef}
            onChange={handleResumeUpload}
            className="hidden"
        />
            <div className="mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold tracking-tight">
                    Student Profile
                </h1>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Manage your personal information and internship preferences.
                </p>
                 
                 {/* Name, Email */}
                <section className="group relative mt-8 overflow-hidden rounded-3xl border border-[#EADCEC] bg-gradient-to-br from-[#FFF5FA] via-[#F8F4FF] to-[#EFF8FF] p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-100/50 dark:border-emerald-400/20 dark:bg-gradient-to-br dark:from-[#172235] dark:via-[#111827] dark:to-[#102720] dark:shadow-[0_12px_35px_rgba(0,0,0,0.18)] dark:hover:border-emerald-400/35 dark:hover:shadow-[0_12px_35px_rgba(16,185,129,0.10)] sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/80 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30 transition-transform duration-300 group-hover:scale-105 dark:border-slate-800 dark:shadow-emerald-500/10 dark:ring-emerald-400/40">
                            {initials || "S"}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold">
                                {user.fullName}
                            </h2>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">
                                {user.email}
                            </p>
                            <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold capitalize text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                                {user.role || "student"}
                            </span>
                        </div>
                        <button
                          onClick={() => {
                          setIsEditing(true);
                          setMessage("");
                          }}
                            className="mt-4 self-start rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-600 sm:self-auto"
                        >
                          Edit Profile
                        </button>
                    </div>
                </section>
                
                  {/* About Me Section */}
            <section className="mt-6 group relative overflow-hidden rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-white via-[#FFF9FC] to-[#F3F8FF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D8B4E2]/60 dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)]">
               <h2 className="text-lg font-bold">
                  About Me
                </h2>

                   <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {user.bio?.trim() || "You haven't added an introduction yet. Tell companies a little about yourself!"}
                    </p>
            </section>

             {/* Education Display Section */}
<section className="group relative mt-6 overflow-hidden rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-white via-[#FFF9FC] to-[#F3F8FF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D8B4E2]/60 dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)]">

    <h2 className="text-lg font-bold">
        Education
    </h2>

    <div className="mt-5 space-y-4">
        {(isEditing ? formData.education : user.education || []).length > 0 ? (
            (isEditing ? formData.education : user.education || []).map((item, index) => (
                <div
                    key={item._id || index}
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {item.institution}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {item.degree}
                        {item.fieldOfStudy && ` · ${item.fieldOfStudy}`}
                    </p>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {item.startYear} – {item.currentlyStudying ? "Present" : item.endYear}
                    </p>

                    {item.currentlyStudying && (
                        <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                            Currently Studying
                        </span>
                    )}
                  {isEditing && (
                     <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-3 dark:border-slate-700">

                          <button
                             type="button"
                             onClick={() => handleEditEducation(index)}
                             className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/20"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteEducation(index)}
                              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400 dark:hover:bg-red-400/20"
                            >
                             Delete
                            </button>
                        </div>
                   )}
                </div>
            ))
        ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
                No education details added yet.
            </p>
        )}
    </div>
</section>

 {/* Projects Section */}
<section className="group relative mt-6 overflow-hidden rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-white via-[#FFF9FC] to-[#F3F8FF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D8B4E2]/60 dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)]">

    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        Projects
    </h2>

    {formData.projects.length > 0 ? (
        <div className="mt-5 space-y-4">
            {formData.projects.map((project, index) => (
                <div
                    key={project._id || index}
                    className="rounded-xl border border-[#EADCEC] bg-white/70 p-5 dark:border-emerald-400/10 dark:bg-[#0B1020]/50"
                >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        {project.title}
                    </h3>

                    {project.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {project.description}
                        </p>
                    )}

                    {project.technologies?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                                <span
                                    key={techIndex}
                                    className="rounded-full bg-[#F3E8F7] px-3 py-1 text-xs font-medium text-[#80558D] dark:bg-emerald-400/10 dark:text-blue-300"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#9B6AA8] hover:underline dark:text-emerald-300"
                            >
                                GitHub
                            </a>
                        )}

                        {project.liveDemoUrl && (
                            <a
                                href={project.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0D9488] hover:underline dark:text-emerald-300"
                            >
                                Live Demo
                            </a>
                        )}
                    </div>

                    {isEditing && (
                        <div className="mt-4 flex justify-end gap-3 border-t border-[#EADCEC] pt-3 dark:border-emerald-400/10">
                            <button
                                type="button"
                                onClick={() => handleEditProject(index)}
                                 className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/20"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDeleteProject(index)}
                                className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-500 transition hover:bg-red-100 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400 dark:hover:bg-red-400/20"

                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    ) : (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            No projects added yet.
        </p>
    )}
</section>

{/* Professional Links Section */}
<section className="mt-6 rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-white via-[#FFF9FC] to-[#F3F8FF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D8B4E2]/60 dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)]">

    <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white">
        Professional Links
    </h2>

    <div className="space-y-3">
        {professionalLinks.length > 0 ? (
           professionalLinks.map(([platform, url]) => (
                    <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-fit items-center gap-2 rounded-lg bg-[#F3E8F7] px-4 py-2 font-medium capitalize text-[#80558D] transition hover:bg-[#EADCF0] dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20"
                    >
                        {platform}
                        <span>↗</span>
                    </a>
                ))
        ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
                No professional links added yet.
            </p>
        )}
    </div>
</section>

{/* Resume Section */}
<section className="mt-6 rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-white via-[#FFF9FC] to-[#F3F8FF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D8B4E2]/60 dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)]">

    <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Resume
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your resume for internship applications.
        </p>
    </div>

    {resume ? (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Resume Details */}
            <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F9EAF5] text-2xl dark:bg-emerald-400/10">
                    📄
                </div>

                <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800 dark:text-white">
                        {resume.fileName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                        PDF · {(resume.bytes / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                        Resume uploaded successfully
                    </p>
                </div>
            </div>

            {/* Resume Actions */}
            <div className="flex shrink-0 flex-wrap gap-2">

                <button
                    type="button"
                    onClick={handleViewResume}
                    disabled={resumeLoading}
                    className="rounded-xl bg-[#DDF3F0] px-4 py-2.5 text-sm font-semibold text-[#277D75] transition hover:bg-[#C9EAE5] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20"
                >
                    View
                </button>

                <button
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={resumeLoading}
                    className="rounded-xl bg-[#E5F0FF] px-4 py-2.5 text-sm font-semibold text-[#4779B8] transition hover:bg-[#D5E6FC] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-400/10 dark:text-sky-300 dark:hover:bg-sky-400/20"
                >
                    Download
                </button>

                <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={resumeUploading}
                    className="rounded-xl bg-[#F3E8F7] px-4 py-2.5 text-sm font-semibold text-[#80558D] transition hover:bg-[#EADCF0] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-400/10 dark:text-purple-300 dark:hover:bg-purple-400/20"
                >
                    {resumeUploading ? "Uploading..." : "Replace"}
                </button>

                <button
                    type="button"
                    onClick={handleDeleteResume}
                    disabled={resumeDeleting}
                    className="rounded-xl bg-[#FCE8EC] px-4 py-2.5 text-sm font-semibold text-[#C04D68] transition hover:bg-[#F8D7DF] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-rose-400/10 dark:text-rose-300 dark:hover:bg-rose-400/20"
                >
                    {resumeDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    ) : (
        <div className="rounded-xl border-2 border-dashed border-[#EADCEC] bg-white/50 px-5 py-8 text-center dark:border-slate-600 dark:bg-slate-800/20">

            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9EAF5] text-2xl dark:bg-emerald-400/10">
                📄
            </div>

            <h3 className="font-semibold text-slate-800 dark:text-white">
                No resume uploaded yet
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                Upload your resume to make it available for your internship applications.
            </p>

            <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                disabled={resumeUploading}
                className="mt-5 rounded-xl bg-gradient-to-r from-[#D9A7C7] to-[#A9CDEB] px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:from-emerald-500 dark:to-teal-500 dark:text-white"
            >
                {resumeUploading ? "Uploading..." : "Upload Resume"}
            </button>

            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                PDF format only · Maximum file size 5 MB
            </p>
        </div>
    )}

    {/* Success and Error Messages */}
    {resumeMessage && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            {resumeMessage}
        </p>
    )}

    {resumeError && (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">
            {resumeError}
        </p>
    )}
</section>

   
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {/* skill */}
                    <section className="group relative overflow-hidden rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-white via-[#FFF9FC] to-[#F3F8FF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D8B4E2]/60 dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)]">
                        <h2 className="text-lg font-bold">
                            Skills
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {user.skills?.length ? (
                                user.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-[#F9EAF5] px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No skills added yet.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* preferred location */}
                    <section className="group relative overflow-hidden rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-white via-[#FFF9FC] to-[#F3F8FF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D8B4E2]/60 dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)]">
                        <h2 className="text-lg font-bold">
                            Preferred Locations
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {user.preferredLocations?.length ? (
                                user.preferredLocations.map((location) => (
                                    <span
                                        key={location}
                                        className="rounded-full bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"
                                    >
                                        {location}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No preferred locations added yet.
                                </p>
                            )}
                        </div>
                    </section>
                     
                     {/* preferred modes */}
                    <section className="group relative overflow-hidden rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-white via-[#FFF9FC] to-[#F3F8FF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D8B4E2]/60 dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] md:col-span-2">
                        <h2 className="text-lg font-bold">
                            Preferred Work Modes
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {user.preferredWorkModes?.length ? (
                                user.preferredWorkModes.map((mode) => (
                                    <span
                                        key={mode}
                                        className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"
                                    >
                                        {mode}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No preferred work modes added yet.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
   
   {/* editing page */}
  {isEditing && (
    <section
     ref={editSectionRef}
       style={{
        boxShadow: "0 6px 20px rgba(216, 180, 226, 0.55)",
       }}
     className="mt-6 scroll-mt-24 rounded-2xl border border-emerald-600 bg-white p-6 transition-all duration-500 dark:border-emerald-400/30 dark:bg-[#111827] dark:[box-shadow:0_8px_30px_rgba(16,185,129,0.08)]">
        <h2 className="text-xl font-bold">Edit Your Profile</h2>

        <div className="mt-5 space-y-5">
            <div>
                <label className="mb-2 block text-sm font-medium">
                    About Me
                </label>

                <textarea
                   name="bio"
                   value={formData.bio}
                   onChange={handleChange}
                   placeholder="Tell us about yourself, your interests, and your career goals..."
                   maxLength={500}
                   rows={4}
                   className="w-full resize-none rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none transition focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
                 />

                <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
                  {formData.bio.length}/500 characters
                </p>
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Full Name
                </label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Skills
                </label>
                <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, C++"
                    className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">
                    Separate skills with commas.
                </p>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Preferred Locations
                </label>
                <input
                    type="text"
                    name="preferredLocations"
                    value={formData.preferredLocations}
                    onChange={handleChange}
                    placeholder="Hyderabad, Bengaluru, Delhi"
                    className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">
                    Separate locations with commas.
                </p>
            </div>
            <div>
    <label className="mb-3 block text-sm font-medium">
        Preferred Work Modes
    </label>

    <div className="flex flex-wrap gap-3">
        {["Remote", "On-site", "Hybrid"].map((mode) => (
            <label
                key={mode}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 transition ${
                    formData.preferredWorkModes.includes(mode)
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"
                        : "border-slate-200 dark:border-slate-700"
                }`}
            >
                <input
                    type="checkbox"
                    checked={formData.preferredWorkModes.includes(mode)}
                    onChange={() => handleWorkModeChange(mode)}
                    className="accent-emerald-500"
                />
                <span>{mode}</span>
            </label>
        ))}
    </div>
</div>
      {/* Education Form */}
<div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
    <h3 className="text-lg font-bold">Education</h3>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add your academic qualifications.
    </p>

    <div className="mt-5 space-y-4">
        <div>
            <label className="mb-2 block text-sm font-medium">
                Institution *
            </label>
            <input
                type="text"
                name="institution"
                value={educationForm.institution}
                onChange={handleEducationChange}
                placeholder="ABC University"
                className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
            />
        </div>

        <div>
            <label className="mb-2 block text-sm font-medium">
                Degree *
            </label>
            <input
                type="text"
                name="degree"
                value={educationForm.degree}
                onChange={handleEducationChange}
                placeholder="B.Tech"
                className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
            />
        </div>

        <div>
            <label className="mb-2 block text-sm font-medium">
                Field of Study
            </label>
            <input
                type="text"
                name="fieldOfStudy"
                value={educationForm.fieldOfStudy}
                onChange={handleEducationChange}
                placeholder="Computer Science and Engineering"
                className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
            />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Start Year *
                </label>
                <input
                    type="number"
                    name="startYear"
                    value={educationForm.startYear}
                    onChange={handleEducationChange}
                    placeholder="2024"
                    className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
                />
            </div>

            {!educationForm.currentlyStudying && (
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        End Year *
                    </label>
                    <input
                        type="number"
                        name="endYear"
                        value={educationForm.endYear}
                        onChange={handleEducationChange}
                        placeholder="2028"
                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
                    />
                </div>
            )}
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
                type="checkbox"
                name="currentlyStudying"
                checked={educationForm.currentlyStudying}
                onChange={handleEducationChange}
                className="h-4 w-4 accent-emerald-500"
            />
            I am currently studying here
        </label>

        <button
            type="button"
            onClick={handleAddEducation}
           className="rounded-xl bg-[#A66DB5] px-5 py-3 font-semibold text-white transition hover:bg-[#9255A3] dark:bg-emerald-600 dark:text-[#07130F] dark:hover:bg-emerald-400">
            + Add Education
        </button>
    </div>
</div>  
</div>

{/* Project Form */}
<div className="mt-8 border-t border-[#EADCEC] pt-6 dark:border-emerald-400/10">

    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
        {editingProjectindex !== null ? "Edit Project" : "Add Project"}
    </h3>

    <div className="mt-5 space-y-4">

        {/* Project Title */}
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Project Title *
            </label>

            <input
                type="text"
                name="title"
                value={projectForm.title}
                onChange={handleProjectChange}
                placeholder="e.g. PlayNest"
                className="w-full rounded-xl border border-[#EADCEC] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#C084D1] focus:ring-2 focus:ring-[#D8B4E2]/30 dark:border-emerald-400/15 dark:bg-[#0B1020] dark:text-white dark:focus:border-emerald-400"
            />
        </div>

        {/* Description */}
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
            </label>

            <textarea
                name="description"
                value={projectForm.description}
                onChange={handleProjectChange}
                rows={4}
                maxLength={1000}
                placeholder="Describe what your project does..."
                className="w-full rounded-xl border border-[#EADCEC] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#C084D1] focus:ring-2 focus:ring-[#D8B4E2]/30 dark:border-emerald-400/15 dark:bg-[#0B1020] dark:text-white dark:focus:border-emerald-400"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
                {projectForm.description.length}/1000
            </p>
        </div>

        {/* Technologies */}
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Technologies Used
            </label>

            <input
                type="text"
                name="technologies"
                value={projectForm.technologies}
                onChange={handleProjectChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full rounded-xl border border-[#EADCEC] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#C084D1] focus:ring-2 focus:ring-[#D8B4E2]/30 dark:border-emerald-400/15 dark:bg-[#0B1020] dark:text-white dark:focus:border-emerald-400"
            />

            <p className="mt-1 text-xs text-slate-400">
                Separate technologies using commas.
            </p>
        </div>

        {/* GitHub URL */}
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                GitHub Repository URL
            </label>

            <input
                type="url"
                name="githubUrl"
                value={projectForm.githubUrl}
                onChange={handleProjectChange}
                placeholder="https://github.com/username/project"
                className="w-full rounded-xl border border-[#EADCEC] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#C084D1] focus:ring-2 focus:ring-[#D8B4E2]/30 dark:border-emerald-400/15 dark:bg-[#0B1020] dark:text-white dark:focus:border-emerald-400"
            />
        </div>

        {/* Live Demo URL */}
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Live Demo URL
            </label>

            <input
                type="url"
                name="liveDemoUrl"
                value={projectForm.liveDemoUrl}
                onChange={handleProjectChange}
                placeholder="https://your-project.com"
                className="w-full rounded-xl border border-[#EADCEC] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#C084D1] focus:ring-2 focus:ring-[#D8B4E2]/30 dark:border-emerald-400/15 dark:bg-[#0B1020] dark:text-white dark:focus:border-emerald-400"
            />
        </div>

        {/* Add / Update Project Button */}
        <div className="flex justify-end pt-2">
            <button
                type="button"
                onClick={handleAddProject}
                className="rounded-xl bg-[#A66DB5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9255A3] dark:bg-emerald-600 dark:text-[#07130F] dark:hover:bg-emerald-400"
            >
                {editingProjectindex !== null ? "Update Project" : "Add Project"}
            </button>
        </div>

    </div>
</div>

{/* Professional Links */}
<div className="mt-8">
    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Professional Links
    </h3>

    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Add your professional profiles or portfolio. All fields are optional.
    </p>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                LinkedIn URL
            </label>
            <input
                type="url"
                name="linkedin"
                value={formData.professionalLinks.linkedin}
                onChange={handleProfessionalLinksChange}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-teal-400 dark:border-gray-700 dark:bg-[#151D30] dark:text-white"
            />
        </div>

        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub URL
            </label>
            <input
                type="url"
                name="github"
                value={formData.professionalLinks.github}
                onChange={handleProfessionalLinksChange}
                placeholder="https://github.com/your-username"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-teal-400 dark:border-gray-700 dark:bg-[#151D30] dark:text-white"
            />
        </div>

        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Portfolio URL
            </label>
            <input
                type="url"
                name="portfolio"
                value={formData.professionalLinks.portfolio}
                onChange={handleProfessionalLinksChange}
                placeholder="https://yourportfolio.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-teal-400 dark:border-gray-700 dark:bg-[#151D30] dark:text-white"
            />
        </div>
    </div>
</div>

<div className="mt-6 flex flex-wrap gap-3">
    <button
         type="button"
        onClick={handleSaveProfile}
        disabled={saving}
        className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
        {saving ? "Saving..." : "Save Changes"}
    </button>

    <button
        type="button"
        onClick={() => {
            setIsEditing(false);
            setMessage("");
            setFormData({
                fullName: user.fullName || "",
                bio: user.bio || "",
                skills: user.skills?.join(", ") || "",
                preferredLocations: user.preferredLocations?.join(", ") || "",
                preferredWorkModes: user.preferredWorkModes || [],
                education: user.education || [],
                projects: user.projects || [],
            });
        }}
        disabled={saving}
        className="rounded-xl border border-slate-200 px-5 py-3 font-semibold transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
    >
        Cancel
    </button>
</div>

{message && (
    <p className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
        {message}
    </p>
)}
    </section>
)}

            </div>
        </div>
    );
}

export default StudentProfile;