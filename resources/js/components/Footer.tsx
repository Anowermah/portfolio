import { Heart, Code } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();
  const hero = settings.hero;
  const footer = settings.footer;

  return (
    <footer className="bg-card border-t border-border py-10 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Logo & Bio */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <Code className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">{hero.name}</span>
            </div>
            {footer.bio && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {footer.bio}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <span>কাজের প্রতি নিষ্ঠা ও ভালোবাসার সাথে তৈরি</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
          </div>
          
          <div className="text-muted-foreground text-xs sm:text-sm">
            {footer.copyright || `© ২০২৬ ${hero.name}। সর্বস্বত্ব সংরক্ষিত।`}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
