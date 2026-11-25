import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "রহিম উদ্দিন",
    role: "প্রজেক্ট ম্যানেজার",
    company: "ডিজিটাল সলিউশন্স",
    rating: 5,
    review: "আনোয়ার হোসাইনের কাজের মান অসাধারণ। তিনি সময়মতো প্রজেক্ট ডেলিভার করেন এবং ক্লায়েন্টের চাহিদা পূরণে সর্বদা সচেষ্ট থাকেন।"
  },
  {
    name: "ফাতেমা খানম",
    role: "CEO",
    company: "ক্রিয়েটিভ এজেন্সি",
    rating: 5,
    review: "তার গ্রাফিক্স ডিজাইনের দক্ষতা এবং ক্রিয়েটিভিটি আমাদের ব্র্যান্ডকে নতুন উচ্চতায় নিয়ে গেছে। অত্যন্ত প্রোফেশনাল এবং নির্ভরযোগ্য।"
  },
  {
    name: "করিম আহমেদ",
    role: "মার্কেটিং ডিরেক্টর", 
    company: "টেক ইনোভেশন",
    rating: 5,
    review: "ভিডিও এডিটিং এ তার দক্ষতা অবিশ্বাস্য। আমাদের মার্কেটিং ক্যাম্পেইনের ভিডিওগুলো অসাধারণ হয়েছে তার কারণে।"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-24 gradient-hero relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="animate-fade-in text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">ক্লায়েন্টদের মতামত</h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            আমার কাজের মান এবং সেবা নিয়ে সন্তুষ্ট ক্লায়েন্টদের প্রশংসাপত্র
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="card-glass hover-lift animate-fade-in relative border border-border/80 shadow-sm rounded-2xl"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full">
                <div>
                  <Quote className="w-8 h-8 text-primary/30 mb-3" />
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-6 italic">
                    "{testimonial.review}"
                  </p>
                </div>

                {/* Client Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                  <Avatar className="w-10 h-10 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">{testimonial.name}</h3>
                    <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
