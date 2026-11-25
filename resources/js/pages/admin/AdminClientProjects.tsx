import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  FolderCheck, 
  MessageCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface ProjectClient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

interface ClientProject {
  id: number;
  user_id: number;
  client?: ProjectClient;
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

interface MarketplaceStats {
  total_orders: number;
  active_orders: number;
  pending_orders: number;
  delivered_orders: number;
  completed_orders: number;
  total_revenue: number;
  total_project_value: number;
}

const AdminClientProjects = () => {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [clients, setClients] = useState<ProjectClient[]>([]);
  const [stats, setStats] = useState<MarketplaceStats>({
    total_orders: 0,
    active_orders: 0,
    pending_orders: 0,
    delivered_orders: 0,
    completed_orders: 0,
    total_revenue: 0,
    total_project_value: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create Project Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    user_id: '',
    title: '',
    service_category: 'Web Development',
    description: '',
    budget: '',
    paid_status: 'unpaid',
    progress: 0,
    status: 'in_progress',
    deadline: '',
    delivery_link: '',
    delivery_notes: '',
  });

  // Edit / Update Modal State
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    service_category: 'Web Development',
    description: '',
    budget: '',
    paid_status: 'unpaid',
    progress: 0,
    status: 'in_progress',
    deadline: '',
    delivery_link: '',
    delivery_notes: '',
  });

  // Delete State
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, clientsRes] = await Promise.all([
        api.get('/admin/projects'),
        api.get('/admin/clients')
      ]);

      if (projectsRes.data?.data) {
        setProjects(projectsRes.data.data);
      }
      if (projectsRes.data?.stats) {
        setStats(projectsRes.data.stats);
      }
      if (clientsRes.data?.data) {
        setClients(clientsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching marketplace projects:', error);
      toast.error('প্রজেক্ট তালিকা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.user_id || !createForm.title.trim()) {
      toast.error('ক্লায়েন্ট এবং প্রজেক্টের নাম আবশ্যক।');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/admin/projects', {
        ...createForm,
        budget: createForm.budget ? parseFloat(createForm.budget) : 0,
        deadline: createForm.deadline || null,
      });

      toast.success(res.data?.message || 'নতুন অর্ডার সফলভাবে তৈরি হয়েছে!');
      setIsCreateOpen(false);
      setCreateForm({
        user_id: '',
        title: '',
        service_category: 'Web Development',
        description: '',
        budget: '',
        paid_status: 'unpaid',
        progress: 0,
        status: 'in_progress',
        deadline: '',
        delivery_link: '',
        delivery_notes: '',
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'অর্ডার তৈরি করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (project: ClientProject) => {
    setEditingProject(project);
    setEditForm({
      title: project.title,
      service_category: project.service_category,
      description: project.description || '',
      budget: project.budget ? String(project.budget) : '',
      paid_status: project.paid_status,
      progress: project.progress || 0,
      status: project.status,
      deadline: project.deadline ? project.deadline.substring(0, 10) : '',
      delivery_link: project.delivery_link || '',
      delivery_notes: project.delivery_notes || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      setIsSubmitting(true);
      const res = await api.put(`/admin/projects/${editingProject.id}`, {
        ...editForm,
        budget: editForm.budget ? parseFloat(editForm.budget) : 0,
        deadline: editForm.deadline || null,
      });

      toast.success(res.data?.message || 'প্রজেক্ট আপডেট সফল হয়েছে!');
      setEditingProject(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'আপডেট করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProjectId) return;
    try {
      const res = await api.delete(`/admin/projects/${deletingProjectId}`);
      toast.success(res.data?.message || 'প্রজেক্ট অর্ডার মুছে ফেলা হয়েছে।');
      setDeletingProjectId(null);
      fetchData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে।');
    }
  };

  const openClientWhatsApp = (client?: ProjectClient, projectTitle?: string) => {
    if (!client?.phone) {
      toast.info('এই ক্লায়েন্টের ফোন নম্বর প্রোফাইলে যুক্ত নেই।');
      return;
    }
    const cleanPhone = client.phone.replace(/[^0-9]/g, '');
    const text = `আসসালামু আলাইকুম ${client.name}, আপনার প্রজেক্ট "${projectTitle || ''}" এর আপডেট সম্পর্কে জানাচ্ছি...`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProjects = projects.filter(p => {
    // Status Filter
    if (statusFilter === 'active' && !['in_progress', 'in_review'].includes(p.status)) return false;
    if (statusFilter === 'pending' && p.status !== 'pending') return false;
    if (statusFilter === 'delivered' && p.status !== 'delivered') return false;
    if (statusFilter === 'completed' && p.status !== 'completed') return false;

    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(term);
      const matchClient = p.client?.name.toLowerCase().includes(term) || p.client?.email.toLowerCase().includes(term);
      const matchCategory = p.service_category.toLowerCase().includes(term);
      return matchTitle || matchClient || matchCategory;
    }

    return true;
  });

  const getStatusBadge = (status: ClientProject['status']) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs">চলমান</Badge>;
      case 'in_review':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs">রিভিউতে</Badge>;
      case 'delivered':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs">ডেলিভারি হয়েছে</Badge>;
      case 'completed':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs">সম্পন্ন</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="text-xs">বাতিল</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">পেন্ডিং</Badge>;
    }
  };

  const getPaymentBadge = (status: ClientProject['paid_status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="text-emerald-600 border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-[11px]">পরিশোধিত</Badge>;
      case 'partial':
        return <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-[11px]">আংশিক</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground border-border text-[11px]">বকেয়া</Badge>;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'নির্ধারিত নয়';
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & New Project Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-primary" />
            মার্কেটপ্লেস অর্ডার ও প্রজেক্ট ম্যানেজমেন্ট
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fiverr/Upwork এর ন্যায় ক্লায়েন্ট অর্ডার তদারকি, অগ্রগতি আপডেট, ডেলিভারি লিংক ও পেমেন্ট ট্র্যাকিং
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl shadow-sm font-semibold gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            নতুন অর্ডার তৈরি করুন
          </Button>
          <Button 
            onClick={fetchData}
            variant="outline" 
            size="icon" 
            className="rounded-xl"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">মোট অর্ডার</p>
            <h3 className="text-2xl font-bold mt-1">{stats.total_orders}</h3>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">চলমান কাজ</p>
            <h3 className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{stats.active_orders}</h3>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">ডেলিভারি / সম্পন্ন</p>
            <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
              {stats.delivered_orders + stats.completed_orders}
            </h3>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">পেন্ডিং অর্ডার</p>
            <h3 className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{stats.pending_orders}</h3>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 shadow-xs col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">আদায়কৃত রেভিনিউ</p>
            <h3 className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
              ৳ {Number(stats.total_revenue).toLocaleString()}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/80">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="প্রজেক্টের নাম, ক্লায়েন্টের নাম বা ইমেইল দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-xl text-sm"
          />
        </div>

        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
          <TabsList className="rounded-xl p-1 bg-muted/60">
            <TabsTrigger value="all" className="rounded-lg text-xs font-medium">সব ({projects.length})</TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg text-xs font-medium">চলমান ({stats.active_orders})</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg text-xs font-medium">পেন্ডিং ({stats.pending_orders})</TabsTrigger>
            <TabsTrigger value="delivered" className="rounded-lg text-xs font-medium">ডেলিভারি ({stats.delivered_orders})</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg text-xs font-medium">সম্পন্ন ({stats.completed_orders})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Projects List / Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse border border-border" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-2 border-border p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg">কোন অর্ডার পাওয়া যায়নি</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            নতুন ক্লায়েন্টের জন্য একটি অর্ডার তৈরি করতে উপরের বোতামে ক্লিক করুন।
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl font-medium">
            <PlusCircle className="w-4 h-4 mr-2" /> নতুন অর্ডার তৈরি করুন
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="rounded-2xl border border-border/80 shadow-xs hover:border-primary/40 transition-all overflow-hidden bg-card">
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-muted font-bold">
                      #ORD-{project.id}
                    </span>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-medium">
                      {project.service_category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {getPaymentBadge(project.paid_status)}
                    {getStatusBadge(project.status)}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Client info bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{project.client?.name || 'অজ্ঞাত ক্লায়েন্ট'}</span>
                    </div>
                    <span className="text-muted-foreground hidden sm:inline">•</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>{project.client?.email}</span>
                    </div>
                  </div>

                  {project.client?.phone && (
                    <Button 
                      onClick={() => openClientWhatsApp(project.client, project.title)}
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold gap-1"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-500" />
                      ক্লায়েন্টকে WhatsApp মেসেজ
                    </Button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">কাজের অগ্রগতি:</span>
                    <span className="text-primary font-bold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2 rounded-full" />
                </div>

                {/* Delivery & Meta info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 border-t border-border/60">
                  <div>
                    <span className="text-muted-foreground block">বাজেট:</span>
                    <span className="font-bold text-foreground">৳ {Number(project.budget).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">ডেডলাইন:</span>
                    <span className="font-semibold text-foreground">{formatDate(project.deadline)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">ডেলিভারি লিংক:</span>
                    {project.delivery_link ? (
                      <a 
                        href={project.delivery_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3 inline shrink-0" />
                        <span>লিংক খুলুন</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground">যুক্ত হয়নি</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground block">অর্ডার তারিখ:</span>
                    <span className="font-semibold text-foreground">{formatDate(project.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                  <Button 
                    onClick={() => openEditModal(project)}
                    size="sm" 
                    variant="outline"
                    className="rounded-xl font-medium text-xs gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-primary" />
                    অগ্রগতি ও তথ্য আপডেট
                  </Button>
                  <Button 
                    onClick={() => setDeletingProjectId(project.id)}
                    size="sm" 
                    variant="ghost"
                    className="rounded-xl text-destructive hover:bg-destructive/10 text-xs px-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Order Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-primary" />
              ক্লায়েন্টের জন্য নতুন অর্ডার তৈরি করুন
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              ক্লায়েন্ট সিলেক্ট করে তার অর্ডার বিবরণ দিন। সে তার ক্লায়েন্ট পোর্টাল থেকে এটি সরাসরি দেখতে পাবে।
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">ক্লায়েন্ট নির্বাচন করুন *</Label>
                <Select 
                  value={createForm.user_id} 
                  onValueChange={(val) => setCreateForm({ ...createForm, user_id: val })}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue placeholder="ক্লায়েন্ট পছন্দ করুন" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {clients.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} ({c.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">সেবার ধরন / ক্যাটাগরি *</Label>
                <Select 
                  value={createForm.service_category} 
                  onValueChange={(val) => setCreateForm({ ...createForm, service_category: val })}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Web Development">ওয়েব ডেভেলপমেন্ট (Full-Stack)</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX ডিজাইন (Figma)</SelectItem>
                    <SelectItem value="Video Editing">ভিডিও এডিটিং ও মোশন গ্রাফিক্স</SelectItem>
                    <SelectItem value="E-Commerce Store">ই-কমার্স শপ / ড্রপশিপিং</SelectItem>
                    <SelectItem value="Bug Fix & Speed">বাগ ফিক্সিং ও অপ্টিমাইজেশন</SelectItem>
                    <SelectItem value="Other">অন্যান্য সেবা</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">প্রজেক্টের নাম / শিরোনাম *</Label>
              <Input 
                placeholder="যেমন: ই-কমার্স ওয়েবসাইট ডেভেলপমেন্ট"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                required
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">কাজের বিবরণ ও রিকোয়ারমেন্টস</Label>
              <Textarea 
                placeholder="প্রজেক্টের মূল ফিচার বা লক্ষ্যসমূহ..."
                rows={3}
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                className="rounded-xl text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">মোট বাজেট (৳)</Label>
                <Input 
                  type="number"
                  placeholder="যেমন: 35000"
                  value={createForm.budget}
                  onChange={(e) => setCreateForm({ ...createForm, budget: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">পেমেন্ট অবস্থা</Label>
                <Select 
                  value={createForm.paid_status} 
                  onValueChange={(val: any) => setCreateForm({ ...createForm, paid_status: val })}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="unpaid">বকেয়া (Unpaid)</SelectItem>
                    <SelectItem value="partial">আংশিক (Partial)</SelectItem>
                    <SelectItem value="paid">পরিশোধিত (Paid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">অর্ডারের অবস্থা</Label>
                <Select 
                  value={createForm.status} 
                  onValueChange={(val: any) => setCreateForm({ ...createForm, status: val })}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="pending">পেন্ডিং (Pending)</SelectItem>
                    <SelectItem value="in_progress">চলমান (In Progress)</SelectItem>
                    <SelectItem value="in_review">রিভিউ (In Review)</SelectItem>
                    <SelectItem value="delivered">ডেলিভারি হয়েছে</SelectItem>
                    <SelectItem value="completed">সম্পন্ন (Completed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">টার্গেট ডেডলাইন</Label>
                <Input 
                  type="date"
                  value={createForm.deadline}
                  onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">ডেলিভারি / ডেমো লিংক (যদি থাকে)</Label>
                <Input 
                  placeholder="https://drive.google.com/..."
                  value={createForm.delivery_link}
                  onChange={(e) => setCreateForm({ ...createForm, delivery_link: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl">
                বাতিল
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl font-semibold">
                {isSubmitting ? 'তৈরি হচ্ছে...' : 'অর্ডার সংরক্ষণ করুন'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit / Progress Update Modal */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              প্রজেক্ট অগ্রগতি ও তথ্য আপডেট (#ORD-{editingProject?.id})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              কাজের অগ্রগতি শতাংশ, স্ট্যাটাস ও ডেলিভারি ফাইল লিংক আপডেট করুন
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            {/* Live Progress Slider */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  কাজের অগ্রগতি স্লাইডার:
                </Label>
                <span className="text-lg font-extrabold text-primary">{editForm.progress}%</span>
              </div>
              <Slider 
                value={[editForm.progress]} 
                onValueChange={(vals) => setEditForm({ ...editForm, progress: vals[0] })}
                max={100}
                step={5}
                className="py-2"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0% শুরু</span>
                <span>25% ড্রাফট</span>
                <span>50% অর্ধেক</span>
                <span>75% ফাইনাল টেস্ট</span>
                <span>100% সম্পূর্ণ</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">অর্ডার স্ট্যাটাস *</Label>
                <Select 
                  value={editForm.status} 
                  onValueChange={(val: any) => setEditForm({ ...editForm, status: val })}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="pending">পেন্ডিং (Pending)</SelectItem>
                    <SelectItem value="in_progress">চলমান (In Progress)</SelectItem>
                    <SelectItem value="in_review">ক্লায়েন্ট রিভিউ (In Review)</SelectItem>
                    <SelectItem value="delivered">ডেলিভারি হয়েছে (Delivered)</SelectItem>
                    <SelectItem value="completed">সম্পন্ন (Completed)</SelectItem>
                    <SelectItem value="cancelled">বাতিল (Cancelled)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">পেমেন্ট অবস্থা</Label>
                <Select 
                  value={editForm.paid_status} 
                  onValueChange={(val: any) => setEditForm({ ...editForm, paid_status: val })}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="unpaid">বকেয়া (Unpaid)</SelectItem>
                    <SelectItem value="partial">আংশিক পরিশোধ (Partial)</SelectItem>
                    <SelectItem value="paid">সম্পূর্ণ পরিশোধিত (Paid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">ডেলিভারি লিংক (Google Drive, Live Demo, GitHub, Figma)</Label>
              <Input 
                placeholder="https://..."
                value={editForm.delivery_link}
                onChange={(e) => setEditForm({ ...editForm, delivery_link: e.target.value })}
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">ক্লায়েন্টের জন্য ডেলিভারি নোট / নির্দেশনা</Label>
              <Textarea 
                placeholder="যেমন: ফ্রন্টএন্ড এবং ব্যাকএন্ড কোড আপলোড করা হয়েছে। লাইভ প্রিভিউ লিংক দেখে নিশ্চিত করুন..."
                rows={3}
                value={editForm.delivery_notes}
                onChange={(e) => setEditForm({ ...editForm, delivery_notes: e.target.value })}
                className="rounded-xl text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">বাজেট (৳)</Label>
                <Input 
                  type="number"
                  value={editForm.budget}
                  onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">ডেডলাইন</Label>
                <Input 
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setEditingProject(null)} className="rounded-xl">
                বাতিল
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl font-semibold">
                {isSubmitting ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deletingProjectId} onOpenChange={(open) => !open && setDeletingProjectId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই প্রজেক্ট অর্ডারটি মুছে ফেলা হবে। ক্লায়েন্টও এটি আর দেখতে পাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl">
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminClientProjects;
