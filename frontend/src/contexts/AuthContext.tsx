import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Keep existing context creation

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  superadmin: {
    id: '1',
    email: 'superadmin@edu.com',
    name: 'Super Admin',
    role: 'superadmin',
  },
  executive: {
    id: '2',
    email: 'executive@edu.com',
    name: 'Executive Admin',
    role: 'executive',
  },
  academic: {
    id: '3',
    email: 'academic@edu.com',
    name: 'Academic Admin',
    role: 'academic',
  },
  faculty: {
    id: '4',
    email: 'faculty@edu.com',
    name: 'Dr. John Smith',
    role: 'faculty',
    department: 'Computer Science',
  },
  student: {
    id: '5',
    email: 'student@edu.com',
    name: 'Jane Doe',
    role: 'student',
    department: 'Computer Science',
    rollNo: 'CS2024001',
    year: 3,
    semester: 5,
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Mock authentication - in production, this would validate against a backend
    if (password === '123') {
      // Find the mock user for the given role and override email if needed
      const user = { ...mockUsers[role], email };
      setUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
