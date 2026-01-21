import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';

export default function Timetable() {
  return (
    <div className="animate-in fade-in duration-500">
      <StudentPageHeader
        title="Timetable"
        subtitle="Your class schedule"
        breadcrumbs={[
          { label: 'Academics', path: '/student/academics/timetable' },
          { label: 'Timetable' },
        ]}
      />

      <StudentSectionCard title="Weekly Schedule">
        <div className="py-12 text-center text-muted-foreground">
          <p>Timetable feature coming soon.</p>
        </div>
      </StudentSectionCard>
    </div>
  );
}
