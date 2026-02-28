import { MainLayout } from "@/pages/admin/department-admin/components/layout/MainLayout";
import { AnnouncementDetail } from "@/components/common/AnnouncementDetail";

export default function DepartmentAdminAnnouncementDetail() {
    return (
        <MainLayout>
            <div className="pb-8">
                <AnnouncementDetail backTo="/admin/department-admin/dashboard" />
            </div>
        </MainLayout>
    );
}
