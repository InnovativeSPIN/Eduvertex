import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
import NotFound from './pages/faculty/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Faculty Routes */}
        <Route path="/" element={<Dashboard />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
