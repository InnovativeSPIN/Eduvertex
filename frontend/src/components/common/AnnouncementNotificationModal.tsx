import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/pages/admin/department-admin/components/ui/badge";
import { Clock, Bell } from "lucide-react";

interface AnnouncementNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    creatorRole: string;
    createdAt: string;
    updatedAt?: string;
}

export function AnnouncementNotificationModal({
    isOpen,
    onClose,
    title,
    message,
    creatorRole,
    createdAt,
    updatedAt
}: AnnouncementNotificationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="border-b border-border pb-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">New Announcement</p>
                        <p className="text-xs text-muted-foreground">Just arrived</p>
                    </div>
                </div>

                <DialogHeader>
                    <DialogTitle className="text-2xl text-left">{title}</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-2 pt-2 text-foreground">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>
                                    {new Date(createdAt).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs py-1">
                                    {creatorRole}
                                </Badge>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                {/* Announcement Content */}
                <div className="space-y-4 py-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/20">
                            {message}
                        </div>
                    </div>

                    {updatedAt && updatedAt !== createdAt && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                            <span className="font-medium">Last updated:</span>
                            <span>{new Date(updatedAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button onClick={onClose} className="gap-2">
                        Got it!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
