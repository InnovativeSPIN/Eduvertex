import { useState } from 'react';
import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';
import { User, Phone, MapPin, Plus, ChevronDown } from 'lucide-react';

const references = [
  {
    id: 1,
    name: 'Dr. Amit Kumar',
    relation: 'Family Friend',
    phone: '+91 98765 44444',
    address: '789 College Road, Academic Zone, Mumbai - 400002',
    occupation: 'Professor',
  },
  {
    id: 2,
    name: 'Mrs. Priya Mehta',
    relation: 'Neighbor',
    phone: '+91 98765 55555',
    address: '124 Main Street, Sector 15, Mumbai - 400001',
    occupation: 'Doctor',
  },
  {
    id: 3,
    name: 'Mr. Suresh Patel',
    relation: 'Family Friend',
    phone: '+91 98765 66666',
    address: '567 Business Park, Andheri, Mumbai - 400069',
    occupation: 'Businessman',
  },
];

export default function ReferenceInfo() {
  const [filter, setFilter] = useState<'all' | 'references' | 'relatives'>('all');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const categorizedReferences = references.map((ref, index) => ({
    ...ref,
    type: index < 2 ? 'references' : 'relatives',
  }));

  const filtered = categorizedReferences.filter((ref) => {
    if (filter === 'all') return true;
    return ref.type === filter;
  });

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <StudentPageHeader
        title="Reference and Relatives in this Institution"
        subtitle="Emergency contacts and references"
        breadcrumbs={[
          { label: 'Profile', path: '/student/profile/basic' },
          { label: 'References' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => setShowAddMenu(false)}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm rounded-t-lg transition-colors"
                  >
                    Reference
                  </button>
                  <button
                    onClick={() => setShowAddMenu(false)}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm rounded-b-lg transition-colors border-t border-border"
                  >
                    Relative
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="appearance-none px-4 py-2 pr-8 rounded-lg border border-input bg-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Filter references"
              >
                <option value="all">All</option>
                <option value="references">References</option>
                <option value="relatives">Relatives</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        }
      />

      <div className="grid gap-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No {filter !== 'all' ? filter : 'references or relatives'} to show.</p>
          </div>
        ) : (
          filtered.map((ref, index) => (
            <StudentSectionCard key={ref.id} title={`${ref.type === 'references' ? 'Reference' : 'Relative'} ${index + 1}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">{ref.name}</h3>
                  <p className="text-sm text-muted-foreground">{ref.relation} • {ref.occupation}</p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{ref.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>{ref.address}</span>
                </div>
              </div>
            </StudentSectionCard>
          ))
        )}
      </div>
    </div>
  );
}
