import { useState } from 'react';
import StudentPageHeader from '../components/StudentPageHeader';
import StudentSectionCard from '../components/StudentSectionCard';
import { Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const personalData = {
  email: 'rahul.sharma@student.university.edu',
  phone: '+91 98765 43210',
  alternatePhone: '+91 87654 32109',
  address: '123 Main Street, Sector 15',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  nationality: 'Indian',
  religion: 'Hindu',
  category: 'General',
  aadharNo: 'XXXX XXXX 1234',
  dob: '2003-05-15',
  gender: 'Male',
  bloodGroup: 'O+',
  motherTongue: 'Hindi',
};

export default function PersonalInfo() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: personalData.email,
    phone: personalData.phone,
    alternatePhone: personalData.alternatePhone,
    address: personalData.address,
    city: personalData.city,
    state: personalData.state,
    pincode: personalData.pincode,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    toast({
      title: 'Success',
      description: 'Personal information updated successfully.',
    });
  };

  const handleCancel = () => {
    setFormData({
      email: personalData.email,
      phone: personalData.phone,
      alternatePhone: personalData.alternatePhone,
      address: personalData.address,
      city: personalData.city,
      state: personalData.state,
      pincode: personalData.pincode,
    });
    setIsEditing(false);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <StudentPageHeader
        title="Personal Information"
        subtitle="Manage your contact details"
        breadcrumbs={[
          { label: 'Profile', path: '/student/profile/basic' },
          { label: 'Personal Info' },
        ]}
        actions={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Edit
            </button>
          ) : null
        }
      />

      <div className="grid gap-6">
        <StudentSectionCard 
          title="Personal Details"
          subtitle="Manage your personal, contact, and address information"
          actions={
            isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            )
          }
        >
          <div className="space-y-6">
            {/* Core personal details (read-only) */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Date of Birth</label>
                <p className="font-medium">{personalData.dob}</p>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Gender</label>
                <p className="font-medium">{personalData.gender}</p>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Blood Group</label>
                <p className="font-medium">{personalData.bloodGroup}</p>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Mother Tongue</label>
                <p className="font-medium">{personalData.motherTongue}</p>
              </div>
            </div>

            {/* Contact information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="py-2.5">{formData.email}</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="py-2.5">{formData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Alternate Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="py-2.5">{formData.alternatePhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                ) : (
                  <p className="py-2.5">{formData.address}</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="py-2.5">{formData.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="py-2.5">{formData.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pincode</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="py-2.5">{formData.pincode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </StudentSectionCard>
      </div>
    </div>
  );
}
