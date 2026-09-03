import { InputHTMLAttributes } from "react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthField({ label, id, ...props }: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-2 px-1">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="h-11 rounded-full bg-background border border-black/[0.06] px-4 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple-accent/30"
      />
    </div>
  );
}
