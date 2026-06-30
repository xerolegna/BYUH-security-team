import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  username: string;
  password: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: string | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  signup: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem('byuh_users') ?? '[]') as User[];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('byuh_auth') === 'true');
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('byuh_user'));

  function login(username: string, password: string) {
    const users = getUsers();
    const match = users.find(u => u.username === username && u.password === password);
    if (!match) return { success: false, message: 'Invalid username or password.' };
    localStorage.setItem('byuh_auth', 'true');
    localStorage.setItem('byuh_user', username);
    setIsLoggedIn(true);
    setCurrentUser(username);
    return { success: true, message: '' };
  }

  function signup(username: string, password: string) {
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already taken.' };
    }
    localStorage.setItem('byuh_users', JSON.stringify([...users, { username, password }]));
    return { success: true, message: '' };
  }

  function logout() {
    localStorage.removeItem('byuh_auth');
    localStorage.removeItem('byuh_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
