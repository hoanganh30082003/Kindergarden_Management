import React, { createContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import authService from '../services/authService';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchAndSetProfile = async () => {
      try {
        const data = await authService.fetchProfile(user);
        setProfile(data);
      } catch (err) {
        console.log("Lỗi khi fetch profile:", err);
        setProfile(null);
      }
    };
    fetchAndSetProfile();
  }, [user]);
  const login = (userData) => {
    setUser(userData);
    const userAccount = {
      id: userData._id,
      email: userData.email,
      password: userData.password,
      role: userData.role
    }
    localStorage.setItem("user", JSON.stringify(userAccount));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
