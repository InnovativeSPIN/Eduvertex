import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/dashboard/DataTable';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { mockFaculty } from '@/data/mockData';
import { Faculty } from '@/types/auth';
import { Badge } from '@/components/ui/badge';

export default function ExecutiveFaculty() {
	const [profileModal, setProfileModal] = useState<{ open: boolean; data: Faculty | null }>({
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

	const handleView = (item: Faculty) => {
		setProfileModal({ open: true, data: item });
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Faculty Directory</h1>
					<p className="text-muted-foreground">View all faculty records (Read-only)</p>
				</div>

				<DataTable
					data={mockFaculty}
					columns={columns}
					title="All Faculty"
					searchPlaceholder="Search faculty..."
					onView={handleView}
					canAdd={false}
					canEdit={false}
					canDelete={false}
				/>

				<ProfileModal
					open={profileModal.open}
					onClose={() => setProfileModal({ open: false, data: null })}
					data={profileModal.data}
					type="faculty"
				/>
			</div>
		</AdminLayout>
	);
}
