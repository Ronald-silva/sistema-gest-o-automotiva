// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@AutoGestao:user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Função para configurar o token no axios
  const setupToken = useCallback((token: string) => {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem('@AutoGestao:token', token);
  }, []);

  // Carregar usuário inicial
  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('@AutoGestao:token');
        if (token) {
          setupToken(token);
          const response = await api.get('/auth/me');
          const userData = response.data;

          setUser(userData);
          localStorage.setItem('@AutoGestao:user', JSON.stringify(userData));
        }
      } catch (error) {
        localStorage.removeItem('@AutoGestao:token');
        localStorage.removeItem('@AutoGestao:user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [setupToken]);

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      setupToken(token);
      setUser(user);
      localStorage.setItem('@AutoGestao:user', JSON.stringify(user));

      // Configura o token imediatamente após o login
      api.defaults.headers.Authorization = `Bearer ${token}`;

      toast.success(`Bem-vindo(a), ${user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      throw error;
    }
  }, [navigate, setupToken]);

  const signOut = useCallback(() => {
    localStorage.removeItem('@AutoGestao:token');
    localStorage.removeItem('@AutoGestao:user');
    delete api.defaults.headers.Authorization;
    setUser(null);
    navigate('/login');
    toast.info('Sessão encerrada com sucesso.');
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}