import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyCompanyEmail } from "../../services/authServices";

function VerifyCompanyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const verificationStarted = useRef(false);

    useEffect(() => {
         if (verificationStarted.current) return;

         verificationStarted.current = true;
        const verifyEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setError("Verification token is missing.");
                setLoading(false);
                return;
            }

            try {
                const response = await verifyCompanyEmail(token);
                setSuccess(response.message);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Email verification failed. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] dark:bg-[#0B1020] px-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg text-center">

                {loading && (
                    <p className="text-slate-600 dark:text-slate-300">
                        Verifying your email...
                    </p>
                )}

                {success && (
                    <>
                        <div className="text-4xl mb-5">✓</div>
                        <h1 className="text-2xl font-bold text-green-600">
                            Email Verified!
                        </h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-300">
                            {success}
                        </p>
                        <button
                            onClick={() => navigate("/company-admin/pending-approval")}
                            className="mt-6 w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-600"
                        >
                            Continue
                        </button>
                    </>
                )}

                {error && (
                    <>
                        <div className="text-4xl mb-5">✕</div>
                        <h1 className="text-2xl font-bold text-red-600">
                            Verification Failed
                        </h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-300">
                            {error}
                        </p>
                    </>
                )}

            </div>
        </div>
    );
}

export default VerifyCompanyEmail;
