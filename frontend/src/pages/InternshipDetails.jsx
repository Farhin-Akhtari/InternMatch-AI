import { useState, useEffect } from "react";
import {useParams, Link} from "react-router-dom";
import { getInternshipById } from "../services/internshipService";
import { applyToInternship, getMyApplications } from "../services/applicationServices";
import { useAuth } from "../context/AuthContext";

// Add the helper function here
const formatStipend = (stipend) => {
    if (!stipend) return "Not specified";

    const { min, max, currency } = stipend;
    const symbol = currency === "INR" || !currency
        ? "₹"
        : `${currency} `;

    if (min == null && max == null) return "Not specified";

    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN").format(amount);

    if (min != null && max != null) {
        return `${symbol}${formatAmount(min)}–${formatAmount(max)}/month`;
    }

    return `${symbol}${formatAmount(min ?? max)}/month`;
};

function InternshipDetails() {
    const { id } = useParams();
    const { user, authLoading } = useAuth();

    const[internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applying, setApplying] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState("");
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        const fetchInternship = async () => {
            try{
                const response = await getInternshipById(id);
                console.log("Internship API response:", response);
                setInternship(response.data);
            }catch(err){
                 console.error("Internship API error:", err);
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch internships details."
                );
            }finally{
                setLoading(false);
            }
        };
        fetchInternship();
    },[id]);

    useEffect(() => {
    if (authLoading) return;

    if (!user) {
        setIsApplied(false);
        return;
    }

    const checkApplicationStatus = async () => {
        try {
            const response = await getMyApplications();
            const applications = response.data || [];

            const alreadyApplied = applications.some(
                (application) =>
                    String(application.internship?._id) === String(id)
            );

            setIsApplied(alreadyApplied);
        } catch (err) {
            console.error(
                "Failed to check application status:",
                err.response?.data || err.message
            );
        }
    };

    checkApplicationStatus();
}, [id, user, authLoading]);

    const handleApply = async () => {
    if (isApplied || applying) return;

    setApplying(true);
    setApplicationMessage("");

    try {
        const response = await applyToInternship(id);

        setIsApplied(true);
        setApplicationMessage(
            response.message || "Application submitted successfully!"
        );
    } catch (err) {
        if (err.response?.status === 409) {
            // The backend confirms an application already exists.
            setIsApplied(true);
            setApplicationMessage("You have already applied.");
        } else {
            setApplicationMessage(
                err.response?.data?.message ||
                "Failed to submit application. Please try again."
            );
        }
    } finally {
        setApplying(false);
    }
};

    if(loading){
        return <p className="p-8 text-center">Loading internship details...</p>;
    }

    if(error){
        return <p className="p-8 text-center text-red-500">{error}</p>;
    }

    if(!internship){
        return <p className="p-8 text-center">Internship not found</p>
    }

    return (
        <div className="min-h-screen bg-[#FCFAFF] px-4 py-8 text-slate-800 dark:bg-[#0B1020] dark:text-slate-100 sm:px-6 lg:px-10">
             <div className="mx-auto max-w-5xl">

            <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#F9EAF5] dark:text-slate-300 dark:hover:bg-slate-800"
            >
                ← Back to internships
            </Link>

            <div className="mt-6 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827] sm:p-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {internship.company}
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            {internship.title}
                        </h1>

                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            {internship.workMode || "Work mode not specified"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 px-5 py-4 dark:bg-emerald-400/10">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Monthly stipend
                        </p>
                        <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                            {formatStipend(internship.stipend)}
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">

                    <div>
                        <h2 className="text-xl font-bold">About this internship</h2>
                        <p className="mt-3 whitespace-pre-line leading-7 text-slate-600 dark:text-slate-300">
                            {internship.description || "No description provided."}
                        </p>

                        <h2 className="mt-8 text-xl font-bold">Required skills</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {(internship.requiredSkills || []).length > 0 ? (
                                internship.requiredSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-[#F9EAF5] px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No required skills listed.
                                </p>
                            )}
                        </div>

                        <h2 className="mt-8 text-xl font-bold">Preferred skills</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {(internship.preferredSkills || []).length > 0 ? (
                                internship.preferredSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No preferred skills listed.
                                </p>
                            )}
                        </div>
                    </div>

                    <aside className="h-fit rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                        <h2 className="text-lg font-bold">Internship overview</h2>

                        <div className="mt-5 space-y-5">
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Company</p>
                                <p className="mt-1 font-medium">{internship.company}</p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Work mode</p>
                                <p className="mt-1 font-medium">
                                    {internship.workMode || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Application deadline</p>
                                <p className="mt-1 font-medium">
                                    {internship.deadline
                                        ? new Date(internship.deadline).toLocaleDateString("en-IN", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                          })
                                        : "Not specified"}
                                </p>
                            </div>
                        </div>

             <button
                type="button"
               onClick={handleApply}
               disabled={applying || isApplied}
               className="mt-7 flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
              {applying ? "Applying..." : isApplied ? "Applied ✓" : "Apply Now"}
           </button>

               {applicationMessage && (
                  <p
                    role="status"
                    className="mt-3 text-sm text-slate-600 dark:text-slate-300"
                   >
                    {applicationMessage}
                   </p>
                )}
                    </aside>

                </div>
            </div>
        </div>
        </div>
    )

}

export default InternshipDetails;