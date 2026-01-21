import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "./components/dashboard/StatCard";
import { NextClassCard } from "./components/dashboard/NextClassCard";
import { PendingTasksList } from "./components/dashboard/PendingTasksList";
import { LeaveSnapshot } from "./components/dashboard/LeaveSnapshot";
import { ProgressRing } from "./components/dashboard/ProgressRing";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Calendar,
  Award,
  Briefcase,
  Heart,
  CalendarDays,
} from "lucide-react";

// Mock data
const currentClass = {
  subject: "Data Structures & Algorithms",
  time: "10:30 AM - 11:30 AM",
  room: "Lab 2, Block A",
  section: "CSE-A",
  studentsCount: 62,
};

const nextClass = {
  subject: "Object Oriented Programming",
  time: "12:00 PM - 1:00 PM",
  room: "Room 204, Block B",
  section: "CSE-B",
  studentsCount: 58,
};

const pendingTasks = [
  {
    id: "1",
    title: "Mark attendance for DSA - CSE-A",
    dueDate: "Today",
    priority: "high" as const,
    type: "attendance" as const,
  },
  {
    id: "2",
    title: "Upload Internal Test 1 marks",
    dueDate: "Tomorrow",
    priority: "medium" as const,
    type: "marks" as const,
  },
  {
    id: "3",
    title: "Grade OOP Lab Assignment 3",
    dueDate: "In 3 days",
    priority: "low" as const,
    type: "assignment" as const,
  },
];

const leaveBalance = [
  { type: "Casual Leave", icon: Calendar, total: 12, used: 4, remaining: 8 },
  { type: "Sick Leave", icon: Heart, total: 10, used: 2, remaining: 8 },
  { type: "Duty Leave", icon: Briefcase, total: 15, used: 3, remaining: 12 },
];

export default function Dashboard() {
  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="page-header font-serif">Good Morning, Dr. Sharma</h1>
        <p className="text-muted-foreground -mt-4">
          Here's your academic overview for today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value="248"
          subtitle="Across 4 sections"
          icon={Users}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Subjects"
          value="6"
          subtitle="This semester"
          icon={BookOpen}
          variant="secondary"
          delay={0.1}
        />
        <StatCard
          title="Classes Today"
          value="5"
          subtitle="2 completed"
          icon={Calendar}
          variant="success"
          delay={0.2}
        />
        <StatCard
          title="Avg. Attendance"
          value="87%"
          subtitle="+3% from last month"
          icon={Award}
          variant="warning"
          delay={0.3}
        />
      </div>

      {/* Current/Next Class */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <NextClassCard currentClass={currentClass} nextClass={nextClass} />
        
        {/* Syllabus Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="widget-card flex flex-col items-center justify-center"
        >
          <h3 className="section-title text-center mb-4">Syllabus Coverage</h3>
          <ProgressRing
            progress={68}
            value="68%"
            label="Overall Progress"
          />
          <div className="mt-4 grid grid-cols-2 gap-4 w-full text-center">
            <div>
              <p className="text-2xl font-bold text-primary">42</p>
              <p className="text-xs text-muted-foreground">Topics Covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">20</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingTasksList tasks={pendingTasks} />
        <LeaveSnapshot leaves={leaveBalance} />
      </div>
    </MainLayout>
  );
}
