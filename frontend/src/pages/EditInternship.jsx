import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInternshipById, updateInternship } from "../services/internshipService";

function EditInternship(){
    const {internshipId} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
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

    useEffect(() => {
     const fetchInternship = async () => {
        try {
            const response = await getInternshipById(internshipId);
            const internship = response.data;

            setFormData({
                title: internship.title || "",
                company: internship.company || "",
                description: internship.description || "",
                requiredSkills: internship.requiredSkills || [],
                preferredSkills: internship.preferredSkills || [],
                location: internship.location || "",
                workMode: internship.workMode || "",
                stipend: {
                    min: internship.stipend?.min ?? "",
                    max: internship.stipend?.max ?? "",
                    currency: internship.stipend?.currency || "INR",
                },
                applicationUrl: internship.applicationUrl || "",
                deadline: internship.deadline
                    ? internship.deadline.slice(0, 10)
                    : "",
                status: internship.status || "active",
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch internship details."
            );
        } finally {
            setLoading(false);
        }
     };

     fetchInternship();
    }, [internshipId]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStipendChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            stipend: {
                ...prev.stipend,
                 [name]: value,
            }
        }));
    };

    const handleSkillsChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
          ...prev,
          [name]: value
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
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
                min:
                    formData.stipend.min === ""
                        ? null
                        : Number(formData.stipend.min),
                max:
                    formData.stipend.max === ""
                        ? null
                        : Number(formData.stipend.max),
            },
            deadline: formData.deadline || null,
         };

         await updateInternship(internshipId, internshipData);

         navigate("/admin");
        } catch (error) {
           setError(
            error.response?.data?.message ||
            "Failed to update internship. Please try again."
         );
         } finally {
         setIsSubmitting(false);
        }
    };

    if (loading) {
       return (
        <div className="flex min-h-screen items-center justify-center bg-[#FCFAFF] dark:bg-[#0B1020]">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
        </div>
       );
    }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F0E8F5] px-4 py-8 text-[#392345] transition-colors duration-300 dark:bg-[#17152C] dark:text-[#F8F3FF] sm:px-6 lg:px-9">

    <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl dark:bg-emerald-400/10" />

    <div className="pointer-events-none absolute -right-20 top-80 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl dark:bg-sky-400/10" />

        <div className="mx-auto max-w-4xl">

            <div className="mb-7">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Edit Internship
                </h1>

                <p className="mt-2 text-sm text-[#70577D] dark:text-[#C8BBD9]">
                    Update the details of this internship opportunity.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                 className="relative rounded-3xl border border-white/70 bg-[#E2D2EA] p-5 shadow-[0_15px_45px_rgba(64,35,79,0.12)] dark:border-[#48405F] dark:bg-[#292443] dark:shadow-[0_15px_45px_rgba(0,0,0,0.25)] sm:p-8"
            >
                {error && (
                    <div className="mb-5 rounded-xl border border-rose-300/60 bg-rose-100/70 p-4 text-sm text-rose-700 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-300">
                        {error}
                    </div>
                )}

                <div className="space-y-5">

    {/* Internship Title */}
    <div>
        <label className="mb-2 block text-sm font-semibold">
            Internship Title
        </label>
        <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Frontend Developer Intern"
            className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none transition placeholder:text-[#907B9B] focus:border-[#168F83] focus:ring-4 focus:ring-[#168F83]/10 dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:placeholder:text-[#B8ADC9] dark:focus:border-[#42CDB5]"
        />
    </div>

    {/* Company */}
    <div>
        <label className="mb-2 block text-sm font-semibold">
            Company Name
        </label>
        <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="Enter company name"
            className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:text-white"
        />
    </div>

    {/* Description */}
    <div>
        <label className="mb-2 block text-sm font-semibold">
            Description
        </label>
        <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Describe the internship opportunity..."
           className="w-full resize-y rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none transition placeholder:text-[#907B9B] focus:border-[#168F83] focus:ring-4 focus:ring-[#168F83]/10 dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:placeholder:text-[#B8ADC9] dark:focus:border-[#42CDB5]"
        />
    </div>

    {/* Location and Work Mode */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        <div>
            <label className="mb-2 block text-sm font-semibold">
                Location
            </label>
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Remote / Hyderabad"
                className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:text-white"
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
                required
                className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none transition focus:border-[#168F83] dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:focus:border-[#42CDB5]"
            >
                <option value="">Select work mode</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
            </select>
         </div>

       </div>
       {/* Required and Preferred Skills */}
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

    {/* Required Skills */}
    <div>
        <label className="mb-2 block text-sm font-semibold">
            Required Skills
        </label>
        <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills.join(", ")}
            onChange={handleSkillsChange}
            required
            placeholder="React, JavaScript, HTML"
            className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none transition placeholder:text-[#907B9B] focus:border-[#168F83] focus:ring-4 focus:ring-[#168F83]/10 dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:placeholder:text-[#B8ADC9] dark:focus:border-[#42CDB5]"
        />
        <p className="mt-2 text-xs text-[#70577D] dark:text-[#C8BBD9]">
            Separate skills using commas.
        </p>
    </div>

    {/* Preferred Skills */}
    <div>
        <label className="mb-2 block text-sm font-semibold">
            Preferred Skills
        </label>
        <input
            type="text"
            name="preferredSkills"
            value={formData.preferredSkills.join(", ")}
            onChange={handleSkillsChange}
            placeholder="Node.js, Git, Tailwind CSS"
            className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none transition placeholder:text-[#907B9B] focus:border-[#168F83] focus:ring-4 focus:ring-[#168F83]/10 dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:placeholder:text-[#B8ADC9] dark:focus:border-[#42CDB5]"
        />
        <p className="mt-2 text-xs text-[#70577D] dark:text-[#C8BBD9]">
            These skills are an added advantage.
        </p>
    </div>

   </div>
   {/* Stipend */}
<div>
    <label className="mb-2 block text-sm font-semibold">
        Stipend
    </label>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <select
            name="currency"
            value={formData.stipend.currency}
            onChange={handleStipendChange}
            className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none focus:border-[#168F83] dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:focus:border-[#42CDB5]"
        >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
        </select>

        <input
            type="number"
            name="min"
            min="0"
            value={formData.stipend.min}
            onChange={handleStipendChange}
            placeholder="Minimum"
            className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none placeholder:text-[#907B9B] focus:border-[#168F83] dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:placeholder:text-[#B8ADC9] dark:focus:border-[#42CDB5]"
        />

        <input
            type="number"
            name="max"
            min="0"
            value={formData.stipend.max}
            onChange={handleStipendChange}
            placeholder="Maximum"
            className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none placeholder:text-[#907B9B] focus:border-[#168F83] dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:placeholder:text-[#B8ADC9] dark:focus:border-[#42CDB5]"
        />
    </div>
</div>

{/* Application URL */}
<div>
    <label className="mb-2 block text-sm font-semibold">
        Application URL
    </label>
    <input
        type="url"
        name="applicationUrl"
        value={formData.applicationUrl}
        onChange={handleChange}
        required
        placeholder="https://company.com/apply"
        className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none placeholder:text-[#907B9B] focus:border-[#168F83] dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:placeholder:text-[#B8ADC9] dark:focus:border-[#42CDB5]"
    />
</div>

{/* Deadline and Status */}
 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
    <div>
        <label className="mb-2 block text-sm font-semibold">
            Application Deadline
        </label>
        <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none focus:border-[#168F83] dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:focus:border-[#42CDB5]"
        />
    </div>

    <div>
        <label className="mb-2 block text-sm font-semibold">
            Internship Status
        </label>
        <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#D2C0DC] bg-[#EEE3F2] px-4 py-3 text-sm text-[#392345] outline-none focus:border-[#168F83] dark:border-[#625777] dark:bg-[#48405F] dark:text-white dark:focus:border-[#42CDB5]"
        >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
        </select>
    </div>
  </div>
        </div>
        {/* Form Actions */}
     <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#D2C0DC] pt-6 dark:border-[#625777] sm:flex-row sm:justify-end">

     <button
        type="button"
        onClick={() => navigate("/admin")}
        className="rounded-xl border border-[#D2C0DC] px-6 py-3 text-sm font-semibold text-[#70577D] transition hover:bg-[#EEE3F2] dark:border-[#625777] dark:text-[#C8BBD9] dark:hover:bg-[#48405F]"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-[#168F83] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#168F83]/20 transition hover:bg-[#11776E] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#42CDB5] dark:text-[#17152C] dark:hover:bg-[#32B69F]"
      >
        {isSubmitting ? "Updating..." : "Update Internship"}
      </button>

    </div>
        </form>
        </div>
        </div>
  );
}

export default EditInternship;