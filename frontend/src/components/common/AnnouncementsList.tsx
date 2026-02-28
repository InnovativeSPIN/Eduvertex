import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/pages/admin/department-admin/components/ui/badge";
import { Bell, Calendar, ArrowRight, Search } from "lucide-react";

interface Announcement {
    id: number;
    title: string;
    message: string;
    creatorRole: string;
    createdAt: string;
}

interface AnnouncementsListProps {
    onSelectAnnouncement?: (announcement: Announcement) => void;
}

export function AnnouncementsList({ onSelectAnnouncement }: AnnouncementsListProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await fetch('/api/v1/announcements', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                const result = await response.json();
                if (result.success) {
                    setAnnouncements(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const filteredAnnouncements = announcements.filter(ann =>
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
                        <p className="text-muted-foreground">Stay updated with the latest announcements</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Announcements List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                </div>
            ) : filteredAnnouncements.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No announcements</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        {searchTerm ? "No announcements match your search." : "No announcements available at the moment."}
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {filteredAnnouncements.map((announcement, index) => (
                        <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group"
                            onClick={() => onSelectAnnouncement?.(announcement)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                    announcement.creatorRole === 'superadmin'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-secondary/10 text-secondary'
                                }`}>
                                    <Bell className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                            {announcement.title}
                                        </h3>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {announcement.message}
                                    </p>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="outline" className="text-[10px] py-0.5 px-2">
                                            {announcement.creatorRole}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: new Date(announcement.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
