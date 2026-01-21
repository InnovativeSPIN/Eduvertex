import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';
import { User, Phone, Briefcase, Users } from 'lucide-react';

const parentData = {
  father: {
    name: 'Rajesh Sharma',
    occupation: 'Business Owner',
    phone: '+91 98765 11111',
    email: 'rajesh.sharma@email.com',
    qualification: 'MBA',
    annualIncome: '₹12,00,000',
  },
  mother: {
    name: 'Sunita Sharma',
    occupation: 'Teacher',
    phone: '+91 98765 22222',
    email: 'sunita.sharma@email.com',
    qualification: 'M.Ed',
    annualIncome: '₹6,00,000',
  },
  guardian: {
    name: 'Vikram Sharma',
    relation: 'Uncle',
    phone: '+91 98765 33333',
    address: '456 Park Avenue, Sector 10, Mumbai',
  },
  siblings: [
    {
      name: 'Arjun Sharma',
      age: 19,
      education: 'B.Tech Computer Science',
      phone: '+91 98765 77777',
    },
    {
      name: 'Anjali Sharma',
      age: 16,
      education: '12th Grade',
      phone: '+91 98765 88888',
    },
  ],
};

export default function ParentInfo() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <StudentPageHeader
        title="Parent Information"
        subtitle="Family and guardian details"
        breadcrumbs={[
          { label: 'Profile', path: '/student/profile/basic' },
          { label: 'Parent Info' },
        ]}
      />

      <div className="grid gap-6">
        <StudentSectionCard title="Parent & Guardian Details">
          <div className="space-y-8">
            {/* Father & Mother */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Father */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">
                      Father
                    </p>
                    <h3 className="font-semibold">{parentData.father.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{parentData.father.occupation}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Phone</span>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{parentData.father.phone}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Email</span>
                    <p className="font-medium break-all">{parentData.father.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground text-xs">Qualification</span>
                      <p className="font-medium">{parentData.father.qualification}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Annual Income</span>
                      <p className="font-medium">{parentData.father.annualIncome}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mother */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">
                      Mother
                    </p>
                    <h3 className="font-semibold">{parentData.mother.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{parentData.mother.occupation}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Phone</span>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{parentData.mother.phone}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Email</span>
                    <p className="font-medium break-all">{parentData.mother.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground text-xs">Qualification</span>
                      <p className="font-medium">{parentData.mother.qualification}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Annual Income</span>
                      <p className="font-medium">{parentData.mother.annualIncome}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian */}
            <div className="rounded-xl border border-dashed border-border bg-background/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Local Guardian (if any)
              </p>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Name</label>
                  <p className="font-medium">{parentData.guardian.name}</p>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Relation</label>
                  <p className="font-medium">{parentData.guardian.relation}</p>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Phone</label>
                  <p className="font-medium">{parentData.guardian.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-muted-foreground mb-1">Address</label>
                  <p className="font-medium">{parentData.guardian.address}</p>
                </div>
              </div>
            </div>

            {/* Siblings */}
            {parentData.siblings && parentData.siblings.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-semibold">Siblings</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {parentData.siblings.map((sibling, index) => (
                    <div key={index} className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{sibling.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Age: {sibling.age}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Education</span>
                          <p className="font-medium">{sibling.education}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Phone</span>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{sibling.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </StudentSectionCard>
      </div>
    </div>
  );
}
