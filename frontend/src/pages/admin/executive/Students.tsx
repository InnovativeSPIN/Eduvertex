import { useState } from 'react';
import { AdminLayout } from '@/pages/admin/components/layout/AdminLayout';
import { DataTable } from '@/pages/admin/components/dashboard/DataTable';
import { ProfileModal } from '@/pages/admin/components/modals/ProfileModal';
import { mockStudents } from '@/data/mockData';
import { Student } from '@/types/auth';
import { Badge } from '@/pages/admin/components/ui/badge';

export default function ExecutiveStudents() {
  const [profileModal, setProfileModal] = useState<{ open: boolean; data: Student | null }>({
    open: false,
    data: null,
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'enrollmentYear', label: 'Year' },
    {
      key: 'status',
      label: 'Status',
      render: (student: Student) => (
        <Badge
          variant={student.status === 'active' ? 'default' : 'secondary'}
          className={student.status === 'active' ? 'bg-success' : student.status === 'graduated' ? 'bg-secondary' : ''}
        >
          {student.status}
        </Badge>
      ),
    },
  ];

  const handleView = (student: Student) => {
    setProfileModal({ open: true, data: student });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Directory</h1>
          <p className="text-muted-foreground">View all student records (Read-only)</p>
        </div>

        <DataTable
          data={mockStudents}
          columns={columns}
          title="All Students"
          searchPlaceholder="Search students..."
          onView={handleView}
          canAdd={false}
          canEdit={false}
          canDelete={false}
        />

        <ProfileModal
          open={profileModal.open}
          onClose={() => setProfileModal({ open: false, data: null })}
          data={profileModal.data}
          type="student"
        />
      </div>
    </AdminLayout>
  );
}
