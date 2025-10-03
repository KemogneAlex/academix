import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Récupération de l'utilisateur stocké
  const storedUser = localStorage.getItem('userInfoLms');

  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  // Connexion : sauvegarde dans le state + localStorage
  const login = (user) => {
    localStorage.setItem('userInfoLms', JSON.stringify(user));
    setUser(user);
  };

  // Déconnexion : suppression du state + localStorage
  const logout = () => {
    localStorage.removeItem('userInfoLms');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
