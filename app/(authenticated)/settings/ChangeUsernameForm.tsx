'use client';

import { useMemo } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import type { ActionState } from '@/lib/actionState';

const INITIAL_STATE: ActionState = {};

interface ChangeUsernameFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  currentUsername?: string | null;
  cooldownEndsAt?: string | null;
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="border border-[#009966] bg-[#009966] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Update Username'}
    </button>
  );
}

export default function ChangeUsernameForm({ action, currentUsername, cooldownEndsAt }: ChangeUsernameFormProps) {
  const [state, formAction] = useFormState(action, INITIAL_STATE);

  const { cooldownActive, cooldownMessage } = useMemo(() => {
    if (!cooldownEndsAt) {
      return { cooldownActive: false, cooldownMessage: null as string | null };
    }

    const endDate = new Date(cooldownEndsAt);
    if (Number.isNaN(endDate.getTime())) {
      return { cooldownActive: false, cooldownMessage: null as string | null };
    }

    const now = new Date();
    const remainingMs = endDate.getTime() - now.getTime();

    if (remainingMs <= 0) {
      return { cooldownActive: false, cooldownMessage: null as string | null };
    }

    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    const formattedEnd = endDate.toLocaleString();
    const message = `Username changes unlock ${remainingDays === 1 ? 'in 1 day' : `in ${remainingDays} days`} (${formattedEnd}).`;

    return { cooldownActive: true, cooldownMessage: message };
  }, [cooldownEndsAt]);

  return (
    <form key={currentUsername ?? 'username-form'} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">
          New Username
        </label>
        <input
          id="username"
          name="username"
          required
          defaultValue={currentUsername ?? undefined}
          className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none disabled:cursor-not-allowed"
          disabled={cooldownActive}
        />
      </div>
      <SubmitButton disabled={cooldownActive} />
      {cooldownMessage ? <p className="text-sm text-[#9a9a9a]">{cooldownMessage}</p> : null}
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-[#009966]">{state.success}</p> : null}
      <p className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">
        Usernames can be updated every 10 days to maintain identity continuity across the city.
      </p>
    </form>
  );
}
