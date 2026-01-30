export const dashboardStats = {
  totalStudents: 500,
  totalFaculty: 50,
  totalDepartments: 6,
  totalCourses: 24,
  activePrograms: 12,
  graduationRate: 92,
  attendanceRate: 87,
};

export const mockStudents = [
  { name: "Alice Johnson", id: 1, department: "Computer Science", status: "active" },
  { name: "Bob Smith", id: 2, department: "Mechanical Engineering", status: "active" },
  { name: "Carol Lee", id: 3, department: "Electronics", status: "active" },
  { name: "David Kim", id: 4, department: "Civil Engineering", status: "inactive" },
  { name: "Eva Brown", id: 5, department: "Mathematics", status: "active" },
  { name: "Frank Green", id: 6, department: "Physics", status: "active" },
];

export const mockFaculty = [
  { name: "Prof. Xavier", id: 1, designation: "Professor", department: "Computer Science" },
  { name: "Dr. Jane Foster", id: 2, designation: "Associate Professor", department: "Physics" },
  { name: "Dr. Bruce Wayne", id: 3, designation: "Assistant Professor", department: "Electronics" },
  { name: "Dr. Clark Kent", id: 4, designation: "Professor", department: "Mathematics" },
];

export const mockDepartments = [
  { id: '1', name: 'Computer Science', code: 'CS', headOfDepartment: 'Dr. Sarah Chen', facultyCount: 12, studentCount: 150 },
  { id: '2', name: 'Mechanical Engineering', code: 'ME', headOfDepartment: 'Dr. Michael Roberts', facultyCount: 10, studentCount: 120 },
  { id: '3', name: 'Electronics', code: 'EC', headOfDepartment: 'Dr. Emily Watson', facultyCount: 8, studentCount: 100 },
  { id: '4', name: 'Civil Engineering', code: 'CE', headOfDepartment: 'Dr. James Anderson', facultyCount: 9, studentCount: 110 },
  { id: '5', name: 'Mathematics', code: 'MATH', headOfDepartment: 'Dr. Lisa Park', facultyCount: 6, studentCount: 45 },
  { id: '6', name: 'Physics', code: 'PHY', headOfDepartment: 'Dr. Robert Kim', facultyCount: 5, studentCount: 40 },
];
