import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentAuthProvider } from '@/context/StudentAuthContext';

// Layout & Components
import StudentMainLayout from './components/StudentMainLayout';
import StudentProtectedRoute from './components/StudentProtectedRoute';

// Auth
import StudentLogin from './auth/StudentLogin';

// Dashboard
import StudentDashboard from './dashboard/StudentDashboard';

// Profile
import BasicInfo from './profile/BasicInfo';
import PersonalInfo from './profile/PersonalInfo';
import ParentInfo from './profile/ParentInfo';
import ReferenceInfo from './profile/ReferenceInfo';
import Photos from './profile/Photos';

// Academics
import Attendance from './academics/Attendance';
import Marks from './academics/Marks';
import Timetable from './academics/Timetable';

// Records
import Projects from './records/Projects';
import Certifications from './records/Certifications';
import Disciplinary from './records/Disciplinary';

// Knowledge
import Materials from './knowledge/Materials';
import Discussions from './knowledge/Discussions';

// Notifications
import Notifications from './notifications/Notifications';

export default function StudentRoutes() {
  return (
    <StudentAuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="login" element={<StudentLogin />} />

        {/* Protected Routes */}
        <Route
          element={
            <StudentProtectedRoute>
              <StudentMainLayout />
            </StudentProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />

          {/* Profile */}
          <Route path="profile/basic" element={<BasicInfo />} />
          <Route path="profile/personal" element={<PersonalInfo />} />
          <Route path="profile/parent" element={<ParentInfo />} />
          <Route path="profile/reference" element={<ReferenceInfo />} />
          <Route path="profile/photos" element={<Photos />} />

          {/* Academics */}
          <Route path="academics/attendance" element={<Attendance />} />
          <Route path="academics/marks" element={<Marks />} />
          <Route path="academics/timetable" element={<Timetable />} />

          {/* Records */}
          <Route path="records/projects" element={<Projects />} />
          <Route path="records/certifications" element={<Certifications />} />
          <Route path="records/disciplinary" element={<Disciplinary />} />

          {/* Knowledge */}
          <Route path="knowledge/materials" element={<Materials />} />
          <Route path="knowledge/discussions" element={<Discussions />} />

          {/* Notifications */}
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Catch-all for student routes */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </StudentAuthProvider>
  );
}
