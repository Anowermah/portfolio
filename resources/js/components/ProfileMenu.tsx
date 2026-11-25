import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, LogOut, LayoutDashboard, ShoppingBag, PlusCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ProfileMenu = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "লগআউট সফল",
        description: "আপনি সফলভাবে লগআউট হয়েছেন।"
      });
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "লগআউট করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  const displayName = user.name || user.email || 'ইউজার';
  const avatarUrl = "/images/profile/profile-formal.jpg";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all p-0">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 shadow-xl rounded-2xl border-border/80" align="end">
        <DropdownMenuLabel className="font-normal px-2 py-2">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-none truncate max-w-[150px]">{displayName}</p>
              <Badge variant={isAdmin ? "default" : "secondary"} className="text-[10px] px-2 py-0.5 font-medium">
                {isAdmin ? "অ্যাডমিন" : "ক্লায়েন্ট"}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Client Specific Links */}
        {!isAdmin ? (
          <>
            <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-xl focus:bg-primary/10 focus:text-primary">
              <Link to="/client/dashboard" className="flex items-center">
                <ShoppingBag className="mr-2.5 h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">আমার ড্যাশবোর্ড ও অর্ডার</span>
                  <span className="text-[10px] text-muted-foreground">কাজের অগ্রগতি ও ফাইল</span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-xl focus:bg-primary/10 focus:text-primary">
              <Link to="/client/dashboard?action=new-order" className="flex items-center">
                <PlusCircle className="mr-2.5 h-4 w-4 text-emerald-500" />
                <span className="font-medium text-sm">নতুন প্রজেক্ট অর্ডার</span>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          /* Admin Specific Links */
          <>
            <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-xl focus:bg-primary/10 focus:text-primary">
              <Link to="/admin/dashboard" className="flex items-center">
                <LayoutDashboard className="mr-2.5 h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">অ্যাডমিন ড্যাশবোর্ড</span>
                  <span className="text-[10px] text-muted-foreground">সার্বিক নিয়ন্ত্রণ কেন্দ্র</span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-xl focus:bg-primary/10 focus:text-primary">
              <Link to="/admin/projects" className="flex items-center">
                <ShoppingBag className="mr-2.5 h-4 w-4 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">মার্কেটপ্লেস অর্ডারসমূহ</span>
                  <span className="text-[10px] text-muted-foreground">ক্লায়েন্ট কাজের তদারকি</span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-xl focus:bg-primary/10 focus:text-primary">
              <Link to="/admin/settings" className="flex items-center">
                <Settings className="mr-2.5 h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">সাইট কাস্টমাইজার</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-xl">
          <Link to="/profile" className="flex items-center">
            <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">প্রোফাইল সেটিংস</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive py-2 rounded-xl" onClick={handleSignOut}>
          <LogOut className="mr-2.5 h-4 w-4" />
          <span className="font-medium text-sm">লগআউট</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
