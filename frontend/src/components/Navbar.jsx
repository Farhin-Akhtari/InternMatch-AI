import { useTheme } from "../context/ThemeContext.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import {FiMoon, FiSun} from "react-icons/fi";

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-pink-100/80 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-[#0B1020]/90">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 sm:py-4"
                aria-label="Main navigation"
            >
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex shrink-0 items-center gap-2.5"
                    aria-label="InternMatch AI home"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-200 via-teal-100 to-sky-200 text-teal-800 shadow-sm dark:from-emerald-400/20 dark:via-teal-400/10 dark:to-sky-400/10 dark:text-emerald-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <path d="M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
                        </svg>
                    </div>

                    <div>
                        <span className="block text-base font-extrabold tracking-tight text-[#29253B] sm:text-xl dark:text-white">
                            InternMatch
                            <span className="text-teal-700 dark:text-emerald-300">
                                {" "}AI
                            </span>
                        </span>

                        <span className="hidden text-[10px] font-medium tracking-[0.16em] text-[#81758B] sm:block dark:text-slate-400">
                            YOUR CAREER COMPANION
                        </span>
                    </div>
                </Link>

                {/* Desktop navigation: visible from 768px upwards */}
                <div className="hidden items-center gap-5 md:flex lg:gap-7">
                    <Link
                        to="/"
                        className="text-sm font-semibold text-teal-800 transition hover:text-pink-600 dark:text-emerald-300 dark:hover:text-emerald-200"
                    >
                        Home
                    </Link>

                    <a
                        href="/#internships"
                        className="text-sm font-medium text-[#71677D] transition hover:text-teal-700 dark:text-slate-300 dark:hover:text-emerald-300"
                    >
                        Internships
                    </a>

                    <button
                        type="button"
                        onClick={() =>
                            window.alert(
                                "Login will be available when we build authentication."
                            )
                        }
                        className="rounded-xl px-3 py-2 text-sm font-semibold text-[#71677D] transition hover:bg-pink-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            window.alert(
                                "Sign up will be available when we build authentication."
                            )
                        }
                        className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:bg-emerald-400 dark:text-[#0B1020] dark:hover:bg-emerald-300 lg:px-5"
                    >
                        Sign Up
                    </button>

                    <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                   className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-[#151C2E] dark:text-emerald-300 dark:hover:bg-slate-800"
                >
                 {theme === "light" ? <FiMoon size={19} /> : <FiSun size={19} />}
                </button>
                </div>

                {/* Mobile hamburger button: visible below 768px */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen((previous) => !previous)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pink-100 bg-white text-[#29253B] transition hover:bg-pink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 md:hidden dark:border-slate-700 dark:bg-[#151C2E] dark:text-white dark:hover:bg-slate-800"
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                >
                    {isMenuOpen ? (
                        /* Close icon */
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="m18 6-12 12M6 6l12 12" />
                        </svg>
                    ) : (
                        /* Hamburger icon */
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* Mobile dropdown menu */}
            {isMenuOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-pink-100 bg-white px-5 pb-5 pt-3 shadow-lg shadow-pink-100/20 md:hidden dark:border-slate-800 dark:bg-[#0F172A] dark:shadow-black/20"
                >
                    <div className="mx-auto flex max-w-7xl flex-col gap-1">
                        <Link
                            to="/"
                            onClick={closeMenu}
                            className="rounded-xl px-4 py-3 text-sm font-semibold text-teal-800 transition hover:bg-[#DDF6F0] dark:text-emerald-300 dark:hover:bg-slate-800"
                        >
                            Home
                        </Link>

                        <a
                            href="/#internships"
                            onClick={closeMenu}
                            className="rounded-xl px-4 py-3 text-sm font-medium text-[#71677D] transition hover:bg-[#F9EAF5] hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                        >
                            Internships
                        </a>

                        <div className="my-2 border-t border-pink-100 dark:border-slate-700" />

                        <button
                            type="button"
                            onClick={() => {
                                closeMenu();
                                window.alert(
                                    "Login will be available when we build authentication."
                                );
                            }}
                            className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#71677D] transition hover:bg-[#F9EAF5] hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                        >
                            Login
                        </button>

                        <button
                        type="button"
                        onClick={() => {
                        closeMenu();
                        toggleTheme();
                        }}
                      className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#71677D] transition hover:bg-[#F9EAF5] hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                        >
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </button>

                        <button
                            type="button"
                            onClick={() => {
                                closeMenu();
                                window.alert(
                                    "Sign up will be available when we build authentication."
                                );
                            }}
                            className="mt-1 rounded-xl bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-800 dark:bg-emerald-400 dark:text-[#0B1020] dark:hover:bg-emerald-300"
                        >
                            Sign Up
                        </button>

                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;


