import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/dashboard/DataTable';
import { UserFormModal } from '@/components/modals/UserFormModal';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { mockStudents as initialStudents } from '@/data/mockData';
import { Student } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function SuperAdminStudents() {
	const [students, setStudents] = useState<Student[]>(initialStudents);
	const [formModal, setFormModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: Student }>({
		open: false,
		mode: 'add',
	});
	const [profileModal, setProfileModal] = useState<{ open: boolean; data: Student | null }>({
		open: false,
		data: null,
	});
	const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; data: Student | null }>({
		open: false,
		data: null,
	});

	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'department', label: 'Department' },
		{ key: 'enrollmentYear', label: 'Year' },
		{
			key: 'status',
			label: 'Status',
			render: (student: Student) => (
				<Badge
					variant={student.status === 'active' ? 'default' : 'secondary'}
					className={student.status === 'active' ? 'bg-success' : student.status === 'graduated' ? 'bg-secondary' : ''}
				>
					{student.status}
				</Badge>
			),
		},
	];

	const handleAdd = () => {
		setFormModal({ open: true, mode: 'add' });
	};

	const handleView = (student: Student) => {
		setProfileModal({ open: true, data: student });
	};

	const handleEdit = (student: Student) => {
		setFormModal({ open: true, mode: 'edit', data: student });
	};

	const handleDelete = (student: Student) => {
		setDeleteDialog({ open: true, data: student });
	};

	const confirmDelete = () => {
		if (deleteDialog.data) {
			setStudents((prev) => prev.filter((s) => s.id !== deleteDialog.data!.id));
			toast.success('Student deleted successfully');
		}
		setDeleteDialog({ open: false, data: null });
	};

	const handleSave = (data: Partial<Student>) => {
		if (formModal.mode === 'add') {
			const newStudent: Student = {
				id: String(Date.now()),
				name: data.name || '',
				email: data.email || '',
				phone: data.phone || '',
				department: data.department || '',
				enrollmentYear: data.enrollmentYear || new Date().getFullYear(),
				status: data.status || 'active',
			};
			setStudents((prev) => [...prev, newStudent]);
			toast.success('Student added successfully');
		} else {
			setStudents((prev) =>
				prev.map((s) => (s.id === formModal.data?.id ? { ...s, ...data } : s))
			);
			toast.success('Student updated successfully');
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Student Management</h1>
					<p className="text-muted-foreground">Manage all student records</p>
				</div>

				<DataTable
					data={students}
					columns={columns}
					title="All Students"
					searchPlaceholder="Search students..."
					onAdd={handleAdd}
					onView={handleView}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>

				<UserFormModal
					open={formModal.open}
					onClose={() => setFormModal({ open: false, mode: 'add' })}
					onSave={handleSave}
					type="student"
					initialData={formModal.data}
					mode={formModal.mode}
				/>

				<ProfileModal
					open={profileModal.open}
					onClose={() => setProfileModal({ open: false, data: null })}
					data={profileModal.data}
					type="student"
				/>

				<AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, data: null })}>
					<AlertDialogContent className="bg-card">
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Student</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete {deleteDialog.data?.name}? This action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</AdminLayout>
	);
}
