
export type UserRole = 'superadmin' | 'executive' | 'academic' | 'faculty' | 'student';

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	avatar?: string;
	department?: string;
}

export interface Student {
	id: string;
	name: string;
	email: string;
	phone: string;
	department: string;
	enrollmentYear: number;
	status: 'active' | 'inactive' | 'graduated';
	avatar?: string;
}

export interface Faculty {
	id: string;
	name: string;
	email: string;
	phone: string;
	department: string;
	designation: string;
	joinDate: string;
	status: 'active' | 'inactive';
	avatar?: string;
}

export interface Department {
	id: string;
	name: string;
	code: string;
	headOfDepartment: string;
	facultyCount: number;
	studentCount: number;
}
