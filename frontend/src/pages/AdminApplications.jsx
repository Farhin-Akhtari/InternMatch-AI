import { useState, useEffect } from "react";
import {getAllApplications, updateApplicationStatus} from "../services/applicationServices";
import {Search, ChevronDown, Users, Clock, Eye, CheckCircle, Circle} from "lucide-react";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const filteredApplications = applications.filter((application) => {
  const search = searchQuery.toLowerCase();

  const studentName = application.student?.fullName?.toLowerCase() || "";
  const studentEmail = application.student?.email?.toLowerCase() || "";
  const internshipTitle = application.internship?.title?.toLowerCase() || "";

  const matchesSearch =
    studentName.includes(search) ||
    studentEmail.includes(search) ||
    internshipTitle.includes(search);

  const matchesStatus =
    statusFilter === "all" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (applicationId, status) => {
    try {
        setError("");
        setUpdating(true);

        await updateApplicationStatus(applicationId, status);

        setApplications((prevApplications) =>
            prevApplications.map((application) =>
                application._id === applicationId
                    ? { ...application, status }
                    : application
            )
        );

        setSelectedApplication(null);
        return true;
    } catch (error) {
        console.error("Error updating application status:", error);
        setError("Failed to update application status. Please try again.");
    } finally {
        setUpdating(false);
    }
  };

 useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await getAllApplications();
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
       setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchApplications();
 }, []);

 const handleRetry = async () => {
    setLoading(true);
    setError("");

    try {
        const response = await getAllApplications();
        setApplications(response.data || []);
    } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to fetch applications. Please try again later.");
    } finally {
        setLoading(false);
    }
  };

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(application => application.status === "pending").length;
  const reviewedApplications = applications.filter(application => application.status === "reviewed").length;
  const acceptedApplications = applications.filter(application => application.status === "accepted").length;
  const rejectedApplications = applications.filter(application => application.status === "rejected").length;

  return (
    <div className="min-h-screen bg-[#FAF7FC] px-4 py-8 text-[#392345] dark:bg-[#17152C] dark:text-[#F8F3FF] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
<div className="mb-8 overflow-hidden rounded-3xl border border-[#B9DCD4] bg-gradient-to-br from-[#D5F0E5] via-[#C9E3F5] to-[#DCDCF5] p-7 shadow-md dark:border-[#285B54] dark:bg-gradient-to-br dark:from-[#172C2B] dark:via-[#1B3935] dark:to-[#20534A] sm:p-9">

  <p className="mb-2 text-sm font-semibold tracking-wider text-[#08796F] dark:text-[#55DCC1]">
    ADMINISTRATION / APPLICATIONS
  </p>

  <h1 className="text-3xl font-bold text-[#263F3B] dark:text-[#F0FFF9] sm:text-4xl">
    Application Management
  </h1>

  <p className="mt-3 max-w-2xl text-sm text-[#52716A] dark:text-[#B9DCD4] sm:text-base">
    Review student applications, track their progress, and manage
    application decisions from one place.
  </p>
</div>

        {/* Statistics Cards */}
        {error && (
  <p className="mb-5 rounded-xl bg-rose-100 p-4 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
    {error}
  </p>
)}
<div className="mb-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">

  {/* Total Applications */}
  <div className="col-span-2 rounded-2xl border border-[#D2C0DC] bg-white p-5 shadow-sm dark:border-[#625777] dark:bg-[#292443]  sm:col-span-2 lg:col-span-1">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-medium text-[#70577D] dark:text-[#C8BBD9]">
        Total Applications
      </p>
      <div className="rounded-xl bg-[#EDE3FA] p-2.5 text-[#8054B8] dark:bg-[#45365F] dark:text-[#C5A5F5]">
        <Users size={20} />
      </div>
    </div>
    <h2 className="text-3xl font-bold">{totalApplications}</h2>
    <p className="mt-2 text-xs text-[#70577D] dark:text-[#C8BBD9]">
      All received applications
    </p>
  </div>

  {/* Pending */}
  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/30">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
        Pending
      </p>
      <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
        <Clock size={20} />
      </div>
    </div>
    <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-200">{pendingApplications}</h2>
    <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
      Awaiting review
    </p>
  </div>

  {/* Reviewed */}
  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/30">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-medium text-sky-800 dark:text-sky-300">
        Reviewed
      </p>
      <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
        <Eye size={20} />
      </div>
    </div>
    <h2 className="text-3xl font-bold text-sky-900 dark:text-sky-200">{reviewedApplications}</h2>
    <p className="mt-2 text-xs text-sky-700 dark:text-sky-300">
      Applications reviewed
    </p>
  </div>

  {/* Accepted */}
  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
        Accepted
      </p>
      <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
        <CheckCircle size={20} />
      </div>
    </div>
    <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-200">{acceptedApplications}</h2>
    <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
      Successful applications
    </p>
  </div>

  {/* Rejected */}
  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/30">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-medium text-rose-800 dark:text-rose-300">
        Rejected
      </p>
      <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
        <Circle size={20} />
      </div>
    </div>
    <h2 className="text-3xl font-bold text-rose-900 dark:text-rose-200">{rejectedApplications}</h2>
    <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">
      Unsuccessful applications
    </p>
  </div>

 </div>

        {/* Search and Filters */}
<div className="mb-8 rounded-3xl border border-[#D8C9E1] bg-white p-5 shadow-sm dark:border-[#285B54] dark:bg-[#202D2D] sm:p-6">

  <div className="mb-5">
    <h2 className="text-xl font-bold text-[#392345] dark:text-[#F0FFF9]">
      Find Applications
    </h2>
    <p className="mt-1 text-sm text-[#70577D] dark:text-[#B9DCD4]">
      Search applicants or filter applications by their current status.
    </p>
  </div>

  <div className="flex flex-col gap-4 md:flex-row">

  {/* Search */}
 <div className="relative flex-1">
  <Search
    size={20}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#168F83]"
  />

  <input
    type="text"
    placeholder="Search by student name, email or internship..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full rounded-xl border border-[#D2C0DC] bg-[#FAF7FC] py-3 pl-11 pr-4 text-sm text-[#392345] outline-none transition focus:border-[#168F83] focus:ring-2 focus:ring-[#168F83]/20 dark:border-[#625777] dark:bg-[#303A3B] dark:text-[#F8F3FF] dark:placeholder:text-[#B9DCD4]"
   />
  </div>

  {/* Status Filter */}
  <div className="relative md:w-52">
   <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full appearance-none rounded-xl border border-[#D2C0DC] bg-[#FAF7FC] py-3 pl-4 pr-12 text-sm font-medium text-[#392345] outline-none focus:border-[#168F83] focus:ring-2 focus:ring-[#168F83]/20 dark:border-[#625777] dark:bg-[#303A3B] dark:text-[#F8F3FF]"
    >
    <option value="all">All Applications</option>
    <option value="pending">Pending</option>
    <option value="reviewed">Reviewed</option>
    <option value="accepted">Accepted</option>
    <option value="rejected">Rejected</option>
   </select>

   <ChevronDown
    size={18}
    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#168F83] dark:text-[#55DCC1]"
   />
  </div>

    {/* Clear Filters */}
    <button
      onClick={() => {
        setSearchQuery("");
        setStatusFilter("all");
      }}
      className="rounded-xl border border-[#B9DCD4] px-5 py-3 text-sm font-semibold text-[#08796F] transition hover:bg-[#E5F4EF] dark:border-[#285B54] dark:text-[#55DCC1] dark:hover:bg-[#203B3A]"
    >
      Clear Filters
    </button>

    </div>
   </div>

        {/* Applications Table */}
<div className="overflow-hidden rounded-3xl border border-[#D8C9E1] bg-white shadow-sm dark:border-[#285B54] dark:bg-[#202D2D]">

    {loading ? (
        <div className="px-5 py-16 text-center">
            <p className="text-[#70577D] dark:text-[#B9DCD4]">
                Loading applications...
            </p>
        </div>
        ) : error && applications.length === 0 ? (
    <div className="px-5 py-16 text-center">
        <h3 className="text-lg font-semibold text-[#35243F] dark:text-white">
            Unable to load applications
        </h3>

        <p className="mt-2 text-sm text-[#70577D] dark:text-[#B9DCD4]">
            We couldn't retrieve applications. Please try again.
        </p>

        <button
            onClick={handleRetry}
            className="mt-5 rounded-xl bg-[#2F8F78] px-5 py-2.5 font-medium text-white transition hover:bg-[#267763]"
        >
            Retry
        </button>
    </div>
    ) : (
        <>

  {/* Table Header */}
  <div className="border-b border-[#E5D9EB] p-5 dark:border-[#405451] sm:p-6">
    <h2 className="text-xl font-bold text-[#392345] dark:text-[#F0FFF9]">
      All Applications
    </h2>

    <p className="mt-1 text-sm text-[#70577D] dark:text-[#B9DCD4]">
      Showing {filteredApplications.length} of {totalApplications} applications
    </p>
  </div>

  {filteredApplications.length === 0 ? (
    /* Empty State */
    <div className="px-5 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F4EF] text-[#168F83] dark:bg-[#203B3A] dark:text-[#55DCC1]">
        <Search size={30} />
      </div>

      <h3 className="text-lg font-semibold text-[#392345] dark:text-[#F0FFF9]">
        No applications found
      </h3>

      <p className="mt-2 text-sm text-[#70577D] dark:text-[#B9DCD4]">
        Try changing your search or status filter.
      </p>
    </div>

  ) : (

    /* Applications Table */
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left">
        <thead className="bg-[#F5F0F8] dark:bg-[#293A39]">
          <tr className="text-xs uppercase tracking-wider text-[#70577D] dark:text-[#B9DCD4]">
            <th className="px-6 py-4 font-semibold">Student</th>
            <th className="px-6 py-4 font-semibold">Internship</th>
            <th className="px-6 py-4 font-semibold">Applied On</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#EDE5F1] dark:divide-[#405451]">
          {filteredApplications.map((application) => (
            <tr
              key={application._id}
              className="transition hover:bg-[#FAF7FC] dark:hover:bg-[#293A39]"
            >
              {/* Student */}
              <td className="px-6 py-5">
                <p className="font-semibold text-[#392345] dark:text-[#F0FFF9]">
                  {application.student?.fullName || "Unknown Student"}
                </p>
                <p className="mt-1 text-sm text-[#70577D] dark:text-[#B9DCD4]">
                  {application.student?.email || "No email"}
                </p>
                <button
                  onClick={() => setSelectedApplicant(application)}
                  className="mt-2 text-sm font-semibold text-[#08796F] transition hover:underline dark:text-[#55DCC1]"
                  >
                    View Profile →
                </button>
              </td>

              {/* Internship */}
              <td className="px-6 py-5">
                <p className="font-semibold text-[#392345] dark:text-[#F0FFF9]">
                  {application.internship?.title || "Unknown Internship"}
                </p>
                <p className="mt-1 text-sm text-[#70577D] dark:text-[#B9DCD4]">
                   {application.internship?.company || "Unknown Company"}
                   {" · "}
                   {application.internship?.location || "Location not specified"}
                   {" · "}
                   {application.internship?.workMode || "Work mode not specified"}
                </p>
              </td>

              {/* Applied Date */}
              <td className="px-6 py-5 text-sm text-[#70577D] dark:text-[#B9DCD4]">
                {new Date(application.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize
                    ${
                      application.status === "pending"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                        : application.status === "reviewed"
                        ? "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
                        : application.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                    }`}
                >
                  {application.status}
                </span>
              </td>

              {/* Action */}
              <td className="px-6 py-5">
                <button
                  onClick={() => setSelectedApplication(application)}
                  className="rounded-lg bg-[#E5F4EF] px-4 py-2 text-sm font-semibold text-[#08796F] transition hover:bg-[#D0EDE3] dark:bg-[#203B3A] dark:text-[#55DCC1] dark:hover:bg-[#28534C]"
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   )}
   </>
    )}
 </div>

      </div>
      {selectedApplication && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#24213B]">

            <h2 className="text-xl font-bold text-[#263F3B] dark:text-white">
                Manage Application
            </h2>

            <div className="mt-5 space-y-3">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Student
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                        {selectedApplication.student?.fullName}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Internship
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                        {selectedApplication.internship?.title}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current Status
                    </p>
                    <p className="font-semibold capitalize text-gray-800 dark:text-white">
                        {selectedApplication.status}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <p className="mb-3 font-semibold text-gray-800 dark:text-white">
                    Update Status
                </p>

                <div className="flex flex-wrap gap-2">
                    {["reviewed", "accepted", "rejected"].map((status) => (
                        <button
                            key={status}
                            disabled={updating || selectedApplication.status === status}
                            onClick={() =>
                             setPendingStatus({
                             applicationId: selectedApplication._id,
                             status
                             })
                            }
                            className="rounded-xl bg-[#E5F4EF] px-4 py-2 text-sm font-semibold capitalize text-[#08796F] transition hover:bg-[#CDEBDD] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#24443D] dark:text-[#8DE5C7] dark:hover:bg-[#31594F]"
                        >
                            {updating ? "Updating..." : status}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => setSelectedApplication(null)}
                disabled={updating}
                className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#302C49]"
            >
                Close
            </button>
        </div>
    </div>
 )}
 {pendingStatus && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-[#24213B]">

            <h2 className="text-xl font-bold text-[#263F3B] dark:text-white">
                Confirm Status Update
            </h2>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to change this application's status to{" "}
                <span className="font-bold capitalize">
                    {pendingStatus.status}
                </span>
                ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={() => setPendingStatus(null)}
                    disabled={updating}
                    className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#302C49]"
                >
                    Cancel
                </button>

                <button
                   onClick={async () => {
                     const success = await handleStatusUpdate(
                     pendingStatus.applicationId,
                     pendingStatus.status
                    );

                    if (success) {
                     setPendingStatus(null);
                    }
                   }}
                    disabled={updating}
                    className="rounded-xl bg-[#08796F] px-4 py-2 font-semibold text-white transition hover:bg-[#06665E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {updating ? "Updating..." : "Confirm"}
                </button>
            </div>
        </div>
    </div>
)}
{selectedApplicant && (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-[#24213B]">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#263F3B] dark:text-white">
                        Applicant Profile
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Student information and technical skills
                    </p>
                </div>

                <button
                    onClick={() => setSelectedApplicant(null)}
                    className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#302C49]"
                    aria-label="Close applicant profile"
                >
                    ×
                </button>
            </div>

            {/* Student Information */}
            <div className="mt-6 rounded-xl bg-[#F7F3FA] p-4 dark:bg-[#302C49]">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full Name
                </p>
                <p className="mt-1 font-semibold text-[#392345] dark:text-white">
                    {selectedApplicant.student?.fullName || "Not provided"}
                </p>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Email Address
                </p>
                <p className="mt-1 break-all font-medium text-[#392345] dark:text-white">
                    {selectedApplicant.student?.email || "Not provided"}
                </p>
            </div>

            {/* Technical Skills */}
            <div className="mt-5">
                <h3 className="font-semibold text-[#263F3B] dark:text-white">
                    Technical Skills
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                    {Array.isArray(selectedApplicant.student?.skills) &&
                    selectedApplicant.student.skills.length > 0 ? (
                        selectedApplicant.student.skills.map((skill, index) => (
                            <span
                                key={`${skill}-${index}`}
                                className="rounded-full bg-[#E5F4EF] px-3 py-1.5 text-sm font-medium text-[#08796F] dark:bg-[#24443D] dark:text-[#8DE5C7]"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No skills added to this student's account yet.
                        </p>
                    )}
                </div>
            </div>

            {/* Internship Information */}
            <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
                <h3 className="font-semibold text-[#263F3B] dark:text-white">
                    Applied Internship
                </h3>

                <p className="mt-2 font-medium text-[#392345] dark:text-white">
                    {selectedApplicant.internship?.title || "Unknown Internship"}
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {selectedApplicant.internship?.company || "Unknown Company"}
                    {" · "}
                    {selectedApplicant.internship?.location || "Location not specified"}
                </p>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Application Status
                </p>

                <p className="mt-1 font-semibold capitalize text-[#08796F] dark:text-[#55DCC1]">
                    {selectedApplicant.status}
                </p>
            </div>

            {/* Footer */}
            <button
                onClick={() => setSelectedApplicant(null)}
                className="mt-6 w-full rounded-xl bg-[#08796F] py-2.5 font-semibold text-white transition hover:bg-[#06665E]"
            >
                Close Profile
            </button>
        </div>
    </div>
)}
    </div>
  );
}

export default AdminApplications;