import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, Globe, Server, Shield, Zap, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-5 h-5 sm:w-6 sm:h-6" />,
  Database: <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
  Globe: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
  Server: <Server className="w-5 h-5 sm:w-6 sm:h-6" />,
  Shield: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
  Zap: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
};

const Skills = () => {
  const { settings } = useSiteSettings();
  const skillsData = settings.skills;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="animate-fade-in text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {skillsData.section_title || 'আমার দক্ষতা'}
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {skillsData.section_subtitle || 'ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন, ভিডিও এডিটিং এবং প্রযুক্তিগত সকল ক্ষেত্রে ব্যাপক অভিজ্ঞতা'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {skillsData.categories.map((category, index) => (
            <Card 
              key={index} 
              className="card-modern hover-scale group animate-fade-in border border-border/80 shadow-sm"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-3 text-primary text-lg sm:text-xl font-bold">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary transition-smooth group-hover:scale-110">
                    {iconMap[category.icon] || <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </div>
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="secondary"
                      className="text-xs sm:text-sm px-2.5 py-1 transition-smooth hover:bg-primary hover:text-primary-foreground font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
