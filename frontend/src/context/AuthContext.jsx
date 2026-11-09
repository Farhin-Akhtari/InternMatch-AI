import {createContext, useContext, useState, useEffect, useRef} from "react";
import { setAccessToken as saveAccessToken } from "../services/tokenStore";
import { loginUser, logoutUser, getCurrentUser, refreshAccessToken } from "../services/authServices";
import api from "../services/axios";


const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const restoreStarted = useRef(false);

  useEffect(() => {
    if (restoreStarted.current) return;
     restoreStarted.current = true;
    const restoreSession = async () => {
        try {
            const response = await refreshAccessToken();
            const newAccessToken = response.data.accessToken;

            updateAccessToken(newAccessToken);

            const userResponse = await getCurrentUser();
            setUser(userResponse.data.user);
        } catch (error) {
            if(error.response?.status !== 401){
                console.error("Session restoration failed:", error);
            }
            setUser(null);
            updateAccessToken(null);
        } finally {
            setAuthLoading(false);
        }
      };

      restoreSession();
    }, []);

    const updateAccessToken = (token) => {
     setAccessToken(token);
     saveAccessToken(token);
    };

    const login = async (credentials) => {
    const response = await loginUser(credentials);

    setUser(response.data.user);
    updateAccessToken(response.data.accessToken);

    return response.data.user;
   };

   const logout = async () => {
    try {
        await logoutUser();
    } finally {
        setUser(null);
        updateAccessToken(null);
    }
  };

    const value = {
        user,
        setUser,
        accessToken,
        setAccessToken: updateAccessToken,
        authLoading,
        setAuthLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};