import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/pages/admin/department-admin/components/ui/badge";
import { ArrowLeft, Calendar, User, AlertCircle } from "lucide-react";

interface Announcement {
    id: number;
    title: string;
    message: string;
    creatorRole: string;
    creatorName?: string;
    createdAt: string;
    updatedAt?: string;
}

interface AnnouncementDetailProps {
    backTo?: string;
}

export function AnnouncementDetail({ backTo = "/" }: AnnouncementDetailProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('authToken');
                const response = await fetch(`/api/v1/announcements/${id}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                const result = await response.json();
                if (result.success && result.data) {
                    setAnnouncement(result.data);
                } else {
                    setError("Announcement not found");
                }
            } catch (err) {
                setError("Failed to load announcement");
                console.error('Error fetching announcement:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAnnouncement();
        }
    }, [id]);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-screen"
            >
                <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
            </motion.div>
        );
    }

    if (error || !announcement) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-screen gap-4 px-4"
            >
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{error || "Not Found"}</h2>
                <p className="text-muted-foreground text-center">
                    {error || "The announcement you're looking for doesn't exist."}
                </p>
                <Button onClick={() => navigate(backTo)} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 py-8"
        >
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => navigate(backTo)}
                className="mb-6 gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </Button>

            {/* Announcement Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-border bg-muted/30">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex-1">
                            {announcement.title}
                        </h1>
                        <Badge variant="outline" className="shrink-0">
                            {announcement.creatorRole}
                        </Badge>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        {announcement.creatorName && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{announcement.creatorName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                            {announcement.message}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {announcement.updatedAt && announcement.updatedAt !== announcement.createdAt && (
                    <div className="p-4 md:p-6 border-t border-border bg-muted/20 text-xs text-muted-foreground">
                        Last updated {new Date(announcement.updatedAt).toLocaleDateString()}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
