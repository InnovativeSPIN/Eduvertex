import { MainLayout } from "../components/layout/MainLayout";
import { AnnouncementDetail } from "@/components/common/AnnouncementDetail";

export default function FacultyAnnouncementDetail() {
    return (
        <MainLayout>
            <div className="pb-8">
                <AnnouncementDetail backTo="/faculty/dashboard" />
            </div>
        </MainLayout>
    );
}
