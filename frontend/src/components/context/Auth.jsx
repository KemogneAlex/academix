import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem('userInfoLms');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  const login = (userData) => {
    localStorage.setItem('userInfoLms', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userInfoLms');
    setUser(null);
  };

  const isInstructor = () => user?.role === 'instructor';
  const isStudent    = () => user?.role === 'student';
  const isAdmin      = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isInstructor, isStudent, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
