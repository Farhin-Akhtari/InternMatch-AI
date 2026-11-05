import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    const successMessage = location.state?.message;

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
    const loggedInUser = await login(formData);

       if (loggedInUser.role === "admin") {
        navigate("/admin");
        } else  if (loggedInUser.role === "student"){
        navigate("/");
        } else {
          setError("Your account has an invalid role. Please contact support.");
          await logout();
        }
    } catch (error) {
    setError(
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
    );
    } finally {
    setLoading(false);
    }
 };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F1FA] via-[#FDF7F8] to-[#EAF5F5] px-4 py-10 dark:bg-[#0B1020] dark:bg-none">
    <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-[#D9B9D8]/30 backdrop-blur-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">

        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Log in to discover internships that match your skills.
            </p>
        </div>

        {successMessage && (
            <p
                role="status"
                className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
                {successMessage}
            </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email address
                </label>

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
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
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                        }))
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
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
                {loading ? "Logging in..." : "Log in"}
            </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
                to="/signup"
                className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
                Sign up
            </Link>
        </p>
    </div>
</div>
    );
}

export default Login;