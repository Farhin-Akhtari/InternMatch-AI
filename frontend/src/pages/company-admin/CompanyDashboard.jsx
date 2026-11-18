import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInternships } from "../../services/internshipService";
import { getAllApplications } from "../../services/applicationServices";

function CompanyDashboard() {
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
          try {
             setLoading(true);
             setError("");

             const [internshipResponse, applicationResponse] = await Promise.all([
                 getAllInternships(),
                 getAllApplications()
                ]);

              setInternships(internshipResponse.data || []);
              setApplications(applicationResponse.data || []);

            } catch (err) {
                  setError(
                     err.response?.data?.message ||
                     "Failed to load dashboard data."
                  );
                 } finally {
                        setLoading(false);
                    }
        };

     fetchDashboardData();
    }, []);

    const totalInternships = internships.length;

    const activeInternships = internships.filter(
        (internship) => internships.status === "active"
    ).length;

    const closedInterships = internships.filter(
        (internship) => internships.status === "closed"
    ).length;

    const totalApplications = applications.length;

    const navigate = useNavigate();

    const handleCreateInternship = () => {
     navigate("/admin/internships/create");
    };

    const handleManageInternships = () => {
    navigate("/company-admin/internships");
    };

    const handleViewApplications = () => {
    navigate("/company-admin/applications");
    };

    if(loading){
        return (
         <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] dark:bg-[#0B1020]">
            <p className="text-slate-600 dark:text-slate-300">
                Loading dashboard...
            </p>
         </div>
        );
    }

    if (error) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] dark:bg-[#0B1020]">
             <p className="text-red-500">{error}</p>
         </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF7FC] px-6 py-8 dark:bg-[#0B1020]">
        <div className="mb-8">
    <p className="text-sm font-semibold uppercase tracking-wider text-pink-500 dark:text-emerald-400">
        Company Workspace
    </p>

    <h1 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
        Welcome back, Company Admin!
    </h1>

    <p className="mt-2 text-slate-500 dark:text-slate-400">
        Manage your internships and track applications in one place.
    </p>
</div>

<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Internships
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-600 dark:text-white">
            {totalInternships}
        </h2>
    </div>

    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
            Active Internships
        </p>
        <h2 className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {activeInternships}
        </h2>
    </div>

    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
            Closed Internships
        </p>
        <h2 className="mt-3 text-3xl font-bold text-red-600 dark:text-white">
            {closedInterships}
        </h2>
    </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
         <p className="text-sm text-slate-500 dark:text-slate-400">
             Total Applications
         </p>
         <h2 className="mt-3 text-3xl font-bold text-blue-500 dark:text-emerald-400">
            {totalApplications}
         </h2>
       </div>
        </div>
        <div className="mt-10">
    <h2 className="mb-5 text-xl font-bold text-slate-800 dark:text-white">
        Quick Actions
    </h2>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <button
            onClick={handleCreateInternship}
             className="rounded-2xl bg-white p-6 text-left shadow-[0_10px_28px_rgba(244,114,182,0.12)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(244,114,182,0.18)] dark:bg-slate-900  dark:shadow-[0_10px_28px_rgba(45,212,191,0.10)] dark:hover:shadow-[0_12px_30px_rgba(45,212,191,0.18)]"
        >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Create Internship
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Post a new internship opportunity for students.
            </p>
        </button>

        <button
            onClick={handleManageInternships}
            className="rounded-2xl bg-white p-6 text-left shadow-[0_10px_28px_rgba(244,114,182,0.12)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(244,114,182,0.18)] dark:bg-slate-900  dark:shadow-[0_10px_28px_rgba(45,212,191,0.10)] dark:hover:shadow-[0_12px_30px_rgba(45,212,191,0.18)]"
        >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Manage Internships
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                View and manage your existing internships.
            </p>
        </button>

        <button
            onClick={handleViewApplications}
            className="rounded-2xl bg-white p-6 text-left shadow-[0_10px_28px_rgba(244,114,182,0.12)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(244,114,182,0.18)] dark:bg-slate-900  dark:shadow-[0_10px_28px_rgba(45,212,191,0.10)] dark:hover:shadow-[0_12px_30px_rgba(45,212,191,0.18)]"
        >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Manage Applications
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Review applications submitted to your internships.
            </p>
        </button>
    </div>
</div>
        </div>
    );
}

export default CompanyDashboard;