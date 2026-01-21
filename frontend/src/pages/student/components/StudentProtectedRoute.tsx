import { Navigate, useLocation } from 'react-router-dom';
import { useStudentAuth } from '@/context/StudentAuthContext';
import StudentLoader from './StudentLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function StudentProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useStudentAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <StudentLoader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/student/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
