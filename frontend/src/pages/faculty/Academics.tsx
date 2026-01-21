import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileUp,
  ClipboardList,
  Check,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  FileText,
  Video,
  Presentation,
  Users,
  GraduationCap,
  Send,
  RefreshCw,
  FileIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassSubject {
  id: string;
  program: string;
  semester: string;
  section: string;
  subject: string;
  subjectCode: string;
}

interface Topic {
  id: string;
  name: string;
  hours: number;
  completed: boolean;
}

interface Material {
  id: string;
  name: string;
  type: "pdf" | "ppt" | "video";
  size: string;
  visible: boolean;
  uploadDate: string;
}

interface StudentMark {
  id: string;
  rollNo: string;
  name: string;
  test1: number;
  test2: number;
  quiz: number;
  assignment: number;
  total?: number;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  category: string;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  totalHours: number;
  credits: number;
}

interface SemesterCredits {
  semester: number;
  year: number;
  department: string;
  subjects: Subject[];
}

// Credits data organized by semester, department, and year
const creditsData: SemesterCredits[] = [
  {
    semester: 5,
    year: 3,
    department: "CSE",
    subjects: [
      { id: "1", code: "CS3452", name: "Theory of Computation", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 3, credits: 3 },
      { id: "2", code: "CS3491", name: "Artificial Intelligence and Machine Learning", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
      { id: "3", code: "CS3492", name: "Database Management Systems", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 3, credits: 3 },
      { id: "4", code: "IT3401", name: "Web Essentials", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
      { id: "5", code: "CS3451", name: "Introduction to Operating Systems", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 3, credits: 3 },
      { id: "6", code: "GE3451", name: "Environmental Sciences and Sustainability", category: "BSC", lectureHours: 2, tutorialHours: 0, practicalHours: 0, totalHours: 2, credits: 2 },
    ],
  },
  {
    semester: 4,
    year: 2,
    department: "CSE",
    subjects: [
      { id: "1", code: "CS3401", name: "Algorithms", category: "PCC", lectureHours: 3, tutorialHours: 1, practicalHours: 0, totalHours: 4, credits: 4 },
      { id: "2", code: "CS3402", name: "Database Systems", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
      { id: "3", code: "CS3403", name: "Operating Systems", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 3, credits: 3 },
      { id: "4", code: "MA3401", name: "Probability and Statistics", category: "BSC", lectureHours: 3, tutorialHours: 1, practicalHours: 0, totalHours: 4, credits: 4 },
    ],
  },
  {
    semester: 3,
    year: 2,
    department: "CSE",
    subjects: [
      { id: "1", code: "CS3301", name: "Data Structures", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
      { id: "2", code: "CS3302", name: "Digital Logic Design", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 3, credits: 3 },
      { id: "3", code: "CS3303", name: "Object Oriented Programming", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
    ],
  },
  {
    semester: 5,
    year: 3,
    department: "AI&DS",
    subjects: [
      { id: "1", code: "AD3501", name: "Deep Learning", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
      { id: "2", code: "AD3502", name: "Natural Language Processing", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
      { id: "3", code: "AD3503", name: "Computer Vision", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
    ],
  },
  {
    semester: 4,
    year: 2,
    department: "IT",
    subjects: [
      { id: "1", code: "IT3401", name: "Web Technology", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
      { id: "2", code: "IT3402", name: "Software Engineering", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 3, credits: 3 },
      { id: "3", code: "IT3403", name: "Computer Networks", category: "PCC", lectureHours: 3, tutorialHours: 0, practicalHours: 2, totalHours: 5, credits: 4 },
    ],
  },
];

// Classes handled by the faculty
const classesHandled: ClassSubject[] = [
  { id: "1", program: "B.E - CSE", semester: "3", section: "A", subject: "Data Structures & Algorithms", subjectCode: "CS3301" },
  { id: "2", program: "B.Tech - AI&DS", semester: "4", section: "A", subject: "Computer Networks", subjectCode: "CS3591" },
  { id: "3", program: "B.Tech - IT", semester: "4", section: "B", subject: "Web Technology", subjectCode: "IT3401" },
  { id: "4", program: "B.E - CSE", semester: "5", section: "B", subject: "Machine Learning", subjectCode: "CS3501" },
  { id: "5", program: "B.Tech - AI&DS", semester: "6", section: "A", subject: "Deep Learning", subjectCode: "AD3601" },
];

// Syllabus data per class
const syllabusDataByClass: Record<string, Topic[]> = {
  "1": [
    { id: "1", name: "Introduction to Data Structures", hours: 3, completed: true },
    { id: "2", name: "Arrays and Linked Lists", hours: 6, completed: true },
    { id: "3", name: "Stacks and Queues", hours: 5, completed: true },
    { id: "4", name: "Trees and Binary Trees", hours: 8, completed: false },
    { id: "5", name: "Graphs and Traversals", hours: 8, completed: false },
    { id: "6", name: "Sorting Algorithms", hours: 6, completed: false },
  ],
  "2": [
    { id: "1", name: "Introduction to Networks", hours: 4, completed: true },
    { id: "2", name: "Physical Layer", hours: 5, completed: true },
    { id: "3", name: "Data Link Layer", hours: 6, completed: false },
    { id: "4", name: "Network Layer", hours: 8, completed: false },
    { id: "5", name: "Transport Layer", hours: 6, completed: false },
  ],
  "3": [
    { id: "1", name: "HTML5 & CSS3", hours: 6, completed: true },
    { id: "2", name: "JavaScript Fundamentals", hours: 8, completed: true },
    { id: "3", name: "React.js Basics", hours: 8, completed: true },
    { id: "4", name: "Node.js Backend", hours: 6, completed: false },
    { id: "5", name: "Database Integration", hours: 6, completed: false },
  ],
  "4": [
    { id: "1", name: "Introduction to ML", hours: 4, completed: true },
    { id: "2", name: "Supervised Learning", hours: 8, completed: false },
    { id: "3", name: "Unsupervised Learning", hours: 6, completed: false },
    { id: "4", name: "Neural Networks", hours: 8, completed: false },
  ],
  "5": [
    { id: "1", name: "Deep Learning Fundamentals", hours: 4, completed: true },
    { id: "2", name: "Convolutional Neural Networks", hours: 8, completed: false },
    { id: "3", name: "Recurrent Neural Networks", hours: 6, completed: false },
    { id: "4", name: "Transformers & Attention", hours: 8, completed: false },
  ],
};

// Materials data per class
const materialsDataByClass: Record<string, Material[]> = {
  "1": [
    { id: "1", name: "Data Structures Introduction.pdf", type: "pdf", size: "2.3 MB", visible: true, uploadDate: "2024-01-10" },
    { id: "2", name: "Arrays Deep Dive.ppt", type: "ppt", size: "5.1 MB", visible: true, uploadDate: "2024-01-12" },
    { id: "3", name: "Linked List Tutorial", type: "video", size: "45 MB", visible: false, uploadDate: "2024-01-14" },
  ],
  "2": [
    { id: "1", name: "Network Basics.pdf", type: "pdf", size: "3.2 MB", visible: true, uploadDate: "2024-01-08" },
    { id: "2", name: "OSI Model.ppt", type: "ppt", size: "4.5 MB", visible: true, uploadDate: "2024-01-10" },
  ],
  "3": [
    { id: "1", name: "HTML5 Guide.pdf", type: "pdf", size: "2.1 MB", visible: true, uploadDate: "2024-01-05" },
    { id: "2", name: "React Tutorial", type: "video", size: "120 MB", visible: true, uploadDate: "2024-01-15" },
  ],
  "4": [
    { id: "1", name: "ML Introduction.pdf", type: "pdf", size: "4.2 MB", visible: true, uploadDate: "2024-01-12" },
  ],
  "5": [
    { id: "1", name: "Deep Learning Basics.pdf", type: "pdf", size: "5.5 MB", visible: true, uploadDate: "2024-01-18" },
  ],
};

// Student marks data per class
const studentMarksDataByClass: Record<string, StudentMark[]> = {
  "1": [
    { id: "1", rollNo: "CSE001", name: "Aditya Kumar", test1: 18, test2: 17, quiz: 9, assignment: 8 },
    { id: "2", rollNo: "CSE002", name: "Priya Sharma", test1: 20, test2: 19, quiz: 10, assignment: 10 },
    { id: "3", rollNo: "CSE003", name: "Rahul Verma", test1: 15, test2: 16, quiz: 8, assignment: 7 },
  ],
  "2": [
    { id: "1", rollNo: "AD001", name: "Sneha Patel", test1: 19, test2: 18, quiz: 9, assignment: 9 },
    { id: "2", rollNo: "AD002", name: "Vikram Singh", test1: 17, test2: 16, quiz: 8, assignment: 8 },
  ],
  "3": [
    { id: "1", rollNo: "IT001", name: "Ananya Rao", test1: 20, test2: 20, quiz: 10, assignment: 10 },
    { id: "2", rollNo: "IT002", name: "Karthik Nair", test1: 16, test2: 17, quiz: 7, assignment: 8 },
  ],
  "4": [
    { id: "1", rollNo: "CSE101", name: "Meera Iyer", test1: 18, test2: 19, quiz: 9, assignment: 9 },
  ],
  "5": [
    { id: "1", rollNo: "AD101", name: "Arjun Menon", test1: 19, test2: 18, quiz: 10, assignment: 9 },
  ],
};

const typeIcons = {
  pdf: FileText,
  ppt: Presentation,
  video: Video,
};

export default function Academics() {
  const [selectedClassId, setSelectedClassId] = useState(classesHandled[0].id);
  const [topicsData, setTopicsData] = useState<Record<string, Topic[]>>(syllabusDataByClass);
  const [materialsData, setMaterialsData] = useState<Record<string, Material[]>>(materialsDataByClass);
  const [marksData, setMarksData] = useState<Record<string, StudentMark[]>>(studentMarksDataByClass);
  const [lockedClasses, setLockedClasses] = useState<Record<string, boolean>>({});

  // Credits filter states
  const [creditsDepartment, setCreditsDepartment] = useState<string>("CSE");
  const [creditsYear, setCreditsYear] = useState<string>("3");
  const [creditsSemester, setCreditsSemester] = useState<string>("5");

  // Course file states
  const [courseFile, setCourseFile] = useState<File | null>(null);
  const [courseFileUrl, setCourseFileUrl] = useState<string | null>(null);
  const [isFileSent, setIsFileSent] = useState<boolean>(false);

  const selectedClass = classesHandled.find(c => c.id === selectedClassId)!;
  const topics = topicsData[selectedClassId] || [];
  const materials = materialsData[selectedClassId] || [];
  const marks = marksData[selectedClassId] || [];
  const isLocked = lockedClasses[selectedClassId] || false;

  // Get filtered credits data
  const filteredCredits = creditsData.find(
    (c) => c.department === creditsDepartment && c.year === parseInt(creditsYear) && c.semester === parseInt(creditsSemester)
  );
  const totalCredits = filteredCredits?.subjects.reduce((acc, s) => acc + s.credits, 0) || 0;
  const totalContactHours = filteredCredits?.subjects.reduce((acc, s) => acc + s.totalHours, 0) || 0;

  const completedTopics = topics.filter((t) => t.completed).length;
  const totalHours = topics.reduce((acc, t) => acc + t.hours, 0);
  const completedHours = topics.filter((t) => t.completed).reduce((acc, t) => acc + t.hours, 0);
  const progressPercentage = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;

  const toggleTopic = (id: string) => {
    setTopicsData((prev) => ({
      ...prev,
      [selectedClassId]: prev[selectedClassId].map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const toggleVisibility = (id: string) => {
    setMaterialsData((prev) => ({
      ...prev,
      [selectedClassId]: prev[selectedClassId].map((m) =>
        m.id === id ? { ...m, visible: !m.visible } : m
      ),
    }));
  };

  const lockMarks = () => {
    setLockedClasses((prev) => ({
      ...prev,
      [selectedClassId]: true,
    }));
  };

  const calculateTotal = (student: StudentMark) => {
    const weightage = {
      test1: 0.25,
      test2: 0.25,
      quiz: 0.2,
      assignment: 0.3,
    };
    return Math.round(
      student.test1 * weightage.test1 +
      student.test2 * weightage.test2 +
      student.quiz * 2 * weightage.quiz +
      student.assignment * weightage.assignment * 10
    );
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="page-header font-serif">Academic Activities</h1>
        <p className="text-muted-foreground -mt-4">
          Manage syllabus, materials, and internal marks for your classes
        </p>
      </motion.div>

      {/* Class Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="widget-card mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Select Class</p>
              <p className="font-semibold text-foreground">Choose a class to manage</p>
            </div>
          </div>
          <div className="flex-1 md:max-w-md">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classesHandled.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-secondary" />
                      <span>{cls.program} - Sem {cls.semester} - Sec {cls.section}</span>
                      <Badge variant="outline" className="ml-2">{cls.subjectCode}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Class Info */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Program</p>
              <p className="font-semibold text-foreground">{selectedClass.program}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Semester / Section</p>
              <p className="font-semibold text-foreground">Sem {selectedClass.semester} - Sec {selectedClass.section}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subject Code</p>
              <p className="font-semibold text-secondary">{selectedClass.subjectCode}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subject Name</p>
              <p className="font-semibold text-foreground">{selectedClass.subject}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="syllabus" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="syllabus" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Syllabus
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <FileUp className="w-4 h-4" />
            Study Materials
          </TabsTrigger>
          <TabsTrigger value="marks" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Internal Marks
          </TabsTrigger>
          <TabsTrigger value="coursefile" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Course File 
          </TabsTrigger>
          <TabsTrigger value="credits" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Credits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="syllabus">
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="widget-card mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedClass.subject}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedClass.program} • Semester {selectedClass.semester} • Section {selectedClass.section}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondary">
                  {completedTopics}/{topics.length}
                </p>
                <p className="text-xs text-muted-foreground">Topics Completed</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hours Covered</span>
                <span className="font-medium">{completedHours}/{totalHours} hrs</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </motion.div>

          {/* Topics List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="widget-card"
          >
            <h3 className="section-title">Syllabus Topics</h3>
            <div className="space-y-3">
              {topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer",
                    topic.completed
                      ? "bg-success/5 border-success/30"
                      : "bg-muted/30 border-border hover:border-primary/30"
                  )}
                  onClick={() => toggleTopic(topic.id)}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox checked={topic.completed} />
                    <div>
                      <p className={cn(
                        "font-medium",
                        topic.completed && "line-through text-muted-foreground"
                      )}>
                        {topic.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{topic.hours} hours</p>
                    </div>
                  </div>
                  {topic.completed && (
                    <Check className="w-5 h-5 text-success" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="materials">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="widget-card mb-6"
          >
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-foreground mb-1">
                Drag and drop files here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse (PDF, PPT, Video links)
              </p>
              <Button variant="outline">
                <FileUp className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </motion.div>

          {/* Materials List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="widget-card"
          >
            <h3 className="section-title">Uploaded Materials for {selectedClass.subject}</h3>
            {materials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No materials uploaded yet for this class
              </div>
            ) : (
              <div className="space-y-3">
                {materials.map((material, index) => {
                  const Icon = typeIcons[material.type];
                  return (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          material.type === "pdf" && "bg-destructive/10",
                          material.type === "ppt" && "bg-warning/10",
                          material.type === "video" && "bg-secondary/10"
                        )}>
                          <Icon className={cn(
                            "w-5 h-5",
                            material.type === "pdf" && "text-destructive",
                            material.type === "ppt" && "text-warning",
                            material.type === "video" && "text-secondary"
                          )} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{material.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {material.size} • {material.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {material.visible ? (
                            <Eye className="w-4 h-4 text-success" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <Switch
                            checked={material.visible}
                            onCheckedChange={() => toggleVisibility(material.id)}
                          />
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="marks">
          {/* Lock Banner */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <Lock className="w-5 h-5 text-warning" />
              <p className="text-sm text-warning font-medium">
                Marks have been locked and submitted to Controller of Exams for {selectedClass.subject}
              </p>
            </motion.div>
          )}

          {/* Marks Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="widget-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="section-title mb-0">Internal Marks Entry - {selectedClass.subject}</h3>
                <p className="text-xs text-muted-foreground">
                  Weightage: Test 1 (25%) + Test 2 (25%) + Quiz (20%) + Assignment (30%)
                </p>
              </div>
              <Button
                className={isLocked ? "bg-muted" : "bg-primary hover:bg-primary/90"}
                disabled={isLocked}
                onClick={lockMarks}
              >
                <Lock className="w-4 h-4 mr-2" />
                Lock Marks
              </Button>
            </div>

            {marks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students found for this class
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Roll No</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Name</th>
                      <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Test 1 (20)</th>
                      <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Test 2 (20)</th>
                      <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Quiz (10)</th>
                      <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Assignment (10)</th>
                      <th className="text-center p-3 text-sm font-semibold text-primary">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((student, index) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3 text-sm font-mono">{student.rollNo}</td>
                        <td className="p-3 text-sm font-medium">{student.name}</td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={student.test1}
                            className="w-16 text-center mx-auto"
                            disabled={isLocked}
                            max={20}
                            min={0}
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={student.test2}
                            className="w-16 text-center mx-auto"
                            disabled={isLocked}
                            max={20}
                            min={0}
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={student.quiz}
                            className="w-16 text-center mx-auto"
                            disabled={isLocked}
                            max={10}
                            min={0}
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={student.assignment}
                            className="w-16 text-center mx-auto"
                            disabled={isLocked}
                            max={10}
                            min={0}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-full">
                            {calculateTotal(student)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="coursefile">
          {/* Course File Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="widget-card mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Course File</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload and manage course file for {selectedClass.subject}
                  </p>
                </div>
              </div>
              {isFileSent && (
                <Badge className="bg-success/10 text-success border-success/30">
                  <Check className="w-3 h-3 mr-1" /> Sent to HOD
                </Badge>
              )}
            </div>

            {!courseFile ? (
              /* Upload Area */
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <FileIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium text-foreground mb-2">
                  Upload Course File (PDF)
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your PDF file here or click to browse
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type === "application/pdf") {
                        setCourseFile(file);
                        setCourseFileUrl(URL.createObjectURL(file));
                        setIsFileSent(false);
                      }
                    }}
                  />
                  <Button variant="outline" className="pointer-events-none">
                    <Upload className="w-4 h-4 mr-2" />
                    Select PDF File
                  </Button>
                </label>
              </div>
            ) : (
              /* PDF Viewer and Actions */
              <div className="space-y-4">
                {/* File Info Bar */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <FileText className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{courseFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(courseFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.type === "application/pdf") {
                            if (courseFileUrl) URL.revokeObjectURL(courseFileUrl);
                            setCourseFile(file);
                            setCourseFileUrl(URL.createObjectURL(file));
                            setIsFileSent(false);
                          }
                        }}
                      />
                      <Button variant="outline" size="sm" className="pointer-events-none">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (courseFileUrl) URL.revokeObjectURL(courseFileUrl);
                        setCourseFile(null);
                        setCourseFileUrl(null);
                        setIsFileSent(false);
                      }}
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* PDF Viewer */}
                <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                  <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">PDF Preview</span>
                  </div>
                  <div className="h-[500px]">
                    {courseFileUrl && (
                      <iframe
                        src={courseFileUrl}
                        className="w-full h-full"
                        title="Course File PDF Preview"
                      />
                    )}
                  </div>
                </div>

                {/* Send Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    className={cn(
                      "min-w-[140px]",
                      isFileSent
                        ? "bg-success hover:bg-success/90"
                        : "bg-primary hover:bg-primary/90"
                    )}
                    onClick={() => setIsFileSent(true)}
                    disabled={isFileSent}
                  >
                    {isFileSent ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Sent
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send to HOD
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="credits">
          {/* Credits Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="widget-card mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Filter Credits</p>
                  <p className="font-semibold text-foreground">Select Department, Year & Semester</p>
                </div>
              </div>
              <div className="flex flex-1 gap-3 flex-wrap md:flex-nowrap">
                <Select value={creditsDepartment} onValueChange={setCreditsDepartment}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="AI&DS">AI&DS</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={creditsYear} onValueChange={setCreditsYear}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={creditsSemester} onValueChange={setCreditsSemester}>
                  <SelectTrigger className="w-full md:w-36">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                    <SelectItem value="8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Credits Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <div className="widget-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Subjects</p>
                  <p className="text-2xl font-bold text-primary">{filteredCredits?.subjects.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="widget-card bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold text-secondary">{totalCredits}</p>
                </div>
              </div>
            </div>
            <div className="widget-card bg-gradient-to-br from-success/5 to-success/10 border-success/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-xl">
                  <ClipboardList className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Hours/Week</p>
                  <p className="text-2xl font-bold text-success">{totalContactHours}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subjects Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="widget-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="section-title mb-0">
                  {creditsDepartment} - Year {creditsYear} - Semester {creditsSemester}
                </h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-muted-foreground">L = Lecture</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-muted-foreground">T = Tutorial</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-muted-foreground">P = Practical</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <span className="text-muted-foreground">C = Credits</span>
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {filteredCredits?.subjects.length || 0} Subjects
              </Badge>
            </div>

            {!filteredCredits || filteredCredits.subjects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No subjects found</p>
                <p className="text-sm">Try selecting a different department, year, or semester</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">S.No</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Code</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Subject Name</th>
                      <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Category</th>
                      <th className="text-center p-3 text-sm font-semibold text-blue-500">L</th>
                      <th className="text-center p-3 text-sm font-semibold text-amber-500">T</th>
                      <th className="text-center p-3 text-sm font-semibold text-emerald-500">P</th>
                      <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Total</th>
                      <th className="text-center p-3 text-sm font-semibold text-purple-500">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCredits.subjects.map((subject, index) => (
                      <motion.tr
                        key={subject.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="p-3 text-sm font-mono text-secondary">{subject.code}</td>
                        <td className="p-3 text-sm font-medium">{subject.name}</td>
                        <td className="p-3 text-center">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              subject.category === "PCC" && "border-primary/50 text-primary bg-primary/5",
                              subject.category === "BSC" && "border-success/50 text-success bg-success/5",
                              subject.category === "ESC" && "border-warning/50 text-warning bg-warning/5",
                              subject.category === "HSMC" && "border-secondary/50 text-secondary bg-secondary/5"
                            )}
                          >
                            {subject.category}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-center">
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium rounded">
                            {subject.lectureHours}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-center">
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium rounded">
                            {subject.tutorialHours}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-center">
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium rounded">
                            {subject.practicalHours}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-center font-medium">{subject.totalHours}</td>
                        <td className="p-3 text-center">
                          <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold rounded-full">
                            {subject.credits}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/50 font-semibold">
                      <td colSpan={4} className="p-3 text-right text-sm">Total:</td>
                      <td className="p-3 text-center text-sm">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium rounded">
                          {filteredCredits.subjects.reduce((acc, s) => acc + s.lectureHours, 0)}
                        </span>
                      </td>
                      <td className="p-3 text-center text-sm">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium rounded">
                          {filteredCredits.subjects.reduce((acc, s) => acc + s.tutorialHours, 0)}
                        </span>
                      </td>
                      <td className="p-3 text-center text-sm">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium rounded">
                          {filteredCredits.subjects.reduce((acc, s) => acc + s.practicalHours, 0)}
                        </span>
                      </td>
                      <td className="p-3 text-center text-sm">{totalContactHours}</td>
                      <td className="p-3 text-center">
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold rounded-full">
                          {totalCredits}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
