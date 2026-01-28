
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

// Admin Pages
import SuperAdminDashboard from './pages/admin/superadmin/Dashboard';
import SuperAdminStudents from './pages/admin/superadmin/Students';
import SuperAdminFaculty from './pages/admin/superadmin/Faculty';
import SuperAdminDepartments from './pages/admin/superadmin/Departments';
import SuperAdminReports from './pages/admin/superadmin/Reports';
import SuperAdminBackup from './pages/admin/superadmin/Backup';

import ExecutiveAdminDashboard from './pages/admin/executive/Dashboard';
import ExecutiveStudents from './pages/admin/executive/Students';
import ExecutiveFaculty from './pages/admin/executive/Faculty';
import ExecutiveReports from './pages/admin/executive/Reports';

import AcademicAdminDashboard from './pages/admin/academic/Dashboard';
import AcademicStudents from './pages/admin/academic/Students';
import AcademicFaculty from './pages/admin/academic/Faculty';
import AcademicDepartments from './pages/admin/academic/Departments';
import AcademicReports from './pages/admin/academic/Reports';

import Login from './pages/auth/Login';
import AdminNotFound from './pages/admin/NotFound';

// Faculty Pages
import Dashboard from './pages/faculty/Dashboard';
import Profile from './pages/faculty/Profile';
import Timetable from './pages/faculty/Timetable';
import Attendance from './pages/faculty/Attendance';
import Academics from './pages/faculty/Academics';
import Leave from './pages/faculty/Leave';
import Assessments from './pages/faculty/Assessments';
import Counseling from './pages/faculty/Counseling';
import Communication from './pages/faculty/Communication';
import Reports from './pages/faculty/Reports';

// Student Routes
import StudentRoutes from './pages/student/StudentRoutes';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Universal Auth */}
        <Route path="/login" element={<Login />} />

        {/* Super Admin Routes */}
        <Route path="/admin/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/admin/superadmin/students" element={<SuperAdminStudents />} />
        <Route path="/admin/superadmin/faculty" element={<SuperAdminFaculty />} />
        <Route path="/admin/superadmin/departments" element={<SuperAdminDepartments />} />
        <Route path="/admin/superadmin/reports" element={<SuperAdminReports />} />
        <Route path="/admin/superadmin/backup" element={<SuperAdminBackup />} />

        {/* Executive Admin Routes */}
        <Route path="/admin/executive" element={<ExecutiveAdminDashboard />} />
        <Route path="/admin/executive/students" element={<ExecutiveStudents />} />
        <Route path="/admin/executive/faculty" element={<ExecutiveFaculty />} />
        <Route path="/admin/executive/reports" element={<ExecutiveReports />} />

        {/* Academic Admin Routes */}
        <Route path="/admin/academic" element={<AcademicAdminDashboard />} />
        <Route path="/admin/academic/students" element={<AcademicStudents />} />
        <Route path="/admin/academic/faculty" element={<AcademicFaculty />} />
        <Route path="/admin/academic/departments" element={<AcademicDepartments />} />
        <Route path="/admin/academic/reports" element={<AcademicReports />} />

        {/* Student Routes */}
        <Route path="/student/*" element={<StudentRoutes />} />

        {/* Faculty Routes */}
        <Route path="/faculty" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/counseling" element={<Counseling />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/reports" element={<Reports />} />

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        {/* NotFound for all unmatched routes */}
        <Route path="*" element={<AdminNotFound />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
