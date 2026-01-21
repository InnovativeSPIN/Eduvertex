import { useState } from 'react';
import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';
import StudentBadge from '../components/StudentBadge';
import { SEMESTERS } from '@/utils/student/constants';
import { Award, TrendingUp, BookOpen } from 'lucide-react';

const marksData = {
  5: {
    sgpa: 8.65,
    totalCredits: 24,
    subjects: [
      { code: 'CS501', name: 'Data Structures', credits: 4, internal: 42, external: 58, total: 100, grade: 'A+' },
      { code: 'CS502', name: 'Database Systems', credits: 4, internal: 38, external: 52, total: 90, grade: 'A' },
      { code: 'CS503', name: 'Operating Systems', credits: 4, internal: 35, external: 48, total: 83, grade: 'B+' },
      { code: 'CS504', name: 'Computer Networks', credits: 4, internal: 40, external: 55, total: 95, grade: 'A+' },
      { code: 'CS505', name: 'Software Engineering', credits: 4, internal: 36, external: 50, total: 86, grade: 'A' },
      { code: 'CS506', name: 'Lab Practice', credits: 4, internal: 45, external: 48, total: 93, grade: 'A+' },
    ],
  },
  4: {
    sgpa: 8.45,
    totalCredits: 24,
    subjects: [
      { code: 'CS401', name: 'Discrete Mathematics', credits: 4, internal: 40, external: 52, total: 92, grade: 'A+' },
      { code: 'CS402', name: 'Digital Logic', credits: 4, internal: 35, external: 45, total: 80, grade: 'B+' },
      { code: 'CS403', name: 'Object Oriented Programming', credits: 4, internal: 38, external: 50, total: 88, grade: 'A' },
      { code: 'CS404', name: 'Computer Architecture', credits: 4, internal: 36, external: 48, total: 84, grade: 'A' },
      { code: 'CS405', name: 'Data Communication', credits: 4, internal: 34, external: 46, total: 80, grade: 'B+' },
      { code: 'CS406', name: 'Lab Practice', credits: 4, internal: 42, external: 50, total: 92, grade: 'A+' },
    ],
  },
};

const gradePoints: Record<string, number> = {
  'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5,
  'C+': 6, 'C': 5, 'C-': 4.5, 'D': 4, 'F': 0,
};

function getGradeVariant(grade: string): 'success' | 'warning' | 'danger' | 'info' {
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'info';
  if (grade.startsWith('C')) return 'warning';
  return 'danger';
}

export default function Marks() {
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const data = marksData[selectedSemester as keyof typeof marksData] || marksData[5];
  
  const totalMarks = data.subjects.reduce((sum, s) => sum + s.total, 0);
  const maxMarks = data.subjects.length * 100;
  const overallPercentage = ((totalMarks / maxMarks) * 100).toFixed(1);

  return (
    <div className="animate-in fade-in duration-500">
      <StudentPageHeader
        title="Marks"
        subtitle="View your examination results"
        breadcrumbs={[
          { label: 'Academics', path: '/student/academics/marks' },
          { label: 'Marks' },
        ]}
        actions={
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            className="px-4 py-2 pr-8 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SEMESTERS.slice(0, 5).reverse().map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">SGPA</p>
              <p className="text-2xl font-bold">{data.sgpa.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary text-secondary-foreground rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">Percentage</p>
              <p className="text-2xl font-bold">{overallPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credits</p>
              <p className="text-2xl font-bold">{data.totalCredits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <StudentSectionCard title={`Semester ${selectedSemester} Results`} subtitle="Internal + External marks breakdown">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Code</th>
                <th className="text-left py-3 px-4 font-medium">Subject</th>
                <th className="text-center py-3 px-4 font-medium">Credits</th>
                <th className="text-center py-3 px-4 font-medium">Internal (50)</th>
                <th className="text-center py-3 px-4 font-medium">External (50)</th>
                <th className="text-center py-3 px-4 font-medium">Total (100)</th>
                <th className="text-center py-3 px-4 font-medium">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.subjects.map((subject) => (
                <tr key={subject.code} className="border-b border-border/50 last:border-0">
                  <td className="py-3 px-4 font-mono text-sm">{subject.code}</td>
                  <td className="py-3 px-4 font-medium">{subject.name}</td>
                  <td className="text-center py-3 px-4">{subject.credits}</td>
                  <td className="text-center py-3 px-4">{subject.internal}</td>
                  <td className="text-center py-3 px-4">{subject.external}</td>
                  <td className="text-center py-3 px-4 font-semibold">{subject.total}</td>
                  <td className="text-center py-3 px-4">
                    <StudentBadge variant={getGradeVariant(subject.grade)}>{subject.grade}</StudentBadge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50">
                <td colSpan={2} className="py-3 px-4 font-semibold">Total</td>
                <td className="text-center py-3 px-4 font-semibold">{data.totalCredits}</td>
                <td className="text-center py-3 px-4 font-semibold">
                  {data.subjects.reduce((sum, s) => sum + s.internal, 0)}
                </td>
                <td className="text-center py-3 px-4 font-semibold">
                  {data.subjects.reduce((sum, s) => sum + s.external, 0)}
                </td>
                <td className="text-center py-3 px-4 font-semibold">{totalMarks}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </StudentSectionCard>

      {/* Grade Legend */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30">
        <h4 className="text-sm font-medium mb-3">Grade Scale</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          {Object.entries(gradePoints).map(([grade, points]) => (
            <div key={grade} className="flex items-center gap-2">
              <StudentBadge variant={getGradeVariant(grade)}>{grade}</StudentBadge>
              <span className="text-muted-foreground">= {points} points</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
