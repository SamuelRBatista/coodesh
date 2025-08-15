import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // Inicializa o token removendo "Bearer " se existir
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    return stored ? stored.replace(/^Bearer\s+/i, '') : null;
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
     
      localStorage.setItem('token', token);
  
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
      api.get('/user/me')
        .then(res => setUser(res.data))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        });
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const signin = async (email, password) => {
    const res = await api.post('/auth/signin', { email, password });
   
    const cleanToken = (res.data.token || '').replace(/^Bearer\s+/i, '');
    setToken(cleanToken);

    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });

    const cleanToken = (res.data.token || '').replace(/^Bearer\s+/i, '');
    setToken(cleanToken);

    return res.data;
  };

  const signout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ user, token, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}
