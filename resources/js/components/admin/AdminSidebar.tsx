import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  History,
  User,
  ShoppingBag
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const adminMenuItems = [
  {
    title: "ড্যাশবোর্ড",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "মার্কেটপ্লেস অর্ডার ও কাজ",
    url: "/admin/projects",
    icon: ShoppingBag,
  },
  {
    title: "যোগাযোগের বার্তা",
    url: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "ব্যবহারকারী ও ক্লায়েন্ট",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "অডিট লগ",
    url: "/admin/audit-logs",
    icon: History,
  },
  {
    title: "সাইট সেটিংস",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "আমার প্রোফাইল",
    url: "/profile",
    icon: User,
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('সফলভাবে লগআউট হয়েছে');
    } catch (error) {
      toast.error('লগআউট করতে সমস্যা হয়েছে');
    }
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent>
        {/* Admin Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-lg">অ্যাডমিন প্যানেল</h2>
                <p className="text-sm text-muted-foreground">নিয়ন্ত্রণ কেন্দ্র</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>নেভিগেশন</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="mt-auto p-4 border-t">
          <Button
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <LogOut className="mr-3 h-4 w-4" />
            {!collapsed && <span>লগআউট</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}