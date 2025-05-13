import React, { createContext, useContext, useEffect, useState } from "react";
import publicAxios from "../src/Services/PublicAxios";
import PrivateAxios from "../src/Services/PrivateAxios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const AuthorizationFetched = async () => {
      try {
        await PrivateAxios.get("/auth/check"); // Axios will throw error if request fails
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
      }
    };
    AuthorizationFetched();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
