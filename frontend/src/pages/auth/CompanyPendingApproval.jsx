import { useNavigate } from "react-router-dom";

function CompanyPendingApproval() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] dark:bg-[#0B1020] px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg text-center">

                <div className="text-5xl mb-5">⏳</div>

                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Registration Under Review
                </h1>

                <p className="mt-4 text-slate-600 dark:text-slate-300">
                    Your email has been successfully verified!
                </p>

                <p className="mt-3 text-slate-600 dark:text-slate-300">
                    Your company registration is currently awaiting
                    approval from the InternMatch AI platform team.
                    You will be able to access your company dashboard
                    once your registration is approved.
                </p>

                <div className="mt-6 rounded-xl bg-pink-50 dark:bg-slate-800 p-4">
                    <p className="font-semibold text-pink-600 dark:text-emerald-400">
                        Current Status: Pending Approval
                    </p>
                </div>

                <button
                    onClick={() => navigate("/login")}
                    className="mt-6 w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                    Go to Login
                </button>

            </div>
        </div>
    );
}

export default CompanyPendingApproval;