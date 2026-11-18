import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getAllInternships, deleteInternship} from "../../services/internshipService";

import {
    BriefcaseBusiness,
    Search,
    MapPin,
    Building2,
    Filter,
    Pencil,
    Trash2,
    ChevronDown,
} from "lucide-react";

function CompanyInternships() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const navigate = useNavigate();

    useEffect(() => {
    const fetchInternships = async () => {
        try {
            const response = await getAllInternships();
            setInternships(response.data || []);
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

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Manage Internships
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    View, edit, and manage your company's internship listings.
                </p>
            </div>

            <button
                type="button"
                onClick={() => navigate("/admin/internships/create")}
                className="rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-pink-500/20 transition hover:bg-pink-600 dark:bg-emerald-600 dark:shadow-emerald-600/20 dark:hover:bg-emerald-500"
            >
                + Create Internship
            </button>
        </div>
        {/* Search and filters */}
<div className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#151D30] sm:flex-row">

    {/* Search */}
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
            className="w-full rounded-xl border border-slate-200 bg-[#FCFAFF] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10 dark:border-slate-700 dark:bg-[#0B1020] dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/10"
        />
    </div>

    {/* Status filter */}
    <div className="flex items-center gap-2">
        <Filter size={17} className="text-slate-400" />

        <div className="relative flex-1 sm:flex-none">
            <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-[#FCFAFF] py-3 pl-4 pr-10 text-sm outline-none focus:border-pink-400 dark:border-slate-700 dark:bg-[#0B1020] dark:text-white dark:focus:border-emerald-400"
            >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
            </select>

            <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
        </div>
    </div>
</div>
   {loading && (
     <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-[#151D30]">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-100 border-t-pink-500 dark:border-emerald-900 dark:border-t-emerald-500" />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading internship listings...
        </p>
     </div>
    )}

    {error && (
     <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
        {error}
     </div>
    )}

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

    {/* Internship table */}
{!loading && !error && filteredInternships.length > 0 && (
    <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#151D30]">

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
                            className="transition hover:bg-pink-50/40 dark:hover:bg-emerald-500/[0.04]"
                        >
                            {/* Internship details */}
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <BriefcaseBusiness size={19} />
                                    </div>

                                    <div>
                                        <button
                                          type="button"
                                          onClick={() => navigate(`/internships/${internship._id}`)}
                                          className="text-left font-semibold text-slate-800 transition hover:text-pink-600 hover:underline dark:text-slate-100 dark:hover:text-emerald-400"
                                        >
                                          {internship.title}
                                        </button>
                                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <Building2 size={13} />
                                            {internship.company}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Work mode */}
                            <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                                {internship.workMode}
                            </td>

                            {/* Location */}
                            <td className="px-6 py-5">
                                <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                                    <MapPin size={14} className="text-slate-400" />
                                    {internship.location}
                                </span>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-5">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                                    internship.status === "active"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                        : internship.status === "draft"
                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                        : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                                }`}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {internship.status}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/admin/internships/edit/${internship._id}`)
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
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

    </div>
</div>
    );
}

export default CompanyInternships;