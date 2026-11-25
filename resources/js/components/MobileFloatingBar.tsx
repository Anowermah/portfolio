import { MessageCircle, PhoneCall, Send } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const MobileFloatingBar = () => {
  const { settings } = useSiteSettings();
  const contact = settings.contact;

  const handleWhatsApp = () => {
    const rawPhone = contact.whatsapp || contact.phone || "8801777028791";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = "আসসালামু আলাইকুম! আমি আপনার সাথে একটি প্রজেক্ট নিয়ে কথা বলতে চাই।";
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    const phone = contact.phone || "01777028791";
    window.open(`tel:${phone}`, '_self');
  };

  const handleScrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-4 left-3 right-3 z-40 md:hidden animate-fade-in">
      <div className="bg-card/90 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl p-2 flex items-center justify-between gap-2">
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-primary active:bg-primary-dark text-primary-foreground font-semibold text-xs transition-colors shadow-sm"
        >
          <PhoneCall className="w-4 h-4" />
          <span>কল করুন</span>
        </button>

        <button
          onClick={handleScrollToContact}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-secondary active:bg-muted text-foreground font-semibold text-xs transition-colors border border-border/80"
        >
          <Send className="w-3.5 h-3.5 text-primary" />
          <span>মেসেজ দিন</span>
        </button>
      </div>
    </div>
  );
};

export default MobileFloatingBar;
