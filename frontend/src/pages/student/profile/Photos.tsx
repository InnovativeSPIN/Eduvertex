import { useState } from 'react';
import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';
import { Camera, Users, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Photos() {
  const { toast } = useToast();
  const [studentPhoto, setStudentPhoto] = useState<string | null>(null);
  const [familyPhoto, setFamilyPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState<'student' | 'family' | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'student' | 'family') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPG, PNG, or WebP image.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(type);

    const reader = new FileReader();
    reader.onload = async (event) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (type === 'student') {
        setStudentPhoto(event.target?.result as string);
      } else {
        setFamilyPhoto(event.target?.result as string);
      }
      
      setUploading(null);
      toast({
        title: 'Photo uploaded',
        description: 'Your photo has been uploaded successfully.',
      });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (type: 'student' | 'family') => {
    if (type === 'student') {
      setStudentPhoto(null);
    } else {
      setFamilyPhoto(null);
    }
    toast({
      title: 'Photo removed',
      description: 'The photo has been removed.',
    });
  };

  interface PhotoUploadCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    photo: string | null;
    type: 'student' | 'family';
  }

  const PhotoUploadCard = ({ title, description, icon: Icon, photo, type }: PhotoUploadCardProps) => (
    <StudentSectionCard title={title} subtitle={description}>
      <div className="flex flex-col items-center">
        {photo ? (
          <div className="relative">
            <img
              src={photo}
              alt={title}
              className="w-48 h-48 object-cover rounded-xl border-2 border-border"
            />
            <button
              onClick={() => removePhoto(type)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <label className="cursor-pointer group">
            <div className="w-48 h-48 rounded-xl border-2 border-dashed border-border hover:border-primary bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-3">
              {uploading === type ? (
                <div className="animate-pulse flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP (max 5MB)</p>
                  </div>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileChange(e, type)}
              className="hidden"
              disabled={uploading !== null}
            />
          </label>
        )}
      </div>
    </StudentSectionCard>
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <StudentPageHeader
        title="Photos"
        subtitle="Upload and manage your photos"
        breadcrumbs={[
          { label: 'Profile', path: '/student/profile/basic' },
          { label: 'Photos' },
        ]}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <PhotoUploadCard
          title="Student Photo"
          description="Your official profile photo"
          icon={Camera}
          photo={studentPhoto}
          type="student"
        />
        <PhotoUploadCard
          title="Family Photo"
          description="Photo with your family"
          icon={Users}
          photo={familyPhoto}
          type="family"
        />
      </div>
    </div>
  );
}
