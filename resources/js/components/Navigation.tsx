import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Code, LogIn, Sparkles, MessageCircle, PhoneCall, ShoppingBag, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import ThemeToggle from "./ThemeToggle";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Navigation = () => {
  const { user, isAdmin } = useAuth();
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navItems = [
    { label: "হোম", id: "home" },
    { label: "পরিচিতি", id: "about" },
    { label: "দক্ষতা", id: "skills" },
    { label: "সেবা", id: "services" },
    { label: "অভিজ্ঞতা", id: "experience" },
    { label: "প্রজেক্ট", id: "projects" },
    { label: "যোগাযোগ", id: "contact" }
  ];

  const handleWhatsApp = () => {
    const contact = settings.contact;
    const rawPhone = contact.whatsapp || contact.phone || "8801777028791";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
    setIsOpen(false);
  };

  const handleCall = () => {
    const phone = settings.contact?.phone || "01777028791";
    window.open(`tel:${phone}`, '_self');
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-1.5 sm:py-2" : "bg-transparent py-2 sm:py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo */}
          <div 
            onClick={() => scrollToSection('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {settings.general?.logo_url ? (
              <img 
                src={settings.general.logo_url} 
                alt={settings.general?.logo_text || "Website Logo"} 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform" 
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                <Code className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                {settings.general?.logo_text || settings.hero?.name || "মো: আনোয়ার হোসাইন"}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">
                {settings.general?.tagline || "পোর্টফোলিও"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground/80 hover:text-primary text-sm font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="h-5 w-[1px] bg-border mx-1" />
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-xl border-border/80 hover:bg-primary/10 hover:text-primary gap-1.5 hidden lg:flex text-xs font-medium">
                  {isAdmin ? (
                    <Link to="/admin/dashboard">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      অ্যাডমিন প্যানেল
                    </Link>
                  ) : (
                    <Link to="/client/dashboard">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                      আমার প্রজেক্ট
                    </Link>
                  )}
                </Button>
                <ProfileMenu />
              </div>
            ) : (
              <Button asChild variant="hero" size="sm" className="rounded-xl shadow-sm px-4">
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  ক্লায়েন্ট লগইন
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {isOpen && (
          <div className="md:hidden mt-3 p-4 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl animate-fade-in space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/80">
              <Button 
                onClick={handleWhatsApp} 
                size="sm" 
                variant="outline"
                className="w-full text-xs font-semibold rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </Button>
              <Button 
                onClick={handleCall} 
                size="sm" 
                variant="outline"
                className="w-full text-xs font-semibold rounded-xl border-primary/30 text-primary gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" /> কল করুন
              </Button>
            </div>

            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-foreground font-medium text-sm hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                </button>
              ))}

              <div className="pt-3 mt-2 border-t border-border/80 flex flex-col space-y-2">
                {user ? (
                  <>
                    <Button asChild variant="outline" className="w-full justify-start rounded-xl font-medium text-xs">
                      {isAdmin ? (
                        <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-primary">
                          <Shield className="w-4 h-4" />
                          অ্যাডমিন ড্যাশবোর্ড
                        </Link>
                      ) : (
                        <Link to="/client/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-emerald-600">
                          <ShoppingBag className="w-4 h-4" />
                          আমার প্রজেক্ট ড্যাশবোর্ড
                        </Link>
                      )}
                    </Button>
                    <div className="w-full flex items-center justify-between py-1 px-1">
                      <span className="text-xs text-muted-foreground">ইউজার মেনু:</span>
                      <ProfileMenu />
                    </div>
                  </>
                ) : (
                  <Button asChild variant="hero" className="w-full py-3.5 rounded-xl font-semibold shadow-sm text-sm">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <LogIn className="w-4 h-4 mr-2" />
                      ক্লায়েন্ট পোর্টাল / লগইন
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
