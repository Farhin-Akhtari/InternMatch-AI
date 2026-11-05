import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authServices";

function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const[error, setError] = useState("");
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        await registerUser(formData);

        setFormData({
            fullName: "",
            email: "",
            password: "",
        });

        navigate("/login", {
            state: {
                message: "Account created successfully! Please log in.",
            },
        });
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Registration failed. Please try again."
        );
    } finally {
        setLoading(false);
    }
   };

    return(
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F1FA] via-[#FDF7F8] to-[#EAF5F5] px-4 py-10 dark:bg-[#0B1020] dark:bg-none">
       <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-[#D9B9D8]/30 backdrop-blur-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">

        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Find internships that match your skills.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Full name
                </label>

                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email address
                </label>

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
            </div>

            {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400"
                >
                  {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Creating account..." : "Create account"}
            </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
                Log in
            </Link>
         </p>
      </div>
    </div>
    );
}

export default Signup;