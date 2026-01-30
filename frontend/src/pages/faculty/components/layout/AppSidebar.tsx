import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Calendar,
  ClipboardCheck,
  BookOpen,
  CalendarDays,
  FileText,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  Hash,
  Briefcase,
  Building2,
  LogOut,
} from "lucide-react";
import { cn } from "@/pages/faculty/lib/utils";

const facultyInfo = {
  name: "Dr. Rajesh Kumar Sharma",
  facultyId: "FAC001",
  employeeId: "EMP12345",
  designation: "Associate Professor",
  department: "CSE",
};

const menuItems = [
  { title: "Dashboard", url: "/faculty/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/faculty/profile", icon: User },
  { title: "Timetable", url: "/faculty/timetable", icon: Calendar },
  { title: "Attendance", url: "/faculty/attendance", icon: ClipboardCheck },
  { title: "Academics", url: "/faculty/academics", icon: BookOpen },
  { title: "Leave", url: "/faculty/leave", icon: CalendarDays },
  { title: "Assessments", url: "/faculty/assessments", icon: FileText },
  { title: "Counseling", url: "/faculty/counseling", icon: Users },
  { title: "Communication", url: "/faculty/communication", icon: MessageSquare },
  { title: "Reports", url: "/faculty/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar z-50 flex flex-col shadow-xl"
    >

      {/* Faculty Info Section */}
      <div className="px-3 py-4 border-b border-sidebar-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sidebar-accent to-secondary flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                {facultyInfo.name.split(" ").map((n) => n[0]).join("")}
              </div>

              {/* Faculty Details */}
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold truncate text-sm">
                  {facultyInfo.name}
                </p>
                <p className="text-white/70 truncate text-xs">
                  {facultyInfo.designation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.url;
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-accent text-white"
                      : "text-white/70 hover:bg-sidebar-accent/50 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors",
                      isActive ? "text-secondary" : "text-white/70 group-hover:text-secondary"
                    )}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium text-sm whitespace-nowrap overflow-hidden"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Logout and Collapse Toggle */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent text-white hover:bg-sidebar-accent/80 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50 text-white hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}



