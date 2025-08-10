"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  useEffect(() => {
    const storedAccess = localStorage.getItem("access");
    const storedRefresh = localStorage.getItem("refresh");

    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
    }
    setLoading(false); // storage check complete
  }, []);

  const refreshAccessToken = async () => {
    if (!refreshToken) return;
    try {
      const res = await api.post("auth/token/refresh/", {
        refresh: refreshToken,
      });
      setAccessToken(res.data.access);
      localStorage.setItem("access", res.data.access);
    } catch (err) {
      console.error("Refresh token expired. Logging out.");
      logout();
    }
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response?.status === 401 && refreshToken) {
          await refreshAccessToken();
          err.config.headers["Authorization"] = `Bearer ${localStorage.getItem("access")}`;
          return api(err.config);
        }
        return Promise.reject(err);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
