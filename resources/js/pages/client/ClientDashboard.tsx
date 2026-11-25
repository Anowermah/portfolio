import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  PlusCircle, 
  MessageCircle, 
  Calendar, 
  CreditCard, 
  ArrowLeft, 
  Sparkles, 
  FolderCheck,
  Send,
  HelpCircle,
  FileCode,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProfileMenu from '@/components/ProfileMenu';
import ThemeToggle from '@/components/ThemeToggle';

interface ClientProject {
  id: number;
  title: string;
  service_category: string;
  description: string;
  budget: number;
  paid_status: 'unpaid' | 'partial' | 'paid';
  progress: number;
  status: 'pending' | 'in_progress' | 'in_review' | 'delivered' | 'completed' | 'cancelled';
  deadline: string | null;
  delivery_link: string | null;
  delivery_notes: string | null;
  client_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientStats {
  total_projects: number;
  active_projects: number;
  pending_projects: number;
  completed_projects: number;
  total_spent: number;
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const { settings } = useSiteSettings();
  const [searchParams] = useSearchParams();

  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [stats, setStats] = useState<ClientStats>({
    total_projects: 0,
    active_projects: 0,
    pending_projects: 0,
    completed_projects: 0,
    total_spent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // New Project Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderForm, setOrderForm] = useState({
    title: '',
    service_category: 'Web Development',
    description: '',
    budget: '',
    deadline: '',
    client_notes: '',
  });

  useEffect(() => {
    fetchClientProjects();

    // Check if opened via query parameter
    if (searchParams.get('action') === 'new-order') {
      setIsOrderModalOpen(true);
    }
  }, [searchParams]);

  const fetchClientProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/client/projects');
      if (res.data?.data) {
        setProjects(res.data.data);
      }
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Error fetching client projects:', error);
      toast.error('প্রজেক্ট তালিকা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.title.trim() || !orderForm.description.trim()) {
      toast.error('দয়া করে প্রজেক্টের নাম ও বিস্তারিত বিবরণ প্রদান করুন।');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/client/projects', {
        title: orderForm.title,
        service_category: orderForm.service_category,
        description: orderForm.description,
        budget: orderForm.budget ? parseFloat(orderForm.budget) : 0,
        deadline: orderForm.deadline || null,
        client_notes: orderForm.client_notes || null,
      });

      toast.success(res.data?.message || 'নতুন প্রজেক্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে!');
      setIsOrderModalOpen(false);
      setOrderForm({
        title: '',
        service_category: 'Web Development',
        description: '',
        budget: '',
        deadline: '',
        client_notes: '',
      });
      fetchClientProjects();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'রিকোয়েস্ট জমা করতে সমস্যা হয়েছে।';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptDelivery = async (projectId: number) => {
    try {
      const res = await api.patch(`/client/projects/${projectId}/accept`);
      toast.success(res.data?.message || 'প্রজেক্টটি সফলভাবে সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে!');
      fetchClientProjects();
    } catch (error) {
      toast.error('ডেলিভারি আপডেট করতে সমস্যা হয়েছে।');
    }
  };

  const handleWhatsAppContact = (project?: ClientProject) => {
    const rawPhone = settings.contact?.whatsapp || settings.contact?.phone || "8801777028791";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    let text = `আসসালামু আলাইকুম আনোয়ার ভাই, আমি আপনার ক্লায়েন্ট ${user?.name || ''}।`;
    if (project) {
      text += ` আমার প্রজেক্ট "${project.title}" (অর্ডার #${project.id}) সম্পর্কে আপডেট আলোচনা করতে চাচ্ছি।`;
    } else {
      text += ` একটি নতুন কাজের বিষয়ে আলোচনা করতে চাচ্ছি।`;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getStatusBadge = (status: ClientProject['status']) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium gap-1.5"><Clock className="w-3 h-3 animate-spin" /> চলমান (In Progress)</Badge>;
      case 'in_review':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium gap-1.5"><AlertCircle className="w-3 h-3" /> রিভিউতে আছে (In Review)</Badge>;
      case 'delivered':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5"><FolderCheck className="w-3 h-3" /> ডেলিভারি হয়েছে (Delivered)</Badge>;
      case 'completed':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium gap-1.5"><CheckCircle2 className="w-3 h-3" /> সম্পূর্ণ (Completed)</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="font-medium">বাতিল</Badge>;
      default:
        return <Badge variant="secondary" className="font-medium gap-1"><Clock className="w-3 h-3" /> পেন্ডিং (Pending)</Badge>;
    }
  };

  const getPaymentBadge = (status: ClientProject['paid_status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="text-emerald-600 border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 font-medium">পরিশোধিত</Badge>;
      case 'partial':
        return <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 font-medium">আংশিক পরিশোধ</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground border-border font-medium">বকেয়া</Badge>;
    }
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['in_progress', 'in_review'].includes(project.status);
    if (activeTab === 'delivered') return ['delivered', 'in_review'].includes(project.status);
    if (activeTab === 'completed') return project.status === 'completed';
    return true;
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'নির্ধারিত হয়নি';
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="rounded-xl">
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-lg leading-tight">ক্লায়েন্ট পোর্টাল</h1>
                <p className="text-[11px] text-muted-foreground hidden sm:block">আপনার প্রজেক্ট ও কাজের ট্র্যাকিং সেন্টার</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsOrderModalOpen(true)}
              size="sm"
              className="rounded-xl font-medium gap-1.5 shadow-sm text-xs sm:text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">নতুন প্রজেক্ট</span> অর্ডার
            </Button>
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-6xl">
        {/* Welcome Client Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-background to-primary/5 border border-primary/20 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 gap-1 font-medium text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" /> ভেরিফাইড ক্লায়েন্ট
                </Badge>
                <span className="text-xs text-muted-foreground">ID: #{user?.id || '101'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                স্বাগতম, {user?.name || 'সম্মানিত ক্লায়েন্ট'}! 👋
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                আপনার অর্ডারের বর্তমান অবস্থা, কাজের শতাংশ এবং ফাইনাল ডেলিভারি ফাইলসমূহ সরাসরি এখান থেকে পর্যবেক্ষণ করুন।
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button 
                onClick={() => handleWhatsAppContact()}
                variant="outline" 
                className="w-full sm:w-auto rounded-2xl border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-2 text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                ডেভেলপারের সাথে চ্যাট
              </Button>
              <Button 
                onClick={fetchClientProjects}
                variant="ghost" 
                size="icon"
                className="rounded-xl"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Client Metrics Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-border/80 shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">মোট প্রজেক্ট</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">{stats.total_projects}</h3>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-xs hover:border-blue-500/40 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">চলমান কাজ</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 text-blue-600 dark:text-blue-400">{stats.active_projects}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-xs hover:border-emerald-500/40 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">সম্পন্ন প্রজেক্ট</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">{stats.completed_projects}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-xs hover:border-purple-500/40 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">মোট বিনিয়োগ</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 text-purple-600 dark:text-purple-400">৳{Number(stats.total_spent).toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl">
                <CreditCard className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Orders Tracker Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold tracking-tight">আমার প্রজেক্ট ও অর্ডারসমূহ</h3>
              <p className="text-xs text-muted-foreground">প্রতিটি অর্ডারের রিয়েলটাইম প্রোগ্রেস ও ডেলিভারি লিংক</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="rounded-xl p-1 bg-muted/60">
                <TabsTrigger value="all" className="rounded-lg text-xs font-medium">সব ({stats.total_projects})</TabsTrigger>
                <TabsTrigger value="active" className="rounded-lg text-xs font-medium">চলমান ({stats.active_projects})</TabsTrigger>
                <TabsTrigger value="delivered" className="rounded-lg text-xs font-medium">ডেলিভারি</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg text-xs font-medium">সম্পন্ন ({stats.completed_projects})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Project List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 rounded-3xl bg-muted/50 animate-pulse border border-border/60" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="rounded-3xl border-dashed border-2 border-border p-10 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold">কোন প্রজেক্ট পাওয়া যায়নি</h4>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                আপনি এখনও কোনো কাজ শুরু করেননি অথবা এই ক্যাটাগরিতে কোনো অর্ডার নেই। এখনই আপনার নতুন প্রজেক্টের রিকোয়েস্ট পাঠান!
              </p>
              <Button onClick={() => setIsOrderModalOpen(true)} className="rounded-2xl gap-2 font-medium">
                <PlusCircle className="w-4 h-4" /> নতুন প্রজেক্ট অর্ডার দিন
              </Button>
            </Card>
          ) : (
            <div className="space-y-5">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="rounded-3xl border border-border/80 shadow-xs hover:shadow-md transition-all overflow-hidden bg-card"
                >
                  <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
                          {project.service_category}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">#ORD-{project.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPaymentBadge(project.paid_status)}
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold mt-2 text-foreground">
                      {project.title}
                    </CardTitle>
                    {project.description && (
                      <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="p-5 sm:p-6 space-y-6">
                    {/* Live Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Sparkles className="w-3.5 h-3.5 text-primary" /> কাজের অগ্রগতি:
                        </span>
                        <span className="text-primary font-bold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-3 rounded-full bg-muted" />
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/40 border border-border/50 text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-0.5">প্রজেক্ট বাজেট</span>
                        <span className="font-bold text-sm text-foreground">
                          ৳ {Number(project.budget).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">টার্গেট ডেডলাইন</span>
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatDate(project.deadline)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">অর্ডার শুরু</span>
                        <span className="font-semibold text-foreground">
                          {formatDate(project.created_at)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">সর্বশেষ আপডেট</span>
                        <span className="font-semibold text-foreground">
                          {formatDate(project.updated_at)}
                        </span>
                      </div>
                    </div>

                    {/* Deliverables Showcase Card (When delivered or link available) */}
                    {(project.delivery_link || project.delivery_notes) && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                            <FolderCheck className="w-4 h-4" />
                            <span>📦 ফাইনাল ডেলিভারি ও ফাইলসমূহ প্রস্তুত:</span>
                          </div>
                          {project.delivery_link && (
                            <Button 
                              asChild 
                              size="sm" 
                              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs gap-1.5"
                            >
                              <a href={project.delivery_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3.5 h-3.5" />
                                লাইভ ডেমো / ডেলিভারি লিংক খুলুন
                              </a>
                            </Button>
                          )}
                        </div>

                        {project.delivery_notes && (
                          <div className="text-xs sm:text-sm text-muted-foreground bg-background/80 p-3 rounded-xl border border-emerald-500/20">
                            <span className="font-semibold text-foreground block mb-0.5">ডেভেলপারের নোট:</span>
                            {project.delivery_notes}
                          </div>
                        )}

                        {project.status === 'delivered' && (
                          <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground">
                              আপনি কি কাজ পর্যালোচনা করেছেন এবং সন্তুষ্ট?
                            </span>
                            <Button 
                              onClick={() => handleAcceptDelivery(project.id)}
                              size="sm"
                              className="rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-xs gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              ডেলিভারি গ্রহণ ও সম্পন্ন নিশ্চিত করুন
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Client Notes / Instructions if any */}
                    {project.client_notes && (
                      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                        <span className="font-medium text-foreground">আপনার নির্দেশনা:</span> {project.client_notes}
                      </div>
                    )}

                    {/* Action Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
                      <Button 
                        onClick={() => handleWhatsAppContact(project)}
                        variant="outline" 
                        size="sm"
                        className="rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        এই প্রজেক্ট নিয়ে সরাসরি হোয়াটসঅ্যাপে কথা বলুন
                      </Button>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>১০০% কোয়ালিটি ও রিভিশন গ্যারান্টি</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Project Order Dialog */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-primary" />
              নতুন প্রজেক্ট অর্ডার / রিকোয়েস্ট করুন
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              আপনার কাঙ্ক্ষিত কাজের বিবরণ পূরণ করুন। ডেভেলপার পর্যালোচনা করে দ্রুত কাজ শুরু করবেন।
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateOrder} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">প্রজেক্টের নাম / শিরোনাম *</Label>
              <Input 
                placeholder="যেমন: ই-কমার্স ওয়েবসাইট ডেভেলপমেন্ট বা ব্র্যান্ডিং লোগো"
                value={orderForm.title}
                onChange={(e) => setOrderForm({ ...orderForm, title: e.target.value })}
                required
                className="rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">সেবার ধরন / ক্যাটাগরি *</Label>
                <Select 
                  value={orderForm.service_category} 
                  onValueChange={(val) => setOrderForm({ ...orderForm, service_category: val })}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Web Development">ওয়েব ডেভেলপমেন্ট (Full-Stack)</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX ডিজাইন (Figma)</SelectItem>
                    <SelectItem value="Video Editing">ভিডিও এডিটিং ও মোশন গ্রাফিক্স</SelectItem>
                    <SelectItem value="E-Commerce Store">ই-কমার্স শপ / ড্রপশিপিং</SelectItem>
                    <SelectItem value="Bug Fix & Speed">বাগ ফিক্সিং ও স্পিড অপ্টিমাইজেশন</SelectItem>
                    <SelectItem value="Other">অন্যান্য কাস্টম কাজ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">আনুমানিক বাজেট (BDT ৳)</Label>
                <Input 
                  type="number"
                  placeholder="যেমন: 25000"
                  value={orderForm.budget}
                  onChange={(e) => setOrderForm({ ...orderForm, budget: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">কাজের বিস্তারিত বিবরণ ও রিকোয়ারমেন্টস *</Label>
              <Textarea 
                placeholder="ওয়েবসাইটের মূল ফিচার, ডিজাইনের পছন্দ বা কোনো রেফারেন্স ওয়েবসাইটের লিংক থাকলে উল্লেখ করুন..."
                rows={4}
                value={orderForm.description}
                onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                required
                className="rounded-xl text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">টার্গেট ডেডলাইন (যদি থাকে)</Label>
                <Input 
                  type="date"
                  value={orderForm.deadline}
                  onChange={(e) => setOrderForm({ ...orderForm, deadline: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">অতিরিক্ত কোনো নির্দেশনা</Label>
                <Input 
                  placeholder="যেমন: জরুরি ডেলিভারি প্রয়োজন"
                  value={orderForm.client_notes}
                  onChange={(e) => setOrderForm({ ...orderForm, client_notes: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOrderModalOpen(false)}
                className="rounded-xl"
              >
                বাতিল
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="rounded-xl font-semibold gap-1.5"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'জমা হচ্ছে...' : 'অর্ডার রিকোয়েস্ট নিশ্চিত করুন'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;
