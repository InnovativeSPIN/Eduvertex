import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';

export default function Certifications() {
  return (
    <div className="animate-in fade-in duration-500">
      <StudentPageHeader
        title="Certifications"
        subtitle="Manage your professional certifications"
        breadcrumbs={[
          { label: 'Records', path: '/student/records/certifications' },
          { label: 'Certifications' },
        ]}
      />

      <StudentSectionCard title="Your Certifications">
        <div className="py-12 text-center text-muted-foreground">
          <p>Certifications feature coming soon.</p>
        </div>
      </StudentSectionCard>
    </div>
  );
}
