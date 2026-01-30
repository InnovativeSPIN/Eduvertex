import { useState } from 'react';
import { AdminLayout } from '@/pages/admin/components/layout/AdminLayout';
import { DataTable } from '@/pages/admin/components/dashboard/DataTable';
import { UserFormModal } from '@/pages/admin/components/modals/UserFormModal';
import { ProfileModal } from '@/pages/admin/components/modals/ProfileModal';
import { mockFaculty as initialFaculty } from '@/data/mockData';
import { Faculty } from '@/types/auth';
import { Badge } from '@/pages/admin/components/ui/badge';
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
} from '@/pages/admin/components/ui/alert-dialog';

export default function SuperAdminFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>(initialFaculty);
  const [formModal, setFormModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: Faculty }>({
    open: false,
    mode: 'add',
  });
  const [profileModal, setProfileModal] = useState<{ open: boolean; data: Faculty | null }>({
    open: false,
    data: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; data: Faculty | null }>({
    open: false,
    data: null,
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    {
      key: 'status',
      label: 'Status',
      render: (item: Faculty) => (
        <Badge
          variant={item.status === 'active' ? 'default' : 'secondary'}
          className={item.status === 'active' ? 'bg-success' : ''}
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setFormModal({ open: true, mode: 'add' });
  };

  const handleView = (item: Faculty) => {
    setProfileModal({ open: true, data: item });
  };

  const handleEdit = (item: Faculty) => {
    setFormModal({ open: true, mode: 'edit', data: item });
  };

  const handleDelete = (item: Faculty) => {
    setDeleteDialog({ open: true, data: item });
  };

  const confirmDelete = () => {
    if (deleteDialog.data) {
      setFaculty((prev) => prev.filter((f) => f.id !== deleteDialog.data!.id));
      toast.success('Faculty member deleted successfully');
    }
    setDeleteDialog({ open: false, data: null });
  };

  const handleSave = (data: Partial<Faculty>) => {
    if (formModal.mode === 'add') {
      const newFaculty: Faculty = {
        id: String(Date.now()),
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        department: data.department || '',
        designation: data.designation || '',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setFaculty((prev) => [...prev, newFaculty]);
      toast.success('Faculty member added successfully');
    } else {
      setFaculty((prev) =>
        prev.map((f) => (f.id === formModal.data?.id ? { ...f, ...data } : f))
      );
      toast.success('Faculty member updated successfully');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Faculty Management</h1>
          <p className="text-muted-foreground">Manage all faculty records</p>
        </div>

        <DataTable
          data={faculty}
          columns={columns}
          title="All Faculty"
          searchPlaceholder="Search faculty..."
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <UserFormModal
          open={formModal.open}
          onClose={() => setFormModal({ open: false, mode: 'add' })}
          onSave={handleSave}
          type="faculty"
          initialData={formModal.data}
          mode={formModal.mode}
        />

        <ProfileModal
          open={profileModal.open}
          onClose={() => setProfileModal({ open: false, data: null })}
          data={profileModal.data}
          type="faculty"
        />

        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, data: null })}>
          <AlertDialogContent className="bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Faculty Member</AlertDialogTitle>
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
