import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Eye, 
  Moon, 
  Sun,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    publicProfile: true,
    dataSharing: false
  });

  // Redirect if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "সেটিং আপডেট হয়েছে",
      description: "আপনার সেটিং সফলভাবে পরিবর্তন হয়েছে।"
    });
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, you would call an API to delete the account
      await signOut();
      toast({
        title: "একাউন্ট ডিলিট করা হয়েছে",
        description: "আপনার একাউন্ট সফলভাবে ডিলিট করা হয়েছে।"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "একাউন্ট ডিলিট করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              হোমে ফিরে যান
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">সেটিংস</h1>
          <p className="text-muted-foreground">আপনার অ্যাকাউন্ট এবং প্রাইভেসি সেটিংস পরিচালনা করুন</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Notifications Settings */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bell className="w-5 h-5" />
                নোটিফিকেশন
              </CardTitle>
              <CardDescription>
                আপনি কী ধরনের নোটিফিকেশন পেতে চান তা পরিচালনা করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">
                    পুশ নোটিফিকেশন
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    গুরুত্বপূর্ণ আপডেট এবং বার্তার জন্য নোটিফিকেশন পান
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={() => handleSettingChange('notifications')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-updates" className="text-base">
                    ইমেইল আপডেট
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    নতুন ফিচার এবং আপডেটের জন্য ইমেইল পান
                  </p>
                </div>
                <Switch
                  id="email-updates"
                  checked={settings.emailUpdates}
                  onCheckedChange={() => handleSettingChange('emailUpdates')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sun className="w-5 h-5" />
                অ্যাপিয়ারেন্স
              </CardTitle>
              <CardDescription>
                থিম এবং ডিসপ্লে সেটিংস কাস্টমাইজ করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="text-base flex items-center gap-2">
                    {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    ডার্ক মোড
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    ডার্ক থিম ব্যবহার করুন (শীঘ্রই আসছে)
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={() => handleSettingChange('darkMode')}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                প্রাইভেসি ও নিরাপত্তা
              </CardTitle>
              <CardDescription>
                আপনার ডেটা এবং প্রাইভেসি নিয়ন্ত্রণ করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-profile" className="text-base flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    পাবলিক প্রোফাইল
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    অন্যরা আপনার প্রোফাইল দেখতে পাবেন
                  </p>
                </div>
                <Switch
                  id="public-profile"
                  checked={settings.publicProfile}
                  onCheckedChange={() => handleSettingChange('publicProfile')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing" className="text-base">
                    ডেটা শেয়ারিং
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    অ্যানালিটিক্সের জন্য বেনামী ডেটা শেয়ার করুন
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.dataSharing}
                  onCheckedChange={() => handleSettingChange('dataSharing')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <SettingsIcon className="w-5 h-5" />
                একাউন্ট ম্যানেজমেন্ট
              </CardTitle>
              <CardDescription>
                আপনার একাউন্ট সেটিংস পরিচালনা করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/profile">
                    প্রোফাইল এডিট করুন
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" disabled>
                  পাসওয়ার্ড পরিবর্তন করুন (শীঘ্রই আসছে)
                </Button>
                
                <Button variant="outline" className="w-full justify-start" disabled>
                  ডেটা এক্সপোর্ট করুন (শীঘ্রই আসছে)
                </Button>
              </div>
              
              <Separator />
              
              {/* Danger Zone */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">বিপজ্জনক অঞ্চল</span>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="w-4 h-4 mr-2" />
                      একাউন্ট ডিলিট করুন
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                      <AlertDialogDescription>
                        এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না। এটি স্থায়ীভাবে আপনার একাউন্ট 
                        ডিলিট করবে এবং আমাদের সার্ভার থেকে আপনার সকল ডেটা সরিয়ে দেবে।
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        হ্যাঁ, ডিলিট করুন
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;