import { Code, Palette, Video, CheckCircle2, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ProjectEstimateModal from "./ProjectEstimateModal";

const iconArray = [Code, Palette, Video];

const Services = () => {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const servicesData = settings.services;

  const handleOrderClick = (serviceName: string) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    toast({
      title: "যোগাযোগ করুন",
      description: `"${serviceName}" সেবাটির জন্য ফর্ম পূরণ করে আপনার প্রয়োজনীয়তা জানান।`,
    });
  };

  return (
    <section className="py-8 sm:py-20 gradient-hero">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="animate-fade-in text-center mb-6 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
            {servicesData.section_title || 'আমার সেবা সমূহ'}
          </h2>
          <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {servicesData.section_subtitle || 'আপনার বিজনেসের প্রসারে আধুনিক, দৃষ্টিনন্দন ও মানসম্মত ডিজিটাল সলিউশন'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesData.items.map((service, index) => {
            const IconComponent = iconArray[index % iconArray.length] || Code;
            return (
              <Card 
                key={index} 
                className="gradient-card hover-lift border border-border/80 group flex flex-col justify-between shadow-sm rounded-2xl"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    {service.title}
                  </CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-xs sm:text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <ProjectEstimateModal 
                    defaultService={index === 0 ? "web" : index === 1 ? "design" : "video"}
                    trigger={
                      <Button 
                        variant="outline" 
                        className="w-full justify-between hover:bg-primary hover:text-primary-foreground group/btn rounded-xl py-5"
                      >
                        <span className="font-semibold text-xs sm:text-sm">কোটেশন ও খরচ হিসাব করুন</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
