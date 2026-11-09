import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCompanyAdmin } from "../../services/authServices";

function CompanyAdminRegister() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        companyName: "",
        companyWebsite: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
     e.preventDefault();

     try {
        setLoading(true);
        setError("");
        setSuccess("");

        const response = await registerCompanyAdmin(formData);

        const { emailSent } = response.data;
        const registeredEmail = formData.email;

        // Preserve registration details after refresh
        sessionStorage.setItem("companyAdminEmail", registeredEmail);
        sessionStorage.setItem("companyAdminEmailSent", String(emailSent));

        navigate("/company-admin/verification-pending", {
            state: {
                email: registeredEmail,
                emailSent,
            },
        });

        setFormData({
            fullName: "",
            email: "",
            password: "",
            companyName: "",
            companyWebsite: "",
        });

     } catch (err) {
        setError(
            err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
     } finally {
        setLoading(false);
     }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] dark:bg-[#0B1020] px-4 py-10">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg
                 hover:shadow-[0_12px_40px_rgba(20,184,166,0.20)]
                 dark:hover:shadow-[0_12px_40px_rgba(45,212,191,0.16)]
                 transition-all duration-300">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Company Admin Registration
                </h1>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Register your company to start managing internship opportunities.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 outline-none"
                        />
                    </div>

                    <div>
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 outline-none"
                        />
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                            className="w-full mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 outline-none"
                        />
                    </div>

                    <div>
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Enter your company name"
                            required
                            className="w-full mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 outline-none"
                        />
                    </div>

                    <div>
                        <label>Company Website</label>
                        <input
                            type="url"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            required
                            className="w-full mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 outline-none"
                        />
                    </div>
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )} 

                    {success && (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                         {success}
                       </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#D96CA5] dark:bg-[#2DD4BF] px-4 py-3 font-semibold text-white dark:text-[#0B1020] hover:bg-[#C85B95] dark:hover:bg-[#14B8A6] transition-all duration-300"
                    >
                        Create Company Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompanyAdminRegister;
