import { 
    BriefcaseBusiness,
    Building2,
    Code2,
    Wallet,
    Globe,
    ArrowLeft,
    Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInternship } from "../services/internshipService";

function CreateInternship() {
    const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requiredSkills: [],
    preferredSkills: [],
    location: "",
    workMode: "",
    stipend: {
        min: "",
        max: "",
        currency: "INR",
    },
    applicationUrl: "",
    deadline: "",
    status: "active",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handles normal input fields
    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Handles stipend fields
    const handleStipendChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            stipend: {
                ...prev.stipend,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
        const internshipData = {
            ...formData,
            stipend: {
                ...formData.stipend,
                min: formData.stipend.min === ""
                    ? null
                    : Number(formData.stipend.min),
                max: formData.stipend.max === ""
                    ? null
                    : Number(formData.stipend.max),
            },
            deadline: formData.deadline || null,
        };

        await createInternship(internshipData);

        navigate("/admin");
    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Failed to create internship. Please try again."
        );
    } finally {
        setIsSubmitting(false);
    }
    };

    return (
       <div className="relative isolate min-h-screen overflow-hidden bg-[#F1EFF8] px-4 py-8 text-slate-800 dark:bg-[#080D1B] dark:text-slate-100 sm:px-6 lg:px-10">
            {/* Background effects */}
            <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-pink-300/50 blur-[100px] dark:bg-emerald-500/30" />

            <div className="pointer-events-none absolute -right-32 top-[35%] h-96 w-96 rounded-full bg-sky-300/50 blur-[110px] dark:bg-cyan-500/25" />

            <div className="pointer-events-none absolute bottom-0 left-[35%] h-80 w-80 rounded-full bg-purple-300/40 blur-[100px] dark:bg-blue-600/20" />
            <div className="relative z-10 mx-auto max-w-5xl">
                 {/*Header*/}
                 <div className="mb-8">
                    <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="mb-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-[#F9EAF5] hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>


                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <Sparkles size={14} />
                                ADMIN WORKSPACE
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Create Internship
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                                Add a new opportunity for students to discover.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form container */}
                <div className="overflow-hidden rounded-3xl border border-[#E5DDF2] bg-[#F8F5FC] shadow-[0_8px_30px_rgba(139,92,246,0.10)] dark:border-slate-800 dark:bg-[#151D30] dark:shadow-[0_8px_30px_rgba(16,185,129,0.08)]">

                    {/* Form heading */}
                    <div className="border-b border-slate-100 bg-gradient-to-r from-[#F9F1FF] via-white to-[#E9F9F6] px-6 py-6 dark:border-slate-800 dark:from-[#17243A] dark:via-[#151D30] dark:to-[#10352F] sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <BriefcaseBusiness size={23} />
                            </div>

                            <div>
                                <h2 className="font-bold">Internship Information</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Enter the details of the opportunity.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-8 bg-[#F8F5FC] p-6 sm:p-8 dark:bg-[#151D30]"
                      onSubmit={handleSubmit} 
                     >
                        {error && (
                          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                            {error}
                          </div>
                        )}

                        {/* Section 1 */}
                        <section>
                            <div className="mb-5 flex items-center gap-3">
                                <Building2 className="text-emerald-600 dark:text-emerald-400" size={20} />
                                <h3 className="font-bold">Basic Details</h3>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold">
                                        Internship Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Frontend Developer Intern"
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:placeholder:text-slate-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="e.g. TechNova"
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:placeholder:text-slate-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Hyderabad or Bengaluru"
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:placeholder:text-slate-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Work Mode
                                    </label>
                                    <select
                                        name="workMode"
                                        value={formData.workMode}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-[#0B1020]"
                                    >
                                        <option value="" disabled>Select work mode</option>
                                        <option value="Remote">Remote</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Application Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-[#0B1020]"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold">
                                        Description
                                    </label>
                                    <textarea
                                      name="description"
                                      value={formData.description}
                                      onChange={handleChange}
                                       rows={5}
                                      placeholder="Describe the role, responsibilities, and what the intern will learn..."
                                      className="w-full resize-y rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-slate-100 dark:border-slate-800" />

                        {/* Section 2 */}
                        <section>
                            <div className="mb-5 flex items-center gap-3">
                                <Code2 className="text-emerald-600 dark:text-emerald-400" size={20} />
                                <h3 className="font-bold">Skills & Requirements</h3>
                            </div>

                            <div className="grid gap-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Required Skills
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.requiredSkills.join(", ")}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            requiredSkills: e.target.value
                                                .split(",")
                                                .map((skill) => skill.trim())
                                                .filter((skill) => skill !== ""),
                                            }))
                                        }
                                        placeholder="e.g. JavaScript, React, HTML, CSS"
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:placeholder:text-slate-500"
                                    />
                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                        Separate each skill with a comma.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Preferred Skills
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.preferredSkills.join(", ")}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                preferredSkills: e.target.value
                                                .split(",")
                                                .map((skill) => skill.trim())
                                                .filter((skill) => skill !== ""),
                                            }))
                                        }
                                        placeholder="e.g. TypeScript, Tailwind CSS"
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:placeholder:text-slate-500"
                                    />
                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                        Optional skills that would be an advantage.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-slate-100 dark:border-slate-800" />

                        {/* Section 3 */}
                        <section>
                            <div className="mb-5 flex items-center gap-3">
                                <Wallet className="text-emerald-600 dark:text-emerald-400" size={20} />
                                <h3 className="font-bold">Compensation</h3>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Minimum Stipend
                                    </label>
                                    <input
                                        type="number"
                                        name="min"
                                        value={formData.stipend.min}
                                        onChange={handleStipendChange}
                                        min="0"
                                        placeholder="15000"
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Maximum Stipend
                                    </label>
                                    <input
                                        type="number"
                                        name="max"
                                        value={formData.stipend.max}
                                        onChange={handleStipendChange}
                                        min="0"
                                        placeholder="25000"
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Currency
                                    </label>
                                    <select
                                        name="currency"
                                        value={formData.stipend.currency}
                                        onChange={handleStipendChange}
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-[#0B1020]"
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-slate-100 dark:border-slate-800" />

                        {/* Section 4 */}
                        <section>
                            <div className="mb-5 flex items-center gap-3">
                                <Globe className="text-emerald-600 dark:text-emerald-400" size={20} />
                                <h3 className="font-bold">Application Details</h3>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold">
                                        Application URL
                                    </label>
                                    <input
                                        type="url"
                                        name="applicationUrl"
                                        value={formData.applicationUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/apply"
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:placeholder:text-slate-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Application Deadline
                                    </label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020]"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                             {isSubmitting ? "Creating..." : "Create Internship"}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
                    InternMatch AI · Internship Management
                </p>
            </div>
        </div>
    );
}

export default CreateInternship;