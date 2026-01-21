import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  History,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  rollNo: string;
  name: string;
  photo: string;
  attendance?: "present" | "absent" | "late";
}

const students: Student[] = [
  { id: "1", rollNo: "CSE001", name: "Aditya Kumar", photo: "AK" },
  { id: "2", rollNo: "CSE002", name: "Priya Sharma", photo: "PS" },
  { id: "3", rollNo: "CSE003", name: "Rahul Verma", photo: "RV" },
  { id: "4", rollNo: "CSE004", name: "Sneha Patel", photo: "SP" },
  { id: "5", rollNo: "CSE005", name: "Vikram Singh", photo: "VS" },
  { id: "6", rollNo: "CSE006", name: "Ananya Gupta", photo: "AG" },
  { id: "7", rollNo: "CSE007", name: "Arjun Reddy", photo: "AR" },
  { id: "8", rollNo: "CSE008", name: "Kavya Nair", photo: "KN" },
  { id: "9", rollNo: "CSE009", name: "Rohit Joshi", photo: "RJ" },
  { id: "10", rollNo: "CSE010", name: "Meera Krishnan", photo: "MK" },
  { id: "11", rollNo: "CSE011", name: "Sanjay Rao", photo: "SR" },
  { id: "12", rollNo: "CSE012", name: "Divya Menon", photo: "DM" },
];

const attendanceHistory = [
  { date: "2024-01-15", subject: "Data Structures", section: "CSE-A", present: 58, absent: 4, late: 2 },
  { date: "2024-01-14", subject: "Data Structures", section: "CSE-A", present: 60, absent: 2, late: 2 },
  { date: "2024-01-13", subject: "OOP", section: "CSE-B", present: 55, absent: 3, late: 0 },
  { date: "2024-01-12", subject: "Algorithms", section: "CSE-C", present: 52, absent: 6, late: 2 },
];

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [markAllPresent, setMarkAllPresent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMarkAll = (checked: boolean) => {
    setMarkAllPresent(checked);
    if (checked) {
      const allPresent: Record<string, string> = {};
      students.forEach((s) => {
        allPresent[s.id] = "present";
      });
      setAttendanceData(allPresent);
    } else {
      setAttendanceData({});
    }
  };

  const handleAttendanceChange = (studentId: string, value: string) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: value }));
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = Object.values(attendanceData).filter((v) => v === "present").length;
  const absentCount = Object.values(attendanceData).filter((v) => v === "absent").length;
  const lateCount = Object.values(attendanceData).filter((v) => v === "late").length;

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="page-header font-serif">Attendance Management</h1>
        <p className="text-muted-foreground -mt-4">
          Mark and manage student attendance
        </p>
      </motion.div>

      <Tabs defaultValue="mark" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="mark" className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Attendance History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mark">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="widget-card mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select defaultValue="a">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Section A</SelectItem>
                    <SelectItem value="b">Section B</SelectItem>
                    <SelectItem value="c">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select defaultValue="ds">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ds">Data Structures</SelectItem>
                    <SelectItem value="oop">Object Oriented Programming</SelectItem>
                    <SelectItem value="algo">Algorithms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
            </div>
          </motion.div>

          {/* Stats & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="p-4 bg-success/10 rounded-lg border border-success/20 text-center">
                <p className="text-2xl font-bold text-success">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
                <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20 text-center">
                <p className="text-2xl font-bold text-warning">{lateCount}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={markAllPresent}
                  onCheckedChange={handleMarkAll}
                  id="mark-all"
                />
                <Label htmlFor="mark-all" className="text-sm">
                  Mark All Present
                </Label>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative mb-4"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll number..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* Student Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.03 }}
                className={cn(
                  "widget-card p-4 transition-all",
                  attendanceData[student.id] === "present" && "border-success/50 bg-success/5",
                  attendanceData[student.id] === "absent" && "border-destructive/50 bg-destructive/5",
                  attendanceData[student.id] === "late" && "border-warning/50 bg-warning/5"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {student.photo}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.rollNo}</p>
                  </div>
                </div>
                <RadioGroup
                  value={attendanceData[student.id] || ""}
                  onValueChange={(value) => handleAttendanceChange(student.id, value)}
                  className="flex gap-2"
                >
                  <div className="flex-1">
                    <RadioGroupItem
                      value="present"
                      id={`${student.id}-present`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`${student.id}-present`}
                      className={cn(
                        "flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer transition-all text-xs",
                        attendanceData[student.id] === "present"
                          ? "bg-success text-white border-success"
                          : "hover:bg-success/10 border-border"
                      )}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      P
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem
                      value="absent"
                      id={`${student.id}-absent`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`${student.id}-absent`}
                      className={cn(
                        "flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer transition-all text-xs",
                        attendanceData[student.id] === "absent"
                          ? "bg-destructive text-white border-destructive"
                          : "hover:bg-destructive/10 border-border"
                      )}
                    >
                      <XCircle className="w-3 h-3" />
                      A
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem
                      value="late"
                      id={`${student.id}-late`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`${student.id}-late`}
                      className={cn(
                        "flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer transition-all text-xs",
                        attendanceData[student.id] === "late"
                          ? "bg-warning text-white border-warning"
                          : "hover:bg-warning/10 border-border"
                      )}
                    >
                      <Clock className="w-3 h-3" />
                      L
                    </Label>
                      <Label
                      htmlFor={`${student.id}-late`}
                      className={cn(
                        "flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer transition-all text-xs",
                        attendanceData[student.id] === ""
                          ? "bg-warning text-white border-warning"
                          : "hover:bg-warning/10 border-border"
                      )}
                    >
                      <Clock className="w-3 h-3" />
                      OD
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="history">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="widget-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title flex items-center gap-2 mb-0">
                <History className="w-5 h-5 text-primary" />
                Recent Attendance Records
              </h3>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Subject</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Section</th>
                    <th className="text-center p-3 text-sm font-semibold text-success">Present</th>
                    <th className="text-center p-3 text-sm font-semibold text-destructive">Absent</th>
                    <th className="text-center p-3 text-sm font-semibold text-warning">Late</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record, index) => (
                    <motion.tr
                      key={record.date + record.subject}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3 text-sm font-medium">{record.date}</td>
                      <td className="p-3 text-sm">{record.subject}</td>
                      <td className="p-3 text-sm">{record.section}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 bg-success/10 text-success rounded-full text-sm">
                          {record.present}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-sm">
                          {record.absent}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 bg-warning/10 text-warning rounded-full text-sm">
                          {record.late}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
