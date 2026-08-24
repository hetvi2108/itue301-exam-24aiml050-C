import React, { createContext, useState } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // Login function
  const login = (employeeData, authToken, userRole) => {
    setEmployee(employeeData);
    setToken(authToken);
    setRole(userRole);
  };

  // Logout function
  const logout = () => {
    setEmployee(null);
    setToken(null);
    setRole(null);
  };

  const value = {
    employee,
    token,
    role,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
