import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/pages/admin/department-admin/components/layout/MainLayout';
import { AnnouncementsList } from '@/components/common/AnnouncementsList';

interface Announcement {
    id: number;
    title: string;
    message: string;
    creatorRole: string;
    createdAt: string;
}

export default function DepartmentAdminAnnouncementsPage() {
    const navigate = useNavigate();

    const handleSelectAnnouncement = (announcement: Announcement) => {
        navigate(`/admin/department-admin/announcements/${announcement.id}`);
    };

    return (
        <MainLayout>
            <div className="pb-8">
                <AnnouncementsList onSelectAnnouncement={handleSelectAnnouncement} />
            </div>
        </MainLayout>
    );
}
