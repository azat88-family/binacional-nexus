import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'owner' | 'attendant';

interface User {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simplified authentication for demo
const DEMO_USERS = {
  owner: { username: 'admin', password: 'admin123' },
  attendant: { username: 'recepcion', password: 'recepcion123' },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    const demoUser = DEMO_USERS[role];
    
    if (demoUser.username === username && demoUser.password === password) {
      setUser({
        id: role === 'owner' ? '1' : '2',
        username,
        role,
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};