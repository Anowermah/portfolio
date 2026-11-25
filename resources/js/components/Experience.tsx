import { Calendar, MapPin, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Experience = () => {
  const { settings } = useSiteSettings();
  const experienceData = settings.experience;

  return (
    <section className="py-8 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="animate-fade-in text-center mb-6 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
            {experienceData.section_title || 'কর্মঅভিজ্ঞতা'}
          </h2>
          <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {experienceData.section_subtitle || 'বিভিন্ন প্রতিষ্ঠানে কাজের অভিজ্ঞতা এবং দক্ষতা অর্জনের যাত্রা'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {experienceData.items.map((exp, index) => (
            <Card 
              key={index} 
              className="card-modern animate-fade-in hover-scale border border-border/80 shadow-sm rounded-2xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-primary">
                      {exp.title}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-foreground mt-1">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{exp.period}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {exp.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="outline"
                      className="text-xs px-2.5 py-0.5 border-primary/20 text-primary bg-primary/5 font-normal"
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

export default Experience;
