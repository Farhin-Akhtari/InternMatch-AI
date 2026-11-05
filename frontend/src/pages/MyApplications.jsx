import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationServices";
import { useAuth } from "../context/AuthContext";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user, authLoading } = useAuth();

    useEffect(() => {
    if (authLoading) return;

    if (!user) {
        setError("Please log in to view your applications.");
        setLoading(false);
        return;
    }

    const fetchApplications = async () => {
        try {
            setError("");
            const response = await getMyApplications();
            setApplications(response.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load your applications."
            );
        } finally {
            setLoading(false);
        }
    };

    fetchApplications();
}, [user, authLoading]);

    return (
        <div className="min-h-screen bg-[#FCFAFF] px-4 py-8 text-slate-800 dark:bg-[#0B1020] dark:text-slate-100 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold tracking-tight">
                    My Applications
                </h1>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Track your internship applications and their status.
                </p>

                {loading ? (
                    <p className="mt-8 text-slate-500 dark:text-slate-400">
                        Loading applications...
                    </p>
                ) : error ? (
                    <p className="mt-8 text-red-500">{error}</p>
                ) : applications.length === 0 ? (
                    <p className="mt-8 text-slate-500 dark:text-slate-400">
                        You haven't applied to any internships yet.
                    </p>
                ) : (
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {applications.map((application) => (
                            <article
                             key={application._id}
                             className="rounded-2xl border border-[#EADCEC] bg-gradient-to-br from-[#FFF5FA] via-[#F8F4FF] to-[#EFF8FF] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-emerald-400/15 dark:bg-gradient-to-br dark:from-[#151D30] dark:via-[#111827] dark:to-[#0D1724] dark:shadow-[0_8px_30px_rgba(0,0,0,0.18)] dark:hover:border-emerald-400/35 dark:hover:shadow-[0_12px_35px_rgba(16,185,129,0.10)]"
                            >
                                <h2 className="text-lg font-bold">
                                    {application.internship?.title ||
                                        "Internship"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {application.internship?.company ||
                                        "Company not available"}
                                </p>

                                <div className="mt-5">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Application status
                                    </p>

                                    <span className="mt-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300">
                                        {application.status || "Pending"}
                                    </span>
                                </div>

                                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                                    Applied on:{" "}
                                    {application.createdAt
                                        ? new Date(
                                              application.createdAt
                                          ).toLocaleDateString("en-IN")
                                        : "Date unavailable"}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyApplications;
