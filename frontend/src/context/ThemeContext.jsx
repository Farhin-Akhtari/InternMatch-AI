import { createContext,useContext, useState,  useLayoutEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("internmatch-theme") || "light";
    });

    useLayoutEffect(() => {
        const root = document.documentElement;

        if(theme === "dark"){
            root.classList.add("dark");
        }else{
            root.classList.remove("dark");
        }
        localStorage.setItem("internmatch-theme", theme);
    },[theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
    };
     return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
     )   
}

export function useTheme() {
     return useContext(ThemeContext);
}