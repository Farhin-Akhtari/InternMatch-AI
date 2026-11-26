import { useEffect, useState } from "react";
import { getSavedInternships, removeSavedInternship } from "../services/savedInternshipServices";
import { Link } from "react-router-dom";

function SavedInternships(){
    const [savedInternships, setSavedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
     const fetchSavedInternships = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getSavedInternships();

            setSavedInternships(response.data);

        } catch (error) {
            console.error(
                "Failed to fetch saved internships:",
                error.response?.data || error.message
            );

            setError("Failed to load saved internships. Please try again.");

        } finally {
            setLoading(false);
        }
     };
 
     fetchSavedInternships();
    }, []);

    const handleRemoveSavedInternship = async(internshipId) => {
        try{
            await removeSavedInternship(internshipId);
            setSavedInternships(preSaved => 
                preSaved.filter(
                    saved => saved.internship?._id !== internshipId
                )
            );
        }catch(error){
            console.error("Failed to remove saved internship:",
                error.response?.data || error.message
            );
        }
    };

    if (loading) {
     return <p>Loading saved internships...</p>;
    }

    if (error) {
     return <p>{error}</p>;
    } 
    
return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-[#0B1220]">
        <div className="mx-auto max-w-6xl">

            {/* Page Heading */}
            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-600 dark:text-emerald-400">
                    Your collection
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
                    Saved Internships
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Keep track of the opportunities you're interested in.
                </p>

                <div className="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-teal-500" />
            </div>

            {/* Empty State */}
            {savedInternships.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 dark:bg-slate-800 dark:text-pink-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            className="h-8 w-8"
                        >
                            <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.75L6 21V4.75Z" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                        No saved internships yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Found an interesting opportunity? Save it here so you can easily find it later.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                    >
                        Explore Internships
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Saved Count */}
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Your saved opportunities
                        </p>

                        <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {savedInternships.length} saved
                        </span>
                    </div>

                    {/* Internship Cards */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                        {savedInternships.map(saved => {
                            const internship = saved.internship;

                            if (!internship) {
                                return (
                                    <article
                                        key={saved._id}
                                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        <h2 className="font-semibold text-slate-800 dark:text-white">
                                            Internship no longer available
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                            This internship may have been permanently deleted.
                                        </p>
                                    </article>
                                );
                            }

                            const isUnavailable =
                                internship.isDeleted ||
                                internship.status !== "active";

                            return (
                                <article
                                    key={saved._id}
                                    className="group relative overflow-hidden rounded-2xl border border-[#D8CDD9] bg-gradient-to-br from-rose-50 via-white to-teal-50 p-6 shadow-[0_8px_24px_rgba(71,55,75,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B9A7BC] hover:shadow-[0_12px_30px_rgba(71,55,75,0.18)] dark:border-slate-600 dark:bg-none dark:bg-slate-900 dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] dark:hover:border-emerald-400/70 dark:hover:shadow-[0_12px_32px_rgba(16,185,129,0.16)]"
                                >
                                    {/* Top Accent */}
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 via-teal-400 to-sky-400 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h2 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                                {internship.title}
                                            </h2>

                                            <p className="mt-1 font-medium text-slate-600 dark:text-slate-300">
                                                {internship.company}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-lg bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 dark:bg-pink-500/10 dark:text-pink-300">
                                            Saved
                                        </span>
                                    </div>

                                    {/* Internship Information */}
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                            {internship.workMode}
                                        </span>

                                        {internship.location && (
                                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                {internship.location}
                                            </span>
                                        )}
                                    </div>

                                    {internship.description && (
                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                            {internship.description}
                                        </p>
                                    )}

                                    {/* Availability */}
                                    {isUnavailable && (
                                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                            <span className="h-2 w-2 rounded-full bg-red-500" />
                                            This internship is no longer available.
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                        {!isUnavailable ? (
                                            <Link
                                                to={`/internships/${internship._id}`}
                                                className="inline-flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700 transition-all duration-300 hover:bg-teal-100 hover:shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                                            >
                                                View Details
                                                <span aria-hidden="true">→</span>
                                            </Link>
                                        ) : (
                                            <span className="text-sm font-medium text-slate-400">
                                                Unavailable
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveSavedInternship(internship._id)
                                            }
                                            className="rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    </div>
);
}

export default SavedInternships;