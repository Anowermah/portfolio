import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Layers } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Fallback images for existing and newly added projects
import shubbanPreview from "@/assets/shubban-preview.jpg";
import lamaanPreview from "@/assets/lamaan-preview.jpg";
import webDevPreview from "@/assets/web-dev-preview.jpg";
import graphicsPreview from "@/assets/graphics-preview.jpg";
import videoPreview from "@/assets/video-preview.jpg";

const fallbackImages = [
  shubbanPreview,
  lamaanPreview,
  webDevPreview,
  graphicsPreview,
  videoPreview,
];

const Projects = () => {
  const { settings } = useSiteSettings();
  const projectsData = settings.projects;
  const items = projectsData.items || [];

  const [selectedCategory, setSelectedCategory] = useState("সবগুলো");

  // Get distinct categories
  const categories = ["সবগুলো", ...Array.from(new Set(items.map(p => p.category).filter(Boolean)))];

  const filteredItems = selectedCategory === "সবগুলো" 
    ? items 
    : items.filter(p => p.category === selectedCategory);

  return (
    <section className="py-8 sm:py-20 bg-card/30 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
            {projectsData.section_title || 'আমার প্রজেক্ট'}
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            {projectsData.section_subtitle || 'ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন এবং ভিডিও এডিটিং এর বিভিন্ন প্রজেক্টের নমুনা'}
          </p>

          {/* Interactive Category Filter Pills (Mobile Horizontal Scrollable) */}
          {categories.length > 1 && (
            <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 sm:py-4 mt-2 sm:mt-4 px-1 sm:px-2 no-scrollbar">
              {categories.map((category, idx) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md scale-105" 
                        : "bg-card border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {filteredItems.map((project, index) => {
            const originalIndex = items.indexOf(project);
            const fallback = fallbackImages[(originalIndex >= 0 ? originalIndex : index) % fallbackImages.length];
            const imgSrc = (project.image && typeof project.image === 'string' && project.image.trim() !== "") 
              ? project.image 
              : fallback;

            const demoUrl = project.demo 
              ? (project.demo.startsWith('http://') || project.demo.startsWith('https://') 
                  ? project.demo 
                  : `https://${project.demo}`) 
              : '';

            return (
              <Card 
                key={index} 
                className="gradient-card hover-lift border border-border/80 group overflow-hidden flex flex-col justify-between shadow-sm rounded-xl sm:rounded-2xl"
              >
                <div>
                  {/* Project Image Banner */}
                  <div className="h-36 sm:h-48 bg-muted overflow-hidden relative">
                    <a 
                      href={demoUrl || '#'} 
                      target={demoUrl ? "_blank" : undefined} 
                      rel="noopener noreferrer" 
                      className="block w-full h-full"
                    >
                      <img 
                        src={imgSrc} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                      />
                    </a>
                    {project.category && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="backdrop-blur-md bg-background/90 text-xs shadow-sm font-medium">
                          {project.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-1">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                </div>
                
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies?.map((tech, techIndex) => (
                      <Badge 
                        key={techIndex} 
                        variant="outline" 
                        className="text-xs px-2.5 py-0.5 border-primary/20 text-primary font-normal"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {demoUrl && (
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full rounded-xl hover:bg-primary hover:text-primary-foreground group/btn"
                    >
                      <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <span>লাইভ ওয়েবসাইট দেখুন</span>
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
