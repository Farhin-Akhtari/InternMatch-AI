import { useMemo, useState } from "react";

const internships = [
    {
        id: 1,
        role: "Frontend Developer Intern",
        company: "TechNova",
        location: "Remote",
        type: "Frontend",
        skills: ["React", "JavaScript", "CSS"],
        stipend: "₹15k–20k/month",
        color: "pink",
    },
    {
        id: 2,
        role: "Backend Developer Intern",
        company: "CloudCore",
        location: "Hybrid",
        type: "Backend",
        skills: ["Node.js", "Express", "MongoDB"],
        stipend: "₹18k–25k/month",
        color: "teal",
    },
    {
        id: 3,
        role: "AI/ML Intern",
        company: "NeuralWorks",
        location: "Remote",
        type: "AI/ML",
        skills: ["Python", "Machine Learning", "Data"],
        stipend: "₹20k–30k/month",
        color: "blue",
    },
];

const categories = ["All", "Frontend", "Backend", "AI/ML"];

function Home() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLocation, setActiveLocation] = useState("All");

    // Filter internship data using the search and selected filters.
    const filteredInternships = useMemo(() => {
        return internships.filter((internship) => {
            const matchesCategory =
                activeCategory === "All" ||
                internship.type === activeCategory;

            const matchesLocation =
                activeLocation === "All" ||
                internship.location === activeLocation;

            const searchableText = [
                internship.role,
                internship.company,
                internship.location,
                internship.type,
                ...internship.skills,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchableText.includes(
                search.trim().toLowerCase()
            );

            return (
                matchesCategory &&
                matchesLocation &&
                matchesSearch
            );
        });
    }, [search, activeCategory, activeLocation]);

    const clearFilters = () => {
        setSearch("");
        setActiveCategory("All");
        setActiveLocation("All");
    };

    return (
        <div className="min-h-screen bg-[#FCFAFF] text-[#29253B] transition-colors duration-300 ease-in-out dark:bg-[#0B1020] dark:text-slate-100">

            {/* ================= HERO SECTION ================= */}
            <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#F9EAF5] via-[#FCFAFF] to-[#E4F1FF] transition-colors duration-300 ease-in-out dark:bg-none dark:bg-[#0B1020]">

                {/* Decorative background accents */}
                <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-pink-300/30 blur-3xl dark:bg-emerald-400/10" />

                <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl dark:bg-teal-400/10" />

                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-10 lg:py-24">

                    {/* Hero text and search */}
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-sm font-medium text-[#A24E85] shadow-sm dark:border-emerald-400/20 dark:bg-[#151C2E] dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-teal-500 dark:bg-emerald-400" />
                            Your career journey starts here
                        </span>

                       <h1 className="mt-6 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight min-[400px]:text-4xl sm:mt-7 sm:text-5xl lg:text-6xl">
                            Find internships that{" "}
                            <span className="bg-gradient-to-r from-[#C65D9B] via-[#168F83] to-[#478FD0] bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300">
                                fit your future.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-[#71677D] sm:text-lg dark:text-slate-400">
                            Discover exciting opportunities, showcase your
                            skills, and take the next step toward your dream
                            career with InternMatch AI.
                        </p>

                        {/* Search input */}
                       
                      <div className="mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/80 bg-white/90 p-2.5 shadow-lg shadow-pink-400/20 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:shadow-slate-400/50 focus-within:shadow-2xl focus-within:shadow-slate-400/50 sm:mt-9 sm:flex-row sm:gap-3 sm:p-3 dark:border-slate-700 dark:bg-[#151C2E] dark:shadow-emerald-950/20 dark:hover:shadow-emerald-400/10 dark:focus-within:shadow-emerald-400/10">
                            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5 shrink-0 text-teal-600 dark:text-emerald-400"
                                    aria-hidden="true"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-4-4" />
                                </svg>

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search roles, companies, skills..."
                                    aria-label="Search internships"
                                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#A39AAA] dark:placeholder:text-slate-500"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById("internships")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:bg-emerald-400 dark:text-[#0B1020] dark:hover:bg-emerald-300"
                            >
                                Explore internships
                            </button>
                        </div>

                        {/* Quick stats */}
                        <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#71677D] dark:text-slate-400">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-pink-400" />
                                Skill-based discovery
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-teal-500" />
                                Multiple career paths
                            </span>
                        </div>
                    </div>

                    {/* Decorative internship preview */}
                    <div className="relative mx-auto w-full max-w-md py-5 lg:ml-auto">

                        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-pink-300/40 via-teal-300/30 to-sky-300/40 blur-3xl dark:from-emerald-400/15 dark:via-teal-400/10 dark:to-cyan-400/10" />

                        <div className="relative rounded-3xl border border-white/80 bg-white/75 p-5 shadow-2xl shadow-pink-200/30 backdrop-blur-xl sm:p-7 dark:border-slate-700 dark:bg-[#151C2E]/90 dark:shadow-black/20">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#81758B] dark:text-slate-400">
                                        YOUR NEXT STEP
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold">
                                        Explore opportunities
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-sky-100 text-teal-700 dark:from-emerald-400/20 dark:to-teal-400/10 dark:text-emerald-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
                                        <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {internships.map((internship) => (
                                    <div
                                        key={internship.id}
                                        className="flex items-center gap-3 rounded-2xl border border-[#F0E6F0] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-[#0F172A]"
                                    >
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                                                internship.color === "pink"
                                                    ? "bg-pink-100 text-pink-700 dark:bg-pink-400/10 dark:text-pink-300"
                                                    : internship.color === "teal"
                                                      ? "bg-teal-100 text-teal-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                                                      : "bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"
                                            }`}
                                        >
                                            {internship.company.charAt(0)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">
                                                {internship.role}
                                            </p>

                                            <p className="mt-1 text-xs text-[#81758B] dark:text-slate-400">
                                                {internship.company} ·{" "}
                                                {internship.location}
                                            </p>
                                        </div>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-5 w-5 shrink-0 text-teal-600 dark:text-emerald-400"
                                            aria-hidden="true"
                                        >
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </div>
                                ))}
                            </div>

                            <p className="mt-5 text-center text-xs text-[#81758B] dark:text-slate-400">
                                Sample opportunities · More features coming soon
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= INTERNSHIP EXPLORER ================= */}
           <section
    id="internships"
    className="mx-auto max-w-7xl px-6 py-14 transition-colors duration-300 ease-in-out sm:px-10 sm:py-20"
>
                {/* Section heading */}
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B45491] dark:text-emerald-300">
                            Explore opportunities
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Find your next role
                        </h2>

                        <p className="mt-3 max-w-xl text-[#71677D] dark:text-slate-400">
                            Browse opportunities that match your interests
                            and career goals.
                        </p>
                    </div>

                    <div className="rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700 dark:bg-[#151C2E]">
                        <span className="font-bold text-teal-700 dark:text-emerald-300">
                            {filteredInternships.length}
                        </span>{" "}
                        <span className="text-[#71677D] dark:text-slate-400">
                            opportunities found
                        </span>
                    </div>
                </div>

                {/* Search and filter layout */}
                <div className="mt-9 grid items-start gap-7 lg:grid-cols-[245px_minmax(0,1fr)]">

                    {/* Left filter sidebar */}
                    <aside className="rounded-2xl border border-[#EEE4EF] bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#111827]">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                                Filters
                            </h3>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm font-semibold text-teal-700 hover:text-teal-900 dark:text-emerald-300 dark:hover:text-emerald-200"
                            >
                                Clear all
                            </button>
                        </div>

                        {/* Category filters */}
                        <div className="mt-7">
                            <h4 className="text-sm font-semibold">
                                Category
                            </h4>

                            <div className="mt-3 space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            setActiveCategory(category)
                                        }
                                        aria-pressed={
                                            activeCategory === category
                                        }
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                            activeCategory === category
                                                ? "bg-[#DDF6F0] font-semibold text-teal-800 dark:bg-emerald-400/15 dark:text-emerald-300"
                                                : "text-[#71677D] hover:bg-[#FCF4FA] dark:text-slate-300 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        <span>{category}</span>

                                        {activeCategory === category && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            >
                                                <path d="m5 12 4 4L19 6" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location filters */}
                        <div className="mt-7 border-t border-[#F0E8F1] pt-6 dark:border-slate-700">
                            <h4 className="text-sm font-semibold">
                                Work mode
                            </h4>

                            <div className="mt-3 space-y-2">
                                {["All", "Remote", "Hybrid"].map(
                                    (location) => (
                                        <button
                                            key={location}
                                            type="button"
                                            onClick={() =>
                                                setActiveLocation(location)
                                            }
                                            aria-pressed={
                                                activeLocation === location
                                            }
                                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                                activeLocation === location
                                                    ? "bg-[#DDF6F0] font-semibold text-teal-800 dark:bg-emerald-400/15 dark:text-emerald-300"
                                                    : "text-[#71677D] hover:bg-[#FCF4FA] dark:text-slate-300 dark:hover:bg-slate-800"
                                            }`}
                                        >
                                            <span>{location}</span>

                                            <span
                                                className={`h-4 w-4 rounded-full border ${
                                                    activeLocation === location
                                                        ? "border-teal-700 bg-teal-700 shadow-[inset_0_0_0_3px_white] dark:border-emerald-300 dark:bg-emerald-300 dark:shadow-[inset_0_0_0_3px_#111827]"
                                                        : "border-[#D8CDDD] dark:border-slate-500"
                                                }`}
                                            />
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl bg-gradient-to-br from-[#F9EAF5] to-[#E4F1FF] p-4 dark:from-emerald-400/10 dark:to-sky-400/10">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-5 w-5 text-teal-700 dark:text-emerald-300"
                                    aria-hidden="true"
                                >
                                    <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
                                </svg>
                                Smart matching
                            </div>

                            <p className="mt-2 text-xs leading-5 text-[#71677D] dark:text-slate-400">
                                We're building tools to help you discover
                                internships aligned with your skills.
                            </p>
                        </div>
                    </aside>

                    {/* Results area */}
                    <div className="min-w-0">

                        {/* Search results toolbar */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#EEE4EF] bg-white px-4 shadow-sm focus-within:border-teal-400 dark:border-slate-700 dark:bg-[#151C2E]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5 shrink-0 text-teal-700 dark:text-emerald-300"
                                    aria-hidden="true"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-4-4" />
                                </svg>

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search by role, company, or skill..."
                                    aria-label="Filter internship results"
                                    className="w-full min-w-0 bg-transparent py-4 text-sm outline-none placeholder:text-[#A39AAA] dark:placeholder:text-slate-500"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                        className="text-sm text-[#81758B] hover:text-teal-700 dark:hover:text-emerald-300"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <span className="flex items-center justify-center rounded-xl border border-[#EEE4EF] bg-white px-4 py-3 text-sm text-[#71677D] dark:border-slate-700 dark:bg-[#151C2E] dark:text-slate-300">
                                Latest opportunities
                            </span>
                        </div>

                        {/* Internship cards */}
                        <div className="mt-5 grid gap-5 xl:grid-cols-2">
                            {filteredInternships.map((internship) => (
                                <article
                                    key={internship.id}
                                    className="group rounded-2xl border border-[#EEE4EF] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-pink-100/50 dark:border-slate-700 dark:bg-[#111827] dark:hover:border-emerald-400/30 dark:hover:shadow-black/20 sm:p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                                                internship.color === "pink"
                                                    ? "bg-pink-100 text-pink-700 dark:bg-pink-400/10 dark:text-pink-300"
                                                    : internship.color === "teal"
                                                      ? "bg-teal-100 text-teal-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                                                      : "bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"
                                            }`}
                                        >
                                            {internship.company.charAt(0)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-bold leading-6 transition group-hover:text-teal-800 dark:group-hover:text-emerald-300">
                                                {internship.role}
                                            </h3>

                                            <p className="mt-1 text-sm text-[#71677D] dark:text-slate-400">
                                                {internship.company}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.alert(
                                                    "Saved internships will be available when we implement authentication and saved-job functionality."
                                                )
                                            }
                                            aria-label={`Save ${internship.role}`}
                                            title="Save internship (demo)"
                                            className="rounded-lg p-2 text-[#A39AAA] transition hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-slate-800 dark:hover:text-pink-300"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            >
                                                <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.75L6 21V4.75Z" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <span className="rounded-lg bg-[#F5EFF7] px-3 py-1.5 text-xs font-medium text-[#71617B] dark:bg-slate-800 dark:text-slate-300">
                                            {internship.location}
                                        </span>

                                        <span className="rounded-lg bg-[#DDF6F0] px-3 py-1.5 text-xs font-medium text-teal-800 dark:bg-emerald-400/10 dark:text-emerald-300">
                                            {internship.type}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {internship.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-lg border border-[#EEE4EF] px-2.5 py-1.5 text-xs text-[#71677D] dark:border-slate-700 dark:text-slate-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#F0E8F1] pt-4 dark:border-slate-700 sm:flex-row sm:items-center">
                                        <div>
                                            <p className="text-xs text-[#81758B] dark:text-slate-400">
                                                Stipend
                                            </p>

                                            <p className="mt-1 text-sm font-semibold">
                                                {internship.stipend}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.alert(
                                                    "The internship details page will be built in a later step."
                                                )
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:bg-emerald-400 dark:text-[#0B1020] dark:hover:bg-emerald-300"
                                        >
                                            View details
                                            <span aria-hidden="true">→</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Empty results state */}
                        {filteredInternships.length === 0 && (
                            <div className="mt-5 rounded-2xl border border-dashed border-[#DCCDDD] bg-white px-6 py-14 text-center dark:border-slate-600 dark:bg-[#111827]">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9EAF5] text-[#A24E85] dark:bg-slate-800 dark:text-emerald-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        className="h-7 w-7"
                                        aria-hidden="true"
                                    >
                                        <circle cx="11" cy="11" r="7" />
                                        <path d="m20 20-4-4" />
                                    </svg>
                                </div>

                                <h3 className="mt-4 text-lg font-bold">
                                    No matching internships
                                </h3>

                                <p className="mt-2 text-sm text-[#81758B] dark:text-slate-400">
                                    Try a different keyword or adjust your
                                    filters to see more opportunities.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 dark:bg-emerald-400 dark:text-[#0B1020] dark:hover:bg-emerald-300"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-[#EEE4EF] bg-white transition-colors duration-300 ease-in-out dark:border-slate-800 dark:bg-[#0B1020]">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-sm text-[#81758B] sm:flex-row sm:items-center sm:justify-between sm:px-10 dark:text-slate-400">
                    <p>
                        <span className="font-bold text-[#29253B] dark:text-white">
                            InternMatch AI
                        </span>{" "}
                        — Find your next opportunity.
                    </p>

                    <p>Built for the next generation of talent.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
