import { useEffect, useState, useRef } from "react";
import { saveInternship, removeSavedInternship } from "../services/savedInternshipServices";

function SavedInternshipButton({ 
     internshipId,
     initiallySaved = false,
     onSavedChange
    }){
    const [isSaved, setIsSaved] = useState(initiallySaved);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const timeoutRef = useRef(null);

    useEffect(() => {
        setIsSaved(initiallySaved);
    }, [initiallySaved]);

    const handleToggleSave = async () => {
        try {
            setIsLoading(true);

           if (isSaved) {
                await removeSavedInternship(internshipId);
                setIsSaved(false);
                onSavedChange?.(internshipId, false);
                showToast("Removed from saved internships.");
            } else {
                await saveInternship(internshipId);
                setIsSaved(true);
                onSavedChange?.(internshipId, true);
                showToast("Internship saved successfully!");
            }
        } catch (error) {
            console.error(
                "Failed to update saved internship:",
                error.response?.data || error.message
            );
            showToast("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (text) => {
    setMessage(text);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
        setMessage("");
    }, 2500);
    };

    
 return (
    <div className="relative">
    <button
        type="button"
        onClick={handleToggleSave}
        disabled={isLoading}
        aria-label={
            isSaved
                ? "Remove saved internship"
                : "Save internship"
        }
        title={
            isSaved
                ? "Remove from saved internships"
                : "Save internship"
        }
        className={`rounded-lg p-2 transition ${
            isSaved
                ? "bg-pink-50 text-pink-600 dark:bg-slate-800 dark:text-pink-300"
                : "text-[#A39AAA] hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-slate-800 dark:hover:text-pink-300"
        }`}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.75L6 21V4.75Z" />
        </svg>
    </button>
     {message && (
            <div
                className={`absolute right-0 top-12 z-50 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
                    message.includes("successfully")
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-slate-800 dark:text-emerald-300"
                        : message.includes("Removed")
                        ? "border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-slate-800 dark:text-sky-300"
                        : "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-slate-800 dark:text-rose-300"
                }`}
            >
                {message}
            </div>
        )}
    </div>
  );

}

export default SavedInternshipButton;