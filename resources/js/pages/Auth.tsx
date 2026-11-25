import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, UserPlus, ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  
  const [isResetting, setIsResetting] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    displayName: '',
    phone: '',
    confirmPassword: ''
  });

  const handlePasswordReset = async () => {
    toast({
      title: "পাসওয়ার্ড রিসেট",
      description: "পাসওয়ার্ড পরিবর্তনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন অথবা phpMyAdmin ব্যবহার করুন।",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "লগইন ব্যর্থ",
            description: "ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।",
            variant: "destructive"
          });
        } else {
          toast({
            title: "ত্রুটি",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "স্বাগতম!",
          description: "সফলভাবে লগইন হয়েছে।"
        });
        const savedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
        if (savedUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/client/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "লগইন করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "ত্রুটি",
        description: "পাসওয়ার্ড মিলছে না।",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "ত্রুটি",
        description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        signupData.email, 
        signupData.password, 
        signupData.displayName,
        signupData.phone
      );
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "একাউন্ট বিদ্যমান",
            description: "এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট আছে। অনুগ্রহ করে লগইন করুন।",
            variant: "destructive"
          });
        } else {
          toast({
            title: "ত্রুটি",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "স্বাগতম!",
          description: "আপনার ক্লায়েন্ট অ্যাকাউন্ট তৈরি হয়েছে। ড্যাশবোর্ডে স্বাগতম!"
        });
        navigate('/client/dashboard');
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "একাউন্ট তৈরি করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              হোমে ফিরে যান
            </Link>
          </Button>
        </div>

        <Card className="gradient-card border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              স্বাগতম
            </CardTitle>
            <CardDescription>
              আপনার একাউন্টে লগইন করুন বা নতুন একাউন্ট তৈরি করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  লগইন
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  সাইনআপ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">ইমেইল</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="আপনার ইমেইল"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">পাসওয়ার্ড</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="আপনার পাসওয়ার্ড"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                  </Button>
                  
                  {/* Password reset button */}
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full text-sm mt-2" 
                    onClick={handlePasswordReset}
                    disabled={isResetting}
                  >
                    {isResetting ? "ইমেইল পাঠানো হচ্ছে..." : "পাসওয়ার্ড ভুলে গেছেন?"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">নাম</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="আপনার নাম"
                        value={signupData.displayName}
                        onChange={(e) => setSignupData({...signupData, displayName: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">ইমেইল *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="আপনার ইমেইল"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">হোয়াটসঅ্যাপ / ফোন নম্বর (প্রজেক্ট আপডেটের জন্য)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="017XXXXXXXX"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                    <PasswordStrengthIndicator password={signupData.password} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">পাসওয়ার্ড নিশ্চিত করুন</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="পাসওয়ার্ড আবার লিখুন"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "একাউন্ট তৈরি হচ্ছে..." : "একাউন্ট তৈরি করুন"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;