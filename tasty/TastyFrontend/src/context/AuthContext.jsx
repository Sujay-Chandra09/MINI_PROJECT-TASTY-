import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ id: payload.sub });
      } catch (e) {
        setCurrentUser(null);
      }
    } else {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
