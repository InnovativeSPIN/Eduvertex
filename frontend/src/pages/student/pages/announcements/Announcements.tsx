import { useNavigate } from 'react-router-dom';
import PageHeader from '@/pages/student/components/layout/PageHeader';
import { AnnouncementsList } from '@/components/common/AnnouncementsList';

interface Announcement {
    id: number;
    title: string;
    message: string;
    creatorRole: string;
    createdAt: string;
}

export default function StudentAnnouncementsPage() {
    const navigate = useNavigate();

    const handleSelectAnnouncement = (announcement: Announcement) => {
        navigate(`/student/announcements/${announcement.id}`);
    };

    return (
        <div>
            <PageHeader
                title="Announcements"
                subtitle="Stay updated with the latest announcements"
            />
            <div className="animate-fade-in">
                <AnnouncementsList onSelectAnnouncement={handleSelectAnnouncement} />
            </div>
        </div>
    );
}


