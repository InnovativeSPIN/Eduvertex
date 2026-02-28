import MainLayout from '../../components/layout/MainLayout';
import { AnnouncementDetail } from '@/components/common/AnnouncementDetail';

export default function StudentAnnouncementDetail() {
    return (
        <MainLayout>
            <div className="pb-8">
                <AnnouncementDetail backTo="/student/announcements" />
            </div>
        </MainLayout>
    );
}
