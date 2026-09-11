import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user_info");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    const token = localStorage.getItem("session_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/session");
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user_info", JSON.stringify(res.data.user));
      } else {
        logoutLocal();
      }
    } catch (err) {
      console.warn("Session restore check failed:", err?.response?.data?.message || err.message);
      logoutLocal();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password, role) => {
    const res = await api.post("/auth/login", { email, password, role });
    if (res.data.success) {
      const { user, token } = res.data;
      setUser(user);
      localStorage.setItem("session_token", token);
      localStorage.setItem("user_info", JSON.stringify(user));
    }
    return res.data;
  };

  const logoutLocal = () => {
    setUser(null);
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_info");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout error:", err.message);
    } finally {
      logoutLocal();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
