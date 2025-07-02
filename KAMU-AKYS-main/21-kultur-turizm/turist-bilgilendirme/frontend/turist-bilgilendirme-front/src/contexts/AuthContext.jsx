import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { storage } from '../utils';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.get('token');
      const userData = storage.get('user');

      if (token && userData) {
        try {
          // Verify token with backend
          const response = await authAPI.verifyToken();
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid, clear storage
          storage.remove('token');
          storage.remove('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      
      const { token, user: userData } = response;
      
      // Store in localStorage
      storage.set('token', token);
      storage.set('user', userData);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Başarıyla giriş yapıldı!');
      return { success: true, user: userData };
    } catch (error) {
      toast.error(error.message || 'Giriş yapılırken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);
      
      toast.success('Hesap başarıyla oluşturuldu! Giriş yapabilirsiniz.');
      return { success: true, data: response };
    } catch (error) {
      toast.error(error.message || 'Kayıt olurken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if logout fails on backend, clear local state
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      storage.remove('token');
      storage.remove('user');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Başarıyla çıkış yapıldı');
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.updateProfile(profileData);
      
      // Update local storage and state
      const updatedUser = response.user;
      storage.set('user', updatedUser);
      setUser(updatedUser);
      
      toast.success('Profil başarıyla güncellendi!');
      return { success: true, user: updatedUser };
    } catch (error) {
      toast.error(error.message || 'Profil güncellenirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      setIsLoading(true);
      await authAPI.changePassword(passwordData);
      
      toast.success('Şifre başarıyla değiştirildi!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Şifre değiştirilirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin or moderator
  const canModerate = () => {
    return user?.role === 'admin' || user?.role === 'moderator';
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    canModerate
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 