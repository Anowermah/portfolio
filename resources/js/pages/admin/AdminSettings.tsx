import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/lib/api';
import { 
  Save, 
  Sparkles, 
  User,
  Code, 
  Briefcase, 
  FolderKanban, 
  Phone, 
  Globe, 
  Plus, 
  Trash2, 
  Layers,
  CheckCircle2,
  Loader2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useSiteSettings, AllSettings } from '@/hooks/useSiteSettings';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  description?: string;
  onSave?: () => void;
}

const ImageUploader = ({ label, value, onChange, placeholder, description, onSave }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': undefined }
      });
      if (res.data?.url) {
        onChange(res.data.url);
        toast.success('ছবি আপলোড সম্পন্ন! পরিবর্তন সাইটে প্রয়োগ করতে সেভ করুন।');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ছবি আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{label}</Label>
        {description && <span className="text-[11px] text-muted-foreground">{description}</span>}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Input 
            value={value || ''} 
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || '/images/profile/... বা https://...'}
            className="rounded-xl h-10 text-xs sm:text-sm"
          />
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        <Button 
          type="button"
          variant="outline" 
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl text-xs h-10 gap-1.5 flex-shrink-0 border-primary/40 text-primary hover:bg-primary/10 font-semibold"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          <span>{uploading ? 'আপলোড হচ্ছে...' : 'ছবি আপলোড করুন'}</span>
        </Button>
      </div>

      {value && (
        <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-xl bg-muted/40 border border-border mt-2">
          <div className="flex items-center gap-3">
            <img 
              src={value} 
              alt="Preview" 
              className="w-14 h-14 rounded-xl object-cover border border-border shadow-xs bg-background" 
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>ছবি সংযুক্ত আছে</span>
              </p>
              <p className="text-muted-foreground truncate max-w-[200px] sm:max-w-xs text-[11px] font-mono">{value}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onSave && (
              <Button 
                type="button" 
                size="sm" 
                onClick={onSave} 
                className="h-8 text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
              >
                <Save className="w-3.5 h-3.5" /> এখনই সেভ করুন
              </Button>
            )}
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => onChange('')} 
              className="h-8 text-xs text-destructive hover:bg-destructive/10 px-2.5 rounded-lg"
            >
              মুছুন
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminSettings = () => {
  const { settings: initialSettings, loading: initialLoading, saveSettings } = useSiteSettings();
  const [form, setForm] = useState<AllSettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setForm(initialSettings);
    }
  }, [initialSettings]);

  const handleGeneralChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      general: { ...(prev.general || {}), [field]: value }
    }));
  };

  const handleHeroChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleAboutChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }));
  };

  const handleInfoItemChange = (index: number, field: 'label' | 'value', value: string) => {
    const newItems = [...(form.about?.info_items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    handleAboutChange('info_items', newItems);
  };

  const handleStatChange = (index: number, field: 'number' | 'label', value: string) => {
    const newStats = [...form.hero.stats];
    newStats[index][field] = value;
    handleHeroChange('stats', newStats);
  };

  const handleContactChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleFooterChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      footer: { ...prev.footer, [field]: value }
    }));
  };

  // Projects handlers
  const handleAddProject = () => {
    setForm(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: [
          ...prev.projects.items,
          {
            title: 'নতুন প্রজেক্ট',
            description: 'প্রজেক্টের বিবরণ লিখুন...',
            technologies: ['React', 'Tailwind', 'PHP'],
            demo: 'https://',
            featured: false,
            category: 'ওয়েব ডেভেলপমেন্ট'
          }
        ]
      }
    }));
  };

  const handleRemoveProject = (index: number) => {
    setForm(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: prev.projects.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleProjectChange = (index: number, field: string, value: any) => {
    const newItems = [...form.projects.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm(prev => ({
      ...prev,
      projects: { ...prev.projects, items: newItems }
    }));
  };

  // Services handlers
  const handleAddService = () => {
    setForm(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: [
          ...prev.services.items,
          {
            title: 'নতুন সেবা',
            description: 'সেবার বিস্তারিত বিবরণ লিখুন...',
            features: ['ফিচার ১', 'ফিচার ২']
          }
        ]
      }
    }));
  };

  const handleRemoveService = (index: number) => {
    setForm(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const newItems = [...form.services.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm(prev => ({
      ...prev,
      services: { ...prev.services, items: newItems }
    }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    setForm(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: [
          ...prev.experience.items,
          {
            title: 'পদবী / রোল',
            company: 'প্রতিষ্ঠানের নাম',
            location: 'ঢাকা, বাংলাদেশ',
            period: '২০২৪ - বর্তমান',
            description: 'কাজের বিবরণ লিখুন...',
            skills: ['React', 'Laravel']
          }
        ]
      }
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setForm(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: prev.experience.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const newItems = [...form.experience.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm(prev => ({
      ...prev,
      experience: { ...prev.experience, items: newItems }
    }));
  };

  // Skills handlers
  const handleCategoryChange = (index: number, field: string, value: any) => {
    const newCategories = [...form.skills.categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setForm(prev => ({
      ...prev,
      skills: { ...prev.skills, categories: newCategories }
    }));
  };

  const handleAddCategory = () => {
    setForm(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        categories: [
          ...prev.skills.categories,
          {
            title: 'নতুন ক্যাটাগরি',
            icon: 'Code',
            skills: ['স্কিল ১', 'স্কিল ২']
          }
        ]
      }
    }));
  };

  const handleRemoveCategory = (index: number) => {
    setForm(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        categories: prev.skills.categories.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await saveSettings(form);
    setSaving(false);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">সেটিংস লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            ওয়েবসাইট কাস্টমাইজেশন প্যানেল
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            আপনার ওয়েবসাইটের প্রতিটি সেকশন, টেক্সট, প্রজেক্ট, স্কিল ও যোগাযোগ তথ্য এখান থেকে সরাসরি এডিট করুন।
          </p>
        </div>
        <Button 
          onClick={handleSaveAll} 
          disabled={saving}
          size="lg"
          className="gap-2 w-full sm:w-auto shadow-md hover-lift"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'সংরক্ষণ হচ্ছে...' : 'সব পরিবর্তন সংরক্ষণ করুন'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="branding" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-full sm:w-auto justify-start bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="branding" className="gap-2 text-xs sm:text-sm font-semibold text-primary">
              <ImageIcon className="w-4 h-4 text-primary" /> ব্র্যান্ডিং ও লোগো
            </TabsTrigger>
            <TabsTrigger value="hero" className="gap-2 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4" /> হিরো (Hero)
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2 text-xs sm:text-sm">
              <User className="w-4 h-4" /> পরিচিতি (About)
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2 text-xs sm:text-sm">
              <Code className="w-4 h-4" /> দক্ষতা (Skills)
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2 text-xs sm:text-sm">
              <Layers className="w-4 h-4" /> সেবা (Services)
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2 text-xs sm:text-sm">
              <FolderKanban className="w-4 h-4" /> প্রজেক্ট (Projects)
            </TabsTrigger>
            <TabsTrigger value="experience" className="gap-2 text-xs sm:text-sm">
              <Briefcase className="w-4 h-4" /> অভিজ্ঞতা (Experience)
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2 text-xs sm:text-sm">
              <Phone className="w-4 h-4" /> যোগাযোগ (Contact)
            </TabsTrigger>
            <TabsTrigger value="footer" className="gap-2 text-xs sm:text-sm">
              <Globe className="w-4 h-4" /> ফুটার (Footer)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ===================== BRANDING & LOGO TAB ===================== */}
        <TabsContent value="branding" className="space-y-6 mt-4">
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                ওয়েবসাইট ব্র্যান্ডিং, লোগো ও ফেভিকন
              </CardTitle>
              <CardDescription>
                ওয়েবসাইটের হেডারে প্রদর্শিত লোগো, ব্রাউজার ট্যাবের ফেভিকন (Favicon) এবং সাইট টাইটেল কাস্টমাইজ করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Logo Section */}
              <div className="space-y-4 p-5 rounded-2xl bg-card border border-border/80">
                <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                  <span>ওয়েবসাইট লোগো (Header Logo)</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  হেডারের বাম পাশে এই লোগোটি প্রদর্শিত হবে। কোনো ছবি আপলোড না থাকলে ডিফল্ট আইকন ও নাম ব্যবহৃত হবে।
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">লোগোর নাম / টেক্সট</Label>
                    <Input 
                      value={form.general?.logo_text || ''} 
                      onChange={e => handleGeneralChange('logo_text', e.target.value)}
                      placeholder="মো: আনোয়ার হোসাইন"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">ট্যাগলাইন (সাব-টেক্সট)</Label>
                    <Input 
                      value={form.general?.tagline || ''} 
                      onChange={e => handleGeneralChange('tagline', e.target.value)}
                      placeholder="পোর্টফোলিও"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <ImageUploader 
                  label="লোগো ছবি (Logo Image File)"
                  value={form.general?.logo_url || ''}
                  onChange={val => handleGeneralChange('logo_url', val)}
                  onSave={handleSaveAll}
                  placeholder="/images/logo.png বা আপলোড করুন"
                  description="স্বচ্ছ ব্যাকগ্রাউন্ডের (PNG বা SVG) লোগো সবচেয়ে ভালো দেখায়"
                />

                {/* Live Header Logo Preview */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                  <span className="text-xs font-medium text-muted-foreground block mb-2">হেডারে কেমন দেখাবে (লাইভ প্রিভিউ):</span>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background border border-border/80 w-fit">
                    {form.general?.logo_url ? (
                      <img 
                        src={form.general.logo_url} 
                        alt="Logo Preview" 
                        className="w-9 h-9 object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                        <Code className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-foreground leading-tight">
                        {form.general?.logo_text || "মো: আনোয়ার হোসাইন"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {form.general?.tagline || "পোর্টফোলিও"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Favicon Section */}
              <div className="space-y-4 p-5 rounded-2xl bg-card border border-border/80">
                <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                  <span>ব্রাউজার ফেভিকন (Website Favicon)</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  ব্রাউজারের ট্যাব বা বুকমার্কে প্রদর্শিত আইকন (.ico, .png বা .svg)
                </p>

                <ImageUploader 
                  label="ফেভিকন ছবি (Favicon File)"
                  value={form.general?.favicon_url || ''}
                  onChange={val => handleGeneralChange('favicon_url', val)}
                  onSave={handleSaveAll}
                  placeholder="/favicon.ico বা আপলোড করুন"
                  description="বর্গাকার ছবি (.ico, .png, .svg) ব্যবহার করুন (যেমন: 32x32 বা 64x64)"
                />

                {/* Live Browser Tab Preview */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                  <span className="text-xs font-medium text-muted-foreground block mb-2">ব্রাউজার ট্যাবে কেমন দেখাবে (লাইভ প্রিভিউ):</span>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-t-xl bg-card border-t border-x border-border shadow-xs text-xs font-medium max-w-sm">
                    {form.general?.favicon_url ? (
                      <img 
                        src={form.general.favicon_url} 
                        alt="Favicon Preview" 
                        className="w-4 h-4 object-contain rounded-xs" 
                      />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">🌐</span>
                    )}
                    <span className="truncate max-w-[200px] text-foreground">
                      {form.general?.site_title || "মো: আনোয়ার হোসাইন - পোর্টফোলিও"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Site SEO Title */}
              <div className="space-y-2 p-5 rounded-2xl bg-card border border-border/80">
                <Label className="text-sm font-semibold">ওয়েবসাইটের ব্রাউজার টাইটেল (SEO Title)</Label>
                <Input 
                  value={form.general?.site_title || ''} 
                  onChange={e => handleGeneralChange('site_title', e.target.value)}
                  placeholder="মো: আনোয়ার হোসাইন - Web Developer, Graphics Designer & Video Editor"
                  className="rounded-xl"
                />
              </div>

              {/* Save Button for Branding */}
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={handleSaveAll} 
                  disabled={saving}
                  className="gap-2 rounded-xl font-semibold shadow-md px-6"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'ব্র্যান্ডিং ও লোগো সংরক্ষণ করুন'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== HERO TAB ===================== */}
        <TabsContent value="hero" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>হিরো সেকশন কন্টেন্ট</CardTitle>
              <CardDescription>ওয়েবসাইটের মূল ব্যানারে প্রদর্শিত আপনার নাম, পদবী, বায়ো ও বাটন টেক্সট</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ওয়েলকাম ব্যাজ টেক্সট</Label>
                  <Input 
                    value={form.hero?.badge || ''} 
                    onChange={e => handleHeroChange('badge', e.target.value)}
                    placeholder="স্বাগতম আমার পোর্টফোলিওতে"
                  />
                </div>
                <div className="space-y-2">
                  <Label>আপনার পূর্ণ নাম</Label>
                  <Input 
                    value={form.hero?.name || ''} 
                    onChange={e => handleHeroChange('name', e.target.value)}
                    placeholder="মো: আনোয়ার হোসাইন"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>পেশাগত পদবী / সাবটাইটেল</Label>
                <Input 
                  value={form.hero?.title || ''} 
                  onChange={e => handleHeroChange('title', e.target.value)}
                  placeholder="Web Developer • Graphics Designer • Video Editor"
                />
              </div>

              {/* Hero Showcase Avatar */}
              <div className="pt-2">
                <ImageUploader 
                  label="হিরো সেকশন প্রোফাইল ছবি (Hero Avatar Photo)"
                  value={form.hero?.avatar_url || ''}
                  onChange={val => handleHeroChange('avatar_url', val)}
                  onSave={handleSaveAll}
                  placeholder="/images/profile/hero-portrait.jpg"
                  description="উইন্ডো শোকেসে প্রদর্শিত হবে (ফাইল আপলোড বা ইউআরএল)"
                />
              </div>

              <div className="space-y-2">
                <Label>সংক্ষিপ্ত পরিচিতি (Bio / Tagline)</Label>
                <Textarea 
                  rows={4}
                  value={form.hero?.bio || ''} 
                  onChange={e => handleHeroChange('bio', e.target.value)}
                  placeholder="প্রযুক্তিগত সকল বিষয়ে পারদর্শী একজন ক্রিয়েটিভ প্রফেশনাল..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>বাটন ১ টেক্সট (যোগাযোগ বাটন)</Label>
                  <Input 
                    value={form.hero?.btn_contact_text || ''} 
                    onChange={e => handleHeroChange('btn_contact_text', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>বাটন ২ টেক্সট (পোর্টফোলিও বাটন)</Label>
                  <Input 
                    value={form.hero?.btn_portfolio_text || ''} 
                    onChange={e => handleHeroChange('btn_portfolio_text', e.target.value)}
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="pt-4 border-t">
                <Label className="text-base font-semibold block mb-3">হিরো কাউন্টার স্ট্যাটিস্টিকস</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {form.hero?.stats?.map((stat, idx) => (
                    <div key={idx} className="p-3 bg-muted/40 rounded-lg space-y-2 border">
                      <Input 
                        value={stat.number} 
                        onChange={e => handleStatChange(idx, 'number', e.target.value)}
                        placeholder="সংখ্যা (যেমন: ৫+)"
                        className="font-bold text-center"
                      />
                      <Input 
                        value={stat.label} 
                        onChange={e => handleStatChange(idx, 'label', e.target.value)}
                        placeholder="লেবেল"
                        className="text-xs text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== ABOUT TAB ===================== */}
        <TabsContent value="about" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>পরিচিতি (About Me) সেকশন কন্টেন্ট</CardTitle>
              <CardDescription>আপনার বায়ো, ব্যক্তিগত তথ্য, ফটো ফ্রেম এবং রেজুমি/সিভি ডাউনলোড লিঙ্ক</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>সেকশন ব্যাজ</Label>
                  <Input 
                    value={form.about?.badge || ''} 
                    onChange={e => handleAboutChange('badge', e.target.value)}
                    placeholder="আমার সম্পর্কে জানুন"
                  />
                </div>
                <div className="space-y-2">
                  <Label>সেকশন টাইটেল</Label>
                  <Input 
                    value={form.about?.section_title || ''} 
                    onChange={e => handleAboutChange('section_title', e.target.value)}
                    placeholder="পরিচিতি ও কর্মজীবন"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>সেকশন সাবটাইটেল</Label>
                <Input 
                  value={form.about?.section_subtitle || ''} 
                  onChange={e => handleAboutChange('section_subtitle', e.target.value)}
                  placeholder="প্রযুক্তি ও ক্রিয়েটিভিটির সমন্বয়ে আধুনিক ডিজিটাল সমাধান তৈরিতে আমি নিবেদিত"
                />
              </div>

              {/* About Profile Photo & Resume Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <ImageUploader 
                  label="পরিচিতি প্রোফাইল ছবি (About Avatar Photo)"
                  value={form.about?.avatar_url || ''}
                  onChange={val => handleAboutChange('avatar_url', val)}
                  onSave={handleSaveAll}
                  placeholder="/images/profile/profile-formal.jpg"
                  description="পরিচিতি ফ্রেমের মূল ছবি"
                />

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">সিভি / রেজুমি ডাউনলোড লিঙ্ক (Resume Link / PDF URL)</Label>
                  <Input 
                    value={form.about?.resume_url || ''} 
                    onChange={e => handleAboutChange('resume_url', e.target.value)}
                    placeholder="https://example.com/resume.pdf"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">Google Drive বা সরাসরি PDF ফাইলের লিঙ্ক দিন</p>
                </div>
              </div>

              {/* Story / Experience Showcase Photos */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">বাস্তব অভিজ্ঞতা ও ফটো শোকেস (Story Moments)</h4>
                  <p className="text-xs text-muted-foreground">পরিচিতি সেকশনের স্টোরির নিচে প্রদর্শিত ২টি অতিরিক্ত ছবি</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUploader 
                    label="কাজের পরিবেশ / লাইফস্টাইল ছবি ১"
                    value={form.about?.story_photo_1 || ''}
                    onChange={val => handleAboutChange('story_photo_1', val)}
                    onSave={handleSaveAll}
                    placeholder="/images/profile/about-story.jpg"
                    description="প্রকৃতি বা কাজের অবসরের মুহূর্ত"
                  />

                  <ImageUploader 
                    label="সেমিনার / ট্রেনিং সেশন ছবি ২"
                    value={form.about?.story_photo_2 || ''}
                    onChange={val => handleAboutChange('story_photo_2', val)}
                    onSave={handleSaveAll}
                    placeholder="/images/profile/seminar.jpg"
                    description="সম্মেলন বা প্রশিক্ষণ মুহূর্ত"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>ফ্রিল্যান্স / কাজের প্রাপ্যতা স্ট্যাটাস (Availability Status)</Label>
                <Input 
                  value={form.about?.availability || ''} 
                  onChange={e => handleAboutChange('availability', e.target.value)}
                  placeholder="Available for Freelance & Remote Work"
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label>মূল শিরোনাম (Story Headline)</Label>
                <Input 
                  value={form.about?.story_heading || ''} 
                  onChange={e => handleAboutChange('story_heading', e.target.value)}
                  placeholder="ডিজিটাল উদ্ভাবন এবং আধুনিক ওয়েব আর্কিটেকচারে পারদর্শী"
                />
              </div>

              <div className="space-y-2">
                <Label>বিস্তারিত পরিচিতি - অনুচ্ছেদ ১</Label>
                <Textarea 
                  rows={3}
                  value={form.about?.story_p1 || ''} 
                  onChange={e => handleAboutChange('story_p1', e.target.value)}
                  placeholder="আপনার কাজের অভিজ্ঞতা ও প্যাশন সম্পর্কে লিখুন..."
                />
              </div>

              <div className="space-y-2">
                <Label>বিস্তারিত পরিচিতি - অনুচ্ছেদ ২ (ঐচ্ছিক)</Label>
                <Textarea 
                  rows={3}
                  value={form.about?.story_p2 || ''} 
                  onChange={e => handleAboutChange('story_p2', e.target.value)}
                  placeholder="আপনার ভবিষ্যৎ লক্ষ্য ও ক্লায়েন্ট কমিটমেন্ট..."
                />
              </div>

              {/* Personal Info Items */}
              <div className="pt-4 border-t space-y-3">
                <Label className="text-base font-semibold block">ব্যক্তিগত সংক্ষিপ্ত তথ্য (Quick Profile Info)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {form.about?.info_items?.map((item, idx) => (
                    <div key={idx} className="flex gap-2 p-2 bg-muted/40 rounded-xl border">
                      <Input 
                        value={item.label} 
                        onChange={e => handleInfoItemChange(idx, 'label', e.target.value)}
                        placeholder="লেবেল"
                        className="w-1/3 text-xs font-semibold"
                      />
                      <Input 
                        value={item.value} 
                        onChange={e => handleInfoItemChange(idx, 'value', e.target.value)}
                        placeholder="মান"
                        className="w-2/3 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== SKILLS TAB ===================== */}
        <TabsContent value="skills" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>দক্ষতা (Skills) সেকশন</CardTitle>
                <CardDescription>আপনার বিভিন্ন টেকনোলজি ও টুলস এর ক্যাটাগরিভিত্তিক তালিকা</CardDescription>
              </div>
              <Button onClick={handleAddCategory} size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> নতুন ক্যাটাগরি যোগ করুন
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>সেকশন টাইটেল</Label>
                  <Input 
                    value={form.skills?.section_title || ''} 
                    onChange={e => setForm(prev => ({ ...prev, skills: { ...prev.skills, section_title: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>সেকশন সাবটাইটেল</Label>
                  <Input 
                    value={form.skills?.section_subtitle || ''} 
                    onChange={e => setForm(prev => ({ ...prev, skills: { ...prev.skills, section_subtitle: e.target.value } }))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {form.skills?.categories?.map((cat, idx) => (
                  <div key={idx} className="p-4 bg-muted/30 rounded-xl border space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input 
                          value={cat.title} 
                          onChange={e => handleCategoryChange(idx, 'title', e.target.value)}
                          placeholder="ক্যাটাগরি শিরোনাম (যেমন: ওয়েব ডেভেলপমেন্ট)"
                          className="font-medium"
                        />
                        <Input 
                          value={cat.icon} 
                          onChange={e => handleCategoryChange(idx, 'icon', e.target.value)}
                          placeholder="আইকন নাম (Code, Database, Globe, Zap, etc.)"
                        />
                      </div>
                      <Button 
                        onClick={() => handleRemoveCategory(idx)} 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">দক্ষতা তালিকা (কমা দিয়ে আলাদা করুন):</Label>
                      <Input 
                        value={cat.skills.join(', ')} 
                        onChange={e => handleCategoryChange(idx, 'skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="HTML5, CSS3, React, Laravel"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== SERVICES TAB ===================== */}
        <TabsContent value="services" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>সেবা (Services) সেকশন</CardTitle>
                <CardDescription>ক্লায়েন্টদের অফার করা সার্ভিসেস কার্ডসমূহ</CardDescription>
              </div>
              <Button onClick={handleAddService} size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> নতুন সার্ভিস যোগ করুন
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>সেকশন টাইটেল</Label>
                  <Input 
                    value={form.services?.section_title || ''} 
                    onChange={e => setForm(prev => ({ ...prev, services: { ...prev.services, section_title: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>সেকশন সাবটাইটেল</Label>
                  <Input 
                    value={form.services?.section_subtitle || ''} 
                    onChange={e => setForm(prev => ({ ...prev, services: { ...prev.services, section_subtitle: e.target.value } }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {form.services?.items?.map((srv, idx) => (
                  <div key={idx} className="p-4 bg-muted/30 rounded-xl border space-y-3">
                    <div className="flex items-center justify-between">
                      <Input 
                        value={srv.title} 
                        onChange={e => handleServiceChange(idx, 'title', e.target.value)}
                        placeholder="সার্ভিসের নাম"
                        className="font-bold max-w-md"
                      />
                      <Button 
                        onClick={() => handleRemoveService(idx)} 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Textarea 
                      rows={2}
                      value={srv.description} 
                      onChange={e => handleServiceChange(idx, 'description', e.target.value)}
                      placeholder="সার্ভিসের বিবরণ..."
                    />

                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">ফিচারসমূহ (কমা দিয়ে আলাদা করুন):</Label>
                      <Input 
                        value={srv.features.join(', ')} 
                        onChange={e => handleServiceChange(idx, 'features', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="রেসপন্সিভ ডিজাইন, দ্রুত ডেলিভারি, এসইও ফ্রেন্ডলি"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== PROJECTS TAB ===================== */}
        <TabsContent value="projects" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>প্রজেক্ট পোর্টফোলিও</CardTitle>
                <CardDescription>আপনার তৈরি করা লাইভ ওয়েবসাইট, ডিজাইন এবং ভিডিও প্রজেক্ট</CardDescription>
              </div>
              <Button onClick={handleAddProject} size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> নতুন প্রজেক্ট যোগ করুন
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>সেকশন টাইটেল</Label>
                  <Input 
                    value={form.projects?.section_title || ''} 
                    onChange={e => setForm(prev => ({ ...prev, projects: { ...prev.projects, section_title: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>সেকশন সাবটাইটেল</Label>
                  <Input 
                    value={form.projects?.section_subtitle || ''} 
                    onChange={e => setForm(prev => ({ ...prev, projects: { ...prev.projects, section_subtitle: e.target.value } }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {form.projects?.items?.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-muted/30 rounded-xl border space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <Input 
                        value={proj.title} 
                        onChange={e => handleProjectChange(idx, 'title', e.target.value)}
                        placeholder="প্রজেক্টের নাম"
                        className="font-bold flex-1"
                      />
                      <Input 
                        value={proj.category} 
                        onChange={e => handleProjectChange(idx, 'category', e.target.value)}
                        placeholder="ক্যাটাগরি"
                        className="w-40 sm:w-48"
                      />
                      <Button 
                        onClick={() => handleRemoveProject(idx)} 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Textarea 
                      rows={2}
                      value={proj.description} 
                      onChange={e => handleProjectChange(idx, 'description', e.target.value)}
                      placeholder="প্রজেক্টের বিবরণ..."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">টেকনোলজি (কমা দিয়ে):</Label>
                        <Input 
                          value={proj.technologies.join(', ')} 
                          onChange={e => handleProjectChange(idx, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          placeholder="React, PHP, MySQL, Bootstrap"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">লাইভ ডেমো ইউআরএল:</Label>
                        <Input 
                          value={proj.demo} 
                          onChange={e => handleProjectChange(idx, 'demo', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="pt-1">
                      <ImageUploader 
                        label="প্রজেক্ট প্রিভিউ ছবি (Project Image / Screenshot)"
                        value={proj.image || ''}
                        onChange={val => handleProjectChange(idx, 'image', val)}
                        onSave={handleSaveAll}
                        placeholder="/images/projects/preview.jpg বা লিঙ্ক"
                        description="প্রজেক্ট কার্ডের থাম্বনেইল ছবি"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== EXPERIENCE TAB ===================== */}
        <TabsContent value="experience" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>কর্মঅভিজ্ঞতা (Experience)</CardTitle>
                <CardDescription>আপনার অতীত ও বর্তমান কর্মসংস্থানের বিবরণ</CardDescription>
              </div>
              <Button onClick={handleAddExperience} size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> নতুন অভিজ্ঞতা যোগ করুন
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>সেকশন টাইটেল</Label>
                  <Input 
                    value={form.experience?.section_title || ''} 
                    onChange={e => setForm(prev => ({ ...prev, experience: { ...prev.experience, section_title: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>সেকশন সাবটাইটেল</Label>
                  <Input 
                    value={form.experience?.section_subtitle || ''} 
                    onChange={e => setForm(prev => ({ ...prev, experience: { ...prev.experience, section_subtitle: e.target.value } }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {form.experience?.items?.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-muted/30 rounded-xl border space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input 
                          value={exp.title} 
                          onChange={e => handleExperienceChange(idx, 'title', e.target.value)}
                          placeholder="পদবী (যেমন: সিনিয়র ওয়েব ডেভেলপার)"
                          className="font-bold"
                        />
                        <Input 
                          value={exp.company} 
                          onChange={e => handleExperienceChange(idx, 'company', e.target.value)}
                          placeholder="কোম্পানির নাম"
                        />
                        <Input 
                          value={exp.period} 
                          onChange={e => handleExperienceChange(idx, 'period', e.target.value)}
                          placeholder="সময়কাল (যেমন: ২০২২ - বর্তমান)"
                        />
                      </div>
                      <Button 
                        onClick={() => handleRemoveExperience(idx)} 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input 
                        value={exp.location} 
                        onChange={e => handleExperienceChange(idx, 'location', e.target.value)}
                        placeholder="অবস্থান (যেমন: ঢাকা, বাংলাদেশ)"
                      />
                      <Input 
                        value={exp.skills.join(', ')} 
                        onChange={e => handleExperienceChange(idx, 'skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="ব্যবহৃত স্কিলসমূহ (যেমন: React, Node.js)"
                      />
                    </div>

                    <Textarea 
                      rows={2}
                      value={exp.description} 
                      onChange={e => handleExperienceChange(idx, 'description', e.target.value)}
                      placeholder="কাজের বিবরণ..."
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== CONTACT TAB ===================== */}
        <TabsContent value="contact" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>যোগাযোগ ও সোশ্যাল মিডিয়া সেটিংস</CardTitle>
              <CardDescription>আপনার ফোন, ইমেইল, হোয়াটসঅ্যাপ এবং সোশ্যাল প্ল্যাটফর্মের লিঙ্কসমূহ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ইমেইল এড্রেস</Label>
                  <Input 
                    value={form.contact?.email || ''} 
                    onChange={e => handleContactChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>মোবাইল / ফোন নম্বর</Label>
                  <Input 
                    value={form.contact?.phone || ''} 
                    onChange={e => handleContactChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>হোয়াটসঅ্যাপ নম্বর (কান্ট্রি কোড সহ, যেমন: 8801777028791)</Label>
                  <Input 
                    value={form.contact?.whatsapp || ''} 
                    onChange={e => handleContactChange('whatsapp', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ঠিকানা / অবস্থান</Label>
                  <Input 
                    value={form.contact?.address || ''} 
                    onChange={e => handleContactChange('address', e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <Label className="text-base font-semibold block">সোশ্যাল মিডিয়া প্রোফাইল লিঙ্ক</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">GitHub প্রোফাইল</Label>
                    <Input 
                      value={form.contact?.github || ''} 
                      onChange={e => handleContactChange('github', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">LinkedIn প্রোফাইল</Label>
                    <Input 
                      value={form.contact?.linkedin || ''} 
                      onChange={e => handleContactChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Facebook প্রোফাইল / পেজ</Label>
                    <Input 
                      value={form.contact?.facebook || ''} 
                      onChange={e => handleContactChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Twitter / X প্রোফাইল</Label>
                    <Input 
                      value={form.contact?.twitter || ''} 
                      onChange={e => handleContactChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== FOOTER TAB ===================== */}
        <TabsContent value="footer" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ফুটার সেটিংস</CardTitle>
              <CardDescription>ওয়েবসাইটের একদম নিচের সংক্ষিপ্ত বায়ো ও কপিরাইট টেক্সট</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ফুটার সংক্ষিপ্ত বায়ো</Label>
                <Textarea 
                  rows={3}
                  value={form.footer?.bio || ''} 
                  onChange={e => handleFooterChange('bio', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>কপিরাইট টেক্সট</Label>
                <Input 
                  value={form.footer?.copyright || ''} 
                  onChange={e => handleFooterChange('copyright', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Save button for convenience */}
      <div className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-40 animate-fade-in">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl">
          <Button 
            onClick={handleSaveAll} 
            disabled={saving}
            size="lg"
            className="shadow-md hover-lift gap-2 bg-primary text-primary-foreground font-bold px-4 sm:px-6 rounded-xl text-xs sm:text-sm h-11 border border-primary/30"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'সংরক্ষণ হচ্ছে...' : 'সব পরিবর্তন সংরক্ষণ করুন'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
