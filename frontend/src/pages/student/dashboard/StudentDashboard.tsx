import { useStudentAuth } from '@/context/StudentAuthContext';
import StudentPageHeader from '../components/StudentPageHeader';
import StudentInfoCard from '../components/StudentInfoCard';
import StudentSectionCard from '../components/StudentSectionCard';
import StudentProgressBar from '../components/StudentProgressBar';
import StudentBadge from '../components/StudentBadge';
import { getAttendanceStatus, getAttendanceMessage } from '@/utils/student/calculateAttendance';
import { 
  User, 
  Building2, 
  Calendar, 
  GraduationCap,
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
  const { user } = useStudentAuth();
  const semesterStatus = getAttendanceStatus(dashboardData.semesterAttendance);
  const yearStatus = getAttendanceStatus(dashboardData.yearAttendance);

  return (
    <div className="animate-in fade-in duration-500">
      <StudentPageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
        subtitle="Here's an overview of your academic progress"
      />

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {dashboardData.alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/30"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <span className="text-sm">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StudentInfoCard
          label="Roll Number"
          value={user?.rollNo || 'N/A'}
          icon={User}
          variant="primary"
        />
        <StudentInfoCard
          label="Department"
          value={user?.department || 'N/A'}
          icon={Building2}
        />
        <StudentInfoCard
          label="Year / Semester"
          value={`${user?.year || '-'} / ${user?.semester || '-'}`}
          icon={Calendar}
        />
        <StudentInfoCard
          label="CGPA"
          value={dashboardData.cgpa.toFixed(2)}
          icon={GraduationCap}
          variant="secondary"
        />
      </div>

      {/* Attendance & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance */}
        <StudentSectionCard title="Attendance Overview" subtitle="Current academic period">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Semester Attendance</span>
                <StudentBadge variant={semesterStatus}>{getAttendanceMessage(dashboardData.semesterAttendance)}</StudentBadge>
              </div>
              <StudentProgressBar value={dashboardData.semesterAttendance} status={semesterStatus} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Year Attendance</span>
                <StudentBadge variant={yearStatus}>{getAttendanceMessage(dashboardData.yearAttendance)}</StudentBadge>
              </div>
              <StudentProgressBar value={dashboardData.yearAttendance} status={yearStatus} />
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Credits Earned</span>
                <span className="font-medium">{dashboardData.earnedCredits} / {dashboardData.totalCredits}</span>
              </div>
            </div>
          </div>
        </StudentSectionCard>

        {/* Today's Schedule */}
        <StudentSectionCard title="Today's Classes" subtitle="Upcoming schedule">
          <div className="space-y-3">
            {dashboardData.upcomingClasses.map((cls, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{cls.subject}</p>
                  <p className="text-sm text-muted-foreground">Room {cls.room}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {cls.time}
                </div>
              </div>
            ))}
          </div>
        </StudentSectionCard>
      </div>

      {/* Recent Marks */}
      <StudentSectionCard title="Recent Marks" subtitle="Latest examination results">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Subject</th>
                <th className="text-center py-3 px-4 font-medium">Internal</th>
                <th className="text-center py-3 px-4 font-medium">External</th>
                <th className="text-center py-3 px-4 font-medium">Total</th>
                <th className="text-center py-3 px-4 font-medium">Grade</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentMarks.map((mark, index) => (
                <tr key={index} className="border-b border-border/50 last:border-0">
                  <td className="py-3 px-4 font-medium">{mark.subject}</td>
                  <td className="text-center py-3 px-4">{mark.internal}</td>
                  <td className="text-center py-3 px-4">{mark.external}</td>
                  <td className="text-center py-3 px-4 font-semibold">{mark.total}</td>
                  <td className="text-center py-3 px-4">
                    <StudentBadge variant={mark.grade.startsWith('A') ? 'success' : 'info'}>
                      {mark.grade}
                    </StudentBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StudentSectionCard>
    </div>
  );
}
