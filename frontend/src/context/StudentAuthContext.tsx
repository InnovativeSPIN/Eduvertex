import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  year: number;
  semester: number;
  avatar?: string;
}

interface StudentAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (rollNo: string, password: string) => Promise<void>;
  logout: () => void;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUser: User = {
  id: '1',
  rollNo: '21CS101',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@university.edu',
  department: 'Computer Science',
  year: 3,
  semester: 5,
};

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('student_erp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (rollNo: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (rollNo && password.length >= 4) {
      const loggedInUser = { ...mockUser, rollNo };
      setUser(loggedInUser);
      localStorage.setItem('student_erp_user', JSON.stringify(loggedInUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('student_erp_user');
  };

  return (
    <StudentAuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
}
