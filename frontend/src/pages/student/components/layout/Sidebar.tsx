import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/pages/student/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  FolderOpen,
  BookOpen,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  FileText,
  MessageSquare,
  Users,
  AlertTriangle,
  Megaphone,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const mainNavItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const profileNavItems = [
  { path: '/student/profile/personal', label: 'Basic Info', icon: User },
];

const academicNavItems = [
  { path: '/student/academics/attendance', label: 'Attendance', icon: Calendar },
  { path: '/student/academics/marks', label: 'Marks', icon: Award },
  { path: '/student/academics/timetable', label: 'Timetable', icon: Calendar },
  { path: '/student/academics/leave', label: 'Leave', icon: FileText },
];

const recordsNavItems = [
  { path: '/student/records/certifications', label: 'Certifications', icon: Award },
];

const knowledgeNavItems = [
  { path: '/student/knowledge/materials', label: 'Materials', icon: BookOpen },
  { path: '/student/knowledge/discussions', label: 'Discussions', icon: MessageSquare },
];

const announcementNavItems = [
  { path: '/student/announcements', label: 'Announcements', icon: Megaphone },
];

const extracurricularNavItems = [
  { path: '/student/extracurricular/sports', label: 'Extra-curricular Activity', icon: Zap },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();
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

    // For Profile, Announcements, Academics, Records, and Knowledge sections, make them navigate directly without dropdown
    if (sectionKey === 'profile' || sectionKey === 'announcements' || sectionKey === 'academics' || sectionKey === 'records' || sectionKey === 'knowledge' || sectionKey === 'extracurricular') {
      const IconComponent = items[0].icon;
      return (
        <div className="mb-2">
          <NavLink
            to={items[0].path}
            className={cn(
              'nav-link',
              isActive(items[0].path) && 'nav-link-active'
            )}
            title={isCollapsed ? title : undefined}
          >
            <IconComponent className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{title}</span>}
          </NavLink>
        </div>
      );
    }

    return (
      <div className="mb-2">
        {!isCollapsed && (
          <button
            onClick={() => toggleSection(sectionKey)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider',
              isSectionActive(items) ? 'text-sidebar-primary' : 'text-sidebar-foreground/50'
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
                  'nav-link',
                  isActive(item.path) && 'nav-link-active'
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
      'fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-40',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-4 h-16 border-b border-sidebar-border',
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-sidebar-primary" />
            <span className="font-display font-bold text-lg text-sidebar-foreground">
              Student ERP
            </span>
          </div>
        )}
        {isCollapsed && (
          <GraduationCap className="w-8 h-8 text-sidebar-primary mx-auto" />
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors',
            isCollapsed && 'mx-auto mt-2'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.rollNo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {/* Main */}
        <div className="mb-4">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'nav-link',
                isActive(item.path) && 'nav-link-active'
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
        <NavSection title="Extra-curricular" items={extracurricularNavItems} sectionKey="extracurricular" />
        <NavSection title="Announcements" items={announcementNavItems} sectionKey="announcements" />
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="nav-link w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

