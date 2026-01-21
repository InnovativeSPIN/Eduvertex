import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';
import { User } from 'lucide-react';

// Mock additional data
const basicInfoData = {
  rollNo: '21CS101',
  admissionNo: 'ADM2021-001',
  name: 'Rahul Sharma',
  department: 'Computer Science',
  year: 3,
  semester: 5,
  section: 'A',
  dob: '2003-05-15',
  gender: 'Male',
  admissionDate: '2021-08-01',
  batch: '2021-2025',
  bloodGroup: 'O+',
  residenceType: 'Hostel',
};

interface InfoRowProps {
  label: string;
  value: string | number;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground sm:w-40 mb-1 sm:mb-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function BasicInfo() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <StudentPageHeader
        title="Basic Information"
        subtitle="Your academic profile details"
        breadcrumbs={[
          { label: 'Profile', path: '/student/profile/basic' },
          { label: 'Basic Info' },
        ]}
      />

      <div className="grid gap-6">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{basicInfoData.name}</h2>
              <p className="text-muted-foreground">{basicInfoData.rollNo}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {basicInfoData.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <StudentSectionCard title="Academic Details">
          <div className="divide-y divide-border/50">
            <InfoRow label="Admission Number" value={basicInfoData.admissionNo} />
            <InfoRow label="Roll Number" value={basicInfoData.rollNo} />
            <InfoRow label="Full Name" value={basicInfoData.name} />
            <InfoRow label="Department" value={basicInfoData.department} />
            <InfoRow label="Year" value={`${basicInfoData.year} Year`} />
            <InfoRow label="Semester" value={`Semester ${basicInfoData.semester}`} />
            <InfoRow label="Section" value={basicInfoData.section} />
            <InfoRow label="Batch" value={basicInfoData.batch} />
            <InfoRow label="Admission Date" value={basicInfoData.admissionDate} />
            <InfoRow label="Nature of Residence" value={basicInfoData.residenceType} />
          </div>
        </StudentSectionCard>
      </div>
    </div>
  );
}
