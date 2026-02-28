import { AdminLayout } from "@/pages/admin/academic/components/layout/AdminLayout";
import { AnnouncementDetail } from "@/components/common/AnnouncementDetail";

export default function AcademicAnnouncementDetail() {
    return (
        <AdminLayout>
            <div className="pb-8">
                <AnnouncementDetail backTo="/admin/academic" />
            </div>
        </AdminLayout>
    );
}
