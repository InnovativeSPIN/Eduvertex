import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/pages/student/components/layout/PageHeader';
import InfoCard from '@/pages/student/components/common/InfoCard';
import SectionCard from '@/pages/student/components/common/SectionCard';
import ProgressBar from '@/pages/student/components/common/ProgressBar';
import Badge from '@/pages/student/components/common/Badge';
import { getAttendanceStatus, getAttendanceMessage } from '@/pages/student/utils/calculateAttendance';
import {
  User,
  Building2,
  Calendar,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Clock,
} from 'lucide-react';

// Mock data
const dashboardData = {
  semesterAttendance: 82.5,
  yearAttendance: 78.3,
  cgpa: 8.45,
  totalCredits: 120,
  earnedCredits: 90,
  upcomingClasses: [
    { subject: 'Data Structures', time: '10:00 AM', room: 'CS-201' },
    { subject: 'Database Systems', time: '11:00 AM', room: 'CS-203' },
    { subject: 'Operating Systems', time: '2:00 PM', room: 'CS-101' },
  ],
  recentMarks: [
    { subject: 'Data Structures', internal: 42, external: 58, total: 100, grade: 'A' },
    { subject: 'Database Systems', internal: 38, external: 52, total: 90, grade: 'A-' },
    { subject: 'Operating Systems', internal: 35, external: 48, total: 83, grade: 'B+' },
  ],
  alerts: [
    { type: 'warning', message: 'Attendance in Operating Systems is below 75%' },
  ],
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const semesterStatus = getAttendanceStatus(dashboardData.semesterAttendance);
  const yearStatus = getAttendanceStatus(dashboardData.yearAttendance);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
        subtitle="Here's an overview of your academic progress"
      />

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {dashboardData.alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20 animate-slide-in"
            >
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <span className="text-sm">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Roll Number"
          value={user?.rollNo || 'N/A'}
          icon={User}
          variant="primary"
        />
        <InfoCard
          label="Department"
          value={user?.department || 'N/A'}
          icon={Building2}
        />
        <InfoCard
          label="Year / Semester"
          value={`${user?.year || '-'} / ${user?.semester || '-'}`}
          icon={Calendar}
        />
        <InfoCard
          label="CGPA"
          value={dashboardData.cgpa.toFixed(2)}
          icon={GraduationCap}
          variant="secondary"
        />
      </div>

      {/* Attendance & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance */}
        <SectionCard title="Attendance Overview" subtitle="Current academic period">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Semester Attendance</span>
                <Badge variant={semesterStatus}>{getAttendanceMessage(dashboardData.semesterAttendance)}</Badge>
              </div>
              <ProgressBar value={dashboardData.semesterAttendance} status={semesterStatus} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Year Attendance</span>
                <Badge variant={yearStatus}>{getAttendanceMessage(dashboardData.yearAttendance)}</Badge>
              </div>
              <ProgressBar value={dashboardData.yearAttendance} status={yearStatus} />
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Credits Earned</span>
                <span className="font-medium">{dashboardData.earnedCredits} / {dashboardData.totalCredits}</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Recent Marks */}
      <SectionCard title="Recent Marks" subtitle="Latest examination results">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th className="text-center">Internal</th>
                <th className="text-center">External</th>
                <th className="text-center">Total</th>
                <th className="text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentMarks.map((mark, index) => (
                <tr key={index}>
                  <td className="font-medium">{mark.subject}</td>
                  <td className="text-center">{mark.internal}</td>
                  <td className="text-center">{mark.external}</td>
                  <td className="text-center font-semibold">{mark.total}</td>
                  <td className="text-center">
                    <Badge variant={mark.grade.startsWith('A') ? 'success' : 'info'}>
                      {mark.grade}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}


