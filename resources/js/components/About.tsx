import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Sparkles, 
  FileDown, 
  Mail, 
  CheckCircle2, 
  Code2, 
  Palette, 
  Film,
  MapPin,
  GraduationCap,
  Globe2,
  Clock,
  Briefcase
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const infoIcons: Record<string, React.ReactNode> = {
  'পূর্ণ নাম': <User className="w-4 h-4 text-primary" />,
  'অভিজ্ঞতা': <Clock className="w-4 h-4 text-primary" />,
  'অবস্থান': <MapPin className="w-4 h-4 text-primary" />,
  'ভাষা': <Globe2 className="w-4 h-4 text-primary" />,
  'শিক্ষাগত যোগ্যতা': <GraduationCap className="w-4 h-4 text-primary" />,
  'কাজের ধরন': <Briefcase className="w-4 h-4 text-primary" />,
};

const pillarIcons = [
  <Code2 className="w-6 h-6 text-primary" />,
  <Palette className="w-6 h-6 text-primary" />,
  <Film className="w-6 h-6 text-primary" />
];

const About = () => {
  const { settings } = useSiteSettings();
  const about = settings.about;
  const hero = settings.hero;

  const handleDownloadResume = () => {
    if (about.resume_url) {
      window.open(about.resume_url, '_blank');
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="about" className="py-8 sm:py-20 bg-card/40 relative overflow-hidden border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
          {about.badge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-sm font-medium mb-2 sm:mb-3">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
              <span>{about.badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
            {about.section_title || 'পরিচিতি ও কর্মজীবন'}
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground px-2">
            {about.section_subtitle}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Avatar & Quick Info Card */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <Card className="gradient-card border border-border/80 shadow-md rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-8 text-center relative">
              {/* Profile Avatar Frame */}
              <div className="relative mx-auto w-24 h-24 sm:w-44 sm:h-44 rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-tr from-primary via-primary-glow to-secondary shadow-md sm:shadow-lg mb-3 sm:mb-6 group">
                <div className="w-full h-full rounded-[14px] sm:rounded-[22px] bg-card overflow-hidden flex items-center justify-center relative">
                  {about.avatar_url ? (
                    <img 
                      src={about.avatar_url} 
                      alt={hero.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <img 
                      src="/images/profile/profile-formal.jpg" 
                      alt={hero.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  )}
                </div>
              </div>

              {/* Name & Title */}
              <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
                {hero.name}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-primary mb-2.5 sm:mb-4">
                {hero.title}
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] sm:text-xs font-semibold mb-3 sm:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{about.availability || 'কাজের জন্য প্রস্তুত (Available)'}</span>
              </div>

              {/* Quick Info Items List */}
              <div className="space-y-1.5 sm:space-y-3 text-left border-t border-border/80 pt-3 sm:pt-5">
                {about.info_items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm py-0.5 sm:py-1 border-b border-border/40 last:border-b-0">
                    <span className="text-muted-foreground flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                      {infoIcons[item.label] || <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                      {item.label}
                    </span>
                    <span className="font-semibold text-foreground text-right text-[11px] sm:text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Detailed Story & Highlights */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
                {about.story_heading || 'ডিজিটাল উদ্ভাবন এবং আধুনিক ওয়েব আর্কিটেকচারে পারদর্শী'}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {about.story_p1}
              </p>
              {about.story_p2 && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {about.story_p2}
                </p>
              )}
            </div>

            {/* 3 Pillars of Expertise */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {about.highlights?.map((hl, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2 hover-scale transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {pillarIcons[idx % pillarIcons.length]}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground">{hl.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{hl.desc}</p>
                </div>
              ))}
            </div>

            {/* Real Life / Career Moments Showcase */}
            {(about.story_photo_1 || about.story_photo_2) && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  কর্মজীবন ও বাস্তব অভিজ্ঞতা
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {about.story_photo_1 && (
                    <div className="group relative rounded-2xl overflow-hidden border border-border/80 shadow-xs bg-card">
                      <div className="h-44 sm:h-48 overflow-hidden">
                        <img 
                          src={about.story_photo_1} 
                          alt="ব্যক্তিগত ও ক্রিয়েটিভ মুহূর্ত" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3 bg-card/90 backdrop-blur-md border-t border-border/60">
                        <p className="text-xs font-semibold text-foreground">ক্রিয়েটিভ ভাবনা ও পরিবেশ</p>
                        <p className="text-[11px] text-muted-foreground">কাজের ফাঁকে প্রকৃতির সান্নিধ্যে</p>
                      </div>
                    </div>
                  )}

                  {about.story_photo_2 && (
                    <div className="group relative rounded-2xl overflow-hidden border border-border/80 shadow-xs bg-card">
                      <div className="h-44 sm:h-48 overflow-hidden">
                        <img 
                          src={about.story_photo_2} 
                          alt="পেশাদার সেমিনার ও ট্রেনিং" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3 bg-card/90 backdrop-blur-md border-t border-border/60">
                        <p className="text-xs font-semibold text-foreground">পেশাদার সেমিনার ও ট্রেনিং</p>
                        <p className="text-[11px] text-muted-foreground">মিডিয়া ও প্রযুক্তি বিষয়ক সম্মেলন</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleDownloadResume}
                variant="hero" 
                size="lg" 
                className="hover-lift py-6 px-6 rounded-xl font-semibold shadow-md gap-2"
              >
                <FileDown className="w-5 h-5" />
                {about.resume_url ? 'রেজুমি / সিভি ডাউনলোড' : 'সিভির জন্য অনুরোধ করুন'}
              </Button>
              <Button 
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                variant="outline" 
                size="lg" 
                className="hover-lift py-6 px-6 rounded-xl font-semibold gap-2"
              >
                <Mail className="w-5 h-5 text-primary" />
                সরাসরি বার্তা দিন
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
