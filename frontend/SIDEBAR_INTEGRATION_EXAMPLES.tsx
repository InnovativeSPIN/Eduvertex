/**
 * INTEGRATION EXAMPLES FOR ADMIN SIDEBARS
 * 
 * This file shows you exactly how to integrate the new sidebar components
 * into your existing layout and page components.
 */

// ============================================================================
// EXAMPLE 1: SuperAdmin Layout Integration
// ============================================================================

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/pages/admin/superadmin/components/layout/AppSidebar';
import { IntegratedNotificationBell } from '@/components/common/IntegratedNotificationBell';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex w-full h-screen bg-background">
      {/* Sidebar Component */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[280px]">
        {/* Header Bar */}
        <header className="sticky top-0 z-40 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-full items-center justify-between px-6">
            <div className="text-foreground font-semibold">
              Welcome, {user.name}
            </div>
            <IntegratedNotificationBell />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Executive Admin Layout Integration
// ============================================================================

import { ExecutiveAdminSidebar } from '@/pages/admin/executive/components/layout/ExecutiveAdminSidebar';

interface ExecutiveAdminLayoutProps {
  children: ReactNode;
}

export function ExecutiveAdminLayout({ children }: ExecutiveAdminLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex w-full h-screen bg-background">
      {/* Executive Sidebar */}
      <ExecutiveAdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[280px]">
        <header className="sticky top-0 z-40 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-full items-center justify-between px-6">
            <h1 className="text-xl font-bold text-foreground">
              Principal Dashboard
            </h1>
            <IntegratedNotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Academic Admin Layout Integration
// ============================================================================

import { AcademicAdminSidebar } from '@/pages/admin/academic/components/layout/AcademicAdminSidebar';

interface AcademicAdminLayoutProps {
  children: ReactNode;
}

export function AcademicAdminLayout({ children }: AcademicAdminLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex w-full h-screen bg-background">
      {/* Academic Sidebar */}
      <AcademicAdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[280px]">
        <header className="sticky top-0 z-40 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-full items-center justify-between px-6">
            <h1 className="text-xl font-bold text-foreground">
              Academic Management
            </h1>
            <IntegratedNotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Unified Admin Layout (Role-based rendering)
// ============================================================================

import { AppSidebar } from '@/pages/admin/superadmin/components/layout/AppSidebar';
import { ExecutiveAdminSidebar } from '@/pages/admin/executive/components/layout/ExecutiveAdminSidebar';
import { AcademicAdminSidebar } from '@/pages/admin/academic/components/layout/AcademicAdminSidebar';

type AdminRole = 'superadmin' | 'super-admin' | 'executive' | 'executiveadmin' | 'academic' | 'academicadmin';

interface UnifiedAdminLayoutProps {
  children: ReactNode;
}

export function UnifiedAdminLayout({ children }: UnifiedAdminLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  // Function to render appropriate sidebar based on role
  const renderSidebar = () => {
    const role = user.role.toLowerCase() as AdminRole;

    if (role === 'superadmin' || role === 'super-admin') {
      return <AppSidebar />;
    }

    if (role === 'executive' || role === 'executiveadmin') {
      return <ExecutiveAdminSidebar />;
    }

    if (role === 'academic' || role === 'academicadmin') {
      return <AcademicAdminSidebar />;
    }

    // Default to superadmin sidebar
    return <AppSidebar />;
  };

  return (
    <div className="flex w-full h-screen bg-background">
      {/* Render appropriate sidebar */}
      {renderSidebar()}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[280px]">
        <header className="sticky top-0 z-40 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-full items-center justify-between px-6">
            <div className="text-foreground font-semibold">
              {user.name} - {user.role.toUpperCase()}
            </div>
            <IntegratedNotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Using in React Router Routes
// ============================================================================

import { Route, Routes } from 'react-router-dom';

// SuperAdmin Routes
export const SuperAdminRoutes = (
  <>
    <Route
      element={<SuperAdminLayout><Dashboard /></SuperAdminLayout>}
      path="superadmin"
    />
    <Route
      element={<SuperAdminLayout><AdminsPage /></SuperAdminLayout>}
      path="superadmin/admins"
    />
    <Route
      element={<SuperAdminLayout><StudentsPage /></SuperAdminLayout>}
      path="superadmin/students"
    />
    <Route
      element={<SuperAdminLayout><FacultyPage /></SuperAdminLayout>}
      path="superadmin/faculty"
    />
    <Route
      element={<SuperAdminLayout><DepartmentsPage /></SuperAdminLayout>}
      path="superadmin/departments"
    />
    <Route
      element={<SuperAdminLayout><TimetablePage /></SuperAdminLayout>}
      path="superadmin/timetable"
    />
    <Route
      element={<SuperAdminLayout><AnnouncementsPage /></SuperAdminLayout>}
      path="superadmin/announcements"
    />
    <Route
      element={<SuperAdminLayout><ReportsPage /></SuperAdminLayout>}
      path="superadmin/reports"
    />
    <Route
      element={<SuperAdminLayout><BackupPage /></SuperAdminLayout>}
      path="superadmin/backup"
    />
  </>
);

// Executive Routes
export const ExecutiveAdminRoutes = (
  <>
    <Route
      element={<ExecutiveAdminLayout><ExecutiveDashboard /></ExecutiveAdminLayout>}
      path="executive"
    />
    <Route
      element={<ExecutiveAdminLayout><AcademicPerformance /></ExecutiveAdminLayout>}
      path="executive/academic-performance"
    />
    <Route
      element={<ExecutiveAdminLayout><ExecutiveStudents /></ExecutiveAdminLayout>}
      path="executive/students"
    />
    <Route
      element={<ExecutiveAdminLayout><ExecutiveFaculty /></ExecutiveAdminLayout>}
      path="executive/faculty"
    />
    <Route
      element={<ExecutiveAdminLayout><LeaveRequests /></ExecutiveAdminLayout>}
      path="executive/leave-requests"
    />
    <Route
      element={<ExecutiveAdminLayout><ExecutiveAnnouncements /></ExecutiveAdminLayout>}
      path="executive/announcements"
    />
    <Route
      element={<ExecutiveAdminLayout><ExecutiveReports /></ExecutiveAdminLayout>}
      path="executive/reports"
    />
  </>
);

// Academic Routes
export const AcademicRoutesAsExample = (
  <>
    <Route
      element={<AcademicAdminLayout><AcademicDashboard /></AcademicAdminLayout>}
      path="academic"
    />
    <Route
      element={<AcademicAdminLayout><AcademicStudents /></AcademicAdminLayout>}
      path="academic/students"
    />
    <Route
      element={<AcademicAdminLayout><AcademicFaculty /></AcademicAdminLayout>}
      path="academic/faculty"
    />
    <Route
      element={<AcademicAdminLayout><AcademicDepartments /></AcademicAdminLayout>}
      path="academic/departments"
    />
    <Route
      element={<AcademicAdminLayout><AcademicAnnouncements /></AcademicAdminLayout>}
      path="academic/announcements"
    />
    <Route
      element={<AcademicAdminLayout><AcademicReports /></AcademicAdminLayout>}
      path="academic/reports"
    />
  </>
);

// ============================================================================
// EXAMPLE 6: Custom Usage with Manual Margin Adjustment
// ============================================================================

/** 
 * If your page content needs to adjust its margin based on sidebar state,
 * you can use CSS Grid instead:
 */

export function ResponsiveAdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr', // Change to '80px 1fr' when collapsed
        height: '100vh',
      }}
      className="bg-background"
    >
      {/* Sidebar always 280px or 80px */}
      <AppSidebar />

      {/* Main content takes remaining space */}
      <div className="flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 h-16 border-b bg-card/95 backdrop-blur">
          <div className="flex h-full items-center justify-between px-6">
            <span className="font-semibold text-foreground">{user?.name}</span>
            <IntegratedNotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: TypeScript-Safe Integration
// ============================================================================

interface BaseLayoutProps {
  children: ReactNode;
  title?: string;
}

abstract class BaseAdminLayout {
  protected renderSidebar(): ReactNode {
    throw new Error('Must implement renderSidebar');
  }

  protected renderContent(children: ReactNode, title?: string): ReactNode {
    return (
      <div className="flex-1 flex flex-col ml-[280px]">
        <header className="sticky top-0 z-40 h-16 border-b bg-card/95 backdrop-blur">
          <div className="flex h-full items-center justify-between px-6">
            {title && <h1 className="text-xl font-bold">{title}</h1>}
            <IntegratedNotificationBell />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    );
  }
}

class SuperAdminLayoutTypeSafe extends BaseAdminLayout {
  protected renderSidebar(): ReactNode {
    return <AppSidebar />;
  }

  render(children: ReactNode, title?: string): ReactNode {
    return (
      <div className="flex w-full h-screen bg-background">
        {this.renderSidebar()}
        {this.renderContent(children, title)}
      </div>
    );
  }
}

// ============================================================================
// NOTES AND BEST PRACTICES
// ============================================================================

/**
 * KEY POINTS:
 * 
 * 1. Always set ml-[280px] on main content area (matches sidebar width)
 * 2. Use fixed positioning on sidebar (already handled in component)
 * 3. Sidebar handles its own collapsed state via localStorage
 * 4. No need to pass props to sidebar components
 * 5. Components use useAuth, useNavigate internally
 * 6. All event handling uses onMouseDown + preventDefault pattern
 * 7. Colors use existing CSS custom properties (--sidebar, --sidebar-accent, etc)
 * 
 * LAYOUT STRUCTURE:
 * ┌─────────────────────────────────────┐
 * │ Sidebar (fixed) │ Main Content      │
 * │ z-50            │                   │
 * │ 280px/80px      │ flex-1            │
 * │                 │                   │
 * │                 ├─────────────────┤
 * │                 │ Header (sticky) │
 * │                 ├─────────────────┤
 * │                 │ Page Content    │
 * │                 │ (overflow-y)    │
 * │                 └─────────────────┘
 * └─────────────────────────────────────┘
 * 
 * RESPONSIVE CONSIDERATIONS:
 * - On mobile < 768px, consider converting sidebar to drawer/modal
 * - Set overflow-y-auto on main content for scrolling
 * - Header should be sticky with proper z-index
 * - Use consistent padding (usually 6 or 8)
 * 
 * PERFORMANCE TIPS:
 * - Wrap page content in React.memo if heavy
 * - Use code splitting for different admin sections
 * - Lazy load sidebars if needed (unlikely for one component)
 * - Cache navigation item rendering
 */

export default {
  SuperAdminLayout,
  ExecutiveAdminLayout,
  AcademicAdminLayout,
  UnifiedAdminLayout,
  ResponsiveAdminLayout,
};
