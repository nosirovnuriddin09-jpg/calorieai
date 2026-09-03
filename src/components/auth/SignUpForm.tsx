"use client";

import { useActionState } from "react";
import { signUp, type AuthResult } from "@/app/(auth)/actions";
import AuthField from "./AuthField";
import SubmitButton from "./SubmitButton";

const initialState: AuthResult = {};

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, initialState);

  if (state?.message) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="h-12 w-12 rounded-full bg-green-bg flex items-center justify-center text-2xl">✉️</div>
        <p className="text-sm text-muted-2">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthField id="name" name="name" type="text" label="Name" placeholder="Your name" required autoComplete="name" />
      <AuthField id="email" name="email" type="email" label="Email" placeholder="you@example.com" required autoComplete="email" />
      <AuthField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="At least 6 characters"
        required
        minLength={6}
        autoComplete="new-password"
      />

      {state?.error && (
        <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{state.error}</p>
      )}

      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}
