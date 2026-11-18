import { useEffect, useState } from "react";
import { getPendingCompanyAdminRequests, approveCompanyAdminRequest, rejectCompanyAdminRequest } from "../../services/authServices";

function CompanyAdminRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [processingId, setProcessingId] = useState("");

    const fetchRequests = async () => {
        try {
            setError("");
            const response = await getPendingCompanyAdminRequests();
            setRequests(response.data.requests);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch company admin requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (userId) => {
        try {
            setProcessingId(userId);
            setActionMessage("");
            await approveCompanyAdminRequest(userId);

            setRequests((prev) =>
                prev.filter((request) => request._id !== userId)
            );

            setActionMessage("Company admin approved successfully.");
        } catch (err) {
            setActionMessage(
                err.response?.data?.message ||
                "Failed to approve company admin."
            );
        } finally {
            setProcessingId("");
        }
    };

    const handleReject = async (userId) => {
        try {
            setProcessingId(userId);
            setActionMessage("");
            await rejectCompanyAdminRequest(userId);

            setRequests((prev) =>
                prev.filter((request) => request._id !== userId)
            );

            setActionMessage("Company admin request rejected.");
        } catch (err) {
            setActionMessage(
                err.response?.data?.message ||
                "Failed to reject company admin."
            );
        } finally {
            setProcessingId("");
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFAFF] px-4 py-8 sm:px-6 lg:px-10 dark:bg-[#0B1020]">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-pink-500 dark:text-emerald-400">
                        Platform Administration
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl dark:text-white">
                        Company Requests
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Review company registrations, verify their email
                        status, and manage access to InternMatch AI.
                    </p>
                </div>

                {/* Summary Card */}
                <div className="mb-8 rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 via-white to-teal-50 p-6 shadow-sm dark:border-slate-700 dark:from-[#151D30] dark:via-[#151D30] dark:to-[#102A29]">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Pending Registrations
                            </p>

                            <p className="mt-2 text-4xl font-bold text-slate-800 dark:text-white">
                                {requests.length}
                            </p>

                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Company accounts awaiting review
                            </p>
                        </div>

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-3xl dark:bg-emerald-400/10">
                            🏢
                        </div>
                    </div>
                </div>

                {/* Action Message */}
                {actionMessage && (
                    <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {actionMessage}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-[#151D30]">
                        <p className="text-slate-500 dark:text-slate-400">
                            Loading company requests...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
                        <p className="text-red-600 dark:text-red-300">
                            {error}
                        </p>

                        <button
                            onClick={fetchRequests}
                            className="mt-4 rounded-xl bg-pink-500 px-5 py-2.5 font-semibold text-white transition hover:bg-pink-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && requests.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-pink-200 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-[#151D30]">
                        <div className="mb-4 text-5xl">🎉</div>

                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            All caught up!
                        </h2>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            There are no pending company registrations
                            at the moment.
                        </p>
                    </div>
                )}

                {/* Request Cards */}
                {!loading && !error && requests.length > 0 && (
                    <div className="space-y-5">
                        {requests.map((request) => {
                            const isProcessing =
                                processingId === request._id;

                            return (
                                <div
                                    key={request._id}
                                    className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/20 dark:border-slate-700/70 dark:bg-[#151D30] dark:hover:border-emerald-500/30 dark:hover:shadow-xl dark:hover:shadow-emerald-500/10"
                                >
                                    {/* Company Heading */}
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                                {request.companyName}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                Registration request
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                                            Pending Review
                                        </span>
                                    </div>

                                    {/* Company Details */}
                                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Admin Name
                                            </p>

                                            <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                                                {request.fullName}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Email Address
                                            </p>

                                            <p className="mt-1 break-all font-medium text-slate-700 dark:text-slate-200">
                                                {request.email}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Company Website
                                            </p>

                                            {request.companyWebsite ? (
                                                <a
                                                    href={request.companyWebsite}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-1 inline-block break-all font-medium text-teal-600 hover:underline dark:text-emerald-400"
                                                >
                                                    {request.companyWebsite}
                                                </a>
                                            ) : (
                                                <p className="mt-1 text-slate-400">
                                                    Not provided
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Email Verification
                                            </p>

                                            <p
                                                className={`mt-1 font-semibold ${
                                                    request.emailVerified
                                                        ? "text-green-600 dark:text-emerald-400"
                                                        : "text-amber-600 dark:text-amber-400"
                                                }`}
                                            >
                                                {request.emailVerified
                                                    ? "✓ Verified"
                                                    : "⚠ Not verified"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
                                        <button
                                            onClick={() =>
                                                handleReject(request._id)
                                            }
                                            disabled={isProcessing}
                                            className="rounded-xl border border-red-200 px-5 py-2.5 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                                        >
                                            {isProcessing
                                                ? "Processing..."
                                                : "Reject"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleApprove(request._id)
                                            }
                                            disabled={
                                                isProcessing ||
                                                !request.emailVerified
                                            }
                                            title={
                                                !request.emailVerified
                                                    ? "Email must be verified before approval."
                                                    : ""
                                            }
                                            className="rounded-xl bg-pink-500 px-5 py-2.5 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                                        >
                                            {isProcessing
                                                ? "Processing..."
                                                : "Approve Company"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompanyAdminRequests;