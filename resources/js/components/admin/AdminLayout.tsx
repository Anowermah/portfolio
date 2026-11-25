import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from './AdminSidebar';
import { AdminPWAInstallButton } from './AdminPWAInstallModal';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Globe, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  User as UserIcon,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

const AdminLayout = () => {
  const { user, loading, isAdmin: authIsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
        setIsAdmin(false);
      } else if (user.role && user.role !== 'admin') {
        toast.info('আপনি ক্লায়েন্ট অ্যাকাউন্টে লগইন আছেন। আপনার প্রজেক্ট ড্যাশবোর্ডে নেওয়া হচ্ছে।');
        navigate('/client/dashboard');
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    }
  }, [user, loading, navigate]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6">
          <Loader2 className="h-9 w-9 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">অ্যাডমিন সিস্টেম লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const currentPath = location.pathname;

  const mobileNavItems = [
    { title: "ড্যাশবোর্ড", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "অর্ডার", url: "/admin/projects", icon: ShoppingBag },
    { title: "মেসেজ", url: "/admin/messages", icon: MessageSquare },
    { title: "সেটিংস", url: "/admin/settings", icon: Settings },
    { title: "প্রোফাইল", url: "/profile", icon: UserIcon },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-border/80 bg-background/95 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-xl border border-border" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-foreground">অ্যাডমিন প্যানেল</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                  <ShieldCheck className="w-3 h-3" /> সিকিউর
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AdminPWAInstallButton />
              <Button asChild variant="outline" size="sm" className="text-xs h-9 rounded-xl shadow-xs">
                <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">পোর্টফোলিও</span>
                  <span>দেখুন</span>
                </a>
              </Button>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 p-3 sm:p-6 bg-muted/20 pb-24 md:pb-8">
            <Outlet />
          </main>

          {/* Mobile Bottom Navigation Bar (Visible only on mobile screens) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl px-2 py-1.5 flex items-center justify-around">
            {mobileNavItems.map((item) => {
              const active = currentPath === item.url;
              const Icon = item.icon;
              return (
                <Link
                  key={item.url}
                  to={item.url}
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                    active 
                      ? "text-primary font-bold bg-primary/10 scale-105" 
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-[11px] mt-1">{item.title}</span>
                </Link>
              );
            })}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-muted-foreground hover:text-foreground font-medium transition-all"
            >
              <Globe className="w-5 h-5" />
              <span className="text-[11px] mt-1">ওয়েবসাইট</span>
            </a>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;