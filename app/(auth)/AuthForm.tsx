'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';

export type AuthState = {
  error?: string;
  message?: string;
};

const initialState: AuthState = {};

interface AuthFormProps {
  action: (state: AuthState, formData: FormData) => Promise<AuthState> | AuthState;
  title: string;
  description?: string;
  submitLabel: string;
  children: ReactNode;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full border border-[#009966] bg-[#009966] px-4 py-2 text-sm font-medium uppercase tracking-[0.3em] text-[#111111] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Processing…' : label}
    </button>
  );
}

export function AuthForm({ action, title, description, submitLabel, children }: AuthFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d9d9d9]">{title}</h2>
        {description ? <p className="text-xs leading-relaxed text-[#9a9a9a]">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state?.message ? <p className="text-sm text-[#009966]">{state.message}</p> : null}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
