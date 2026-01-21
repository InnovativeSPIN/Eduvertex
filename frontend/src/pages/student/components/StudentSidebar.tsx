import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useStudentAuth } from '@/context/StudentAuthContext';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  FolderOpen,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  FileText,
  MessageSquare,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

const mainNavItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const profileNavItems = [
  { path: '/student/profile/basic', label: 'Basic Info', icon: User },
  { path: '/student/profile/personal', label: 'Personal Info', icon: FileText },
  { path: '/student/profile/parent', label: 'Parent Info', icon: Users },
  { path: '/student/profile/reference', label: 'References', icon: Users },
  { path: '/student/profile/photos', label: 'Photos', icon: FileText },
];

const academicNavItems = [
  { path: '/student/academics/attendance', label: 'Attendance', icon: Calendar },
  { path: '/student/academics/marks', label: 'Marks', icon: Award },
  { path: '/student/academics/timetable', label: 'Timetable', icon: Calendar },
];

const recordsNavItems = [
  { path: '/student/records/projects', label: 'Projects', icon: FolderOpen },
  { path: '/student/records/certifications', label: 'Certifications', icon: Award },
  { path: '/student/records/disciplinary', label: 'Disciplinary', icon: AlertTriangle },
];

const knowledgeNavItems = [
  { path: '/student/knowledge/materials', label: 'Materials', icon: BookOpen },
  { path: '/student/knowledge/discussions', label: 'Discussions', icon: MessageSquare },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function StudentSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useStudentAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>('profile');

  const isActive = (path: string) => location.pathname === path;
  const isSectionActive = (items: typeof profileNavItems) => 
    items.some(item => location.pathname === item.path);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const NavSection = ({ 
    title, 
    items, 
    sectionKey 
  }: { 
    title: string; 
    items: typeof profileNavItems;
    sectionKey: string;
  }) => {
    const isExpanded = expandedSection === sectionKey || isSectionActive(items);
    
    return (
      <div className="mb-2">
        {!isCollapsed && (
          <button
            onClick={() => toggleSection(sectionKey)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider',
              isSectionActive(items) ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {title}
            <ChevronRight className={cn(
              'w-4 h-4 transition-transform',
              isExpanded && 'rotate-90'
            )} />
          </button>
        )}
        {(isCollapsed || isExpanded) && (
          <div className="space-y-1">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors mx-2',
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-40',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-4 h-16 border-b border-border',
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg">
              Student ERP
            </span>
          </div>
        )}
        {isCollapsed && (
          <GraduationCap className="w-8 h-8 text-primary mx-auto" />
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-lg hover:bg-muted transition-colors',
            isCollapsed && 'mx-auto mt-2'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.rollNo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Main */}
        <div className="mb-4">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors mx-2',
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        <NavSection title="Profile" items={profileNavItems} sectionKey="profile" />
        <NavSection title="Academics" items={academicNavItems} sectionKey="academics" />
        <NavSection title="Records" items={recordsNavItems} sectionKey="records" />
        <NavSection title="Knowledge" items={knowledgeNavItems} sectionKey="knowledge" />
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
