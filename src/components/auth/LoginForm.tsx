"use client";

import { useActionState } from "react";
import { signIn, type AuthResult } from "@/app/(auth)/actions";
import AuthField from "./AuthField";
import SubmitButton from "./SubmitButton";

const initialState: AuthResult = {};

export default function LoginForm() {
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthField id="email" name="email" type="email" label="Email" placeholder="you@example.com" required autoComplete="email" />
      <AuthField id="password" name="password" type="password" label="Password" placeholder="••••••••" required autoComplete="current-password" />

      {state?.error && (
        <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{state.error}</p>
      )}

      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
