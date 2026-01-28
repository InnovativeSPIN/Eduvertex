import { Student, Faculty, Department } from '@/types/auth';

export const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@edu.com', phone: '+1-555-0101', department: 'Computer Science', enrollmentYear: 2022, status: 'active' },
  { id: '2', name: 'Bob Williams', email: 'bob@edu.com', phone: '+1-555-0102', department: 'Mechanical Engineering', enrollmentYear: 2021, status: 'active' },
  { id: '3', name: 'Carol Davis', email: 'carol@edu.com', phone: '+1-555-0103', department: 'Electronics', enrollmentYear: 2023, status: 'active' },
  { id: '4', name: 'David Brown', email: 'david@edu.com', phone: '+1-555-0104', department: 'Civil Engineering', enrollmentYear: 2020, status: 'graduated' },
  { id: '5', name: 'Eva Martinez', email: 'eva@edu.com', phone: '+1-555-0105', department: 'Computer Science', enrollmentYear: 2022, status: 'active' },
  { id: '6', name: 'Frank Wilson', email: 'frank@edu.com', phone: '+1-555-0106', department: 'Electronics', enrollmentYear: 2021, status: 'inactive' },
  { id: '7', name: 'Grace Lee', email: 'grace@edu.com', phone: '+1-555-0107', department: 'Mathematics', enrollmentYear: 2023, status: 'active' },
  { id: '8', name: 'Henry Taylor', email: 'henry@edu.com', phone: '+1-555-0108', department: 'Physics', enrollmentYear: 2022, status: 'active' },
];

export const mockFaculty: Faculty[] = [
  { id: '1', name: 'Dr. Sarah Chen', email: 'sarah.chen@edu.com', phone: '+1-555-1001', department: 'Computer Science', designation: 'Professor', joinDate: '2015-08-15', status: 'active' },
  { id: '2', name: 'Dr. Michael Roberts', email: 'm.roberts@edu.com', phone: '+1-555-1002', department: 'Mechanical Engineering', designation: 'Associate Professor', joinDate: '2018-01-10', status: 'active' },
  { id: '3', name: 'Dr. Emily Watson', email: 'e.watson@edu.com', phone: '+1-555-1003', department: 'Electronics', designation: 'Professor', joinDate: '2012-06-01', status: 'active' },
  { id: '4', name: 'Dr. James Anderson', email: 'j.anderson@edu.com', phone: '+1-555-1004', department: 'Civil Engineering', designation: 'Assistant Professor', joinDate: '2020-09-01', status: 'active' },
  { id: '5', name: 'Dr. Lisa Park', email: 'l.park@edu.com', phone: '+1-555-1005', department: 'Mathematics', designation: 'Professor', joinDate: '2010-03-15', status: 'active' },
  { id: '6', name: 'Dr. Robert Kim', email: 'r.kim@edu.com', phone: '+1-555-1006', department: 'Physics', designation: 'Associate Professor', joinDate: '2016-07-20', status: 'inactive' },
];

export const mockDepartments: Department[] = [
  { id: '1', name: 'Computer Science', code: 'CS', headOfDepartment: 'Dr. Sarah Chen', facultyCount: 12, studentCount: 150 },
  { id: '2', name: 'Mechanical Engineering', code: 'ME', headOfDepartment: 'Dr. Michael Roberts', facultyCount: 10, studentCount: 120 },
  { id: '3', name: 'Electronics', code: 'EC', headOfDepartment: 'Dr. Emily Watson', facultyCount: 8, studentCount: 100 },
  { id: '4', name: 'Civil Engineering', code: 'CE', headOfDepartment: 'Dr. James Anderson', facultyCount: 9, studentCount: 110 },
  { id: '5', name: 'Mathematics', code: 'MATH', headOfDepartment: 'Dr. Lisa Park', facultyCount: 6, studentCount: 45 },
  { id: '6', name: 'Physics', code: 'PHY', headOfDepartment: 'Dr. Robert Kim', facultyCount: 5, studentCount: 40 },
];

export const dashboardStats = {
  totalStudents: 565,
  totalFaculty: 50,
  totalDepartments: 6,
  activePrograms: 24,
  graduationRate: 94,
  attendanceRate: 87,
};
