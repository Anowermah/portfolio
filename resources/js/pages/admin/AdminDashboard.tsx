import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/lib/api';
import { 
  MessageSquare, 
  Users, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Settings, 
  User, 
  Globe, 
  ExternalLink,
  ArrowRight,
  Mail,
  Send,
  ShieldCheck,
  Server,
  Eye,
  Check,
  ShoppingBag,
  FolderCheck,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  totalUsers: number;
  recentMessages: any[];
  totalOrders?: number;
  activeOrders?: number;
  deliveredOrders?: number;
  completedOrders?: number;
  totalRevenue?: number;
  recentOrders?: any[];
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unreadMessages: 0,
    totalUsers: 0,
    recentMessages: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string | number) => {
    try {
      await api.patch(`/admin/messages/${messageId}/read`);
      setStats(prev => ({
        ...prev,
        unreadMessages: Math.max(0, prev.unreadMessages - 1),
        recentMessages: prev.recentMessages.map(msg => 
          String(msg.id) === String(messageId) ? { ...msg, read_status: true } : msg
        )
      }));
      if (selectedMessage && String(selectedMessage.id) === String(messageId)) {
        setSelectedMessage({ ...selectedMessage, read_status: true });
      }
      toast.success('বার্তা পঠিত হিসেবে চিহ্নিত হয়েছে');
    } catch (error) {
      toast.error('বার্তা আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted/50 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Card */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                স্বাগতম, {user?.name || "অ্যাডমিন"}!
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                অনলাইন
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              ওয়েবসাইটের কন্টেন্ট কাস্টমাইজেশন, ক্লায়েন্টদের মেসেজ ও প্রোফাইল ব্যবস্থাপনা করুন
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button asChild variant="hero" size="sm" className="rounded-xl shadow-xs gap-1.5">
              <Link to="/admin/projects">
                <ShoppingBag className="w-4 h-4" />
                <span>মার্কেটপ্লেস অর্ডার ({stats.totalOrders || 0})</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl shadow-xs gap-1.5">
              <Link to="/admin/settings">
                <Settings className="w-4 h-4" />
                <span>সাইট কাস্টমাইজার</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Modern Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Messages */}
        <Card className="border border-border/80 shadow-xs hover-scale transition-all rounded-2xl bg-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">মোট বার্তা</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{stats.totalMessages}</div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              সর্বমোট ক্লায়েন্ট অনুসন্ধান
            </p>
          </CardContent>
        </Card>

        {/* Unread Messages */}
        <Card className="border border-border/80 shadow-xs hover-scale transition-all rounded-2xl bg-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">অপঠিত বার্তা</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{stats.unreadMessages}</div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              উত্তর বা রিভিউ অপেক্ষমান
            </p>
          </CardContent>
        </Card>

        {/* Registered Users */}
        <Card className="border border-border/80 shadow-xs hover-scale transition-all rounded-2xl bg-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">ব্যবহারকারী</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{stats.totalUsers}</div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              সিস্টেম অ্যাকাউন্ট
            </p>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border border-border/80 shadow-xs hover-scale transition-all rounded-2xl bg-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">সাইট স্ট্যাটাস</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">১০০% সচল</div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              Laravel API + MySQL OK
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Shortcuts Grid */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>দ্রুত পদক্ষেপ (Quick Actions)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link 
            to="/admin/projects" 
            className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-xs hover-scale transition-all group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                <span>মার্কেটপ্লেস অর্ডার</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-muted-foreground">
                ক্লায়েন্ট প্রজেক্ট ও অগ্রগতির ট্র্যাকিং ({stats.activeOrders || 0} চলমান)
              </p>
            </div>
          </Link>
          <Link 
            to="/admin/settings" 
            className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-xs hover-scale transition-all group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                <span>সাইট কাস্টমাইজেশন</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-muted-foreground">
                হিরো, পরিচিতি, স্কিল, প্রজেক্ট ও সেবা এডিট করুন
              </p>
            </div>
          </Link>

          <Link 
            to="/admin/messages" 
            className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-xs hover-scale transition-all group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                <span>মেসেজ ইনবক্স</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-muted-foreground">
                গ্রাহকদের বার্তা পড়ুন, রিপ্লাই দিন ও পরিচালনা করুন
              </p>
            </div>
          </Link>

          <Link 
            to="/profile" 
            className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-xs hover-scale transition-all group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                <span>প্রোফাইল ও পাসওয়ার্ড</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-muted-foreground">
                অ্যাডমিন তথ্য ও নিরাপত্তা পাসওয়ার্ড আপডেট করুন
              </p>
            </div>
          </Link>

          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-xs hover-scale transition-all group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                <span>লাইভ পোর্টফোলিও</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-muted-foreground">
                ওয়েবসাইটের পরিবর্তনগুলো সরাসরি নতুন ট্যাবে দেখুন
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Messages with Modal */}
      <Card className="border border-border/80 shadow-xs rounded-2xl bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base sm:text-lg">সাম্প্রতিক বার্তাসমূহ</CardTitle>
            <CardDescription className="text-xs">সর্বশেষ আগত যোগাযোগের বার্তা</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs text-primary hover:text-primary gap-1">
            <Link to="/admin/messages">
              <span>সবগুলো দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                কোনো বার্তা এখনও আসেনি
              </div>
            ) : (
              stats.recentMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                    message.read_status 
                      ? "border-border/60 bg-muted/10" 
                      : "border-amber-500/40 bg-amber-500/5 shadow-xs"
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground truncate">{message.name}</p>
                      <Badge 
                        variant={message.read_status ? "secondary" : "destructive"}
                        className="text-[10px] px-2 py-0.2"
                      >
                        {message.read_status ? "পঠিত" : "নতুন"}
                      </Badge>
                      {message.phone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                          📞 {message.phone}
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">
                        • {message.email}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground/90 truncate">{message.subject}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDate(message.created_at)}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs rounded-lg gap-1 border-border shadow-xs"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span>পড়ুন</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-lg">বার্তার বিস্তারিত</DialogTitle>
                          <DialogDescription className="text-xs">
                            {selectedMessage?.name} এর পাঠানো বার্তা
                          </DialogDescription>
                        </DialogHeader>
                        {selectedMessage && (
                          <div className="space-y-3 text-sm pt-2">
                            <div className="p-3 rounded-xl bg-muted/40 space-y-1.5 text-xs">
                              <div><span className="font-bold text-muted-foreground">প্রেরক:</span> <span className="font-medium text-foreground">{selectedMessage.name}</span></div>
                              {selectedMessage.phone && (
                                <div><span className="font-bold text-muted-foreground">ফোন / WhatsApp:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1">{selectedMessage.phone}</span></div>
                              )}
                              <div><span className="font-bold text-muted-foreground">ইমেইল:</span> <span className="font-medium text-foreground">{selectedMessage.email}</span></div>
                              <div><span className="font-bold text-muted-foreground">বিষয়:</span> <span className="font-medium text-foreground">{selectedMessage.subject}</span></div>
                              <div><span className="font-bold text-muted-foreground">তারিখ:</span> <span className="font-medium text-foreground">{formatDate(selectedMessage.created_at)}</span></div>
                            </div>

                            <div>
                              <p className="text-xs font-bold text-muted-foreground mb-1">বার্তা বিষয়বস্তু:</p>
                              <div className="p-3.5 bg-muted/20 border border-border rounded-xl whitespace-pre-wrap text-foreground text-xs leading-relaxed">
                                {selectedMessage.message}
                              </div>
                            </div>

                            {/* Action Buttons in Modal */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                              <Button
                                size="sm"
                                className="text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                                onClick={() => {
                                  const raw = selectedMessage.phone || '';
                                  const clean = raw.replace(/[^0-9]/g, '');
                                  const target = clean ? (clean.startsWith('88') ? clean : '88' + clean) : '';
                                  const text = encodeURIComponent(`আসসালামু আলাইকুম ${selectedMessage.name}! আপনার পাঠানো বার্তার ("${selectedMessage.subject}") প্রেক্ষিতে যোগাযোগ করছি। আমি মো: আনোয়ার হোসাইন...`);
                                  window.open(`https://wa.me/${target}?text=${text}`, '_blank');
                                }}
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>WhatsApp রিপ্লাই</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs rounded-xl gap-1.5"
                                onClick={() => {
                                  window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                                }}
                              >
                                <Mail className="w-3.5 h-3.5 text-primary" />
                                <span>ইমেইলে উত্তর দিন</span>
                              </Button>

                              {!selectedMessage.read_status && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="text-xs rounded-xl gap-1.5"
                                  onClick={() => markAsRead(selectedMessage.id)}
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>পঠিত চিহ্নিত করুন</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {!message.read_status && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 px-2"
                        onClick={() => markAsRead(message.id)}
                        title="পঠিত হিসেবে চিহ্নিত করুন"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Information Strip */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-primary" />
          <span>সার্ভার কাঠামো: <strong>Laravel 13 + React 18 (Vite)</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span>ডাটাবেজ: <strong>MySQL (phpMyAdmin)</strong></span>
          <span>নিরাপত্তা: <strong>Sanctum API Guard</strong></span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;