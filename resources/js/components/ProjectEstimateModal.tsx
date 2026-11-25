import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Sparkles, 
  Code2, 
  Palette, 
  Video, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Phone, 
  MessageCircle,
  Clock,
  ShieldCheck,
  Loader2
} from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';

interface ProjectEstimateModalProps {
  trigger?: React.ReactNode;
  defaultService?: string;
}

const serviceOptions = [
  {
    id: "web",
    title: "ওয়েব ডেভেলপমেন্ট",
    desc: "রেসপন্সিভ সাইট, ই-কমার্স বা কাস্টম ওয়েব সফটওয়্যার",
    icon: Code2,
    badge: "সবচেয়ে জনপ্রিয়"
  },
  {
    id: "design",
    title: "গ্রাফিক্স ও UI/UX ডিজাইন",
    desc: "লোগো, সোশ্যাল মিডিয়া কিট ও ওয়েবসাইট ডিজাইন",
    icon: Palette,
    badge: "ক্রিয়েটিভ"
  },
  {
    id: "video",
    title: "ভিডিও এডিটিং ও মোশন",
    desc: "ইউটিউব, রিলস, কমার্শিয়াল ও সোশ্যাল মিডিয়া ভিডিও",
    icon: Video,
    badge: "হাই-এনগেজিং"
  }
];

const scopeOptions = [
  {
    id: "starter",
    title: "স্টার্টার / বেসিক প্রজেক্ট",
    desc: "১-৩ পেজ ল্যান্ডিং পেজ বা প্রাথমিক ডিজাইন",
    timeline: "৩-৫ কার্যদিবস",
    range: "বাজেট ফ্রেন্ডলি"
  },
  {
    id: "standard",
    title: "স্ট্যান্ডার্ড বিজনেস প্রজেক্ট",
    desc: "পূর্ণাঙ্গ বিজনেস পোর্টফোলিও বা ব্র্যান্ডিং কিট",
    timeline: "৭-১০ কার্যদিবস",
    range: "মধ্যম পরিসর"
  },
  {
    id: "advanced",
    title: "অ্যাডভান্সড / কাস্টম প্রজেক্ট",
    desc: "ই-কমার্স, পেমেন্ট গেটওয়ে, স্পেশাল ওয়েব অ্যাপ",
    timeline: "১৫-২০ কার্যদিবস",
    range: "ফুল প্রফেশনাল"
  }
];

export const ProjectEstimateModal = ({ trigger, defaultService }: ProjectEstimateModalProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(defaultService || "web");
  const [selectedScope, setSelectedScope] = useState("standard");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }
    if (!phone.trim()) {
      toast.error("অনুগ্রহ করে আপনার মোবাইল বা WhatsApp নম্বর দিন");
      return;
    }

    setSubmitting(true);

    const serviceObj = serviceOptions.find(s => s.id === selectedService);
    const scopeObj = scopeOptions.find(sc => sc.id === selectedScope);

    const subject = `[স্মার্ট কোটেশন লিড] ${serviceObj?.title || selectedService}`;
    const message = `ক্লায়েন্ট স্মার্ট এস্টিমেটর ব্যবহার করেছেন:\n- সেবার ধরন: ${serviceObj?.title}\n- প্রজেক্ট স্কেল: ${scopeObj?.title} (${scopeObj?.timeline})\n- ক্লায়েন্ট ফোন/WhatsApp: ${phone}\n- ক্লায়েন্ট ইমেইল: ${email || 'দেওয়া হয়নি'}\n- অনুরোধের সময়: ${new Date().toLocaleString('bn-BD')}`;

    try {
      await api.post('/contact', {
        name,
        email: email.trim() || `client_${Date.now()}@lead.local`,
        phone,
        subject,
        message
      });

      setSubmitted(true);
      toast.success("আপনার প্রজেক্ট এস্টিমেট সফলভাবে গৃহীত হয়েছে!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "অনুরোধ পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি যোগাযোগ করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setName("");
    setPhone("");
    setEmail("");
    setSubmitted(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="hero" 
            className="rounded-2xl gap-2 font-bold shadow-md hover-lift"
          >
            <Calculator className="w-4 h-4" />
            <span>প্রজেক্ট খরচ হিসাব করুন</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg sm:max-w-xl rounded-3xl p-5 sm:p-7 bg-card/95 backdrop-blur-2xl border border-border/80 shadow-2xl">
        <DialogHeader className="text-left space-y-1.5 pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>স্মার্ট প্রজেক্ট কোটেশন ও এস্টিমেট</span>
            </DialogTitle>
            {!submitted && (
              <Badge variant="outline" className="text-xs border-primary/30 text-primary font-semibold">
                ধাপ {step} / ৩
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {submitted 
              ? "আপনার কোটেশন ফাইল প্রস্তুত করা হচ্ছে" 
              : "মাত্র কয়েকটি ক্লিকে আপনার প্রজেক্টের প্রস্তাবিত আনুমানিক বাজেট ও সময়সীমা জানুন"}
          </DialogDescription>
        </DialogHeader>

        {/* Success Screen */}
        {submitted ? (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">ধন্যবাদ, {name}!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                আপনার পছন্দের প্রজেক্টের আনুমানিক কোটেশন ও ফ্রি ডেমো প্রস্তুত। আমি খুব দ্রুত আপনার নম্বরে (<strong className="text-foreground">{phone}</strong>) WhatsApp-এ বিস্তারিত পাঠিয়ে দেব।
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-center gap-2 text-xs text-muted-foreground max-w-sm mx-auto">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span>সাধারণত ৩০ মিনিট থেকে ১ ঘণ্টার মধ্যে উত্তর দেওয়া হয়</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <Button
                onClick={() => {
                  const text = encodeURIComponent(`আসসালামু আলাইকুম আনোয়ার ভাই! আমি মাত্র ওয়েবসাইটে প্রজেক্ট কোটেশন হিসাব করেছি (নাম: ${name}, সেবা: ${serviceOptions.find(s => s.id === selectedService)?.title})। বিস্তারিত কথা বলতে চাই।`);
                  window.open(`https://wa.me/8801777028791?text=${text}`, '_blank');
                }}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-2 py-5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>সরাসরি এখনই WhatsApp-এ কথা বলুন</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-xl text-xs py-5"
              >
                সম্পন্ন করুন
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-3 space-y-5">
            {/* STEP 1: Select Service */}
            {step === 1 && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  ১. আপনার কী ধরনের সেবা প্রয়োজন?
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {serviceOptions.map((opt) => {
                    const isSelected = selectedService === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedService(opt.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected 
                            ? "border-primary bg-primary/10 shadow-sm scale-[1.01]" 
                            : "border-border/80 bg-card hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-foreground">{opt.title}</p>
                              {opt.badge && (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-primary/10 text-primary font-semibold">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Select Scope & Timeline */}
            {step === 2 && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  ২. প্রজেক্টের কাজের পরিধি ও সময় কেমন?
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {scopeOptions.map((opt) => {
                    const isSelected = selectedScope === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedScope(opt.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected 
                            ? "border-primary bg-primary/10 shadow-sm scale-[1.01]" 
                            : "border-border/80 bg-card hover:bg-muted/30"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-foreground">{opt.title}</p>
                            <Badge variant="secondary" className="text-[10px]">
                              {opt.timeline}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Natural Lead Capture (Where to send the quote file) */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-3.5 animate-fade-in">
                <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                  <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>আপনার আনুমানিক কোটেশন ও ফ্রি ডেমো প্রস্তুত!</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    সরাসরি আপনার নম্বরে কোনো স্প্যাম করা হবে না। বিস্তারিত ফাইল ও বাজেট আলোচনা WhatsApp এ পাঠানো হবে।
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lead-name" className="text-xs font-semibold">আপনার নাম *</Label>
                  <Input 
                    id="lead-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="যেমন: আহমেদ করিম"
                    required
                    className="rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lead-phone" className="text-xs font-semibold">WhatsApp / মোবাইল নম্বর *</Label>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">কোটেশন পাঠানোর জন্য</span>
                  </div>
                  <Input 
                    id="lead-phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    required
                    className="rounded-xl h-10 text-xs sm:text-sm border-emerald-500/40 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lead-email" className="text-xs font-semibold">ইমেইল এড্রেস (ঐচ্ছিক)</Label>
                  <Input 
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-5 rounded-xl font-bold text-xs sm:text-sm gap-2 shadow-md hover-lift mt-2 bg-primary text-primary-foreground"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{submitting ? "প্রস্তুত হচ্ছে..." : "আমার প্রজেক্ট কোটেশন ফাইল পাঠান 🚀"}</span>
                </Button>
              </form>
            )}

            {/* Modal Navigation Buttons (For step 1 & 2) */}
            {step < 3 && (
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="text-xs gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>পেছনে</span>
                  </Button>
                ) : <div />}

                <Button
                  type="button"
                  variant="hero"
                  size="sm"
                  onClick={handleNext}
                  className="text-xs gap-1.5 px-4 font-bold rounded-xl"
                >
                  <span>পরবর্তী ধাপ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEstimateModal;
