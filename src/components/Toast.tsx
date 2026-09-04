"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-cta text-background text-sm font-medium px-4 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] animate-[fadeIn_0.2s_ease-out]">
      <CheckCircle2 size={16} className="text-green-accent" />
      {message}
    </div>
  );
}
