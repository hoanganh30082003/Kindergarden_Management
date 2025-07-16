import React, { createContext, useState } from "react";
import { useEffect } from "react";
import authService from '../services/authService';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchAndSetProfile = async () => {
      try {
        const data = await authService.fetchProfile(account);
        setProfile(data);
      } catch (err) {
        console.log("Lỗi khi fetch profile:", err);
        setProfile(null);
      }
    };
    if(!account){
      return;
    }else if(account.role ==='Teacher' || account.role ==='Parent'){
      fetchAndSetProfile();
    }
  }, [account]);
  const login = (account) => {
    setAccount(account);
    const userAccount = {
      _id: account._id,
      email: account.email,
      system_name: account.system_name,
      role: account.role
    }
    localStorage.setItem("user", JSON.stringify(userAccount));
  };
  const logout = () => {
    setAccount(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ account, login, logout, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
