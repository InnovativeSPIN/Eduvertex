import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';

export default function Materials() {
  return (
    <div className="animate-in fade-in duration-500">
      <StudentPageHeader
        title="Study Materials"
        subtitle="Access study materials and resources"
        breadcrumbs={[
          { label: 'Knowledge', path: '/student/knowledge/materials' },
          { label: 'Materials' },
        ]}
      />

      <StudentSectionCard title="Available Materials">
        <div className="py-12 text-center text-muted-foreground">
          <p>Study materials feature coming soon.</p>
        </div>
      </StudentSectionCard>
    </div>
  );
}
