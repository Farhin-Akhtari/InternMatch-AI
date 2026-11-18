
import { useNavigate } from "react-router-dom";

function RegistrationChoice() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] dark:bg-[#0B1020] px-4 py-12">

            <div className="w-full max-w-4xl">

                {/* Heading */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
                        Join InternMatch AI
                    </h1>

                    <p className="mt-3 text-slate-500 dark:text-slate-400">
                        Choose how you want to use InternMatch AI.
                    </p>
                </div>

                {/* Registration Options */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* Student Card */}
                    <div className="rounded-2xl border border-pink-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200/40 dark:border-slate-700 dark:bg-[#151D30] dark:hover:shadow-pink-500/10">

                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-3xl dark:bg-pink-500/10">
                            🎓
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            I'm a Student
                        </h2>

                        <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Discover internship opportunities, apply for positions, and track your applications.
                        </p>

                        <button
                            onClick={() => navigate("/signup")}
                            className="mt-7 w-full rounded-xl bg-[#D96CA5] px-5 py-3 font-semibold text-white transition hover:bg-[#C85B95]"
                        >
                            Register as Student
                        </button>
                    </div>

                    {/* Company Card */}
                    <div className="rounded-2xl border border-teal-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-200/40 dark:border-slate-700 dark:bg-[#151D30] dark:hover:shadow-emerald-500/10">

                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-3xl dark:bg-emerald-500/10">
                            🏢
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            I'm a Company
                        </h2>

                        <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Register your company, publish internship opportunities, and manage applications.
                        </p>

                        <button
                            onClick={() => navigate("/company-admin/register")}
                            className="mt-7 w-full rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 dark:bg-[#2DD4BF] dark:text-[#0B1020] dark:hover:bg-[#14B8A6]"
                        >
                            Register as Company
                        </button>
                    </div>

                </div>

                {/* Existing Account */}
                <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="font-semibold text-pink-600 hover:underline dark:text-emerald-400"
                    >
                        Login
                    </button>
                </p>

            </div>
        </div>
    );
}

export default RegistrationChoice;
