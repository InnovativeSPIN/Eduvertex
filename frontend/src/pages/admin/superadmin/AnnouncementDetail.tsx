import { AdminLayout } from "@/pages/admin/superadmin/components/layout/AdminLayout";
import { AnnouncementDetail } from "@/components/common/AnnouncementDetail";

export default function SuperAdminAnnouncementDetail() {
    return (
        <AdminLayout>
            <div className="pb-8">
                <AnnouncementDetail backTo="/admin/superadmin" />
            </div>
        </AdminLayout>
    );
}
