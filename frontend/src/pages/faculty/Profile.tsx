import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Edit2,
  Save,
  X,
  FileText,
  Award,
  Download,
  Building,
  Clock,
  BookOpen,
  Users,
  Target,
} from "lucide-react";

// Faculty data based on the Self-Appraisal Form
const facultyData = {
  // Basic Information
  name: "J. Vinoth Kumar",
  employeeId: "FAC2023045",
  designation: "Assistant Professor",
  department: "Artificial Intelligence and Data Science",
  college: "Nadar Saraswathi College of Engineering & Technology",
  dateOfBirth: "24.10.1995",
  age: 29,
  dateOfJoining: "01.09.2023",
  email: "Velvinojagan@gmail.com",
  phone: "+91 8072435849",
  address: "Vadapudupatti, Theni – 625531",
};

// Educational Qualifications
const educationalQualifications = [
  {
    degree: "Ph.D.",
    branch: "Information and Communication Engineering",
    college: "-",
    university: "Anna University",
    year: "Pursuing",
    percentage: "-",
  },
  {
    degree: "M.E",
    branch: "Computer Science Engineering",
    college: "Nehru Institute of Technology, Coimbatore",
    university: "Anna University",
    year: "2019",
    percentage: "81%",
  },
  {
    degree: "B.E",
    branch: "Electronics and Communication Engineering",
    college: "Nehru Institute of Technology, Coimbatore",
    university: "Anna University",
    year: "2017",
    percentage: "66%",
  },
];

// Experience Details
const experienceDetails = [
  {
    position: "Assistant Professor",
    institution: "Nadar Saraswathi College of Engineering and Technology, Theni",
    from: "01.09.2023",
    to: "Present",
    period: "1 Yr 1 M",
  },
  {
    position: "Assistant Professor",
    institution: "AAA College of Engineering and Technology, Sivakasi",
    from: "15.08.2021",
    to: "31.05.2023",
    period: "1 Yr 10 M",
  },
  {
    position: "Assistant Professor",
    institution: "Ultra College of Engineering and Technology, Madurai",
    from: "21.09.2020",
    to: "20.07.2021",
    period: "10 M",
  },
  {
    position: "Front End Developer and Instructor",
    institution: "Azhimat, Chennai",
    from: "01.06.2019",
    to: "30.08.2020",
    period: "1 Yr 2 M",
  },
];

// Subjects Handled
const subjectsHandled = [
  { program: "B.E - CSE", semester: "3", subject: "CS3301 - Data Structures", result: "82%" },
  { program: "B.Tech - AI&DS", semester: "4", subject: "CS3591 - Computer Networks", result: "100%" },
  { program: "B.Tech - IT", semester: "4", subject: "IT3401 - Web Technology", result: "92%" },
];

// Professional Memberships
const memberships = [
  { society: "IAENG Member", id: "304180", status: "Active" },
];

// Leave Details
const leaveDetails = {
  totalWorkingDays: 265,
  availedLeave: 5,
  onDuty: 0,
  effectiveAttendance: 260,
  attendancePercentage: "95%",
};

// Documents
const documents = [
  { name: "Ph.D. Registration Certificate", type: "PDF", date: "2023", size: "1.2 MB" },
  { name: "M.E Degree Certificate", type: "PDF", date: "2019", size: "2.3 MB" },
  { name: "B.E Degree Certificate", type: "PDF", date: "2017", size: "1.8 MB" },
  { name: "Experience Certificate - AAA College", type: "PDF", date: "2023", size: "0.8 MB" },
  { name: "IAENG Membership Certificate", type: "PDF", date: "2024", size: "0.5 MB" },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: facultyData.email,
    phone: facultyData.phone,
    address: facultyData.address,
  });

  const handleDownloadProfile = () => {
    // Create profile data for download
    const profileContent = `
FACULTY PROFILE
================

PERSONAL INFORMATION
--------------------
Name: ${facultyData.name}
Employee ID: ${facultyData.employeeId}
Designation: ${facultyData.designation}
Department: ${facultyData.department}
Institution: ${facultyData.college}
Date of Birth: ${facultyData.dateOfBirth}
Age: ${facultyData.age}
Date of Joining: ${facultyData.dateOfJoining}
Email: ${facultyData.email}
Phone: ${facultyData.phone}
Address: ${facultyData.address}

EDUCATIONAL QUALIFICATIONS
--------------------------
${educationalQualifications.map(eq => `${eq.degree} - ${eq.branch}
  College: ${eq.college}
  University: ${eq.university}
  Year: ${eq.year}
  Percentage: ${eq.percentage}`).join('\n\n')}

EXPERIENCE DETAILS
------------------
${experienceDetails.map(exp => `${exp.position}
  Institution: ${exp.institution}
  From: ${exp.from} To: ${exp.to}
  Duration: ${exp.period}`).join('\n\n')}

SUBJECTS HANDLED
----------------
${subjectsHandled.map(sub => `${sub.program} - Semester ${sub.semester}
  Subject: ${sub.subject}
  Result: ${sub.result}`).join('\n\n')}

LEAVE DETAILS
-------------
Total Working Days: ${leaveDetails.totalWorkingDays}
Leave Availed: ${leaveDetails.availedLeave}
On Duty: ${leaveDetails.onDuty}
Attendance: ${leaveDetails.attendancePercentage}

PROFESSIONAL MEMBERSHIPS
------------------------
${memberships.map(m => `${m.society} (ID: ${m.id})`).join('\n')}
    `.trim();

    const blob = new Blob([profileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${facultyData.name.replace(/\s+/g, '_')}_Profile.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="page-header font-serif">Faculty Profile</h1>
          <p className="text-muted-foreground -mt-4">
            Self-Appraisal Form - Academic Year 2023-24
          </p>
        </div>
        <Button onClick={handleDownloadProfile} className="bg-secondary hover:bg-secondary/90">
          <Download className="w-4 h-4 mr-2" />
          Download Profile
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="widget-card lg:col-span-1"
        >
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-white">JV</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {facultyData.name}
            </h2>
            <p className="text-secondary font-medium">{facultyData.designation}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {facultyData.department}
            </p>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Employee ID</p>
              <p className="font-mono font-semibold text-foreground">
                {facultyData.employeeId}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Building className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground line-clamp-2">{facultyData.college}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">DOB:</span>
              <span className="font-medium">{facultyData.dateOfBirth} (Age: {facultyData.age})</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Joined:</span>
              <span className="font-medium">{facultyData.dateOfJoining}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium text-sm break-all">{facultyData.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">{facultyData.phone}</span>
            </div>
          </div>

          {/* Leave Summary */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              Attendance Summary
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Working Days</p>
                <p className="font-bold text-foreground">{leaveDetails.totalWorkingDays}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Leave Availed</p>
                <p className="font-bold text-foreground">{leaveDetails.availedLeave}</p>
              </div>
              <div>
                <p className="text-muted-foreground">On Duty</p>
                <p className="font-bold text-foreground">{leaveDetails.onDuty}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Attendance</p>
                <p className="font-bold text-secondary">{leaveDetails.attendancePercentage}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="widget-card lg:col-span-2"
        >
          <Tabs defaultValue="education" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
              <TabsTrigger value="subjects" className="text-xs">Subjects</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs">Contact</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
            </TabsList>

            {/* Educational Qualifications */}
            <TabsContent value="education">
              <h3 className="section-title flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-secondary" />
                Educational Qualifications
              </h3>
              <div className="space-y-4">
                {educationalQualifications.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={edu.degree === "Ph.D." ? "default" : "secondary"}>
                            {edu.degree}
                          </Badge>
                          {edu.year === "Pursuing" && (
                            <Badge variant="outline" className="text-warning border-warning">
                              Pursuing
                            </Badge>
                          )}
                        </div>
                        <p className="font-semibold text-foreground">{edu.branch}</p>
                        <p className="text-sm text-muted-foreground mt-1">{edu.college}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            <strong>University:</strong> {edu.university}
                          </span>
                          <span className="text-muted-foreground">
                            <strong>Year:</strong> {edu.year}
                          </span>
                          {edu.percentage !== "-" && (
                            <span className="text-secondary font-semibold">
                              {edu.percentage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Professional Memberships */}
              <h3 className="section-title flex items-center gap-2 mt-8">
                <Users className="w-5 h-5 text-secondary" />
                Professional Memberships
              </h3>
              <div className="space-y-3">
                {memberships.map((membership, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/10 to-transparent rounded-lg border-l-4 border-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/20 rounded-full">
                        <Award className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{membership.society}</p>
                        <p className="text-sm text-muted-foreground">ID: {membership.id}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-success border-success">
                      {membership.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Experience Details */}
            <TabsContent value="experience">
              <h3 className="section-title flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-secondary" />
                Experience Details
              </h3>
              <div className="space-y-4">
                {experienceDetails.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    {index === 0 && (
                      <Badge className="absolute -top-2 right-4 bg-success">Current</Badge>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{exp.position}</p>
                        <p className="text-sm text-muted-foreground mt-1">{exp.institution}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {exp.from} - {exp.to}
                            </span>
                          </div>
                          <Badge variant="outline">{exp.period}</Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Subjects Handled */}
            <TabsContent value="subjects">
              <h3 className="section-title flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                Subjects Handled & Results
              </h3>
              <div className="space-y-4">
                {subjectsHandled.map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary">{subject.program}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Semester {subject.semester}
                          </span>
                        </div>
                        <p className="font-semibold text-foreground">{subject.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Result</p>
                        <p className={`text-lg font-bold ${
                          parseInt(subject.result) >= 90 ? "text-success" :
                          parseInt(subject.result) >= 80 ? "text-secondary" : "text-warning"
                        }`}>
                          {subject.result}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-semibold text-foreground">Average Result</p>
                    <p className="text-2xl font-bold text-secondary">91%</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Contact Details */}
            <TabsContent value="contact">
              <div className="flex justify-end mb-4">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      <Save className="w-4 h-4 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email Address
                    </Label>
                    <Input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Permanent Address
                  </Label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              {isEditing && (
                <p className="text-xs text-muted-foreground mt-4">
                  * Changes will require admin approval to reflect
                </p>
              )}
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents">
              <h3 className="section-title flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                Document Vault
              </h3>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} • {doc.size} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </motion.div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  Upload New Document
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MainLayout>
  );
}
