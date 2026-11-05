
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInternships, deleteInternship } from "../services/internshipService";
import { getAllApplications } from "../services/applicationServices";
import {
    BriefcaseBusiness,
    Search,
    Users,
    CircleCheck,
    Clock,
    Plus,
    ArrowUpRight,
    MapPin,
    Building2,
    Filter,
    LayoutDashboard,
    Pencil,
    Trash2,
    ChevronDown,
} from "lucide-react";

function AdminDashboard() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const navigate = useNavigate();
    const [pendingApplications, setPendingApplications] = useState(null);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await getAllInternships();
                setInternships(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch internships."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInternships();
    }, []);

    useEffect(() => {
      const fetchApplications = async () => {
         try {
            const response = await getAllApplications();

            const pendingCount = response.data.filter(
                (application) => application.status === "pending"
            ).length;

             setPendingApplications(pendingCount);
          } catch (error) {
            console.error("Failed to fetch applications:", error);
         }
       };

     fetchApplications();
    }, []);

    const stats = useMemo(() => [
        {
            title: "Total Internships",
            value: internships.length,
            icon: BriefcaseBusiness,
            color: "emerald",
        },
        {
            title: "Active Listings",
            value: internships.filter((item) => item.status === "active").length,
            icon: CircleCheck,
            color: "blue",
        },
        {
            title: "Draft Listings",
            value: internships.filter((item) => item.status === "draft").length,
            icon: Clock,
            color: "purple",
        },
        {
            title: "Closed Listings",
            value: internships.filter((item) => item.status === "closed").length,
            icon: Users,
            color: "orange",
        },
    ], [internships]);

    const filteredInternships = useMemo(() => {
        return internships.filter((internship) => {
            const matchesSearch =
                internship.title?.toLowerCase().includes(search.toLowerCase()) ||
                internship.company?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                activeFilter === "all" ||
                internship.status === activeFilter;

            return matchesSearch && matchesStatus;
        });
    }, [internships, search, activeFilter]);

    const statColors = {
        emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        blue: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
        purple: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
        orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    };

    const statusColors = {
        active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        draft: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        closed: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
    };

    const handleDelete = async (internshipId) => {
    const isConfirmed = window.confirm(
        "Are you sure you want to delete this internship?"
    );

    if (!isConfirmed) return;

    try {
        await deleteInternship(internshipId);

        setInternships((prev) =>
            prev.filter((internship) => internship._id !== internshipId)
        );

        alert("Internship deleted successfully!");
    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Failed to delete internship. Please try again."
        );
    }
    };

    return (
        <div className="min-h-screen bg-[#FAF7FC] px-4 py-7 text-slate-800 dark:bg-[#0B1020] dark:text-slate-100 sm:px-6 lg:px-9">

            <div className="mx-auto max-w-7xl">

                {/* Welcome section */}
                <section className="relative overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-[#D5F0E5] via-[#C9E3F5] to-[#DCDCF5] p-6 shadow-[0_8px_24px_rgba(56,189,248,0.10)] transition-all duration-300 hover:shadow-[0_14px_32px_rgba(56,189,248,0.25)] dark:border-slate-800 dark:from-[#151D30] dark:via-[#17243A] dark:to-[#10352F] dark:shadow-[0_8px_24px_rgba(148,163,184,0.12)] dark:hover:shadow-[0_14px_32px_rgba(148,163,184,0.30)] sm:p-9">

                    <div className="relative z-10 max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-slate-900/40 dark:text-emerald-400">
                            <LayoutDashboard size={14} />
                            ADMIN WORKSPACE
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-[#263F3B] dark:text-white sm:text-4xl">
                            Welcome back, Admin!
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#47645F] dark:text-slate-300 sm:text-base">
                            Manage internship opportunities and keep track
                            of your platform's activity from one place.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20">
                                <BriefcaseBusiness size={17} />
                                Internship Management
                            </div>
                            <div ClassName="flex flex-col items-start gap-2">
                             <button
                              type="button"
                              onClick={() => navigate("/admin/applications")}
                              className="inline-flex items-center gap-2 rounded-xl border border-[#D2C0DC] bg-[#FAF7FC] px-4 py-2.5 text-sm font-semibold text-[#392345] transition hover:bg-[#F1EAF6] dark:border-[#625777] dark:bg-[#17152C] dark:text-[#F8F3FF] dark:hover:bg-[#24203D]"
                            >
                             <Users size={17} />
                              View Applications
                              <ArrowUpRight size={15} />
                            </button>

                               <p className="mt-2 pl-1 text-xs text-slate-500 dark:text-slate-400">
                                 {pendingApplications === null ? "Loading pending applications..." : `Pending: ${pendingApplications}`}
                               </p>
                            </div>
                        </div>
                    </div>

                    <div className="pointer-events-none absolute -right-10 -top-12 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 right-20 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl" />
                </section>

                {/* Statistics */}
                <section className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold tracking-tight">
                            Overview
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            A quick look at your internship listings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.title}
                                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(190,24,93,0.16)] dark:border-slate-800 dark:bg-[#151D30] dark:hover:shadow-[0_12px_30px_rgba(16,185,129,0.18)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${statColors[stat.color]}`}>
                                            <Icon size={21} />
                                        </div>

                                        <ArrowUpRight
                                            size={18}
                                            className="text-slate-300 dark:text-slate-600"
                                        />
                                    </div>

                                    <p className="mt-5 text-3xl font-bold tracking-tight">
                                        {stat.value}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {stat.title}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Internship management */}
                <section className="mt-9">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">
                                Internship Listings
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                View and manage all internship opportunities.
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {internships.length} Total Listings
                        </span>
                    </div>

                    {/* Search and filters */}
                    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#151D30] sm:flex-row">

                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by internship or company..."
                                className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-slate-500"
                            />
                        </div>

                      <div className="flex items-center gap-2">
                       <Filter size={17} className="text-slate-400" />

                       <div className="relative flex-1 sm:flex-none">
                        <select
                           value={activeFilter}
                           onChange={(e) => setActiveFilter(e.target.value)}
                           className="w-full appearance-none rounded-xl border border-slate-200 bg-[#FCFAFF] py-3 pl-4 pr-10 text-sm outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-[#0B1020] dark:text-white"
                        >
                         <option value="all">All Status</option>
                         <option value="active">Active</option>
                         <option value="draft">Draft</option>
                         <option value="closed">Closed</option>
                        </select>

                       <ChevronDown size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                      </div>
                     </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-[#151D30]">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                                Loading internship listings...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                            {error}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && filteredInternships.length === 0 && (
                        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-[#151D30]">
                            <BriefcaseBusiness
                                size={35}
                                className="mx-auto text-slate-300 dark:text-slate-600"
                            />
                            <h3 className="mt-4 font-semibold">
                                No internships found
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Try changing your search or status filter.
                            </p>
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && filteredInternships.length > 0 && (
                        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#151D30]">

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px] text-left">
                                    <thead className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-[#10182A]">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Internship
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Work Mode
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Location
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                               Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredInternships.map((internship) => (
                                            <tr
                                                key={internship._id}
                                                className="transition hover:bg-emerald-50/40 dark:hover:bg-emerald-500/[0.04]"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                            <BriefcaseBusiness size={19} />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-slate-800 dark:text-slate-100">
                                                                {internship.title}
                                                            </p>
                                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                                <Building2 size={13} />
                                                                {internship.company}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                                                    {internship.workMode}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        {internship.location}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusColors[internship.status] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                        {internship.status}
                                                    </span>
                                                </td>
                                              <td className="px-6 py-5">
                                                <div className="flex items-center gap-5">

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    navigate(`/admin/internships/edit/${internship._id}`)
                                                  }
                                                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                                                >
                                                 <Pencil size={15} />
                                                    Edit
                                                </button>
                                                <button
                                                   type="button"
                                                   onClick={() => handleDelete(internship._id)}
                                                   className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                                                >
                                                  <Trash2 size={15} />
                                                   Delete
                                                </button>

                                              </div>
                                              </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                Showing {filteredInternships.length} of {internships.length} internships
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AdminDashboard;
