import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';
import StudentBadge from '../components/StudentBadge';
import { AlertTriangle, CheckCircle, FileText, Calendar, User } from 'lucide-react';
import { formatDate } from '@/utils/student/formatDate';

interface DisciplinaryRecord {
  id: string;
  date: string;
  type: 'warning' | 'suspension' | 'fine' | 'counseling';
  description: string;
  actionTaken: string;
  staffRemarks: string;
  staffName: string;
  resolved: boolean;
}

const disciplinaryRecords: DisciplinaryRecord[] = [
  {
    id: '1',
    date: '2024-02-15',
    type: 'warning',
    description: 'Late submission of assignment for Database Systems course.',
    actionTaken: 'Written warning issued. Student counseled on time management.',
    staffRemarks: 'First offense. Student showed understanding and commitment to improvement.',
    staffName: 'Prof. Patel',
    resolved: true,
  },
  {
    id: '2',
    date: '2023-11-20',
    type: 'counseling',
    description: 'Attendance falling below required threshold in Operating Systems.',
    actionTaken: 'Counseling session conducted. Attendance improvement plan created.',
    staffRemarks: 'Student explained personal circumstances. Showing improvement since counseling.',
    staffName: 'Dr. Kumar',
    resolved: true,
  },
];

const getTypeVariant = (type: DisciplinaryRecord['type']): 'warning' | 'danger' | 'info' => {
  switch (type) {
    case 'suspension': return 'danger';
    case 'fine': return 'danger';
    case 'warning': return 'warning';
    default: return 'info';
  }
};

const getTypeLabel = (type: DisciplinaryRecord['type']): string => {
  switch (type) {
    case 'suspension': return 'Suspension';
    case 'fine': return 'Fine';
    case 'warning': return 'Warning';
    case 'counseling': return 'Counseling';
    default: return type;
  }
};

export default function Disciplinary() {
  const hasRecords = disciplinaryRecords.length > 0;
  const allResolved = disciplinaryRecords.every(r => r.resolved);

  return (
    <div className="animate-in fade-in duration-500">
      <StudentPageHeader
        title="Disciplinary Records"
        subtitle="View your disciplinary history"
        breadcrumbs={[
          { label: 'Records', path: '/student/records/disciplinary' },
          { label: 'Disciplinary' },
        ]}
      />

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
        !hasRecords 
          ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900/30' 
          : allResolved 
            ? 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/30'
            : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/30'
      }`}>
        {!hasRecords ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Clean Record</p>
              <p className="text-sm text-green-700 dark:text-green-300">No disciplinary records found.</p>
            </div>
          </>
        ) : allResolved ? (
          <>
            <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">All Issues Resolved</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">You have {disciplinaryRecords.length} record(s), all resolved.</p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Pending Issues</p>
              <p className="text-sm text-red-700 dark:text-red-300">Some disciplinary matters are still pending resolution.</p>
            </div>
          </>
        )}
      </div>

      {/* Records */}
      {hasRecords ? (
        <div className="space-y-4">
          {disciplinaryRecords.map((record, index) => (
            <StudentSectionCard 
              key={record.id} 
              title={`Record #${disciplinaryRecords.length - index}`}
              actions={
                <StudentBadge variant={record.resolved ? 'success' : 'danger'}>
                  {record.resolved ? 'Resolved' : 'Pending'}
                </StudentBadge>
              }
            >
              <div className="space-y-4">
                {/* Header Info */}
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
                  <StudentBadge variant={getTypeVariant(record.type)}>
                    {getTypeLabel(record.type)}
                  </StudentBadge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(record.date)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    {record.staffName}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium mb-1">Issue Description</h4>
                  <p className="text-muted-foreground">{record.description}</p>
                </div>

                {/* Action Taken */}
                <div>
                  <h4 className="text-sm font-medium mb-1">Action Taken</h4>
                  <p className="text-muted-foreground">{record.actionTaken}</p>
                </div>

                {/* Staff Remarks */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium mb-1">Staff Remarks</h4>
                      <p className="text-sm text-muted-foreground">{record.staffRemarks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </StudentSectionCard>
          ))}
        </div>
      ) : (
        <StudentSectionCard title="Disciplinary History">
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
            <p className="text-muted-foreground">You have maintained a clean disciplinary record. Keep it up!</p>
          </div>
        </StudentSectionCard>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> This page displays read-only information. If you believe any record is incorrect, 
          please contact the Student Affairs Office for clarification.
        </p>
      </div>
    </div>
  );
}
