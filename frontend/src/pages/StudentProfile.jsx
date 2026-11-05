import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { updateUserProfile } from "../services/authServices";

function StudentProfile() {
    const {user, setUser, authLoading} = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
    fullName: "",
    skills: "",
    preferredLocations: "",
    preferredWorkModes: [],
    });

   useEffect(() => {
     if (!user) return;

     setFormData({
        fullName: user.fullName || "",
        skills: user.skills?.join(", ") || "",
        preferredLocations: user.preferredLocations?.join(", ") || "",
        preferredWorkModes: user.preferredWorkModes || [],
     });
    }, [user]);

    const handleChange = (e) => {
     const { name, value } = e.target;

     setFormData((prev) => ({
        ...prev,
        [name]: value,
     }));
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
    setSaving(true);
    setMessage("");

    try {
        const profileData = {
            fullName: formData.fullName.trim(),
            skills: formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
            preferredLocations: formData.preferredLocations
                .split(",")
                .map((location) => location.trim())
                .filter(Boolean),
            preferredWorkModes: formData.preferredWorkModes,
        };

        const response = await updateUserProfile(profileData);

        setUser(response.data.user);
        setIsEditing(false);
        setMessage("Profile updated successfully!");
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
            <div className="mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold tracking-tight">
                    Student Profile
                </h1>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Manage your personal information and internship preferences.
                </p>

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

                {isEditing && (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <h2 className="text-xl font-bold">Edit Your Profile</h2>

        <div className="mt-5 space-y-5">
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
        
</div>
<div className="mt-6 flex flex-wrap gap-3">
    <button
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
                skills: user.skills?.join(", ") || "",
                preferredLocations: user.preferredLocations?.join(", ") || "",
                preferredWorkModes: user.preferredWorkModes || [],
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

                <div className="mt-6 grid gap-6 md:grid-cols-2">
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
            </div>
        </div>
    );
}

export default StudentProfile;