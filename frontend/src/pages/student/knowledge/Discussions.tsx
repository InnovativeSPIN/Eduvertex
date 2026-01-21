import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';

export default function Discussions() {
  return (
    <div className="animate-in fade-in duration-500">
      <StudentPageHeader
        title="Discussions"
        subtitle="Ask questions and share knowledge"
        breadcrumbs={[
          { label: 'Knowledge', path: '/student/knowledge/discussions' },
          { label: 'Discussions' },
        ]}
      />

      <StudentSectionCard title="Discussion Forum">
        <div className="py-12 text-center text-muted-foreground">
          <p>Discussions feature coming soon.</p>
        </div>
      </StudentSectionCard>
    </div>
  );
}
