import { useMemo } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const usePasswordStrength = (password: string) => {
  return useMemo(() => {
    const requirements: PasswordRequirement[] = [
      { label: 'কমপক্ষে ৬ অক্ষর', met: password.length >= 6 },
      { label: 'একটি বড় হাতের অক্ষর', met: /[A-Z]/.test(password) },
      { label: 'একটি ছোট হাতের অক্ষর', met: /[a-z]/.test(password) },
      { label: 'একটি সংখ্যা', met: /[0-9]/.test(password) },
      { label: 'একটি বিশেষ চিহ্ন (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const metCount = requirements.filter(r => r.met).length;
    
    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
    let strengthLabel = 'দুর্বল';
    let strengthColor = 'bg-destructive';
    
    if (metCount >= 5) {
      strength = 'strong';
      strengthLabel = 'শক্তিশালী';
      strengthColor = 'bg-green-500';
    } else if (metCount >= 4) {
      strength = 'good';
      strengthLabel = 'ভালো';
      strengthColor = 'bg-blue-500';
    } else if (metCount >= 3) {
      strength = 'fair';
      strengthLabel = 'মোটামুটি';
      strengthColor = 'bg-yellow-500';
    }

    const percentage = (metCount / requirements.length) * 100;

    return {
      requirements,
      strength,
      strengthLabel,
      strengthColor,
      percentage,
      isValid: metCount >= 3, // Minimum 3 requirements for valid password
    };
  }, [password]);
};

const PasswordStrengthIndicator = ({ 
  password, 
  showRequirements = true 
}: PasswordStrengthIndicatorProps) => {
  const { 
    requirements, 
    strengthLabel, 
    strengthColor, 
    percentage 
  } = usePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">পাসওয়ার্ডের শক্তি</span>
          <span className={cn(
            "font-medium",
            percentage >= 80 ? "text-green-500" : 
            percentage >= 60 ? "text-blue-500" : 
            percentage >= 40 ? "text-yellow-500" : "text-destructive"
          )}>
            {strengthLabel}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-300", strengthColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Requirements list */}
      {showRequirements && (
        <div className="grid grid-cols-1 gap-1.5">
          {requirements.map((req, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                req.met ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {req.met ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
