import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, MessageCircle, Send, PhoneCall, Facebook } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { z } from 'zod';
import { useRateLimit, CONTACT_FORM_RATE_LIMIT } from '@/hooks/useRateLimit';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Input validation schema
const contactSchema = z.object({
  name: z.string().trim().min(1, "নাম আবশ্যক").max(100, "নাম সর্বোচ্চ ১০০ অক্ষরের হতে হবে"),
  email: z.string().trim().email("সঠিক ইমেইল এড্রেস দিন").max(255),
  phone: z.string().trim().max(50).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "মেসেজ কমপক্ষে ৫ অক্ষরের হতে হবে").max(5000)
});

const Contact = () => {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const contactInfo = settings.contact;

  const { isLimited, remainingAttempts, checkLimit, recordAttempt } = useRateLimit(CONTACT_FORM_RATE_LIMIT);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkLimit()) {
      toast({
        title: "অনুরোধের সীমা অতিক্রম",
        description: "অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const validation = contactSchema.safeParse(formData);
      
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast({
          title: "ভুল তথ্য",
          description: firstError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const validatedData = validation.data;

      // Save message to Laravel API / MySQL
      await api.post('/contact', {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject || 'নতুন মেসেজ',
        message: validatedData.message
      });

      toast({
        title: "মেসেজ সফলভাবে পাঠানো হয়েছে!",
        description: "ধন্যবাদ, আমি খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      });

      recordAttempt();

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "ত্রুটি",
        description: error.response?.data?.message || "মেসেজ পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const rawPhone = contactInfo.whatsapp || contactInfo.phone || "8801777028791";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = "আসসালামু আলাইকুম! আমি আপনার সাথে কাজ নিয়ে কথা বলতে চাই।";
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    const phone = contactInfo.phone || "01777028791";
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmailClick = () => {
    const email = contactInfo.email || "anower9135@gmail.com";
    window.open(`mailto:${email}?subject=Project Discussion`, '_self');
  };

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {contactInfo.section_title || 'যোগাযোগ করুন'}
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {contactInfo.section_subtitle || 'আপনার কোনো প্রশ্ন বা প্রজেক্ট নিয়ে আলোচনা করতে সরাসরি যোগাযোগ করতে পারেন'}
          </p>
        </div>

        {/* Quick Contact Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-xl mx-auto mb-12 sm:mb-16">
          <Button 
            onClick={handleWhatsAppClick}
            variant="hero" 
            size="lg" 
            className="hover-lift bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-xl shadow-sm"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp এ মেসেজ করুন
          </Button>
          <Button 
            onClick={handleCallClick}
            variant="hero-outline" 
            size="lg" 
            className="hover-lift font-semibold py-6 rounded-xl"
          >
            <PhoneCall className="w-5 h-5 mr-2 text-primary" />
            সরাসরি কল করুন
          </Button>
          <Button 
            onClick={handleEmailClick}
            variant="outline" 
            size="lg" 
            className="hover-lift font-semibold py-6 rounded-xl"
          >
            <Mail className="w-5 h-5 mr-2 text-primary" />
            ইমেইল পাঠান
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
          {/* Contact Information Cards */}
          <div className="space-y-6 sm:space-y-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-6">যোগাযোগের বিবরণ</h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground font-medium">অফিসিয়াল ইমেইল</p>
                    <p className="text-sm sm:text-base font-semibold text-foreground truncate">{contactInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground font-medium">ফোন / হোয়াটসঅ্যাপ</p>
                    <p className="text-sm sm:text-base font-semibold text-foreground">{contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground font-medium">অবস্থান ও ঠিকানা</p>
                    <p className="text-sm sm:text-base font-semibold text-foreground">{contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-sm">
              <h4 className="text-base sm:text-lg font-bold text-foreground mb-4">সোশ্যাল মিডিয়ায় ফলো করুন</h4>
              <div className="flex flex-wrap gap-3">
                {contactInfo.github && (
                  <Button asChild variant="outline" size="icon" className="w-11 h-11 rounded-xl hover:bg-primary hover:text-primary-foreground">
                    <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <Github className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                {contactInfo.linkedin && (
                  <Button asChild variant="outline" size="icon" className="w-11 h-11 rounded-xl hover:bg-primary hover:text-primary-foreground">
                    <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                {contactInfo.facebook && (
                  <Button asChild variant="outline" size="icon" className="w-11 h-11 rounded-xl hover:bg-primary hover:text-primary-foreground">
                    <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <Facebook className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                {contactInfo.twitter && (
                  <Button asChild variant="outline" size="icon" className="w-11 h-11 rounded-xl hover:bg-primary hover:text-primary-foreground">
                    <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <Card className="gradient-card border border-border/80 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-primary">আমাকে মেসেজ পাঠান</CardTitle>
              <CardDescription>
                আপনার যে কোনো প্রজেক্ট বা প্রস্তাবের জন্য সরাসরি ইনবক্স করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLimited && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    আপনি সর্বোচ্চ সংখ্যক মেসেজ পাঠিয়েছেন। অনুগ্রহ করে ৩০ মিনিট পর আবার চেষ্টা করুন।
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">আপনার নাম *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    required
                    disabled={isSubmitting || isLimited}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">ইমেইল এড্রেস *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      required
                      disabled={isSubmitting || isLimited}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="phone">মোবাইল / WhatsApp</Label>
                      <span className="text-[11px] text-emerald-600 font-semibold">সরাসরি উত্তরের জন্য</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="017XXXXXXXX"
                      disabled={isSubmitting || isLimited}
                      className="rounded-xl border-emerald-500/30 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">বিষয়</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="মেসেজের মূল বিষয়"
                    disabled={isSubmitting || isLimited}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">বার্তা / মেসেজ *</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="আপনার প্রজেক্ট বা প্রশ্ন সম্পর্কে বিস্তারিত লিখুন..."
                    required
                    disabled={isSubmitting || isLimited}
                    className="rounded-xl"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || isLimited}
                  className="w-full py-6 text-base font-semibold rounded-xl shadow-md gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? "পাঠানো হচ্ছে..." : "মেসেজ পাঠান"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
