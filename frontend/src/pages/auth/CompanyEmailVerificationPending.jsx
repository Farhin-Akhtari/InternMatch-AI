
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { resendCompanyVerificationEmail } from "../../services/authServices";

function CompanyEmailVerificationPending() {
    const location = useLocation();

    const email =
      location.state?.email ||
      sessionStorage.getItem("companyAdminEmail") ||
      "";

    const emailSent =
      location.state?.emailSent ??
      (sessionStorage.getItem("companyAdminEmailSent") === "true");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(
        emailSent
            ? "Verification email sent! Please check your inbox."
            : "Your account was created, but the verification email could not be sent. You can try again below."
    );
    const [error, setError] = useState("");

    const handleResend = async () => {
        console.log("RESEND BUTTON CLICKED", email);
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await resendCompanyVerificationEmail(email);

            setSuccess(response.message);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to resend verification email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] dark:bg-[#0B1020] px-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg text-center">

                <div className="text-4xl mb-5">✉️</div>

                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Verify your email
                </h1>

                <p className="mt-3 text-slate-600 dark:text-slate-300">
                    Your company admin account has been created.
                    Please verify your email address to continue.
                </p>

                {email && (
                    <p className="mt-4 font-semibold text-slate-800 dark:text-white">
                        {email}
                    </p>
                )}

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                   {emailSent
                    ? "Check your inbox for the verification link."
                    : "If you haven't received a verification email, you can request another one below."}
                </p>

                {success && (
                    <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                        {success}
                    </p>
                )}

                {error && (
                    <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}

                <button
                    onClick={handleResend}
                    disabled={loading || !email}
                    className="mt-6 w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Resend Verification Email"}
                </button>

            </div>
        </div>
    );
}

export default CompanyEmailVerificationPending;
