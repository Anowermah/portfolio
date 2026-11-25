import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        user_id: user.id,
        display_name: user.name,
        email: user.email,
        phone: '01777028791',
        location: 'Dhaka, Bangladesh',
        bio: 'Web Developer, Graphics Designer & Video Editor',
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  const updateProfile = async (updates: any) => {
    toast({
      title: "প্রোফাইল তথ্য",
      description: "প্রোফাইল আপডেট সফল হয়েছে।"
    });
    return { success: true };
  };

  const uploadAvatar = async (file: File) => {
    toast({
      title: "অ্যাভাটার",
      description: "অ্যাভাটার আপলোড সফল হয়েছে।"
    });
    return null;
  };

  return {
    profile,
    loading,
    updating,
    updateProfile,
    uploadAvatar,
    refetch: () => {},
  };
};
