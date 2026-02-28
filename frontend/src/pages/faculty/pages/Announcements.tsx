import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/pages/faculty/components/layout/MainLayout';
import { AnnouncementsList } from '@/components/common/AnnouncementsList';

interface Announcement {
    id: number;
    title: string;
    message: string;
    creatorRole: string;
    createdAt: string;
}

export default function FacultyAnnouncementsPage() {
    const navigate = useNavigate();

    const handleSelectAnnouncement = (announcement: Announcement) => {
        navigate(`/faculty/announcements/${announcement.id}`);
    };

    return (
        <MainLayout>
            <div className="pb-8">
                <AnnouncementsList onSelectAnnouncement={handleSelectAnnouncement} />
            </div>
        </MainLayout>
    );
}