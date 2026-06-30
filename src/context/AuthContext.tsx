import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: string | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const VALID_USERNAME = 'Security';
const VALID_PASSWORD = 'Seasider2026';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('byuh_auth') === 'true');
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('byuh_user'));

  function login(username: string, password: string) {
    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
      return { success: false, message: 'Invalid username or password.' };
    }
    localStorage.setItem('byuh_auth', 'true');
    localStorage.setItem('byuh_user', username);
    setIsLoggedIn(true);
    setCurrentUser(username);
    return { success: true, message: '' };
  }

  function logout() {
    localStorage.removeItem('byuh_auth');
    localStorage.removeItem('byuh_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
