import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/pages/admin/executive/components/layout/AdminLayout';
import { AnnouncementsList } from '@/components/common/AnnouncementsList';

interface Announcement {
    id: number;
    title: string;
    message: string;
    creatorRole: string;
    createdAt: string;
}

export default function ExecutiveAnnouncementsPage() {
    const navigate = useNavigate();

    const handleSelectAnnouncement = (announcement: Announcement) => {
        navigate(`/admin/executive/announcements/${announcement.id}`);
    };

    return (
        <AdminLayout>
            <div className="pb-8">
                <AnnouncementsList onSelectAnnouncement={handleSelectAnnouncement} />
            </div>
        </AdminLayout>
    );
}