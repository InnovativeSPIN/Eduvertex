import { AdminLayout } from "@/pages/admin/executive/components/layout/AdminLayout";
import { AnnouncementDetail } from "@/components/common/AnnouncementDetail";

export default function ExecutiveAnnouncementDetail() {
    return (
        <AdminLayout>
            <div className="pb-8">
                <AnnouncementDetail backTo="/admin/executive" />
            </div>
        </AdminLayout>
    );
}
