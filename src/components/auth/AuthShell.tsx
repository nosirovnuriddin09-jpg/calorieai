import { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="h-11 w-11 rounded-2xl bg-foreground flex items-center justify-center text-background font-semibold text-sm">
            M
          </div>
        </div>

        <div className="bg-surface rounded-[28px] p-7 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
          <h1 className="text-xl font-bold text-center mb-1">{title}</h1>
          <p className="text-sm text-muted text-center mb-6">{subtitle}</p>

          {children}
        </div>

        <p className="text-sm text-muted text-center mt-6">{footer}</p>
      </div>
    </div>
  );
}
