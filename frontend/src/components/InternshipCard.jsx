import { useEffect, useState } from "react";
import {applyToInternship, getMyApplications} from "../services/applicationServices";


function InternshipCard({ internship }) {
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
         console.log("Checking applications for:", internship._id);
    const checkApplicationStatus = async () => {
        try {
            const response = await getMyApplications();
            const applications = response.data;

            const alreadyApplied = applications.some(
                (application) =>
                    application.internship?._id === internship._id
            );

            setIsApplied(alreadyApplied);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        }
       };

       checkApplicationStatus();
    }, [internship._id]);

    
const handleApply = async () => {
    try {
        await applyToInternship(internship._id);
        setIsApplied(true);
    } catch (error) {
        if (error.response?.status === 409) {
            setIsApplied(true);
        } else {
            console.error(
                "Failed to apply for internship:",
                error.response?.data || error.message
            );
        }
    }
};

    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {internship.role}
            </h3>

            <p className="mt-1 text-gray-600 dark:text-slate-300">
                {internship.company}
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                {internship.location}
            </p>

            <button
                type="button"
                onClick={handleApply}
                disabled={isApplied}
                 className={`mt-4 rounded-xl px-5 py-2.5 font-medium text-white transition ${
                isApplied
                ? "cursor-not-allowed bg-gray-400"
                 : "bg-emerald-600 hover:bg-emerald-700"
                 }`}
            >  
              {isApplied ? "Applied" : "Apply Now"}
            </button>
        </article>
    );
}

export default InternshipCard;
