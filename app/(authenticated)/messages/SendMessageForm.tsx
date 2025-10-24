'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { ActionState } from '@/lib/actionState';

const INITIAL_STATE: ActionState = {};

interface SendMessageFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-[#009966] bg-[#009966] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send Message'}
    </button>
  );
}

export default function SendMessageForm({ action }: SendMessageFormProps) {
  const [state, formAction] = useFormState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="recipient" className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">
          Recipient Username
        </label>
        <input
          id="recipient"
          name="recipient"
          required
          className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="body" className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">
          Message
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          required
          className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none"
        />
      </div>
      <SubmitButton />
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-[#009966]">{state.success}</p> : null}
    </form>
  );
}
