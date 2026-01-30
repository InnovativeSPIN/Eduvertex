import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/pages/student/lib/utils';

interface KnowledgeNavItem {
  path: string;
  label: string;
}

const knowledgeNavItems: KnowledgeNavItem[] = [
  { path: '/knowledge/materials', label: 'Materials' },
  { path: '/knowledge/discussions', label: 'Discussions' },
];

export default function KnowledgeNavBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="mb-6">
      <div className="inline-flex bg-gray-100 rounded-full p-1.5 gap-1.5 shadow-sm" style={{ borderRadius: '999px' }}>
        {knowledgeNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              'px-6 py-2.5 text-sm font-medium transition-all duration-200 ease-out whitespace-nowrap',
              isActive(item.path)
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            )}
            style={{
              borderRadius: '999px',
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

