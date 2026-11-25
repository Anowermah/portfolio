import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  cooldownMs: number;
}

interface RateLimitResult {
  isLimited: boolean;
  remainingAttempts: number;
  resetTime: number | null;
  checkLimit: () => boolean;
  recordAttempt: () => void;
  reset: () => void;
}

export const useRateLimit = (config: RateLimitConfig): RateLimitResult => {
  const { maxAttempts, windowMs, cooldownMs } = config;
  const [isLimited, setIsLimited] = useState(false);
  const [resetTime, setResetTime] = useState<number | null>(null);
  const attemptsRef = useRef<number[]>([]);

  const cleanupOldAttempts = useCallback(() => {
    const now = Date.now();
    attemptsRef.current = attemptsRef.current.filter(
      timestamp => now - timestamp < windowMs
    );
  }, [windowMs]);

  const checkLimit = useCallback(() => {
    cleanupOldAttempts();
    
    if (isLimited && resetTime && Date.now() < resetTime) {
      return true;
    }
    
    if (isLimited && resetTime && Date.now() >= resetTime) {
      setIsLimited(false);
      setResetTime(null);
      attemptsRef.current = [];
    }
    
    return attemptsRef.current.length >= maxAttempts;
  }, [cleanupOldAttempts, isLimited, resetTime, maxAttempts]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    attemptsRef.current.push(now);
    cleanupOldAttempts();
    
    if (attemptsRef.current.length >= maxAttempts) {
      setIsLimited(true);
      setResetTime(now + cooldownMs);
    }
  }, [cleanupOldAttempts, maxAttempts, cooldownMs]);

  const reset = useCallback(() => {
    attemptsRef.current = [];
    setIsLimited(false);
    setResetTime(null);
  }, []);

  const remainingAttempts = Math.max(0, maxAttempts - attemptsRef.current.length);

  return {
    isLimited,
    remainingAttempts,
    resetTime,
    checkLimit,
    recordAttempt,
    reset,
  };
};

// Default config for contact form: 5 attempts per hour, 30 minute cooldown
export const CONTACT_FORM_RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  cooldownMs: 30 * 60 * 1000, // 30 minutes
};
