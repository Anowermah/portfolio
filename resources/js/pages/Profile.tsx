import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import api from '@/lib/api';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Save, 
  KeyRound, 
  Globe, 
  Settings,
  CheckCircle2,
  Calendar,
  Loader2,
  ShoppingBag,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { settings } = useSiteSettings();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);

    try {
      const res = await api.put('/user/profile', { name, email, phone });
      if (res.data?.success) {
        toast({
          title: "প্রোফাইল আপডেট হয়েছে",
          description: "আপনার নাম, ইমেইল ও যোগাযোগের তথ্য সংরক্ষিত হয়েছে।",
        });
      }
    } catch (err: any) {
      toast({
        title: "ত্রুটি",
        description: err.response?.data?.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "পাসওয়ার্ড মিলেনি",
        description: "নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড একই হতে হবে।",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "দুর্বল পাসওয়ার্ড",
        description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
        variant: "destructive"
      });
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await api.put('/user/password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });

      if (res.data?.success) {
        toast({
          title: "পাসওয়ার্ড পরিবর্তন সফল",
          description: "আপনার পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।",
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      const msg = err.response?.data?.errors?.current_password?.[0] || err.response?.data?.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।";
      toast({
        title: "ত্রুটি",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 pb-24 sm:pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" /> মূল ওয়েবসাইটে ফিরুন
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs rounded-xl">
                  <Link to="/admin/projects">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" /> মার্কেটপ্লেস অর্ডার
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs rounded-xl">
                  <Link to="/admin/dashboard">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> অ্যাডমিন প্যানেল
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild variant="hero" size="sm" className="gap-1.5 text-xs rounded-xl shadow-xs">
                <Link to="/client/dashboard">
                  <ShoppingBag className="w-3.5 h-3.5" /> আমার প্রজেক্ট ড্যাশবোর্ড
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="border border-border/80 shadow-sm rounded-3xl overflow-hidden bg-card">
          <div className="h-28 sm:h-36 bg-gradient-to-r from-primary/20 via-primary-glow/20 to-secondary/30 relative"></div>
          <CardContent className="relative px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              <div className="flex items-end gap-4">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-xl rounded-full overflow-hidden bg-card">
                  <AvatarImage 
                    src={settings.about?.avatar_url || settings.hero?.avatar_url || "/images/profile/profile-formal.jpg"} 
                    alt={name} 
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-3xl">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">{name}</h1>
                    <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                      {isAdmin ? "সুপার অ্যাডমিন" : "সম্মানিত ক্লায়েন্ট"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  অ্যাকাউন্ট স্ট্যাটাস: সক্রিয়
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information Form */}
          <Card className="border border-border/80 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-primary" /> ব্যক্তিগত তথ্য আপডেট
              </CardTitle>
              <CardDescription>আপনার নাম, ইমেইল ও যোগাযোগের মোবাইল নম্বর আপডেট করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">পূর্ণ নাম</Label>
                  <Input 
                    id="admin-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-email">লগইন ইমেইল</Label>
                  <Input 
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-phone">মোবাইল / WhatsApp নম্বর</Label>
                  <Input 
                    id="admin-phone"
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="rounded-xl"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={profileSaving}
                  className="w-full py-5 rounded-xl shadow-sm gap-2 font-semibold"
                >
                  {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {profileSaving ? 'সংরক্ষণ হচ্ছে...' : 'তথ্য সংরক্ষণ করুন'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Change Form */}
          <Card className="border border-border/80 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                <Lock className="w-5 h-5 text-primary" /> সিকিউরিটি ও পাসওয়ার্ড
              </CardTitle>
              <CardDescription>আপনার অ্যাকাউন্টের পাসওয়ার্ড নিরাপদ রাখতে পরিবর্তন করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="curr-pass">বর্তমান পাসওয়ার্ড</Label>
                  <Input 
                    id="curr-pass"
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-pass">নতুন পাসওয়ার্ড</Label>
                  <Input 
                    id="new-pass"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-pass">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
                  <Input 
                    id="confirm-pass"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                    required
                    className="rounded-xl"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={passwordSaving}
                  variant="outline"
                  className="w-full py-5 rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground gap-2 font-semibold"
                >
                  {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  {passwordSaving ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Security / System Information */}
        <Card className="border border-border/80 shadow-sm rounded-2xl bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> অ্যাকাউন্ট ও সিস্টেম সিকিউরিটি বিবরণ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-muted/40 border">
                <span className="text-muted-foreground block mb-1">অথেন্টিকেশন ফ্রেমওয়ার্ক</span>
                <span className="font-semibold text-foreground">Laravel Sanctum Bearer Token</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border">
                <span className="text-muted-foreground block mb-1">ডাটাবেস কানেকশন</span>
                <span className="font-semibold text-foreground">MySQL (phpMyAdmin)</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border">
                <span className="text-muted-foreground block mb-1">পাসওয়ার্ড এনক্রিপশন</span>
                <span className="font-semibold text-foreground">Bcrypt Hashing (12 Rounds)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
