import { useState } from 'react';
import PageHeader from '@/pages/student/components/layout/PageHeader';
import SectionCard from '@/pages/student/components/common/SectionCard';
import Badge from '@/pages/student/components/common/Badge';
import KnowledgeNavBar from '@/pages/student/components/layout/KnowledgeNavBar';
import { Search, FileText, Filter, BookOpen, File, Presentation, ExternalLink } from 'lucide-react';
import { formatDate } from '@/pages/student/utils/formatDate';

interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video';
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  size: string;
  link: string;
}

const materials: Material[] = [
  {
    id: '1',
    title: 'Data Structures Complete Notes',
    description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, and algorithms.',
    subject: 'Data Structures',
    type: 'pdf',
    uploadedBy: 'Dr. Sharma',
    uploadDate: '2024-01-10',
    downloads: 234,
    size: '4.5 MB',
    link: 'https://classroom.google.com/c/data-structures',
  },
  {
    id: '2',
    title: 'Database Normalization Presentation',
    description: 'Slides explaining 1NF, 2NF, 3NF, and BCNF with examples.',
    subject: 'Database Systems',
    type: 'ppt',
    uploadedBy: 'Prof. Patel',
    uploadDate: '2024-01-15',
    downloads: 189,
    size: '2.8 MB',
    link: 'https://classroom.google.com/c/database-systems',
  },
  {
    id: '3',
    title: 'Operating Systems Concepts',
    description: 'Study material covering process management, memory management, and file systems.',
    subject: 'Operating Systems',
    type: 'pdf',
    uploadedBy: 'Dr. Kumar',
    uploadDate: '2024-01-20',
    downloads: 156,
    size: '6.2 MB',
    link: 'https://classroom.google.com/c/operating-systems',
  },
  {
    id: '4',
    title: 'Network Protocols Reference',
    description: 'Quick reference guide for TCP/IP, HTTP, FTP, and other networking protocols.',
    subject: 'Computer Networks',
    type: 'doc',
    uploadedBy: 'Prof. Singh',
    uploadDate: '2024-02-01',
    downloads: 98,
    size: '1.5 MB',
    link: 'https://classroom.google.com/c/computer-networks',
  },
  {
    id: '5',
    title: 'Software Development Life Cycle',
    description: 'Detailed presentation on SDLC models: Waterfall, Agile, and DevOps.',
    subject: 'Software Engineering',
    type: 'ppt',
    uploadedBy: 'Dr. Gupta',
    uploadDate: '2024-02-10',
    downloads: 145,
    size: '3.2 MB',
    link: 'https://classroom.google.com/c/software-engineering',
  },
];

const subjects = ['All', 'Data Structures', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering'];

const getTypeIcon = (type: Material['type']) => {
  switch (type) {
    case 'pdf': return FileText;
    case 'ppt': return Presentation;
    default: return File;
  }
};

const getTypeColor = (type: Material['type']) => {
  switch (type) {
    case 'pdf': return 'bg-red-100 text-red-600';
    case 'ppt': return 'bg-orange-100 text-orange-600';
    case 'doc': return 'bg-blue-100 text-blue-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function Materials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || material.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Study Materials"
        subtitle="Access study materials and resources"
        breadcrumbs={[
          { label: 'Knowledge', path: '/knowledge/materials' },
          { label: 'Materials' },
        ]}
      />

      <KnowledgeNavBar />

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search materials..."
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field pl-10 pr-8 min-w-[200px]"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => {
            const TypeIcon = getTypeIcon(material.type);
            
            return (
              <div key={material.id} className="section-card p-5 hover:shadow-lg transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(material.type)}`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-1">{material.title}</h3>
                    <Badge variant="info" className="mt-1">{material.subject}</Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {material.description}
                </p>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                  <span>{material.uploadedBy}</span>
                  <span>â€¢</span>
                  <span>{material.size}</span>
                  <span>â€¢</span>
                  <span>{material.downloads} downloads</span>
                </div>

                <div className="mt-4">
                  <a href={material.link} target="_blank" rel="noopener noreferrer" className="w-full btn-primary py-2 flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on Google Classroom
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <SectionCard title="No Results">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No materials found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        </SectionCard>
      )}
    </div>
  );
}


