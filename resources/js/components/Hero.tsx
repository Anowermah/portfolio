import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  FolderOpen, 
  Mail, 
  Sparkles, 
  Code2, 
  Palette, 
  Video, 
  CheckCircle2, 
  Terminal, 
  Award, 
  Zap, 
  ArrowRight,
  ExternalLink,
  Layers,
  Star
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ProjectEstimateModal from "./ProjectEstimateModal";

const techSkills = [
  { name: "React", color: "text-cyan-500 border-cyan-500/20 bg-cyan-500/5" },
  { name: "Laravel", color: "text-red-500 border-red-500/20 bg-red-500/5" },
  { name: "PHP", color: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5" },
  { name: "Tailwind CSS", color: "text-sky-500 border-sky-500/20 bg-sky-500/5" },
  { name: "MySQL", color: "text-blue-500 border-blue-500/20 bg-blue-500/5" },
  { name: "Figma", color: "text-purple-500 border-purple-500/20 bg-purple-500/5" },
  { name: "Premiere Pro", color: "text-pink-500 border-pink-500/20 bg-pink-500/5" },
];

const Hero = () => {
  const { settings } = useSiteSettings();
  const hero = settings.hero;
  const about = settings.about;

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-20 pb-8 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 flex flex-col justify-center relative overflow-hidden bg-background">
      {/* Modern High-Tech Grid & Gradient Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-36 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Powerful Typography & Action (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-6 text-center lg:text-left">
            
            {/* Live Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-sm font-semibold text-foreground">
                {about?.availability || "নতুন প্রজেক্টের জন্য উন্মুক্ত (Available for Hire)"}
              </span>
            </div>

            {/* Overline & Name */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-[11px] sm:text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center lg:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>{hero.badge || "ওয়েব ডেভেলপার ও ক্রিয়েটিভ ডিজাইনার"}</span>
              </p>
              
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.2] sm:leading-[1.15]">
                ডিজিটাল ধারণাকে রূপান্তর করি <br className="hidden sm:inline" />
                <span className="text-gradient">আধুনিক ডিজিটাল সলিউশনে</span>
              </h1>
            </div>

            {/* Subtitle / Roles Badge Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-sm font-semibold">
                <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Full-Stack Web
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] sm:text-sm font-semibold">
                <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> UI/UX Design
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-[11px] sm:text-sm font-semibold">
                <Video className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Video Editing
              </span>
            </div>

            {/* Bio Description (compact on mobile) */}
            <p className="text-xs sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-3 sm:line-clamp-none">
              {hero.bio}
            </p>

            {/* Call to Actions (CTA - side-by-side on mobile) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 pt-1">
              <Button 
                onClick={scrollToContact}
                variant="hero" 
                size="default"
                className="hover-lift py-3 sm:py-6 px-3 sm:px-6 text-xs sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-md gap-1.5 sm:gap-2 text-primary-foreground group"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{hero.btn_contact_text || "যোগাযোগ করুন"}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <ProjectEstimateModal 
                trigger={
                  <Button 
                    variant="outline" 
                    size="default"
                    className="w-full hover-lift py-3 sm:py-6 px-3 sm:px-5 text-xs sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-xs gap-1.5 sm:gap-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 animate-pulse" />
                    <span>খরচ হিসাব করুন</span>
                  </Button>
                }
              />

              <Button 
                onClick={scrollToProjects}
                variant="ghost" 
                size="default"
                className="hidden sm:inline-flex hover-lift py-6 px-4 text-sm font-semibold rounded-2xl gap-2 text-muted-foreground hover:text-foreground"
              >
                <FolderOpen className="w-4 h-4 text-primary" />
                <span>প্রজেক্ট গ্যালারি</span>
              </Button>
            </div>

            {/* Quick Tech Stack Micro Pills */}
            <div className="pt-2.5 sm:pt-4 border-t border-border/60">
              <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2.5">
                মূল প্রযুক্তি ও ফ্রেমওয়ার্ক:
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1 sm:gap-2">
                {techSkills.map((tech, idx) => (
                  <span 
                    key={idx}
                    className={`text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border font-medium transition-all hover:scale-105 ${tech.color}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Centerpiece (Interactive Developer & Designer Card) (lg:col-span-5) */}
          <div className="lg:col-span-5 relative mt-3 sm:mt-6 lg:mt-0">
            {/* Outer Glow Halo */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 via-primary-glow/20 to-primary/10 rounded-2xl sm:rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>

            {/* Terminal Window Card */}
            <div className="relative rounded-2xl sm:rounded-[28px] bg-card/90 backdrop-blur-xl border border-border/80 shadow-xl overflow-hidden p-3.5 sm:p-6 space-y-2.5 sm:space-y-5">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-border/70">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 sm:px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-primary" />
                  <span>anower-profile.tsx</span>
                </div>
                <div className="w-6 sm:w-8"></div>
              </div>

              {/* Profile Avatar & Interactive Highlights */}
              <div className="relative text-center py-1 sm:py-2">
                {/* Avatar with Animated Ring */}
                <div className="relative mx-auto w-24 h-24 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-tr from-primary via-primary-glow to-blue-500 shadow-md sm:shadow-xl mb-2 sm:mb-4 group">
                  <div className="w-full h-full rounded-[14px] sm:rounded-[20px] bg-card overflow-hidden flex items-center justify-center relative">
                    {hero?.avatar_url ? (
                      <img 
                        src={hero.avatar_url} 
                        alt={hero.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <img 
                        src="/images/profile/hero-portrait.jpg" 
                        alt={hero.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    )}
                  </div>
                </div>

                {/* Floating Achievement Badge 1 (Top Left) */}
                <div className="absolute -top-1 -left-1 sm:-left-4 animate-float bg-card/95 backdrop-blur-md border border-border shadow-md rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 text-left">
                  <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                    🏆
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-none">অভিজ্ঞতা</p>
                    <p className="text-[11px] sm:text-xs font-bold text-foreground">৫+ বছর</p>
                  </div>
                </div>

                {/* Floating Achievement Badge 2 (Bottom Right) */}
                <div className="absolute bottom-1 -right-1 sm:-right-4 animate-float [animation-delay:1.5s] bg-card/95 backdrop-blur-md border border-border shadow-md rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 text-left">
                  <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                    ⚡
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-none">সফল প্রজেক্ট</p>
                    <p className="text-[11px] sm:text-xs font-bold text-foreground">৫০+ সম্পন্ন</p>
                  </div>
                </div>

                <h3 className="text-base sm:text-xl font-bold text-foreground">
                  {hero.name}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-primary">
                  {hero.title}
                </p>
              </div>

              {/* Developer Code Snippet Box (hidden on mobile for compact minimalism) */}
              <div className="hidden sm:block rounded-2xl bg-muted/40 border border-border/80 p-3.5 text-left font-mono text-[11px] sm:text-xs text-muted-foreground space-y-1 overflow-x-auto">
                <div className="text-primary font-semibold">// ডেভেলপার স্পেকস</div>
                <div><span className="text-purple-500">const</span> <span className="text-blue-500">creator</span> = &#123;</div>
                <div className="pl-4">role: <span className="text-emerald-500">"Full-Stack Web & UI Designer"</span>,</div>
                <div className="pl-4">stack: [<span className="text-amber-500">"React"</span>, <span className="text-amber-500">"Laravel"</span>, <span className="text-amber-500">"Tailwind"</span>],</div>
                <div className="pl-4">passion: <span className="text-emerald-500">"High-performance & clean UI"</span>,</div>
                <div className="pl-4">openForHire: <span className="text-blue-500">true</span></div>
                <div>&#125;;</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Stats Bar */}
        {hero.stats && hero.stats.length > 0 && (
          <div className="mt-6 sm:mt-16 p-2.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
              {hero.stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center justify-center text-center p-1.5 sm:p-3 ${idx > 0 ? "pt-2 sm:pt-3" : ""}`}
                >
                  <span className="text-xl sm:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-1">
                    <span className="text-primary">{stat.number}</span>
                  </span>
                  <span className="text-[11px] sm:text-sm font-semibold text-muted-foreground mt-0.5 sm:mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="hidden lg:block absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-70 hover:opacity-100" onClick={scrollToProjects}>
        <ChevronDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  );
};

export default Hero;
