import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import useToast from '../hooks/useToast';
import { API_URL, API_KEY } from './apiConfig';

interface AuthContextType {
  user: tokenDecode | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface tokenDecode {
  role: string;
  name: string;
  role_id: number;
  user_id: number;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<tokenDecode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users.about`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_KEY,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        setUser(null);
      } else {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users.signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_KEY,
        },
        credentials: 'include',
      });

      let data = null;
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        showError(data?.detail || 'Error inesperado');
        return;
      }

      setUser(null);
      sessionStorage.clear();
      showSuccess('Cierre de sesión correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      showError('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, showError, showSuccess]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
