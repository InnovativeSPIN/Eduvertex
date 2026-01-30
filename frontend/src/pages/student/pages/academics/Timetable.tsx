import PageHeader from '@/pages/student/components/layout/PageHeader';
import SectionCard from '@/pages/student/components/common/SectionCard';
import AcademicsNavBar from '@/pages/student/components/layout/AcademicsNavBar';

export default function Timetable() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Timetable"
        subtitle=""
        breadcrumbs={[
          { label: 'Academics', path: '/academics/timetable' },
          { label: 'Timetable' },
        ]}
      />

      <AcademicsNavBar />

      <SectionCard title="Timetable">
        <div className="py-12 text-center text-muted-foreground">
          Timetable content has been removed.
        </div>
      </SectionCard>
    </div>
  );
}


