import { useState } from 'react';
import { useAdminPWA } from '@/hooks/useAdminPWA';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Smartphone, Download, Share2, PlusSquare, CheckCircle2, Shield } from 'lucide-react';

export function AdminPWAInstallButton({ variant = "outline", className = "" }: { variant?: "default" | "outline" | "secondary" | "ghost", className?: string }) {
  const { isInstallable, isInstalled, isIOS, promptInstall } = useAdminPWA();
  const [openIOSDialog, setOpenIOSDialog] = useState(false);

  // If already running inside installed standalone app, show subtle status badge
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">PWA মোড সক্রিয়</span>
      </span>
    );
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      promptInstall();
    } else if (isIOS) {
      setOpenIOSDialog(true);
    } else {
      // General fall-back guidance
      setOpenIOSDialog(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleInstallClick}
        variant={variant}
        size="sm"
        className={`rounded-xl gap-1.5 text-xs font-semibold shadow-xs ${className}`}
      >
        <Smartphone className="w-3.5 h-3.5 text-primary" />
        <span>অ্যাপ ইনস্টল</span>
      </Button>

      {/* iOS & Manual Installation Instruction Dialog */}
      <Dialog open={openIOSDialog} onOpenChange={setOpenIOSDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <img src="/images/admin-icon-192.png" alt="Admin App Icon" className="w-10 h-10 rounded-xl shadow-xs" />
            </div>
            <DialogTitle className="text-lg font-bold">
              ফোনে অ্যাডমিন অ্যাপ ইনস্টল করুন
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              কোনো ব্রাউজার ইউআরএল ছাড়া ফুল-স্ক্রিন অ্যাপ হিসেবে সরাসরি ড্যাশবোর্ড ব্যবহার করুন
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-3 text-xs sm:text-sm">
            {isIOS ? (
              <>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">১. শেয়ার বাটনে চাপুন</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Safari ব্রাউজারের নিচে থাকা <strong>Share (📤)</strong> আইকনে ট্যাপ করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <PlusSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">২. হোম স্ক্রিনে যোগ করুন</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      তালিকা স্ক্রোল করে <strong>'Add to Home Screen (➕)'</strong> চাপুন এবং উপরে 'Add' দিন।
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">ব্রাউজার মেনু থেকে ইনস্টল</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Chrome ব্রাউজারের উপরে ডানদিকের তিনটি ডট (⋮) চাপুন এবং <strong>'Install app'</strong> বা <strong>'Add to Home screen'</strong> বেছে নিন।
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>এটি সম্পূর্ণ নিরাপদ এবং শুধুমাত্র আপনার এই অ্যাডমিন প্যানেলটির জন্য তৈরি।</span>
            </div>
          </div>

          <Button onClick={() => setOpenIOSDialog(false)} className="w-full rounded-xl">
            ঠিক আছে, বুঝতে পেরেছি
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
